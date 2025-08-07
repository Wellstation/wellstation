"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./AdminLogin";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { isAuthenticated, isLoading, login } = useAdminAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-xl text-white">로딩 중...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={login} />;
    }

    return <>{children}</>;
} 