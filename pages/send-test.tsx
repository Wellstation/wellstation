import { useState } from 'react';

export default function SendTestPage() {
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleSend = async () => {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, text }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📨 문자 전송 테스트</h2>
      <input
        type="text"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="수신 번호"
      />
      <br />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지 내용"
      />
      <br />
      <button onClick={handleSend}>전송</button>
      <pre>{result}</pre>
    </div>
  );
}