import axios from "axios";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

interface KakaoRequest {
  to: string;
  templateId: string;
  variables?: Record<string, string>;
  buttons?: Array<{
    name: string;
    linkType: "WL" | "AL" | "DS" | "BK" | "MD";
    linkMo?: string;
    linkPc?: string;
    linkAnd?: string;
    linkIos?: string;
  }>;
}

interface KakaoResponse {
  message: string;
  result?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KakaoResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { to, templateId, variables, buttons }: KakaoRequest = req.body;

    if (!to || !templateId) {
      console.log("Missing required fields:", to, templateId);
      return res
        .status(400)
        .json({ message: `Missing required fields: ${to}, ${templateId}` });
    }

    // SOLAPI 설정
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const sender = process.env.SOLAPI_SENDER;

    // 개발 환경에서 환경변수가 없으면 모의 응답 반환
    if (!apiKey || !apiSecret || !sender) {
      console.log(
        "SOLAPI credentials not configured - returning mock response for development"
      );
      console.log("KakaoTalk message would be sent to:", to);
      console.log("Template ID:", templateId);
      console.log("Variables:", variables);
      console.log("Buttons:", buttons);

      return res.status(200).json({
        message: "KakaoTalk message sent successfully (development mode)",
        result: {
          status: "success",
          messageId: "dev-" + Date.now(),
          to: to,
          from: "DEV_SENDER",
          templateId: templateId,
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

    // 카카오 알림톡 메시지 구성
    const messageData: any = {
      to,
      from: sender,
      kakaoOptions: {
        pfId: process.env.SOLAPI_KAKAO_PFID, // 카카오톡 채널 ID
        templateId: templateId,
      },
    };

    // 변수 추가
    if (variables && Object.keys(variables).length > 0) {
      messageData.kakaoOptions.variables = variables;
    }

    // 버튼 추가
    if (buttons && buttons.length > 0) {
      messageData.kakaoOptions.buttons = buttons;
    }

    // SOLAPI 카카오 알림톡 전송 API 호출
    const response = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        message: messageData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        },
      }
    );

    return res.status(200).json({
      message: "KakaoTalk message sent successfully",
      result: response.data,
    });
  } catch (error: any) {
    console.error("[KAKAO ERROR]", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
