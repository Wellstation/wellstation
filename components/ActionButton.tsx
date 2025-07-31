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
        className={`w-[180px] h-[90px] text-[1.25rem] font-semibold text-white rounded-full shadow-lg
                    hover:opacity-90 hover:scale-105 transition duration-300 ${bgColor}`}
      >
        {label}
      </button>
    </Link>
  );
}
