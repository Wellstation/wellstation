// components/ActionButton.tsx
'use client';

import Link from 'next/link';

interface ActionButtonProps {
  label: string;
  href: string;
  bgColor: string;
}

export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button
        className={`w-64 py-4 text-xl font-bold text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out ${bgColor}`}
      >
        {label}
      </button>
    </Link>
  );
}
