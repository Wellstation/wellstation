import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { to, text } = req.body;

    const response = await axios.post("https://api.solapi.com/messages/v4/send", {
      message: {
        to,
        from: process.env.SMS_FROM,
        text,
      },
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SOLAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({ message: "Success", data: response.data });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
}
