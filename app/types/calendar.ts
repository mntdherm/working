export interface Appointment {
  id: string;
  vendor_id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  booking_services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
}

export interface BlockedTime {
  id: string;
  vendor_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'blocked';
  status?: string;
  appointment?: Appointment;
}
