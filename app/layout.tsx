"use client";

import "./globals.css";
import Navbar from "./navbar/navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/web/login" ||
    pathname === "/web/register" ||
    pathname === "/web/forgot-password" ||
    pathname === "/web/reset-password";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {!hideNavbar && <Navbar />}
        <main style={{ width: "100%" }}>
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
