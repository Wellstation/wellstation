"use client";

import { useState } from "react";

export default function RepairReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [date, setDate] = useState("");
  const [request, setRequest] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = `[정비예약]
이름: ${name}
연락처: ${phone}
차량 모델명: ${model}
차대번호(VIN): ${vin}
예약일시: ${date}
요청 정비 항목: ${request}
기타 요청사항: ${etc}`;

    const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: phone, text }),
    });

    const data = await res.json();
    if (data.success) {
      setResult("✅ 전송 성공✅");
    } else {
      setResult("❌ 전송 실패❌");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/bg-placeholder.jpg')" }}
    >
      <div className="w-[70%] md:w-[50%] bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">🛠️ 정비 예약</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            placeholder="연락처"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            placeholder="차량 모델명"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            placeholder="차대번호 (VIN)"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="요청 정비 항목"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="기타 요청사항"
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            예약 및 문자 전송
          </button>
        </form>
        {result && (
          <p className="mt-4 font-medium text-center">{result}</p>
        )}
      </div>
    </div>
  );
}
