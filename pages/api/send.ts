import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const response = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        messages: [
          {
            to: req.body.to,
            from: process.env.SOLAPI_SENDER,
            text: req.body.text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SOLAPI_API_KEY}:${process.env.SOLAPI_API_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error?.response?.data || error.message });
  }
}
