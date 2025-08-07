import { SERVICE_TYPE_LABELS, ServiceType } from "@/types/enums";

interface ServiceTypeSelectorProps {
    selectedServiceType: ServiceType | null;
    onServiceTypeChange: (serviceType: ServiceType | null) => void;
    className?: string;
    showEntireOption?: boolean;
}

export default function ServiceTypeSelector({
    selectedServiceType,
    onServiceTypeChange,
    className = '',
    showEntireOption = false
}: ServiceTypeSelectorProps) {
    return (
        <div className={`bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6 ${className}`}>
            <h3 className="text-lg font-medium text-white mb-4">서비스 타입 선택</h3>
            <div className="flex space-x-4">
                {showEntireOption && (
                    <button
                        onClick={() => onServiceTypeChange(null)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedServiceType === null
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            }`}
                    >
                        전체 보기
                    </button>
                )}
                {Object.entries(SERVICE_TYPE_LABELS).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => onServiceTypeChange(key as ServiceType)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedServiceType === key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
} 