"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function TuningReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vin, setVin] = useState("");
  const [date, setDate] = useState("");
  const [request, setRequest] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = `[튜닝예약]
이름: ${name}
연락처: ${phone}
차량모델: ${vehicleModel}
연식: ${vehicleYear}
차대번호: ${vin}
예약일시: ${date}
요청사항: ${request}
기타: ${etc}`;

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, text })
    });

    const data = await res.json();
    if (data.success) {
      setResult("✅ 전송 성공");
    } else {
      setResult("❌ 전송 실패");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/bg-placeholder.jpg')" }}
    >
      <div className="p-6 max-w-xl w-full bg-white bg-opacity-90 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">튜닝 예약</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="차량 모델명" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연식" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="차대번호 (VIN)" value={vin} onChange={(e) => setVin(e.target.value)} required className="border p-2 rounded" />
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="border p-2 rounded" />
          <textarea placeholder="튜닝 요청사항" value={request} onChange={(e) => setRequest(e.target.value)} className="border p-2 rounded" />
          <textarea placeholder="기타 요청사항" value={etc} onChange={(e) => setEtc(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">예약 및 문자 전송</button>
        </form>
        {result && <p className="mt-4 font-medium text-center">{result}</p>}
      </div>
    </div>
  );
}
