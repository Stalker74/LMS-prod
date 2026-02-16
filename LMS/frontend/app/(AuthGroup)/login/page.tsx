"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { LoginUser, SocialOauth } from "../../APIs/routes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { dispatchUserData } from "../../Redux/UserSlice";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";

type FieldType = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
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
      setloading(true);
      const res = await LoginUser(values);
      if (res.data.success) {
        dispatch(dispatchUserData(res.data?.data));
        messageApi.success("User logged in successfully");
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to login user"
        );
      }
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="flex w-full min-h-screen items-stretch ">
      {contextHolder}
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center lg:justify-center max-h-screen overflow-y-auto hide-scrollbar py-10">
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
          <div className="text-title">Login as Student</div>
        </div>

        <Form
          name="login form"
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

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="John$m!th2" />
          </Form.Item>
          <div className="w-full flex justify-end mb-3 ">
            <Link href={"/forget-password"} style={{ color: "red" }}>
              Forgot Password ?
            </Link>
          </div>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              iconPlacement="end"
            >
              Login
            </Button>
          </Form.Item>
          <div className="text-center">
            Donot have account yet ?{" "}
            <Link href={"/signup"} className="">
              Register
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
      ></div>
    </div>
  );
};

export default Login;
