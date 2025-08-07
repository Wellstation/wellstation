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
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <div className="text-xl text-white">관리자 인증 확인 중...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin login={login} />;
    }

    return <>{children}</>;
} 