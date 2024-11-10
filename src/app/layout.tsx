import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const sfProSans = localFont({
  src: "./fonts/sf-pro-text-heavy.woff",
  variable: "--sf-pro",
  weight: "100 900",
});
const sfProMono = localFont({
  src: "./fonts/sf-pro-text-heavy.woff",
  variable: "--sf-pro",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "For your system design needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative"
      // className={`${sfProSans.variable} ${sfProMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <SidebarProvider>
            <AppSidebar />
            <img src="nexus.svg" alt="nexus_logo" className="fixed top-0 ml-[13vw] mt-2 z-10 drop-shadow-xl" />
            {/* <SidebarTrigger /> */}
            {children}
          </SidebarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
