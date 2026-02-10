import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutClient from "@/components/LayoutClient";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Webstore",
  description: "Webstore Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased bg-gray-900 text-gray-100`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
