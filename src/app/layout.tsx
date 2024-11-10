import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { SidebarProvider } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
      <body
      // className={`${sfProSans.variable} ${sfProMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <SidebarProvider>
            {/* <SidebarTrigger /> */}
            {children}
          </SidebarProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
