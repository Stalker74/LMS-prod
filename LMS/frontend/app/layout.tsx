import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "@/utils/ThemeProvider";
import AntdThemeProvider from "@/utils/AntdThemeProvider";
import ReduxProvider from "@/utils/ReduxProvider";
import PersistGateProvider from "@/utils/PersistGateProvider";
import RefreshTokenProvider from "@/utils/RefreshTokenProvider";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});
export const metadata: Metadata = {
  title: "ELearning",
  description: "One stop platform to learn fast growing technical skills",
  keywords: "Programming, MERN, Next js, Tailwind css, Redux Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} antialiased bg-body-light dark:bg-body-dark min-h-screen h-full dark:text-primary-dark text-primary-light`}
      >
        <ReduxProvider>
          <PersistGateProvider>
            <SessionProvider>
              <RefreshTokenProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                >
                  <AntdThemeProvider>
                    <div className="min-h-screen flex flex-col">
                      {/* <Header /> */}
                      <div className="grow">{children}</div>
                      {/* <div>This is the footer</div> */}
                    </div>
                  </AntdThemeProvider>
                </ThemeProvider>
              </RefreshTokenProvider>
            </SessionProvider>
          </PersistGateProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
