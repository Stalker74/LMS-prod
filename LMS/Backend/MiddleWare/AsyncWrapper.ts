import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncWrapper = (
    req:Request,
    res:Response,
    next:NextFunction
) => Promise<any>

export const AsyncWrapper = (Fn:AsyncWrapper):AsyncWrapper => {
  return async (req, res, next) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
       return next(error)
    }
  };
};
