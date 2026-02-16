"use client";

import { div } from "motion/react-client";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera } from "react-icons/fa";
import { IUser } from "@/app/types/apifn.types";
import { Button, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { UpdateAvatar, UpdateProfile } from "@/app/APIs/routes";
import { dispatchUserData } from "@/app/Redux/UserSlice";

interface IUserData {
  name: string;
  email: string;
  avatar: any;
}
function Account() {
  const { user } = useSelector((state: any) => state.UserReducer);
  const [form] = useForm();
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [loading, setloading] = useState(false)
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage();
  const initialValues = {
    name: user?.name,
    email: user?.email,
  };
  const [preview, setpreview] = useState(user?.avatar?.url || "/profileimage.png");
  console.log("preview is", preview);

  const handleUpate: FormProps<IUserData>["onFinish"] = async (values) => {
    try {
      setloading(true)
      if(values.email === user.email && values.name === user.name){
        return messageApi.warning('Please make any change to update profile')
      }
      const res = await UpdateProfile(values)
      if(res.data.success){
        messageApi.success('Profile Updated successfully')
        dispatch(dispatchUserData(res.data.data))
      }
    } catch (error) {
      messageApi.error('Failed to update profile')
    }
    finally{
      setloading(false)
    }
  };

  const handlePreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      messageApi.open({
        key: "upload",
        content: "Uploading...",
        type: "loading",
      });
      console.log("handle peview run");
      const file = e.target.files?.[0];
      console.log("file is", file);
      if (file) {
        console.log("file created or not");
        const imageUrl = URL.createObjectURL(file);
        setpreview(imageUrl);
        const reader = new FileReader()
        console.log('reader is',reader)
        const readedFile = reader.readAsDataURL(file)
        console.log('readed file is',readedFile)
        reader.onloadend = async()=>{
          const base64ImageUrl = reader.result
          console.log('base64imageurl',base64ImageUrl)
          const res = await UpdateAvatar({ avatar: base64ImageUrl });
          if (res.data.success) {
            setTimeout(() => {
              messageApi.open({
                key: "upload",
                content: "Uploaded successfully",
                type: "success",
              });
            }, 2000);
            dispatch(dispatchUserData(res.data.data))
          }
          
        }
      }
    } catch (error) {
      console.log('error is',error)
        messageApi.open({
          key: "upload",
          content: "Failed to upload image",
          type: "error",
        });
        setpreview('/profileimage.png')
    }
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col items-center ">
      {contextHolder}
      <div className="text-title text-center mb-6 md:mb-10">
        Update <span className="text-accent">Profile</span>
      </div>
      <Form
        form={form}
        name="Update Profile"
        onFinish={handleUpate}
        layout="vertical"
        className="w-full flex flex-col items-center"
        initialValues={initialValues}
      >
        <label htmlFor="profile-image">
          <div className="border-2 dark:border-border-dark border-border-light rounded-full relative cursor-pointer">
            <Image
              src={preview}
              alt="Profile image"
              width={screenWidth < 768 ? 100 : 150}
              height={screenWidth < 768 ? 100 : 150}
              className="rounded-full w-20 h-20 md:w-36 md:h-36 "
            />

            <div className="absolute bottom-1 md:bottom-4 right-1 cursor-pointer ">
              <FaCamera size={screenWidth < 768 ? 20 : 30} className="text-bprimary dark:text-body-light"/>
            </div>
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          id="profile-image"
          className="hidden"
          hidden
          onChange={handlePreview}
        />
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Email is required" }]}
          className="w-full"
        >
          <Input type={"text"} placeholder="John Smith" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid Email Format" },
          ]}
          className="w-full"
        >
          <Input type={"email"} placeholder="Johnsmith@gmail.com" />
        </Form.Item>

        <Button
          loading={loading}
          icon
          iconPlacement="end"
          block
          variant="filled"
          type="primary"
          htmlType="submit"
        >
          Update
        </Button>
      </Form>
    </div>
  );
}

export default Account;
