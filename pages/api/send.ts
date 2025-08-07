import axios from "axios";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

interface SMSRequest {
  to: string;
  text: string;
}

interface SMSResponse {
  message: string;
  result?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SMSResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { to, text }: SMSRequest = req.body;

    if (!to || !text) {
      console.log("Missing required fields:", to, text);
      return res
        .status(400)
        .json({ message: `Missing required fields: ${to}, ${text}` });
    }

    // SOLAPI SMS 서비스 설정
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const sender = process.env.SOLAPI_SENDER;

    // 개발 환경에서 환경변수가 없으면 모의 응답 반환
    if (!apiKey || !apiSecret || !sender) {
      console.log(
        "SOLAPI credentials not configured - returning mock response for development"
      );
      console.log("SMS would be sent to:", to);
      console.log("SMS content:", text);

      return res.status(200).json({
        message: "SMS sent successfully (development mode)",
        result: {
          status: "success",
          messageId: "dev-" + Date.now(),
          to: to,
          from: "DEV_SENDER",
        },
      });
    }

    // SOLAPI HMAC-SHA256 인증 헤더 생성
    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString("hex");
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(date + salt)
      .digest("hex");

    // SOLAPI SMS 전송 API 호출
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

    return res
      .status(200)
      .json({ message: "SMS sent successfully", result: response.data });
  } catch (error: any) {
    console.error("[SMS ERROR]", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
