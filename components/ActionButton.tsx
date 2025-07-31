// components/ReservationButton.tsx
'use client';

import React from 'react';

interface ReservationButtonProps {
  text: string;
  color: string;
  onClick?: () => void;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ text, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-[250px] py-6 rounded-2xl text-white text-xl font-bold shadow-lg hover:brightness-110 transition-all duration-200 ${color}`}
    >
      {text}
    </button>
  );
};

export default ReservationButton;

