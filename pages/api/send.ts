import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: '수신번호와 메시지를 입력해주세요.' });
  }

  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const sender = process.env.SOLAPI_SENDER;

  if (!apiKey || !apiSecret || !sender) {
    return res.status(500).json({ error: '환경변수가 누락되었습니다. (API_KEY / API_SECRET / SENDER)' });
  }

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString('hex');

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(date + salt)
    .digest('hex');

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.solapi.com/messages/v4/send',
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json',
      },
      data: {
        message: {
          to: to.replace(/-/g, ''),
          from: sender,
          text,
        },
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (err: any) {
    console.error('문자 발송 실패:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
}
