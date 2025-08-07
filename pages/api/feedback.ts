import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { service_type, name, contact, content, rating, visit_date } =
      req.body;

    // Validate required fields
    if (!service_type || !name || !contact || !content) {
      return res.status(400).json({
        error: "모든 필드를 입력해주세요.",
      });
    }

    // Validate rating (optional, but if provided must be 1-5)
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        error: "별점은 1-5 사이의 값이어야 합니다.",
      });
    }

    // Validate service type
    if (!["repair", "tuning", "parking"].includes(service_type)) {
      return res.status(400).json({
        error: "유효하지 않은 서비스 타입입니다.",
      });
    }

    // Validate content length
    if (content.length < 10) {
      return res.status(400).json({
        error: "피드백 내용은 최소 10자 이상 입력해주세요.",
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: "피드백 내용은 최대 1000자까지 입력 가능합니다.",
      });
    }

    // Insert feedback
    const { data, error } = await supabase.from("feedback").insert([
      {
        service_type,
        name: name.trim(),
        contact: contact.trim(),
        content: content.trim(),
        rating: rating || null,
        visit_date: visit_date || null,
      },
    ]);

    if (error) {
      console.error("Feedback insert error:", error);
      return res.status(500).json({
        error: "피드백 저장 중 오류가 발생했습니다.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "피드백이 성공적으로 제출되었습니다.",
      data,
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return res.status(500).json({
      error: "서버 오류가 발생했습니다.",
    });
  }
}
