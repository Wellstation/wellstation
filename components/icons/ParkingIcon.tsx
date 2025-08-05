
interface ParkingIconProps {
    className?: string;
}

export default function ParkingIcon({ className = "w-16 h-16 sm:w-20 sm:h-20" }: ParkingIconProps) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10h-3V9h3c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
        </svg>
    );
} 