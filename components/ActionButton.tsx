'use client';

import Link from 'next/link';

interface ActionButtonProps {
  label: string;
  href: string;
  bgColor: string;
}

export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <div className="my-6 sm:my-8"> {/* 버튼 간 간격 충분히 늘림 */}
      <Link href={href}>
        <a>
          <button
            className={`w-72 h-16 text-2xl font-bold text-white ${bgColor} 
              rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300`}
          >
            {label}
          </button>
        </a>
      </Link>
    </div>
  );
}
