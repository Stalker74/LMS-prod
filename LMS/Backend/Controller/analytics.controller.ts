import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { CourseModel } from "../Model/course.model.js";
import { OrderModel } from "../Model/order.model.js";
import { userModel } from "../Model/user.model.js";
import { customError } from "../Utils/customError.js";
import { last12MothsData } from "../Utils/last12monthsdata.js";

export const User_Analytics = AsyncWrapper(async(req,res,next)=>{
    const userAnalytics = await last12MothsData(userModel)
    if(!userAnalytics){
        return next(customError(400,'Failed to get User Analytics'))
    }
    return res.status(200).json({
        success:true,
        data:userAnalytics,

    })
})
export const Course_Analytics = AsyncWrapper(async(req,res,next)=>{
    const courseAnalytics = await last12MothsData(CourseModel)
    if(!courseAnalytics){
        return next(customError(400,'Failed to get Courses Analytics'))
    }
    return res.status(200).json({
        success:true,
        data:courseAnalytics,

    })
})
export const Order_Analytics = AsyncWrapper(async(req,res,next)=>{
    const orderAnalytics = await last12MothsData(OrderModel)
    console.log('order analytics are',orderAnalytics)
    if(!orderAnalytics){
        return next(customError(400,'Failed to get Order Analytics'))
    }
    return res.status(200).json({
        success:true,
        data:orderAnalytics,

    })
})