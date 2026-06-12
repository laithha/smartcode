"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/web/login");
        } else {
            setAuthenticated(true);
        }
    }, [router]);

    return authenticated;
}
