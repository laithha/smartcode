"use client";

import "./globals.css";
import Navbar from "./web/components/navbar/navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/web/login" || pathname === "/web/register";

  const isAuthPage =
    pathname === "/web/login" || pathname === "/web/register";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          overflow: "hidden",
          height: "100vh",
          width: "100vw",
          backgroundColor: isAuthPage ? "transparent" : "#ffffff",
        }}
      >
        {!hideNavbar && <Navbar />}

        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            margin: 0,
            padding: 0,
            background: "transparent",
          }}
        >
          {children}
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
