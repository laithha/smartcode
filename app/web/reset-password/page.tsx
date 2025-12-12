"use client";
import { Suspense } from "react";
import ResetPasswordForm from "../components/reset-password/resetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
