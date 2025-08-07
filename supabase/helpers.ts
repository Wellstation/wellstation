import { ServiceType } from "../types/enums";
import type { Database } from "../types/supabase";
import { supabase } from "./client";

// Type helpers for better type safety
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Settings helper functions
export const settingsHelpers = {
  // Get service setting value
  async getServiceSetting(
    serviceType: ServiceType,
    settingKey: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("service_settings")
      .select("setting_value")
      .eq("service_type", serviceType)
      .eq("setting_key", settingKey)
      .single();

    if (error) {
      console.error("Error fetching service setting:", error);
      return null;
    }

    return data?.setting_value || null;
  },

  // Get service start time
  async getServiceStartTime(serviceType: ServiceType): Promise<string> {
    const startTime = await this.getServiceSetting(serviceType, "start_time");
    return startTime || "09:00"; // Default to 09:00
  },

  // Get service end time
  async getServiceEndTime(serviceType: ServiceType): Promise<string> {
    const endTime = await this.getServiceSetting(serviceType, "end_time");
    return endTime || "18:00"; // Default to 18:00
  },

  // Get service interval minutes
  async getServiceIntervalMinutes(serviceType: ServiceType): Promise<number> {
    const interval = await this.getServiceSetting(
      serviceType,
      "interval_minutes"
    );
    return interval ? parseInt(interval, 10) : 30; // Default to 30 minutes
  },

  // Get disable after slots count
  async getDisableAfterSlots(serviceType: ServiceType): Promise<number> {
    const slots = await this.getServiceSetting(
      serviceType,
      "disable_after_slots"
    );
    return slots ? parseInt(slots, 10) : 1; // Default to 1 slot
  },

  // Set a setting value for a specific service type
  async setServiceSetting(
    serviceType: ServiceType,
    key: string,
    value: string,
    description?: string
  ) {
    const { data, error } = await supabase
      .from("service_settings")
      .upsert({
        service_type: serviceType,
        setting_key: key,
        setting_value: value,
        description: description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Reservation helper functions
export const reservationHelpers = {
  // Create a new reservation
  async createReservation(reservationData: Inserts<"reservations">) {
    // 지나간 시간대인지 확인
    const now = new Date();
    const reservationTime = new Date(reservationData.reservation_date);

    if (reservationTime <= now) {
      throw new Error("지나간 시간대는 예약할 수 없습니다.");
    }

    // 중복 예약 확인
    const conflictingReservations = await this.getConflictingReservations(
      reservationData.service_type as ServiceType,
      reservationData.reservation_date
    );

    if (conflictingReservations.length > 0) {
      throw new Error("이미 예약된 시간대입니다. 다른 시간을 선택해주세요.");
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      // Supabase 에러 메시지 처리
      if (error.code === "23505") {
        // Unique constraint violation - check which constraint was violated
        if (error.message.includes("idx_reservations_unique_service_date")) {
          throw new Error(
            "이미 예약된 시간대입니다. 다른 시간을 선택해주세요."
          );
        } else {
          throw new Error(
            "중복된 예약이 감지되었습니다. 다른 시간을 선택해주세요."
          );
        }
      }
      throw error;
    }
    return data;
  },

  // Get all reservations
  async getReservations() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get reservations by service type
  async getReservationsByType(serviceType: ServiceType) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("service_type", serviceType)
      .order("reservation_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get reservation by ID
  async getReservationById(id: string) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a reservation
  async updateReservation(id: string, updates: Updates<"reservations">) {
    const { data, error } = await supabase
      .from("reservations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a reservation
  async deleteReservation(id: string) {
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) throw error;
  },

  // Get conflicting reservations for a time slot
  async getConflictingReservations(
    serviceType: ServiceType,
    reservationDate: string
  ) {
    const reservationTime = new Date(reservationDate);
    const disableAfterSlots = await settingsHelpers.getDisableAfterSlots(
      serviceType
    );
    const intervalMinutes = await settingsHelpers.getServiceIntervalMinutes(
      serviceType
    );

    // Calculate buffer based on interval and disable slots
    const bufferMs = disableAfterSlots * intervalMinutes * 60 * 1000;

    const bufferBefore = new Date(reservationTime.getTime() - bufferMs);
    const bufferAfter = new Date(reservationTime.getTime() + bufferMs);

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("service_type", serviceType)
      .gte("reservation_date", bufferBefore.toISOString())
      .lte("reservation_date", bufferAfter.toISOString());

    if (error) throw error;
    return data;
  },

  // Check if a time slot is available
  async checkTimeSlotAvailability(
    serviceType: ServiceType,
    reservationDate: string
  ) {
    const reservationTime = new Date(reservationDate);
    const disableAfterSlots = await settingsHelpers.getDisableAfterSlots(
      serviceType
    );
    const intervalMinutes = await settingsHelpers.getServiceIntervalMinutes(
      serviceType
    );

    // Calculate buffer based on interval and disable slots
    const bufferMs = disableAfterSlots * intervalMinutes * 60 * 1000;

    const bufferBefore = new Date(reservationTime.getTime() - bufferMs);
    const bufferAfter = new Date(reservationTime.getTime() + bufferMs);

    const { data, error } = await supabase
      .from("reservations")
      .select("reservation_date")
      .eq("service_type", serviceType)
      .gte("reservation_date", bufferBefore.toISOString())
      .lte("reservation_date", bufferAfter.toISOString());

    if (error) throw error;
    return data.length === 0; // true if available, false if conflicting
  },

  // Get available time slots for a specific date and service type
  async getAvailableTimeSlots(serviceType: ServiceType, date: string) {
    // Get service settings
    const startTime = await settingsHelpers.getServiceStartTime(serviceType);
    const endTime = await settingsHelpers.getServiceEndTime(serviceType);
    const intervalMinutes = await settingsHelpers.getServiceIntervalMinutes(
      serviceType
    );

    // Parse start and end times
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Create date objects for the selected date
    const selectedDate = new Date(date);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Get existing reservations for the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: existingReservations, error: reservationError } =
      await supabase
        .from("reservations")
        .select("reservation_date")
        .eq("service_type", serviceType)
        .gte("reservation_date", startOfDay.toISOString())
        .lte("reservation_date", endOfDay.toISOString());

    if (reservationError) throw reservationError;

    const availableSlots: string[] = [];

    // Generate time slots
    for (
      let time = new Date(startDateTime);
      time < endDateTime;
      time.setMinutes(time.getMinutes() + intervalMinutes)
    ) {
      const timeSlot = new Date(time);
      const timeSlotISO = timeSlot.toISOString();

      // Check if this time slot conflicts with existing reservations
      let isAvailable = true;

      if (existingReservations.length > 0) {
        const disableAfterSlots = await settingsHelpers.getDisableAfterSlots(
          serviceType
        );
        const bufferMs = disableAfterSlots * intervalMinutes * 60 * 1000;
        const bufferBefore = new Date(timeSlot.getTime() - bufferMs);
        const bufferAfter = new Date(timeSlot.getTime() + bufferMs);

        for (const reservation of existingReservations) {
          const reservationTime = new Date(reservation.reservation_date);
          if (
            reservationTime >= bufferBefore &&
            reservationTime <= bufferAfter
          ) {
            isAvailable = false;
            break;
          }
        }
      }

      if (isAvailable) {
        availableSlots.push(timeSlotISO);
      }
    }

    return availableSlots;
  },
};

// Example helper functions
export const supabaseHelpers = {
  // Example: Get all users
  // async getUsers() {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('*')
  //
  //   if (error) throw error
  //   return data
  // },
  // Example: Create a new user
  // async createUser(userData: Inserts<'users'>) {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .insert(userData)
  //     .select()
  //     .single()
  //
  //   if (error) throw error
  //   return data
  // },
  // Example: Update a user
  // async updateUser(id: string, updates: Updates<'users'>) {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .update(updates)
  //     .eq('id', id)
  //     .select()
  //     .single()
  //
  //   if (error) throw error
  //   return data
  // },
  // Example: Delete a user
  // async deleteUser(id: string) {
  //   const { error } = await supabase
  //     .from('users')
  //     .delete()
  //     .eq('id', id)
  //
  //   if (error) throw error
  // },
  // Example: Get user by ID
  // async getUserById(id: string) {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('*')
  //     .eq('id', id)
  //     .single()
  //
  //   if (error) throw error
  //   return data
  // }
};
