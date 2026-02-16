//  console.log('keys are',process.env.STRIPE_SECRET_KEYS)

import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { CourseModel } from "../Model/course.model.js";
import { userModel } from "../Model/user.model.js";
import { customError } from "../Utils/customError.js";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const StripeCheckoutSession = AsyncWrapper(async (req, res, next) => {
  const { courseId, userEmail, userId } = req.body;
  const courseData = await CourseModel.findById(courseId).select(
    "name price thumbnail.url _id"
  );
  if (!courseData) {
    return next(customError(400, "Failed to fetch Course Data"));
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: courseData.name,
            images: [courseData.thumbnail?.url],
          },
          unit_amount: courseData.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email:userEmail,
    metadata: {
      userId: userId,
      courseId: courseId,
    },
    success_url: `${process.env.FRONTEND_URL}/payment-verification?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/course/${courseId}`,
  });

  res.json({success:true, data: session.url });
});

export const SessionVerification = AsyncWrapper(async (req, res, next) => {
  const id = req.body?.id;
  const response = await stripe.checkout.sessions.retrieve(id);
  
  if (response?.payment_status !== "paid") {
    return next(customError(400, "Payment Verification Failed"));
  }

  // Extract metadata from the session
  const { userId, courseId } = response.metadata || {};
  
  if (!userId || !courseId) {
    return next(customError(400, "Invalid payment session data"));
  }
    res.status(200).json({
      success: true,
      message: "Payment verified successfully and course access granted",
      data:{userId,courseId}
    });
  } 
);
