import { supabase } from "~/lib/supabase.server";
import type { AvailabilityParams, BookingFormData, TimeSlot } from "~/types/booking";

export async function getVendorBookings(vendorId: string, startDate: Date, endDate: Date) {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      booking_services (
        service_id,
        price,
        duration
      )
    `)
    .eq("vendor_id", vendorId)
    .gte("start_time", startDate.toISOString())
    .lte("end_time", endDate.toISOString())
    .neq("status", "cancelled");

  if (error) throw error;
  return bookings;
}

export async function getBlockedTimes(vendorId: string, startDate: Date, endDate: Date) {
  const { data: blockedTimes, error } = await supabase
    .from("blocked_times")
    .select("*")
    .eq("vendor_id", vendorId)
    .gte("start_time", startDate.toISOString())
    .lte("end_time", endDate.toISOString());

  if (error) throw error;
  return blockedTimes;
}

export async function calculateAvailableTimeSlots({
  vendorId,
  serviceIds,
  date,
}: AvailabilityParams): Promise<TimeSlot[]> {
  // Get vendor's operating hours for the day
  const dayOfWeek = date.getDay();
  const { data: operatingHours } = await supabase
    .from("operating_hours")
    .select("*")
    .eq("vendor_id", vendorId)
    .eq("day_of_week", dayOfWeek)
    .single();

  if (!operatingHours || operatingHours.is_closed) {
    return [];
  }

  // Get total duration of selected services
  const { data: services } = await supabase
    .from("services")
    .select("duration")
    .in("id", serviceIds);

  const totalDuration = services?.reduce((sum, service) => sum + service.duration, 0) || 0;

  // Get existing bookings
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const [bookings, blockedTimes] = await Promise.all([
    getVendorBookings(vendorId, startOfDay, endOfDay),
    getBlockedTimes(vendorId, startOfDay, endOfDay),
  ]);

  // Generate time slots
  const slots: TimeSlot[] = [];
  const [openHour, openMinute] = operatingHours.open_time.split(":").map(Number);
  const [closeHour, closeMinute] = operatingHours.close_time.split(":").map(Number);

  const slotInterval = 30; // 30-minute intervals
  let currentTime = new Date(date);
  currentTime.setHours(openHour, openMinute, 0, 0);

  const closeTime = new Date(date);
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  while (currentTime < closeTime) {
    const slotEnd = new Date(currentTime.getTime() + totalDuration * 60000);
    
    if (slotEnd <= closeTime) {
      const isAvailable = !isTimeSlotBooked(
        currentTime,
        slotEnd,
        bookings,
        blockedTimes
      );

      slots.push({
        startTime: new Date(currentTime),
        endTime: slotEnd,
        available: isAvailable,
      });
    }

    currentTime = new Date(currentTime.getTime() + slotInterval * 60000);
  }

  return slots;
}

function isTimeSlotBooked(
  start: Date,
  end: Date,
  bookings: any[],
  blockedTimes: any[]
): boolean {
  // Check against existing bookings
  const hasBookingConflict = bookings.some(booking => {
    const bookingStart = new Date(booking.start_time);
    const bookingEnd = new Date(booking.end_time);
    return (
      (start >= bookingStart && start < bookingEnd) ||
      (end > bookingStart && end <= bookingEnd) ||
      (start <= bookingStart && end >= bookingEnd)
    );
  });

  if (hasBookingConflict) return true;

  // Check against blocked times
  const hasBlockedConflict = blockedTimes.some(blocked => {
    const blockedStart = new Date(blocked.start_time);
    const blockedEnd = new Date(blocked.end_time);
    return (
      (start >= blockedStart && start < blockedEnd) ||
      (end > blockedStart && end <= blockedEnd) ||
      (start <= blockedStart && end >= blockedEnd)
    );
  });

  return hasBlockedConflict;
}

export async function createBooking(data: BookingFormData, userId: string) {
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .in("id", data.services);

  if (!services) throw new Error("Services not found");

  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

  const startTime = new Date(data.startTime);
  const endTime = new Date(startTime.getTime() + totalDuration * 60000);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      vendor_id: data.vendorId,
      customer_id: userId,
      status: "pending",
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      total_price: totalPrice,
      notes: data.notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Create booking services
  const bookingServices = services.map(service => ({
    booking_id: booking.id,
    service_id: service.id,
    price: service.price,
    duration: service.duration,
  }));

  const { error: servicesError } = await supabase
    .from("booking_services")
    .insert(bookingServices);

  if (servicesError) throw servicesError;

  return booking;
}
