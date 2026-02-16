"use client";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import Image from "next/image";
import logoImage from "@/public/logo.png";
import Link from "next/link";
import ThemeChanger from "@/utils/ThemeChanger";
import { useRouter } from "next/navigation";
import { ResetPasswordApi } from "../../APIs/routes";
import axios from "axios";

type FieldType = {
  password: string;
  confirm_password: string;
};

const ResetPassword: React.FC = () => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setloading(true);
      const refreshToken = JSON.parse(
        localStorage.getItem("refreshToken") as string
      );
      const res = await ResetPasswordApi({
        password: values.password,
        refreshToken,
      });
      if (res.data.success) {
        messageApi.success("Password Reset Successfully");
        localStorage.removeItem("refreshToken");
        router.replace("login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to reset password"
        );
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-stretch ">
      {contextHolder}
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center max-h-screen overflow-y-auto hide-scrollbar py-10 relative">
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={100}
          height={100}
          className="-ml-5 md:ml-0 mb-9"
        />
        <div className="flex flex-col items-center mb-9 -mt-2 md:mt-0">
          <div className="text-display text-center">
            Reset your <span className="text-accent">Password</span>
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
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (value.length < 8) {
                    return Promise.reject(
                      "Password must be at least 8 characters long"
                    );
                  }
                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject(
                      "Password must contain at least 1 UpperCase letter"
                    );
                  }
                  if (!/[a-z]/.test(value)) {
                    return Promise.reject(
                      "Password must contain at least 1 lowercase letter"
                    );
                  }
                  if (!/\d/.test(value)) {
                    return Promise.reject("Include at least one number");
                  }
                  if (!/[@$!%*?&#]/.test(value)) {
                    return Promise.reject(
                      "Include at least one special character"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="John$m!th2" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Confirm Password"
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please Re-enter your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue("password") !== value) {
                    return Promise.reject(
                      new Error("Confirm password does not match!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="John$m!th2" />
          </Form.Item>
          <Form.Item shouldUpdate label="Password Rules">
            {({ getFieldValue }) => {
              const value = getFieldValue("password") || "";
              return (
                <ul className="text-xs md:text-sm text-gray-500">
                  <li className={value.length >= 8 ? "text-green-500" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(value) ? "text-green-500" : ""}>
                    Minimum One Uppercase letter
                  </li>
                  <li className={/[a-z]/.test(value) ? "text-green-500" : ""}>
                    Minimum One Lowercase letter
                  </li>
                  <li className={/\d/.test(value) ? "text-green-500" : ""}>
                    Minimum One Number
                  </li>
                  <li
                    className={/[@$!%*?&#]/.test(value) ? "text-green-500" : ""}
                  >
                    Minimum One Special character
                  </li>
                </ul>
              );
            }}
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              iconPlacement="end"
            >
              Reset Password
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
      >
        {/* <div className="text-display -mb-110 text-secondary-dark">Lets Get Started</div> */}
      </div>
    </div>
  );
};

export default ResetPassword;
