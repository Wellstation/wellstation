"use client";

import { supabase } from "@/supabase/client";
import { useState } from "react";

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 비밀번호 검증
            console.log("Attempting to query admin_auth table...");
            const { data, error } = await supabase
                .from("admin_auth")
                .select("password_hash")
                .eq("username", "admin")
                .single();

            console.log("Supabase query result:", { data, error });
            if (error) {
                console.error("Supabase error details:", {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
            }

            if (error) {
                alert("관리자 계정을 찾을 수 없습니다.");
                setError("관리자 계정을 찾을 수 없습니다.");
                return;
            }

            // 비밀번호 확인 (평문 비교)
            const { data: verifyData, error: verifyError } = await supabase
                .rpc("verify_admin_password", {
                    input_password: password,
                    stored_password: data.password_hash
                });

            if (verifyError || !verifyData) {
                alert("비밀번호가 올바르지 않습니다.");
                setError("비밀번호가 올바르지 않습니다.");
                return;
            }

            // 로그인 성공 - 세션에 저장
            sessionStorage.setItem("adminAuthenticated", "true");
            onLoginSuccess();

        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : "로그인에 실패했습니다.";
            alert(errorMessage);
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
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
} 