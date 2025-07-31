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
        className={`min-w-[240px] px-10 py-5 text-[1.25rem] font-semibold text-white rounded-2xl shadow-lg hover:opacity-90 hover:scale-105 transition duration-300 ${bgColor}`}
      >
        {label}
      </button>
    </Link>
  );
}
