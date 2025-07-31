"use client";

import { useState } from "react";

export default function ParkingReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [date, setDate] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = `[주차예약]
이름: ${name}
연락처: ${phone}
입고 차량 정보: ${vehicleInfo}
예약일시: ${date}
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
      <div className="p-6 w-[70%] lg:w-[50%] bg-white bg-opacity-90 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4 text-center">🚗 주차 예약</h1>
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
          <textarea
            placeholder="입고 차량 정보"
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
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
            placeholder="기타 요청사항"
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">
            📩 예약 및 문자 전송
          </button>
        </form>
        {result && <p className="mt-4 font-medium text-center">{result}</p>}
      </div>
    </div>
  );
}
