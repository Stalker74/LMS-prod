// "use client";

// import { dispatchscreenWidth } from "@/app/Redux/UtilSlice";
// import { ReactNode, useEffect } from "react";
// import { useDispatch } from "react-redux";

// export const InnerWidthProvider = ({ children }: { children: ReactNode }) => {
//   innerWidth;
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const checkInnerWidth = () => dispatch(dispatchscreenWidth(innerWidth));
//     window.addEventListener("resize", () => checkInnerWidth);
//     return window.removeEventListener("resize", () => checkInnerWidth);
//   }, []);

//   return <>{children}</>;
// };
