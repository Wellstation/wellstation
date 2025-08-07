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
    const { workRecordId, userIp } = req.body;

    if (!workRecordId || !userIp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already viewed this work record (within last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: existingView } = await supabase
      .from("work_record_views")
      .select("id")
      .eq("work_record_id", workRecordId)
      .eq("user_ip", userIp)
      .gte("viewed_at", yesterday.toISOString())
      .single();

    if (!existingView) {
      // Add view
      const { error: insertError } = await supabase
        .from("work_record_views")
        .insert({
          work_record_id: workRecordId,
          user_ip: userIp,
        });

      if (insertError) {
        console.error("Error adding view:", insertError);
        return res.status(500).json({ error: "Failed to add view" });
      }
    }

    return res.status(200).json({
      success: true,
      message: "View recorded successfully",
    });
  } catch (error) {
    console.error("Error in view handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
