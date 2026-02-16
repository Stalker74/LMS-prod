import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { IUser, userModel } from "../Model/user.model.js";
import { customError } from "../Utils/customError.js";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../Utils/sendActivationEmail.js";
import { fileURLToPath } from "url";
import { SendCookie } from "../Utils/jwt.js";
import { CookieParseOptions } from "cookie-parser";
import { redisClient } from "../Redis/init.redis.js";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { GetProfileData } from "../../frontend/app/APIs/routes.js";
import { CourseModel } from "../Model/course.model.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const User_Registration = AsyncWrapper(async (req, res, next) => {
  const { name, email, password: pass } = req.body;
  const isAlreadyRegistered = await userModel.findOne({ email });
  if (isAlreadyRegistered) {
    return next(customError(400, "User already registered against this email"));
  }
  const bcryptedPassword = bcrypt.hashSync(pass, 10);
  const user = {
    name,
    email,
    password: bcryptedPassword,
  };
  const verificationCode = crypto.randomInt(100000, 1000000);
  const authToken = jwt.sign(
    { user: user, verificationCode: verificationCode },
    process.env.JWT_SECRETS as Secret,
    {
      expiresIn: "5m",
    },
  );
  const refreshToken = jwt.sign(
    { user: user },
    process.env.JWT_SECRETS as Secret,
    { expiresIn: "1d" },
  );
  const verificationEmail = await ejs.renderFile(
    path.join(__dirname, "../Templates/verficationEmail.ejs"),
    {
      logoUrl: "",
      companyName: "ELearning",
      code: verificationCode,
      supportEmail: "computer388unofficial@gmail.com",
      subject: "Activate Your Account",
      userName: name,
      companyAddress: "Township A2, Block 4, Lahore, Paskistan",
      companyPhone: "0317 0652733",
      websiteUrl: `${process.env.FRONTEND_URL}/verify-account`,
    },
  );

  res.status(200).json({
    message: "Activation email sent to verify your account",
    success: true,
    authToken: authToken,
    refreshToken: refreshToken,
  });

  await sendMail({
    to: email,
    subject: "Activate Your Account",
    html: verificationEmail,
  }).catch((err) => console.error("Email send failed:", err));
});

export const Resend_VerificationCode = AsyncWrapper(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(customError(400, "Failed to resend Activation code"));
  }
  const userData = jwt.verify(
    refreshToken,
    process.env.JWT_SECRETS as Secret,
  ) as { user: IUser };
  if (!userData) {
    return next(customError(400, "Failed to resend Activation code"));
  }
  const verificationCode = crypto.randomInt(100000, 1000000);
  const authToken = jwt.sign(
    { user: userData?.user, verificationCode },
    process.env.JWT_SECRETS as Secret,
    { expiresIn: "5m" },
  );

  const verificationEmail = await ejs.renderFile(
    path.join(__dirname, "../Templates/verficationEmail.ejs"),
    {
      logoUrl: "",
      companyName: "ELearning",
      code: verificationCode,
      supportEmail: "computer388unofficial@gmail.com",
      subject: "Activate Your Account",
      userName: userData?.user?.name,
      companyAddress: "Township A2, Block 4, Lahore, Paskistan",
      companyPhone: "0317 0652733",
      websiteUrl: `${process.env.FRONTEND_URL}/verify-account`,
    },
  );
  await sendMail({
    to: userData?.user?.email,
    subject: "Activate Your Account",
    html: verificationEmail,
  }).catch((err) => console.error("Email send failed:", err));

  res.status(200).json({
    message: "Activation code resent successfully",
    success: true,
    authToken: authToken,
  });
});

export const Activate_User = AsyncWrapper(async (req, res, next) => {
  const { verificationCode, authToken } = req.body;
  const isverifyEmailQuery = req.query?.email;
  const newUser = jwt.verify(authToken, process.env.JWT_SECRETS as Secret) as {
    user: any;
    verificationCode: string;
  };
  console.log("new User", newUser, "verification code", verificationCode);
  if (String(newUser.verificationCode) !== verificationCode) {
    return next(
      customError(400, "Verification Failed ! Please enter correct code"),
    );
  }
  if (isverifyEmailQuery) {
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  }
  const { user } = newUser;
  console.log("user detail is", user);
  const registerNewUser = await userModel.create({ ...user, isVerified: true });
  return res.status(200).json({
    message: "Account activated successfully",
    success: true,
  });
});

