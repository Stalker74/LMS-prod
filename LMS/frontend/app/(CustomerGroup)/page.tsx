"use client";

import { FC, useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Reviews from "../components/Reviews";
import { useDispatch } from "react-redux";
import { dispatchscreenWidth } from "../Redux/UtilSlice";
import Faqs from "./faqs/page";
import Footer from "../components/Footer";
import { removeCourses } from "../Redux/UserSlice";
import { socket } from "@/socketio";
import { Button } from "antd";
import Lottie from "lottie-react";
import lottieAnimation from "@/public/loader.json";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {}

const Page: FC<IProps> = () => {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const scrollToFaq = () => {
    const faqElement = document.getElementById('faq');
    if (faqElement) {
      faqElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const checkInnerWidth = () => {
      console.log("inner Width is", innerWidth);
      dispatch(dispatchscreenWidth(innerWidth));
    };
    checkInnerWidth();
    window.addEventListener("resize", checkInnerWidth);

    // Simulate initial page load time
    const timer = setTimeout(() => {
      setInitialLoading(false);
      
      // Check for hash after loading is complete
      if (window.location.hash === '#faq') {
        setTimeout(() => {
          scrollToFaq();
        }, 100);
      }
    }, 1000);

    return () => {
      window.removeEventListener("resize", checkInnerWidth);
      clearTimeout(timer);
    };
  }, [dispatch]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#faq' && !initialLoading) {
        scrollToFaq();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialLoading]);

  if (initialLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-center">
          <div className="h-80 lg:h-100 mx-auto aspect-square ">
            <Lottie
              animationData={lottieAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full px-6 md:px-10 mx-auto flex flex-col gap-y-10 lg:gap-y-20">
      <Hero />
      <Courses />
      <Reviews />
      <div id="faq">
        <Faqs />
      </div>
    </div>
  );
};

export default Page;
