import axios from "axios";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { SMSErrorResponse, SMSResponse } from "../../types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SMSResponse | SMSErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res
      .status(400)
      .json({ message: "Missing required fields: to, text" });
  }

  const apiKey = process.env.SOLAPI_API_KEY!;
  const apiSecret = process.env.SOLAPI_API_SECRET!;
  const sender = process.env.SOLAPI_SENDER!;

  // ✅ ISO 8601 형식의 date
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");

  try {
    const response = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        message: {
          to,
          from: sender,
          text,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        },
      }
    );

    return res.status(200).json({
      message: "SMS sent successfully",
      result: response.data,
    } as SMSResponse);
  } catch (error: any) {
    console.error("[SMS ERROR]", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to send SMS",
      error: error?.response?.data || error.message,
    } as SMSErrorResponse);
  }
}
