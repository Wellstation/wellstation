import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ message: 'Missing required fields: to, text' });
  }

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.solapi.com/messages/v4/send',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SOLAPI_API_KEY}:${process.env.SOLAPI_API_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      data: {
        message: {
          to,
          from: process.env.SOLAPI_SENDER || '', // 보내는 번호
          text,
        },
      },
    });

    return res.status(200).json({ message: 'SMS sent successfully', result: response.data });
  } catch (error: any) {
    console.error('[SMS ERROR]', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to send SMS',
      error: error?.response?.data || error.message,
    });
  }
}
