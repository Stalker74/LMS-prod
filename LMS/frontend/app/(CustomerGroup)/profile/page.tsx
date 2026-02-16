"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoSchoolSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { div } from "motion/react-client";
import { Button, message, Modal, Spin, Tooltip } from "antd";
import Account from "../../components/ProfileComponents/Account";
import ChangePassword from "../../components/ProfileComponents/ChangePassword";
import EnrolledCourses from "../../components/ProfileComponents/EnrolledCourses";
import { redirect, useRouter } from "next/navigation";
import { LogoutUser } from "../../APIs/routes";
import { signOut } from "next-auth/react";
import { dispatchUserData } from "../../Redux/UserSlice";
import Link from "next/link";
import { LoadingOutlined } from '@ant-design/icons';


type Props = {};

interface ISideBarData {
  key: string;
  name: string;
  icon: any;
}

const Profile = (props: Props) => {
  const { user } = useSelector((state: any) => state?.UserReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  useEffect(() => {
    if (!user?._id) {
      router.replace("/");
    }
  }, []);
  const [activeMenu, setActiveMenu] = useState("my-account");
  const sideBarData: ISideBarData[] = [
    {
      key: "my-account",
      name: "My Account",
      icon: user?.avater ? (
        ""
      ) : (
        <Image
          src={user.avatar?.url || "/profileimage.png"}
          alt="Profile Image"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 border-2 border-bprimary"
        />
      ),
    },
    {
      key: "change-password",
      name: "Change Password",
      icon: <RiLockPasswordFill />,
    },
    {
      key: "courses",
      name: "Enrolled Courses",
      icon: <IoSchoolSharp />,
    },
    {
      key: "admin-dashboard",
      name: "Admin Dashboard",
      icon: <MdSpaceDashboard />,
    },
    {
      key: "logout",
      name: "Logout",
      icon: <IoLogOut />,
    },
  ];
  const [showlogoutModal, setshowlogoutModal] = useState(false);
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const dispatch = useDispatch();

  const handleLogoutUser = async () => {
    try {
      const res = await LogoutUser();
      if (res.data.success) {
        await signOut({ redirect: false });
        dispatch(dispatchUserData({}));
        router.push("/login");
      }
    } catch (error) {
      messageApi.error("Failed to Logout User");
    }
  };
  return (
    <div className="w-full">
      {contextHolder}
      <div className="max-w-7xl mx-auto  flex min-h-[calc(100vh-90px)] max-h-[calc(100vh-90px)]">
        <div className=" hide-scrollbar flex flex-col gap-y-6 md:gap-y-8 w-max md:w-1/4 md:justify-center md:items-stretch items-center  pt-10 border dark:border-border-dark border-border-light dark:bg-section-dark bg-section-light shrink-0!">
          {sideBarData?.length > 0 &&
            sideBarData.map((item, index) => {
              return  (
                <div
                  key={item.key}
                  className={`flex gap-3 items-center cursor-pointer px-3 md:px-6 py-2 ${
                    activeMenu === item.key ? "md:bg-accent" : ""
                  }`}
                  onClick={() => {
                    setActiveMenu(item.key);
                    if (item.key === "logout") {
                      setshowlogoutModal(true);
                    }
                    if (item.key === "admin-dashboard") {
                      router.push("/admin/create-courses");
                    }
                  }}
                >
                  {screenWidth < 768 ? (
                    <Tooltip
                      placement="right"
                      arrow
                      title={item.name}
                      className="text-white md:hidden"
                      color={"#f59e0b"}
                      open={activeMenu === item.key}
                      classNames={{ container: "flex items-center" }}
                    >
                      <div className="text-2xl">{item.icon}</div>
                    </Tooltip>
                  ) : (
                    <div className="text-2xl hidden md:block">{item.icon}</div>
                  )}

                  <div className="hidden md:block">{item.name}</div>
                </div>
              )
            })}
        </div>
        <div className="grow overflow-y-auto px-3 hide-scrollbar">
          {activeMenu === "my-account" ? (
            <div className="w-full flex justify-center mt-10 md:items-center  h-full">
              <Account />
            </div>
          ) : activeMenu === "change-password" ? (
            <div className="w-full flex justify-center mt-10 md:items-center  h-full">
              <ChangePassword />
            </div>
          ) : activeMenu === "courses" ? (
            <div className="w-full flex flex-col items-center mt-10  h-full!">
              <EnrolledCourses />
            </div>
          ) : (
            activeMenu === 'admin-dashboard' ? 
            <div className="w-full flex justify-center items-center h-full">
                <Spin size='large' indicator={<LoadingOutlined style={{ fontSize: 60 }} spin/>}/>
            </div>
            :
            ''
          )}
        </div>
      </div>
      <Modal
        title={
          <div className="text-center text-title">
            Logout <span className="text-accent">User</span>
          </div>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={showlogoutModal}
        footer={false}
        onCancel={() => setshowlogoutModal(false)}
      >
        <div>
          <div className="my-4 text-body">Are your sure to logout ?</div>
          <div className="flex justify-end gap-x-2">
            <Button
              variant="outlined"
              onClick={() => setshowlogoutModal(false)}
            >
              NO
            </Button>
            <Button variant="filled" type="primary" onClick={handleLogoutUser}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
