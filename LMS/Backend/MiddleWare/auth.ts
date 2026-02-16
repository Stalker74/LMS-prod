import { customError } from "../Utils/customError.js";
import { AsyncWrapper } from "./AsyncWrapper.js";
import jwt from "jsonwebtoken";
import { redisClient } from "../Redis/init.redis.js";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { userModel } from "../Model/user.model.js";

export const Verify_User = AsyncWrapper(async (req, res, next) => {
  const cookie = req.cookies?.access_token;
  console.log("access token is", cookie);
  if (!cookie) {
    return next(customError(401, "Cookie Expired !"));
  }
  const user = jwt.verify(cookie, process.env.ACCESS_TOKEN as string) as {
    id: string;
  };
  if (!user?.id) {
    return next(customError(401, "Session Expired !"));
  }
  // const redisUser = await redisClient.get(user?.id)
  // if(!redisUser){
  //     return next(customError(400,'User not found'))
  // }
  // const userData = JSON.parse(redisUser)
  const userData = await userModel.findById(user?.id);
  if (!userData?._id) {
    return next(customError(401, "User does not exist !"));
  }
  req.user = userData;
  next();
});

export const Authorize_Role = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        customError(
          400,
          `Role "${req.user?.role}" is not allowed to access this feature`,
        ),
      );
    }
    next();
  };
};
