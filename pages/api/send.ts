import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';

const apiKey = process.env.SOLAPI_API_KEY;
const apiSecret = process.env.SOLAPI_API_SECRET;
const sender = process.env.SOLAPI_SENDER;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!apiKey || !apiSecret || !sender) {
      throw new Error('Missing SOLAPI API credentials or sender');
    }

    const date = Date.now().toString();
    const salt = crypto.randomBytes(32).toString('hex');
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(date + salt)
      .digest('hex');

    const result = await axios({
      method: 'POST',
      url: 'https://api.solapi.com/messages/v4/send',
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            to: req.body.to,
            from: sender,
            text: req.body.text,
          },
        ],
      },
    });

    res.status(200).json(result.data);
  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({ error: 'SMS send failed' });
  }
}
