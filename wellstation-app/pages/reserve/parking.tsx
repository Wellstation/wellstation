"use client";

import { useState } from "react";

export default function ParkingReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = `[주차예약]\n이름: ${name}\n연락처: ${phone}\n차량정보: ${vehicleInfo}\n기타: ${etc}`;

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
        <h1 className="text-2xl font-bold mb-4 text-center">주차 예약</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded" />
          <input placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded" />
          <textarea placeholder="입고 차량 정보" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} className="border p-2 rounded" required />
          <textarea placeholder="기타 요청사항" value={etc} onChange={(e) => setEtc(e.target.value)} className="border p-2 rounded" />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">예약 및 문자 전송</button>
        </form>
        {result && <p className="mt-4 font-medium text-center">{result}</p>}
      </div>
    </div>
  );
}
