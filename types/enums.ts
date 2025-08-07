// Service type enum
export enum ServiceType {
  REPAIR = "repair",
  TUNING = "tuning",
  PARKING = "parking",
}

// Service type labels for display
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.REPAIR]: "정비",
  [ServiceType.TUNING]: "튜닝",
  [ServiceType.PARKING]: "주차",
};

// Service type colors for UI
export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  [ServiceType.PARKING]: "bg-blue-100 text-blue-800",
  [ServiceType.REPAIR]: "bg-red-100 text-red-800",
  [ServiceType.TUNING]: "bg-purple-100 text-purple-800",
};

// Helper function to check if a string is a valid service type
export function isValidServiceType(value: string): value is ServiceType {
  return Object.values(ServiceType).includes(value as ServiceType);
}

// Helper function to get service type label
export function getServiceTypeLabel(serviceType: ServiceType): string {
  return SERVICE_TYPE_LABELS[serviceType] || serviceType;
}

// Helper function to get service type color
export function getServiceTypeColor(serviceType: ServiceType): string {
  return SERVICE_TYPE_COLORS[serviceType] || "bg-gray-100 text-gray-800";
}

// Service type options for select components
export const SERVICE_TYPE_OPTIONS = [
  { value: ServiceType.REPAIR, label: SERVICE_TYPE_LABELS[ServiceType.REPAIR] },
  { value: ServiceType.TUNING, label: SERVICE_TYPE_LABELS[ServiceType.TUNING] },
  {
    value: ServiceType.PARKING,
    label: SERVICE_TYPE_LABELS[ServiceType.PARKING],
  },
];
