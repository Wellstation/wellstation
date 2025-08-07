import { supabase } from "@/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // 방문자 수 증가
    try {
      const today = new Date().toISOString().split("T")[0];
      const visitorId = (req.headers["x-visitor-id"] as string) || "anonymous";

      // 오늘 날짜의 방문자 수 레코드 확인
      const { data: existingRecord } = await supabase
        .from("visitor_counts")
        .select("*")
        .eq("date", today)
        .single();

      // 방문자 세션 확인 (같은 사용자가 하루에 한 번만 카운트)
      const sessionKey = `${today}-${visitorId}`;
      const { data: sessionRecord } = await supabase
        .from("visitor_sessions")
        .select("*")
        .eq("session_key", sessionKey)
        .single();

      if (sessionRecord) {
        // 이미 오늘 방문한 사용자
        const count = existingRecord?.count || 0;

        // 전체 방문자 수 조회
        const { count: totalVisitors } = await supabase
          .from("visitor_sessions")
          .select("*", { count: "exact", head: true });

        res.status(200).json({
          count,
          totalVisitors: totalVisitors || 0,
          alreadyVisited: true,
        });
        return;
      }

      // 새로운 방문자 - 세션 기록
      await supabase.from("visitor_sessions").insert({
        session_key: sessionKey,
        date: today,
        visitor_id: visitorId,
      });

      if (existingRecord) {
        // 기존 레코드가 있으면 카운트 증가
        const { data, error } = await supabase
          .from("visitor_counts")
          .update({ count: existingRecord.count + 1 })
          .eq("date", today)
          .select()
          .single();

        if (error) {
          console.error("Error updating visitor count:", error);
          res.status(500).json({ error: "Failed to update visitor count" });
          return;
        }

        // 전체 방문자 수 조회
        const { count: totalVisitors } = await supabase
          .from("visitor_sessions")
          .select("*", { count: "exact", head: true });

        res.status(200).json({
          count: data.count,
          totalVisitors: totalVisitors || 0,
        });
      } else {
        // 새로운 레코드 생성
        const { data, error } = await supabase
          .from("visitor_counts")
          .insert({ date: today, count: 1 })
          .select()
          .single();

        if (error) {
          console.error("Error creating visitor count record:", error);
          res
            .status(500)
            .json({ error: "Failed to create visitor count record" });
          return;
        }

        // 전체 방문자 수 조회
        const { count: totalVisitors } = await supabase
          .from("visitor_sessions")
          .select("*", { count: "exact", head: true });

        res.status(200).json({
          count: data.count,
          totalVisitors: totalVisitors || 0,
        });
      }
    } catch (error) {
      console.error("Error updating visitor count:", error);
      res.status(500).json({ error: "Failed to update visitor count" });
    }
  } else if (req.method === "GET") {
    // 오늘 방문자 수 및 전체 방문자 수 조회
    try {
      const today = new Date().toISOString().split("T")[0];

      // 오늘 방문자 수 조회
      const { data: todayData, error: todayError } = await supabase
        .from("visitor_counts")
        .select("count")
        .eq("date", today)
        .single();

      if (todayError && todayError.code !== "PGRST116") {
        console.error("Error fetching today's visitor count:", todayError);
        res
          .status(500)
          .json({ error: "Failed to fetch today's visitor count" });
        return;
      }

      const todayCount = todayData?.count || 0;

      // 전체 방문자 수 조회
      const { count: totalVisitors, error: totalError } = await supabase
        .from("visitor_sessions")
        .select("*", { count: "exact", head: true });

      if (totalError) {
        console.error("Error fetching total visitors count:", totalError);
        res.status(500).json({ error: "Failed to fetch total visitors count" });
        return;
      }

      res.status(200).json({
        count: todayCount,
        totalVisitors: totalVisitors || 0,
      });
    } catch (error) {
      console.error("Error fetching visitor count:", error);
      res.status(500).json({ error: "Failed to fetch visitor count" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
