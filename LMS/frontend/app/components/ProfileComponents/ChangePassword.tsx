import { UpdatePassword } from "@/app/APIs/routes";
import { Button, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useState } from "react";

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}
const ChangePassword = () => {
  const [loading, setloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm()
  const handleUpdatePassword: FormProps<IUpdatePassword>["onFinish"] = async (
    values
  ) => {
    try {
      setloading(true);
      const res = await UpdatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (res.data.success) {
        messageApi.success("Password Updated Successfully");
        form.resetFields()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data.message || "Failed to update password"
        );
      }
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="w-full md:w-3/4">
      {contextHolder}
      <div className="text-title text-center mb-6 md:mb-10">
        Change <span className="text-accent">Password</span>
      </div>
      <Form
      form={form}
        name="Update Password"
        onFinish={handleUpdatePassword}
        layout="vertical"
        className="flex flex-col items-center w-full"
      >
        <Form.Item
          name={"oldPassword"}
          label="Old Password"
          rules={[{ required: true, message: "Old Password is required" }]}
          className="w-full"
        >
          <Input.Password type="password" placeholder="old password" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name={"newPassword"}
          label="New Password"
          rules={[
            { required: true, message: "New Password is required" },
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
          <Input.Password placeholder="new password" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name={"confirmPassword"}
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Confrim Password is required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && value !== getFieldValue("newPassword")) {
                  return Promise.reject("New and Confirm password must match");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder="confirm password" />
        </Form.Item>
        <Form.Item shouldUpdate label="Password Rules" className="w-full">
          {({ getFieldValue }) => {
            const value = getFieldValue("newPassword") || "";
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
        <Button
          htmlType="submit"
          type="primary"
          variant="filled"
          block
          loading={loading}
          icon
          iconPlacement="end"
        >
          Update Password
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;
