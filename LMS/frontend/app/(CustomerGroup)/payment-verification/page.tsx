"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SessionVerificationApi, CreateOrderApi, GetProfileData } from "@/app/APIs/routes";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { dispatchUserData } from "@/app/Redux/UserSlice";

const PaymentVerification = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          router.replace("/success?status=failed&message=Invalid payment session");
          return;
        }

        const response = await SessionVerificationApi({ id: sessionId });

        if (response.data.success) {
          const { userId, courseId } = response.data.data;
          
          // Create order
          const orderRes = await CreateOrderApi({
            courseId,
            payment_info: { session_id: sessionId }
          });

          // Update user profile
          if (orderRes.data.success) {
            dispatch(dispatchUserData(orderRes.data.data));
          }

          router.replace("/success?status=success&message=Payment successful! Course access granted.");
        } else {
          router.replace("/success?status=failed&message=Payment verification failed");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        router.replace(`/success?status=failed&message=${error.response?.data?.message || "Payment verification failed"}`);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-lg text-secondary-light dark:text-secondary-dark">
          Verifying your payment...
        </p>
      </div>
    </div>
  );
};

export default PaymentVerification;
