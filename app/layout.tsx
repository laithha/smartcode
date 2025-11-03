"use client";

import "./globals.css";
import Navbar from "./web/components/navbar/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar only on /web/login
  const showNavbar = pathname !== "/web/login";

  // Detect if we're on the login page
  const isLoginPage = pathname === "/web/login";

  return (
    <html lang="en">
<body
  style={{
    backgroundColor: pathname === "/web/login" ? "#0a1930" : "#ffffff",
    margin: 0,
    padding: 0,
    overflow: "hidden", // prevents white scroll area
    height: "100vh", // ensure full height
    width: "100vw", // ensure full width
  }}
>
  {showNavbar && <Navbar />}
  <main
    style={{
      height: "100%",
      width: "100%",
      margin: 0,
      padding: 0,
    }}
  >
    {children}
  </main>
</body>

    </html>
  );
}
