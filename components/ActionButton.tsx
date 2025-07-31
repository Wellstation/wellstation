'use client';

import Link from 'next/link';

interface ActionButtonProps {
  label: string;
  href: string;
  bgColor: string;
}

export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <div className="my-3 sm:my-4">
      <Link href={href}>
        <a>
          <button
            className={`w-64 py-5 text-xl font-bold text-white ${bgColor} 
              rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300`}
          >
            {label}
          </button>
        </a>
      </Link>
    </div>
  );
}
