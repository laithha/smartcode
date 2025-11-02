"use client";

import "./globals.css";
import Navbar from "./web/components/navbar/navbar";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar only on /web/login
  const showNavbar = pathname !== "/web/login";

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
