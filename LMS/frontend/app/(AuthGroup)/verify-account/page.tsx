"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import Image from "next/image";
import type { GetProps } from "antd";
import { ActivateAccount, ResendActivationCode } from "../../APIs/routes";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

type OTPProps = GetProps<typeof Input.OTP>;

const VerifyAccount: React.FC = () => {
  const [otp, setotp] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [verifyEmailQuery, setverifyEmailQuery] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Boolean(searchParams.get("email"));
    if (params) {
      return setverifyEmailQuery(true);
    }
    return;
  }, []);

  const onInput: OTPProps["onInput"] = (value) => {
    if (value.length === 6) {
      seterror("");
    }
    const formattedOTP = value.join("");
    setotp(formattedOTP);
  };

  const sharedProps: OTPProps = {
    onInput,
  };

  const handleAccountVerification = async () => {
    if (!otp || otp.length !== 6) {
      return seterror("OTP must be at least 6 digits");
    }
    setloading(true);
    const authToken = JSON.parse(localStorage.getItem("authToken") as string);
    try {
      const res = await ActivateAccount(
        {
          authToken,
          verificationCode: otp,
        },
        verifyEmailQuery ? true : false
      );
      if (res.data.success) {
        messageApi.success("Account Activated Successfully");
        setTimeout(() => {
          verifyEmailQuery
            ? router.replace("/reset-password")
            : router.replace("/login");
        }, 1500);
        localStorage.removeItem("authToken");
        !verifyEmailQuery && localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          `${error.response?.data?.message}` || "Failed to activate account"
        );
      }
    } finally {
      setloading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      messageApi.open({
        key: "updatable",
        type: "loading",
        content: "Processing...",
      });
      const refreshToken = JSON.parse(
        localStorage.getItem("refreshToken") as string
      );
      const res = await ResendActivationCode({ refreshToken });
      if (res.data.success) {
        localStorage.setItem("authToken", JSON.stringify(res.data.authToken));
        messageApi.open({
          key: "updatable",
          type: "success",
          content: "Activation code resent successfully",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.open({
          key: "updatable",
          type: "error",
          content:
            error.response?.data?.message || "Failed to resend activation code",
        });
      }
    } finally {
    }
  };

  return (
    <div className="flex w-full min-h-screen items-stretch ">
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center md:justify-center mt-16 md:mt-0 max-h-screen overflow-y-auto hide-scrollbar ">
        {contextHolder}
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={100}
          height={100}
          className="-ml-5 md:ml-0 mb-8"
        />
        <div className="flex flex-col items-center mb-9 -mt-2 md:mt-0">
          <div className="text-display text-center">
            Verify <span className="text-accent">Account !</span>
          </div>
          <div className="md:max-w-[60ch] md:text-lg text-muted-light dark:text-muted-dark text-wrap text-center ">
            We've sent a 6-digit authentication code to your registered email
            address. Please enter the code below to verify your account.
          </div>
        </div>

        <Input.OTP
          value={otp}
          className=" w-full flex justify-center mb-6 "
          {...sharedProps}
        />
        {error && <div className="text-ui text-error mb-2">{error}</div>}
        <div className="md:max-w-[60ch] md:text-lg text-muted-light dark:text-muted-dark text-wrap text-center mb-2">
          If you haven't received the code, check your spam/junk folder or
          resend code.
        </div>
        <Button
          type="link"
          style={{ color: "orange" }}
          onClick={handleResendCode}
        >
          Resend Code
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          iconPlacement="end"
          onClick={handleAccountVerification}
        >
          Continue
        </Button>
      </div>
      <div
        className="hidden md:w-1/2 bg-bprimary  max-h-screen md:flex items-center justify-center"
        style={{
          backgroundImage: `url('/auth-img.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default VerifyAccount;
