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
    const { workRecordId, userIp, checkOnly } = req.body;

    if (!workRecordId || !userIp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already liked this work record
    const { data: existingLike } = await supabase
      .from("work_record_likes")
      .select("id")
      .eq("work_record_id", workRecordId)
      .eq("user_ip", userIp)
      .single();

    // If checkOnly is true, just return the current like status
    if (checkOnly) {
      return res.status(200).json({
        success: true,
        isLiked: !!existingLike,
        message: "Like status checked successfully",
      });
    }

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from("work_record_likes")
        .delete()
        .eq("work_record_id", workRecordId)
        .eq("user_ip", userIp);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return res.status(500).json({ error: "Failed to remove like" });
      }

      return res.status(200).json({
        success: true,
        action: "unliked",
        message: "Like removed successfully",
      });
    } else {
      // Like: Add the like
      const { error: insertError } = await supabase
        .from("work_record_likes")
        .insert({
          work_record_id: workRecordId,
          user_ip: userIp,
        });

      if (insertError) {
        console.error("Error adding like:", insertError);
        return res.status(500).json({ error: "Failed to add like" });
      }

      return res.status(200).json({
        success: true,
        action: "liked",
        message: "Like added successfully",
      });
    }
  } catch (error) {
    console.error("Error in like handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
