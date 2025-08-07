"use client";

import { useAdminAuth } from '@/hooks/useAdminAuth';
import React from 'react';

interface AdminHeaderProps {
    title: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, left, right }) => {
    const { logout } = useAdminAuth();

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return (
        <header className="bg-black/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        {left && <div className="mr-4 text-white">{left}</div>}
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                    </div>
                    <div className="flex space-x-4">
                        {right}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;