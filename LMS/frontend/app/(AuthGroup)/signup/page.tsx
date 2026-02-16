"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Alert, Button, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { RegisterUser, SocialOauth } from "../../APIs/routes";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { signIn, useSession } from "next-auth/react";

type FieldType = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

const Signup: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const { data: session } = useSession();

  console.log("data is", session);
  useEffect(() => {
    const SocialOauthRegister = async () => {
      messageApi.open({
        key: "oauth",
        type: "loading",
        content: "Authorizing ...",
      });
      try {
        const res = await SocialOauth(
          session?.user as { name: string; email: string; image: string }
        );
        if (res.data.success) {
          setTimeout(() => {
            messageApi.open({
              key: "oauth",
              type: "success",
              content: "User Authorized Successfully",
            });
          }, 2000);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (error) {
        messageApi.error("User Authorization Failed");
      }
    };
    if (!session?.user) return;
    SocialOauthRegister();
  }, [session]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      if (!values) return;
      setloading(true);
      const res = await RegisterUser(values);
      if (res.data.success) {
        messageApi.success(
          "We have sent a 6 digit verification code to your email to activate your account"
        );
        localStorage.setItem("authToken", JSON.stringify(res.data.authToken));
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(res.data.refreshToken)
        );
        setTimeout(() => {
          router.push("/verify-account");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(error.response?.data?.message || "Please check your Internet connection or Try again later");
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-stretch relative">
      {contextHolder}
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center max-h-screen overflow-y-auto hide-scrollbar pt-10 pb-20 relative">
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={100}
          height={100}
          className="-ml-5 md:ml-0 mb-9"
        />
        <div className="flex flex-col items-center mb-9 -mt-2 md:mt-0">
          <div className="text-display text-center">
            Welcome to <span className="text-accent">ELearning</span>
          </div>
          <div className="text-title">Register as Student</div>
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
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="John Smith" />
          </Form.Item>
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
              Register
            </Button>
          </Form.Item>
          <div className="text-center">
            Already have an account ?{" "}
            <Link href={"/login"} className="">
              Login
            </Link>
          </div>
        </Form>
        <div className="text-body mt-4">
          <div>OR Join with</div>
          <div className="flex w-full justify-center items-center gap-4 mt-2">
            <FcGoogle
              size={40}
              onClick={() => signIn("google")}
              className="cursor-pointer"
            />
            <AiFillGithub
              size={40}
              onClick={async () => await signIn("github")}
              className="cursor-pointer"
            />
          </div>
        </div>
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

export default Signup;
