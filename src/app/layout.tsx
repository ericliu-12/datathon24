import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      <body
        // className={`${sfProSans.variable} ${sfProMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
