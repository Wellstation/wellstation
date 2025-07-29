import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, phone, vehicle, date, message } = req.body;

    const response = await axios.post("https://api.solapi.com/messages/v4/send", {
      message: {
        to: phone,
        from: process.env.SENDER_PHONE, // 예: "01012345678"
        text: `[예약확인] ${name}님의 ${vehicle} 차량\n예약일: ${date}\n요청사항: ${message}`,
      },
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SOLAPI_API_KEY}`, // 환경변수 또는 직접 키 입력
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({ success: true, response: response.data });
  } catch (error: any) {
    console.error("SMS 전송 실패:", error.response?.data || error.message);
    return res.status(500).json({ error: "문자 전송 중 오류 발생" });
  }
}
