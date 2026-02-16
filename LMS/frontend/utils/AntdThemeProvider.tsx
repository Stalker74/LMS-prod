"use client";

import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";
import { FC, ReactNode, useEffect, useState } from "react";


export default function AntdThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const [isDark, setIsDark] = useState(false);
  const {resolvedTheme,systemTheme, setTheme} = useTheme()
  useEffect(()=>{
    setTheme(systemTheme as string)
  },[systemTheme])
  const isDark = resolvedTheme === 'dark' ? true : false 

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4F46E5",
          colorTextHeading: isDark ? "#f9fafb" : "#111827",
          colorText: isDark ? "#CBD5E1" : "#374151",
          colorBorder: isDark ? "#334155" : "#d1d5db",
          borderRadius: 8,
          controlHeight: 40,
          marginLG:14,
        },
        components: {
          Input: {
            activeShadow: "none",
          },
          Form:{ 
            verticalLabelPadding:'0 0 2px',
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
