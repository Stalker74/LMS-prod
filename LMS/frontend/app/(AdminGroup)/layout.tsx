"use client";

import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { ReactNode, useState } from "react";
import {
  MdContentPaste,
  MdLiveTv,
  MdManageAccounts,
  MdOutlineCategory,
  MdPieChartOutlined,
} from "react-icons/md";
type MenuItem = Required<MenuProps>["items"][number];
import {
  DashboardOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SlCamrecorder } from "react-icons/sl";

import ThemeChanger from "@/utils/ThemeChanger";
import { useSelector } from "react-redux";
import Notification from "@/app/components/Notification";
import { PiInvoiceLight } from "react-icons/pi";
import { BiCustomize } from "react-icons/bi";
import { GrAnalytics, GrDomain } from "react-icons/gr";
import { FaQuestion } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { CgScreenWide } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { IoIosAnalytics } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setselectedKey] = useState("dashboard");
  console.log('selected key is',selectedKey)
  const router = useRouter()
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),
    getItem("Notifications", "notifications", <IoNotifications />),
    getItem("Data", "data", <DatabaseOutlined />, [
      getItem("Users", "users", <UserOutlined />),
      getItem("Invoices", "invoices", <PiInvoiceLight />),
    ]),
    getItem("Content", "content", <MdContentPaste />, [
      getItem("Create Courses", "create-courses", <SlCamrecorder />),
      getItem("Live Courses", "live-courses", <MdLiveTv />),
    ]),
    getItem("Customization", "customization", <BiCustomize />, [
      getItem("Hero", "hero", <GrDomain />),
      getItem("FAQ", "faq", <FaQuestion />),
      getItem("Categories", "categories", <MdOutlineCategory />),
    ]),
    getItem("Controllers", "controllers", <MdManageAccounts />, [
      getItem("Manage Team", "manage-team", <RiTeamLine />),
    ]),
    getItem("Anayltics", "anayltics", <GrAnalytics />, [
      getItem(
        "Courses Analytics",
        "courses-analytics",
        <TbDeviceDesktopAnalytics />
      ),
      getItem(
        "Users Analytics",
        "users-analytics",
        <IoIosAnalytics />

      ),
      getItem(
        "Orders Analytics",
        "orders-analytics",
        <TbDeviceDesktopAnalytics />
      ),
    ]),
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const {key} = e
    setselectedKey(key);
    router.push(`/admin/${key}`)
  };

  return (
    <div className="min-h-screen flex max-h-screen max-w-screen">
      <Sider
        // breakpoint="lg"
        // collapsedWidth="0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{minHeight:'100% !important'}}
        className="h-full! min-h-screen! dark:bg-card-dark! bg-card-light! max-h-screen! overflow-y-auto! hide-scrollbar"
        
      >
        <div className="demo-logo-vertical" />
        <Menu
          //   theme="dark"
          onClick={handleMenuClick}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          className=" h-full bg-white dark:bg-section-dark!"
          classNames={{
            itemContent: "md:text-lg",
            item: "flex items-center",
            itemIcon: "text-lg! md:text-xl!",
            itemTitle: "text-4xl!",
            subMenu: {
              item: "flex! items-center!",
              itemIcon: "  md:text-xl!",
              itemTitle: "text-xl!",
            },
          }}
        />
      </Sider>
      <div className="grow overflow-auto">
        <div className="w-full flex justify-end items-center gap-2 md:gap-4 h-16 md:h-20 md:max-w-7xl md:px-10 px-3 mx-auto">
          <ThemeChanger />
          <Notification />
        </div>
        <div className="max-w-7xl md:px-10 px-3 mx-auto w-full! hide-scrollbar pb-10">{children}</div>
        <div></div>
      </div>
    </div>
  );
};

export default AdminLayout;
