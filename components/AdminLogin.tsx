"use client";

import { useState } from "react";

interface AdminLoginProps {
    login: (email: string, password: string) => Promise<{ success?: boolean; error?: string }>;
}

export default function AdminLogin({ login }: AdminLoginProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await login("apsauto@naver.com", password);

            if (result.error) {
                setError(result.error);
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : "로그인에 실패했습니다.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">관리자 로그인</h1>
                    <p className="text-gray-300">관리자 비밀번호를 입력하세요</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
} 