export interface VendorProfile {
  id: string;
  businessName: string;
  logo: string;
  coverPhoto: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  services: Service[];
  operatingHours: OperatingHours[];
  reviews: Review[];
  averageRating: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