export const Login_User = AsyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const RegisteredUser = await userModel.findOne({ email });
  if (!RegisteredUser) {
    return next(
      customError(400, "Invalid Credentials ! Please enter correct email"),
    );
  }
  const validatePassword = bcrypt.compareSync(
    password,
    RegisteredUser?.password,
  );
  if (!validatePassword) {
    return next(
      customError(400, "Invalid Credentials ! Please enter correct password"),
    );
  }

  SendCookie(RegisteredUser, 200, res);
});

export const Social_Oauth = AsyncWrapper(async (req, res, next) => {
  const { name, email, image } = req.body;
  const userAlreadyRegistered = await userModel.findOne({ email });
  if (userAlreadyRegistered) {
    SendCookie(userAlreadyRegistered, 200, res);
  } else {
    const password = Math.random().toString(36).slice(-8);
    const user = {
      name,
      email,
      password,
      isVerified: true,
    };
    const userData = await userModel.create(user);
    SendCookie(userData, 200, res);
  }
});

export const Forget_Password = AsyncWrapper(async (req, res, next) => {
  const email = req.body?.email;
  const user = await userModel.findOne({ email });
  if (!user?._id) {
    return next(
      customError(
        400,
        "No account exist against this email. Please enter the registered one",
      ),
    );
  }
  const verificationCode = crypto.randomInt(100000, 1000000);
  const authToken = jwt.sign(
    { user, verificationCode },
    process.env.JWT_SECRETS as Secret,
    {
      expiresIn: "5m",
    },
  );
  const refreshToken = jwt.sign(
    { user: user },
    process.env.JWT_SECRETS as Secret,
    { expiresIn: "1d" },
  );
  const verificationEmail = await ejs.renderFile(
    path.join(__dirname, "../Templates/verficationEmail.ejs"),
    {
      logoUrl: "",
      companyName: "ELearning",
      code: verificationCode,
      supportEmail: "computer388unofficial@gmail.com",
      subject: "Verify your Email",
      userName: user?.name,
      companyAddress: "Township A2, Block 4, Lahore, Paskistan",
      companyPhone: "0317 0652733",
      websiteUrl: `${process.env.FRONTEND_URL}/verify-account?email=true`,
    },
  );

  res.status(200).json({
    message: "6 digit verification code sent to your email",
    success: true,
    authToken: authToken,
    refreshToken: refreshToken,
  });

  await sendMail({
    to: email,
    subject: "Activate Your Account",
    html: verificationEmail,
  }).catch((err) => console.error("Email send failed:", err));
});

export const Reset_Password = AsyncWrapper(async (req, res, next) => {
  const password = req.body?.password;
  const refreshToken = req.body?.refreshToken;
  const userData = jwt.verify(
    refreshToken,
    process.env.JWT_SECRETS as Secret,
  ) as { user: { _id: string } };
  const hashedPassword = bcrypt.hashSync(password, 10);
  const updatedUserData = await userModel.findByIdAndUpdate(
    userData?.user?._id,
    { password: hashedPassword },
    { new: true, runValidators: true },
  );
  if (!updatedUserData) {
    return next(customError(400, "Failed to reset Password"));
  }
  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

export const Logout_User = AsyncWrapper(async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  redisClient.del(req.user?._id);
  return res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});

export const Refresh_AccessToken = AsyncWrapper(async (req, res, next) => {
  const { refresh_token } = req.cookies;

  console.log(
    "refresh token ",
    refresh_token,
    "accesstoken ",
    req.cookies.access_token,
  );
  if (!refresh_token) {
    return next(customError(403, "Session Expired ! Please login again"));
  }
  const user = jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN as string,
  ) as { id: string };
  console.log('user is',user)
  if (!user?.id) {
    return next(customError(403, "Session Expired ! Please login again"));
  }
  const userData = await userModel.findById(user?.id)
  if (!userData?._id) {
    return next(customError(403, "User does not exist"))
  }
  SendCookie(userData, 200, res, true);

});

