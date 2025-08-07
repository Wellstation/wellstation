import { supabase } from "@/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res
        .status(400)
        .json({ error: "Phone number and verification code are required" });
    }

    // 현재 시간
    const now = new Date();

    // Supabase에서 인증코드 조회
    const { data: verification, error } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("phone", phone)
      .eq("code", code)
      .eq("used", false)
      .gte("expires_at", now.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !verification) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    // 인증코드를 사용됨으로 표시
    const { error: updateError } = await supabase
      .from("phone_verifications")
      .update({ used: true })
      .eq("id", verification.id);

    if (updateError) {
      console.error("Error updating verification status:", updateError);
      return res
        .status(500)
        .json({ error: "Failed to update verification status" });
    }

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
