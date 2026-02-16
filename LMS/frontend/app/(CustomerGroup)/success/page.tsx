"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "antd";
import { socket } from "@/socketio";

const Success = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status") as "success" | "failed";
    const msg = searchParams.get("message") || "";
    if(status === 'success'){
      socket.emit('notification')
    }
    
    setVerificationStatus(status);
    setMessage(msg);
  }, [searchParams]);

  const handleGoToCourses = () => {
    router.replace("/");
  };

  const handleRetry = () => {
    router.replace("/");
  };

  if (!verificationStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-center">
          <p className="text-lg text-secondary-light dark:text-secondary-dark">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 border border-border-light dark:border-border-dark shadow-lg">
          <div className="mb-6 flex justify-center">
            {verificationStatus === "success" ? (
              <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 bg-error rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {verificationStatus === "success" ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-success mb-4">
                Success
              </h1>
              <p className="text-secondary-light dark:text-secondary-dark mb-6">
                {message}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleGoToCourses}
                className="bg-bprimary hover:bg-bprimary-hover border-none w-full"
              >
                Go to My Courses
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-error mb-4">
                Failed
              </h1>
              <p className="text-secondary-light dark:text-secondary-dark mb-6">
                {message}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleRetry}
                className="bg-bprimary hover:bg-bprimary-hover border-none w-full"
              >
               Go back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
