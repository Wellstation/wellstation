import { useEffect, useState } from "react";
import { getVisitorId } from "../utils/visitor";

interface VisitorCountData {
  count: number;
  totalVisitors: number;
}

export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 방문자 수 증가
  const incrementVisitorCount = async () => {
    try {
      const visitorId = getVisitorId();
      const response = await fetch("/api/visitor-count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-visitor-id": visitorId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to increment visitor count");
      }

      const data: VisitorCountData = await response.json();
      setVisitorCount(data.count);
      setTotalVisitors(data.totalVisitors);
    } catch (err) {
      console.error("Error incrementing visitor count:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // 방문자 수 조회
  const fetchVisitorCount = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/visitor-count", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visitor count");
      }

      const data: VisitorCountData = await response.json();
      setVisitorCount(data.count);
      setTotalVisitors(data.totalVisitors);
      setError(null);
    } catch (err) {
      console.error("Error fetching visitor count:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 방문자 수 증가 및 조회
    incrementVisitorCount();
    fetchVisitorCount();
  }, []);

  return {
    visitorCount,
    totalVisitors,
    loading,
    error,
    refetch: fetchVisitorCount,
  };
}
