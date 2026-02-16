import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { CourseModel } from "../Model/course.model.js";
import { NotificationModel } from "../Model/notification.model.js";
import { OrderModel } from "../Model/order.model.js";
import { userModel } from "../Model/user.model.js";
import { redisClient } from "../Redis/init.redis.js";
import { customError } from "../Utils/customError.js";
import { sendMail } from "../Utils/sendActivationEmail.js";
import { __dirname } from "./authuser.controller.js";
import ejs from "ejs";
import path from "path";

export const Create_Order = AsyncWrapper(async (req, res, next) => {
  const { courseId, payment_info } = req.body;
  const user = req.user;
  const enrolledCourses = user?.courses;
  console.log('enrolled courses are',enrolledCourses)
  const isAlreadyPurchased = enrolledCourses.some(
    (course: string) => course === courseId
  );
  if (isAlreadyPurchased) {
    return next(customError(400, "You have already purchased this course"));
  }
  const courses = await CourseModel.find().select("_id");
  console.log("coruses id", courses);
  const isCourseValid = courses.some(
    (course) => course?._id.toString() === courseId
  );
  if (!isCourseValid) {
    return next(customError(400, "Course does not exist"));
  }
  const CourseDetail = await CourseModel.findById(courseId).select(
    "name price estimatedPrice "
  );
  const orderData = {
    courseId,
    payment_info,
    userId: user?._id,
  };
  const Order = await OrderModel.create(orderData);
  if (!Order) {
    return next(customError(400, "Failed to create order"));
  }
  await CourseModel.findByIdAndUpdate(
    courseId,
    {
      $inc: {
        purchased: 1,
      },
    },
    { new: true, runValidators: true }
  );
  const UserData = await userModel.findOneAndUpdate(
    {
      _id: user?._id,
    },
    {
      $addToSet: {
        courses: courseId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // await redisClient.set(user?._id, JSON.stringify(UserData));
  await NotificationModel.create({
    userId: user?._id,
    title: "New Order",
    message: `You have new order from ${CourseDetail?.name}`,
  });
  const template = await ejs.renderFile(
    path.join(__dirname, "../Templates/newOrderEmail.ejs"),
    {
      userName: user?.name,
      courseName: CourseDetail?.name,
      orderId: `ORD-${Order?._id.toString().slice(0, 7)}`,
      amount: CourseDetail?.price,
      purchaseDate: new Date(),
      dashboardUrl: "https://google.com",
      paymentMethod: "credit Card",
    }
  );
  await sendMail({
    to: user?.email,
    subject: "Order Placed",
    html: template,
  });

  return res.status(201).json({
    success: true,
    message: "Order Placed successfully",
    data: UserData,
  });
});

export const Get_All_Orders = AsyncWrapper(async (req, res, next) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 })
  .populate('userId','name email')
  .populate('courseId', 'price name')
  return res.status(200).json({
    success: true,
    data: orders,
  });
});
