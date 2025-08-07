"use client";

import { useEffect, useState } from "react";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 세션에서 인증 상태 확인
    const adminAuth = sessionStorage.getItem("adminAuthenticated");
    setIsAuthenticated(adminAuth === "true");
    setIsLoading(false);
  }, []);

  const login = () => {
    sessionStorage.setItem("adminAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
