export default function ActionButton({ label, href, bgColor }: ActionButtonProps) {
  return (
    <div className="my-8"> {/* 버튼 간 충분한 간격 */}
      <Link href={href}>
        <a>
          <button
            className={`
              w-72 h-16 
              text-xl font-bold text-white 
              ${bgColor} 
              rounded-full shadow-lg 
              hover:scale-105 transition-transform duration-300
            `}
          >
            {label}
          </button>
        </a>
      </Link>
    </div>
  );
}
