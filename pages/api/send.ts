import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';

const apiKey = process.env.SOLAPI_API_KEY;
const apiSecret = process.env.SOLAPI_API_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Missing SOLAPI API credentials');
    }

    const date = Date.now().toString();
    const salt = crypto.randomBytes(32).toString('hex');
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(date + salt)
      .digest('hex');

    const { to, from, text } = req.body;

    if (!to || !from || !text) {
      return res.status(400).json({ error: '필수값 누락됨' });
    }

    const result = await axios({
      method: 'POST',
      url: 'https://api.solapi.com/messages/v4/send',
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json',
      },
      data: {
        message: {
          to,
          from,
          text,
        },
      },
    });

    res.status(200).json(result.data);
  } catch (error: any) {
    console.error('SMS send error:', error.response?.data || error.message);
    res.status(500).json({ error: 'SMS send failed' });
  }
}
