"use client";

import { useState } from "react";

export default function TuningReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [request, setRequest] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = `[튜닝 예약]\n이름: ${name}\n연락처: ${phone}\n모델명: ${model}\n연식: ${year}\n차대번호: ${vin}\n요청사항: ${request}`;

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, text }),
    });

    const data = await res.json();
    if (data.success) {
      setResult("✅ 전송 성공 ✅");
    } else {
      setResult("❌ 전송 실패 ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/tuning-bg.png')" }}
    >
      <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4 text-center">📐 튜닝 예약</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="모델명" value={model} onChange={(e) => setModel(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연식" value={year} onChange={(e) => setYear(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="차대번호" value={vin} onChange={(e) => setVin(e.target.value)} required className="border p-2 rounded" />
          <textarea placeholder="튜닝 요청사항" value={request} onChange={(e) => setRequest(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">🚗 예약 전송</button>
        </form>
        {result && <p className="mt-4 font-medium text-center">{result}</p>}
      </div>
    </div>
  );
}
