import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, carModel, vin, requestText } = req.body;

  // 🔍 입력값 체크
  console.log("📥 입력값 req.body:", { name, phone, carModel, vin, requestText });

  if (!name || !phone || !carModel || !vin || !requestText) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const auth = Buffer.from(
      `${process.env.SOLAPI_API_KEY}:${process.env.SOLAPI_API_SECRET}`
    ).toString("base64");

    console.log("🔐 Authorization 헤더:", auth);
    console.log("📦 전송 데이터:", {
      to: phone,
      from: process.env.SOLAPI_SENDER,
      text: `[예약] ${name}님의 차량(${carModel}/${vin}) 요청사항: ${requestText}`,
    });

    const response = await axios({
      method: "POST",
      url: "https://api.solapi.com/messages/v4/send",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      data: {
        message: {
          to: phone,
          from: process.env.SOLAPI_SENDER,
          text: `[예약] ${name}님의 차량(${carModel}/${vin}) 요청사항: ${requestText}`,
        },
      },
    });

    return res.status(200).json({ success: true, result: response.data });
  } catch (error) {
    console.error("❌ SMS 전송 에러:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "SMS 전송 실패",
      error: error?.response?.data || error.message,
    });
  }
}
