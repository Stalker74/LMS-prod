"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import ThemeChanger from "@/utils/ThemeChanger";
import { ProfileIcon } from "./ReactIcons";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { Popover } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";

const Header = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [opensidebar, setopensidebar] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const path = usePathname();
  const { user } = useSelector((state: any) => state.UserReducer);
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const router = useRouter();

  useEffect(() => {
    const activeTab = path.split("/")[1];
    const hash = window.location.hash;
    
    if (path === "/" && hash === "#faq") {
      setActiveItem("faq");
    } else {
      setActiveItem(activeTab ? activeTab : "home");
    }
    console.log("active tab");
  }, [path]);

  // Listen for hash changes to update active item
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (path === "/" && hash === "#faq") {
        setActiveItem("faq");
      } else if (path === "/" && !hash) {
        setActiveItem("home");
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [path]);

  const handleNavigation = (item: any) => {
    if (item.key === 'faq') {
      // If already on home page, just scroll to FAQ
      if (path === '/') {
        const faqElement = document.getElementById('faq');
        if (faqElement) {
          faqElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        // Update URL hash
        setActiveItem('faq');
      } else {
        // Navigate to home page with hash
        router.push('/#faq');
      }
    } else {
      router.push(item.path);
      setActiveItem(item.key)
    }
    // Close sidebar on mobile
    setopensidebar(false);
  };

  const NavItems = [
    {
      key: "home",
      name: "Home",
      path: "/",
    },
    {
      key: "courses",
      name: "Courses",
      path: "/courses",
    },
    {
      key: "about",
      name: "About",
      path: "/about",
    },
    {
      key: "policy",
      name: "Policy",
      path: "/policy",
    },
    {
      key: "faq",
      name: "FAQ",
      path: "/#faq",
    },
  ];

  const HandleOpenLogin = (open: boolean) => {
    setOpenLogin(open);
  };

  return (
    <div className="w-full border-b-[0.2px] border-gray-300 dark:border-gray-700 bg-section-light dark:bg-section-dark ">
      <div className="max-w-7xl px-4 md:px-10 mx-auto flex items-center h-20 justify-between">
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={screenWidth < 768 ? 50 : 70}
          height={screenWidth < 768 ? 50 : 70}
          className="-ml-6"
        />
        <div className="hidden md:flex items-center gap-10 text-ui grow justify-center ">
          {NavItems.map((item) => {
            return (
              <div
                key={item?.key}
                className={`cursor-pointer ${
                  item.key === activeItem ? "text-accent" : ""
                }`}
                onClick={() => handleNavigation(item)}
              >
                {item?.name}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 md:gap-6 items-center -mr-4">
          <ThemeChanger />

          {user?._id ? (
            <Image
              src={user?.avatar?.url || "/profileimage.png"}
              alt="Profile image"
              width={screenWidth < 768 ? 35 : 50}
              height={screenWidth < 768 ? 35 : 50}
              className=" rounded-full cursor-pointer border-2 border-bprimary w-10 h-10 md:w-12 md:h-12 "
              onClick={() => router.push("/profile")}
            />
          ) : (
            <Popover
              trigger="click"
              content={<Link href={"/login"}>Login/SignUp</Link>}
              open={openLogin}
              onOpenChange={HandleOpenLogin}
              placement="bottom"
            >
              <div>
                <ProfileIcon />
              </div>
            </Popover>
          )}
          <HiOutlineMenuAlt3
            size={30}
            className="cursor-pointer block md:hidden"
            onClick={() => setopensidebar(true)}
          />
        </div>
        {opensidebar && (
          <div className="md:hidden   min-h-screen absolute top-0 left-0 z-40 w-full flex justify-end">
            <div
              className={`${
                opensidebar ? "w-4/5 translate-x-0" : "w-0"
              } ease-in-out transition-all duration-1000 dark:bg-section-dark bg-section-light min-h-full border-l rounded-l-md px-6 border-gray-300 dark:border-gray-700`}
            >
              <div className="min-h-20 flex justify-end items-center">
                <IoClose
                  size={30}
                  className=""
                  onClick={() => setopensidebar(false)}
                />
              </div>
              <div className="flex flex-col gap-y-6 text-lg font-semibold">
                {NavItems.map((item) => {
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleNavigation(item)}
                      className={`cursor-pointer ${
                        item.key === activeItem ? "text-accent" : ""
                      }`}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
              <div className="text-meta flex justify-center mt-10 ">
                Copyright © 2026 ELearning
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
