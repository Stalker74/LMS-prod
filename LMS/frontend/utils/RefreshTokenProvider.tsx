"use client";

import { GetLayoutDataApi, RefreshToken } from "@/app/APIs/routes";
import {
  dispatchCategories,
  dispatchFaqs,
  dispatchHeroSection,
} from "@/app/Redux/Layout";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const RefreshTokenProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const isUserloggedIn = useSelector(
    (state: any) => state.UserReducer.user?._id
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const pathsToSkip = [
      "/login",
      "/signup",
      "/verify-account",
      "/reset-password",
      "/forget-password",
    ];
    const fetchAccessToken = async () => {
      try {
        const hero = await GetLayoutDataApi({ type: "banner" });
        dispatch(
          dispatchHeroSection({
            ...hero.data.data.banner,
            image: hero.data.data.banner.image.url,
          })
        );
        if (pathsToSkip.includes(path) || !isUserloggedIn) return;
        await RefreshToken();
      } catch (error) {
        console.log("Something went wrong, PLease try again later");
      }
    };
    fetchAccessToken();
  }, []);
  return <>{children}</>;
};

export default RefreshTokenProvider;
