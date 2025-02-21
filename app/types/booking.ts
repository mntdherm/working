export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export interface Booking {
  id: string;
  vendorId: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  notes?: string;
  services: BookingService[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingService {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
}

export interface BlockedTime {
  id: string;
  vendorId: string;
  startTime: Date;
  endTime: Date;
  reason?: string;
}

export interface BookingFormData {
  vendorId: string;
  services: string[]; // service IDs
  startTime: string;
  notes?: string;
}

export interface AvailabilityParams {
  vendorId: string;
  serviceIds: string[];
  date: Date;
}
