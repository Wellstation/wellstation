"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAdminAuth();
    };

    initAuth();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await checkAdminAuth();
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setIsLoading(true);

      // 현재 세션 확인
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
        return;
      }

      if (session) {
        // apsauto@naver.com 계정만 관리자로 인식
        const isAdmin = session.user.email === "apsauto@naver.com";
        setIsAuthenticated(isAdmin);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Admin auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);

        // Supabase 인증 에러 메시지를 사용자 친화적으로 변환
        let errorMessage = "로그인에 실패했습니다.";
        if (error.message === "Invalid login credentials") {
          errorMessage = "비밀번호가 올바르지 않습니다.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "이메일 인증이 필요합니다.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage =
            "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
        }

        return { error: errorMessage };
      }

      if (data.user) {
        // 로그인 후 admin 권한 재확인
        await checkAdminAuth();
        return { success: true };
      }

      return { error: "로그인에 실패했습니다." };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "로그인 중 오류가 발생했습니다.";
      return { error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
