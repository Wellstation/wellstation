import React from 'react';
import Link from 'next/link';

type ActionButtonProps = {
  label: string;
  href: string;
  bgColor: string;
};

export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button className={`text-white font-bold py-2 px-6 rounded-2xl shadow-lg ${bgColor}`}>
        {label}
      </button>
    </Link>
  );
}
