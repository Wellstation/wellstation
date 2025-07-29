import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, carModel, vin, requestText } = req.body;

  // 필수값 확인
  if (!name || !phone || !carModel || !vin || !requestText) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await axios({
      method: "POST",
      url: "https://api.solapi.com/messages/v4/send",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SOLAPI_API_KEY}:${process.env.SOLAPI_API_SECRET}`
          ).toString("base64"),
      },
      data: {
        message: {
          to: phone,
          from: process.env.SOLAPI_SENDER,
          text: `[예약] ${name}님의 차량(${carModel}/${vin}) 요청사항: ${requestText}`,
        },
      },
    });

    return res.status(200).json({ success: true, result: result.data });
  } catch (error) {
    console.error("SMS send error:", error?.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, error: error?.response?.data || error.message });
  }
}
