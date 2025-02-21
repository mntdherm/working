export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  orderIndex: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithServices extends Category {
  services: Service[];
}

export interface Service {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isVisible: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  isVisible: boolean;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  duration: number;
  isVisible: boolean;
}
