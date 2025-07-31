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
        className={`px-8 py-5 text-lg font-semibold text-white rounded-full shadow-lg
                    hover:opacity-90 hover:scale-105 transition duration-300 ${bgColor}`}
      >
        {label}
      </button>
    </Link>
  );
}
