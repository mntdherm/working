export type PaymentMethod = 'card' | 'mobilepay' | 'invoice';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  paymentId: string;
  vendorId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid';
  createdAt: Date;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
}

export interface Invoice {
  id: string;
  paymentId: string;
  vendorId: string;
  customerId: string;
  number: string;
  amount: number;
  tax: number;
  items: InvoiceItem[];
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface TransactionLog {
  id: string;
  paymentId: string;
  action: 'payment' | 'refund' | 'commission' | 'invoice';
  status: 'success' | 'failure';
  amount: number;
  metadata?: Record<string, any>;
  error?: string;
  createdAt: Date;
}

export interface PaymentProcessingError extends Error {
  code: string;
  details?: Record<string, any>;
}
