import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, carModel, vin, requestText } = req.body;

  if (!name || !phone || !carModel || !vin || !requestText) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const authKey = Buffer.from(
      `${process.env.SOLAPI_API_KEY}:${process.env.SOLAPI_API_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        messages: [
          {
            to: phone,
            from: process.env.SOLAPI_SENDER,
            text: `[예약] ${name}님의 차량(${carModel}/${vin}) 요청사항: ${requestText}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${authKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ success: true, result: response.data });
  } catch (error: any) {
    console.error("SMS send error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
}
