'use client';

import Link from 'next/link'

interface ActionButtonProps {
  label: string;
  href: string;
  bgColor: string;
}

export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <div className="my-6 sm:my-8">
      <Link href={href}>
        <a>
          <button
            className={`w-72 h-16 text-xl font-bold text-yellow-300 ${bgColor}
              rounded-full shadow-xl hover:scale-110 hover:opacity-90 transition-transform duration-300`}
          >
            {label}
          </button>
        </a>
      </Link>
    </div>
  );
}
