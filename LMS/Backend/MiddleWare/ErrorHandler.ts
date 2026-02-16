import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const ErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
    let message = err.message || 'Internal Server Error'
    let statusCode = err.statusCode || 500
    if(err.name === 'TokenExpiredError'){
        message = 'Session Expired'
        statusCode = 401
    }
    if(err.name === 'JsonWebTokenError'){
        message = 'Session Expired'
        statusCode = 401
    }
    return res.status(statusCode).json({
        success:false,
        message:message
    })
}