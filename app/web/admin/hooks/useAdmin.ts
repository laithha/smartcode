"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lesson } from "../utils";

export function useAdmin() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (!token || !user_id) { router.push("/web/login"); return; }

        const checkAdmin = async () => {
            const res = await fetch(`http://localhost:8000/users/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) { router.push("/web/login"); return; }
            const data = await res.json();
            if (!data.user || data.user[3] !== true) { router.push("/web/lessons"); return; }
            fetchAll(token);
        };
        checkAdmin();
    }, []);

    const fetchAll = async (token: string) => {
        const [usersRes, lessonsRes] = await Promise.all([
            fetch("http://localhost:8000/users", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:8000/lessons"),
        ]);
        const usersData = await usersRes.json();
        const lessonsData = await lessonsRes.json();
        setUsers((usersData.users ?? []).map((u: any[]) => ({ id: u[0], email: u[1], is_admin: u[3] })));
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
        setLoading(false);
    };

    const refetchLessons = async () => {
        const res = await fetch("http://localhost:8000/lessons");
        const data = await res.json();
        setLessons(Array.isArray(data) ? data : []);
    };

    const deleteUser = async (user_id: number) => {
        const token = localStorage.getItem("token")!;
        await fetch(`http://localhost:8000/users/${user_id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setUsers(prev => prev.filter(u => u.id !== user_id));
    };

    const toggleAdmin = async (user_id: number, current: boolean) => {
        const token = localStorage.getItem("token")!;
        await fetch(`http://localhost:8000/users/${user_id}/admin`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ is_admin: !current }),
        });
        setUsers(prev => prev.map(u => u.id === user_id ? { ...u, is_admin: !current } : u));
    };

    const deleteLesson = async (lesson_id: number) => {
        const token = localStorage.getItem("token")!;
        await fetch(`http://localhost:8000/lessons/${lesson_id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setLessons(prev => prev.filter(l => l.lesson_id !== lesson_id));
    };

    return { users, lessons, loading, deleteUser, toggleAdmin, deleteLesson, refetchLessons };
}
