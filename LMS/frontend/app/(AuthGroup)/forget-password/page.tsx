"use client";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { ForgetPassword } from "../../APIs/routes";
import axios from "axios";
import { useRouter } from "next/navigation";

type FieldType = {
  email: string;
};

const ForgetPasswordComp: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = async (value) => {
    if (!value) return;
    try {
      setloading(true);
      const res = await ForgetPassword(value);
      if (res.data.success) {
        localStorage.setItem("authToken", JSON.stringify(res.data.authToken));
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(res.data.refreshToken)
        );
        messageApi.success(
          "We have sent a 6 digit verification code to verify your email"
        );
        router.replace("/verify-account?email=true");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to verify your email"
        );
      }
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="flex w-full min-h-screen items-stretch ">
      {contextHolder}
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center md:justify-center mt-20 md:mt-0 max-h-screen overflow-y-auto hide-scrollbar ">
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={100}
          height={100}
          className="-ml-5 md:ml-0 mb-9"
        />
        <div className="flex flex-col items-center mb-9 -mt-2 md:mt-0">
          <div className="text-display text-center">
            Forgot Your <span className="text-accent">Password ?</span>
          </div>
          <div className="md:max-w-[60ch] md:text-lg text-muted-light dark:text-muted-dark text-wrap text-center ">
            Enter your email address and we will send you instructions to reset
            your password
          </div>
        </div>

        <Form
          name="signup form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="lg:w-4/5 w-full"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid Email Format" },
            ]}
          >
            <Input placeholder="johnsmith@gmail.com" />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              iconPlacement="end"
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
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

export default ForgetPasswordComp;