export const User_Profile = AsyncWrapper(async (req, res, next) => {
  const userData = req?.user;
  if (!userData?._id) {
    return next(customError(400, "Failed to get User Data"));
  }
  return res.status(200).json({
    success: true,
    data: userData,
  });
});

export const Update_Profile = AsyncWrapper(async (req, res, next) => {
  const UserId = req.user?._id;
  const userData = req.user;
  const newData = { ...userData, name: req.body.name, email: req.body.email };
  const updatedData = await userModel.findByIdAndUpdate(UserId, newData, {
    new: true,
    runValidators: true,
  });
  // redisClient.set(`${UserId}`, JSON.stringify(updatedData));
  return res.status(201).json({
    success: true,
    data: updatedData,
    message: "Profile Updated Successfully",
  });
});

export const update_Password = AsyncWrapper(async (req, res, next) => {
  const userId = req.user?._id;
  const hashedPassword = req.user?.password;
  const oldPassword = req.body?.oldPassword;
  const newPassword = req.body?.newPassword;
  const verifyPassword = bcrypt.compareSync(oldPassword, hashedPassword);
  if (!verifyPassword) {
    return next(customError(400, "Your old password is incorrect"));
  }
  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  const passwordUpdatedUser = await userModel.findByIdAndUpdate(
    userId,
    { password: hashedNewPassword },
    { new: true, runValidators: true },
  );
  // redisClient.set(`${userId}`, JSON.stringify(passwordUpdatedUser));
  return res.status(201).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const Update_Avatar = AsyncWrapper(async (req, res, next) => {
  const avatar = req.body?.avatar;
  const user = req.user;

  const uplaodAvatar = async (
    img: any,
  ): Promise<{ userData: IUser | null }> => {
    const MyCloud = await cloudinary.v2.uploader.upload(img, {
      folder: "avatars",
      width: 150,
    });
    const PublicId = MyCloud?.public_id;
    const Url = MyCloud.secure_url;
    const AvatarData = {
      public_id: PublicId,
      url: Url,
    };
    const updatedUser = { ...user, avatar: AvatarData };
    // redisClient.set(`${user?._id}`, JSON.stringify(updatedUser));
    const updatedUserData: IUser | null = await userModel.findByIdAndUpdate(
      user?._id,
      updatedUser,
      {
        new: true,
        runValidators: true,
      },
    );
    return {
      userData: updatedUserData,
    };
  };

  if (user?.avatar?.public_id) {
    cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
    await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
    });
    console.log("here we reached ?");
    const userData = await uplaodAvatar(avatar);
    return res.status(201).json({
      success: true,
      message: "User avatar updated successfully",
      data: userData?.userData,
    });
  } else {
    const userData = await uplaodAvatar(avatar);
    return res.status(201).json({
      success: true,
      message: "User avatar updated successfully",
      data: userData?.userData,
    });
  }
});

export const Get_All_Users = AsyncWrapper(async (req, res, next) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: users,
  });
});

export const Update_User_Role = AsyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const email = req.body?.email;
  const userRole = req.body?.role;
  const updatedRoleUser = await userModel.findOneAndUpdate(
    { email },
    { role: userRole },
    { new: true, runValidators: true },
  );
  console.log("user", updatedRoleUser);
  if (!updatedRoleUser) {
    return next(customError(400, "No user found against this email"));
  }
  // redisClient.set(userId,JSON.stringify(updatedRoleUser))
  const users = await userModel.find({});
  return res.status(201).json({
    success: true,
    message: "User role updated successfully",
    data: users,
  });
});

export const Delete_User = AsyncWrapper(async (req, res, next) => {
  const userId = req.params?.id;
  const userDeleted = await userModel.findByIdAndDelete(userId);
  await redisClient.del(userId);
  if (!userDeleted) {
    return next(customError(400, "Failed to delete requested User"));
  }
  const users = await userModel.find({});
  return res.status(200).json({
    success: true,
    message: "User Deleted successfully",
    data: users,
  });
});
export const Get_Enrolled_Courses = AsyncWrapper(async (req, res, next) => {
  const user = req.user;
  if (!user?.courses || user.courses.length === 0) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const enrolledCourses = await CourseModel.find({
    _id: { $in: user.courses }
  }).select('name description price thumbnail tags level category ratings purchased createdAt');

  return res.status(200).json({
    success: true,
    data: enrolledCourses,
  });
});
