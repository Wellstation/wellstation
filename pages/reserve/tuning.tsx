// pages/reserve/tuning.tsx
"use client";

import { useState } from "react";

export default function TuningReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [date, setDate] = useState("");
  const [request, setRequest] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = `\n[튜닝예약]\n이름: ${name}\n연락처: ${phone}\n차량 모델명: ${model}\n연식: ${year}\n차대번호(VIN): ${vin}\n예약일시: ${date}\n튜닝 요청사항: ${request}`;

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, text }),
    });
    const data = await res.json();
    if (data.success) setResult("✅ 전송 성공✅");
    else setResult("❌ 전송 실패❌");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 py-8" style={{ backgroundImage: "url('/bg-placeholder.jpg')" }}>
      <div className="w-full sm:w-[70%] lg:w-[50%] bg-white bg-opacity-90 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center py-5">튜닝 예약</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 pb-8">
          <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="차량 모델명" value={model} onChange={(e) => setModel(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연식" value={year} onChange={(e) => setYear(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="차대번호 (VIN)" value={vin} onChange={(e) => setVin(e.target.value)} required className="border p-2 rounded" />
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="border p-2 rounded" />
          <textarea placeholder="튜닝 요청사항" value={request} onChange={(e) => setRequest(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">예약 및 문자 전송</button>
        </form>
        {result && <p className="text-center font-medium pb-5">{result}</p>}
      </div>
    </div>
  );
}
