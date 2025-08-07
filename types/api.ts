// Import Tables type from supabase.ts
import { ServiceType, isValidServiceType } from "./enums";
import { Tables } from "./supabase";

// Application-level types that extend database types with proper transformations
export interface Reservation
  extends Omit<Tables<"reservations">, "service_type"> {
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
}

export interface RecentReservation
  extends Omit<Tables<"reservations">, "service_type"> {
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
}

export interface WorkRecord
  extends Omit<Tables<"work_records">, "service_type"> {
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
  likes_count: number;
  views_count: number;
}

export interface WorkImage extends Tables<"work_images"> {
  created_at: string;
}

export interface GalleryImage
  extends Omit<Tables<"gallery_images">, "service_type"> {
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
}

export interface ServiceSetting
  extends Omit<Tables<"service_settings">, "service_type"> {
  service_type: ServiceType;
  created_at: string;
  updated_at: string;
}

// Type conversion utilities for enum validation
export function validateServiceType(serviceType: string): ServiceType {
  return isValidServiceType(serviceType)
    ? (serviceType as ServiceType)
    : ServiceType.REPAIR;
}

// Helper function to get typed reservation with validated service_type
export function getTypedReservation(
  dbReservation: Tables<"reservations">
): Reservation {
  return {
    ...dbReservation,
    service_type: validateServiceType(dbReservation.service_type),
    created_at: dbReservation.created_at || new Date().toISOString(),
    updated_at: dbReservation.updated_at || new Date().toISOString(),
  };
}

// Helper function to get typed work record with validated service_type
export function getTypedWorkRecord(
  dbWorkRecord: Tables<"work_records">
): WorkRecord {
  return {
    ...dbWorkRecord,
    service_type: validateServiceType(dbWorkRecord.service_type),
    created_at: dbWorkRecord.created_at || new Date().toISOString(),
    updated_at: dbWorkRecord.updated_at || new Date().toISOString(),
    likes_count: dbWorkRecord.likes_count || 0,
    views_count: dbWorkRecord.views_count || 0,
  };
}

// Helper function to get typed gallery image with validated service_type
export function getTypedGalleryImage(
  dbGalleryImage: Tables<"gallery_images">
): GalleryImage {
  return {
    ...dbGalleryImage,
    service_type: validateServiceType(dbGalleryImage.service_type),
    created_at: dbGalleryImage.created_at || new Date().toISOString(),
    updated_at: dbGalleryImage.updated_at || new Date().toISOString(),
  };
}

// Helper function to get typed service setting with validated service_type
export function getTypedServiceSetting(
  dbServiceSetting: Tables<"service_settings">
): ServiceSetting {
  return {
    ...dbServiceSetting,
    service_type: validateServiceType(dbServiceSetting.service_type),
    created_at: dbServiceSetting.created_at || new Date().toISOString(),
    updated_at: dbServiceSetting.updated_at || new Date().toISOString(),
  };
}

// Legacy conversion functions for backward compatibility
// These can be gradually removed as components are updated to use Tables directly

export function convertDatabaseReservation(
  dbReservation: Tables<"reservations">
): Reservation {
  return getTypedReservation(dbReservation);
}

export function convertDatabaseWorkRecord(
  dbWorkRecord: Tables<"work_records">
): WorkRecord {
  return getTypedWorkRecord(dbWorkRecord);
}

export function convertDatabaseWorkImage(
  dbWorkImage: Tables<"work_images">
): WorkImage {
  return {
    ...dbWorkImage,
    created_at: dbWorkImage.created_at || new Date().toISOString(),
  };
}

export function convertDatabaseGalleryImage(
  dbGalleryImage: Tables<"gallery_images">
): GalleryImage {
  return getTypedGalleryImage(dbGalleryImage);
}

export function convertDatabaseServiceSetting(
  dbServiceSetting: Tables<"service_settings">
): ServiceSetting {
  return getTypedServiceSetting(dbServiceSetting);
}
