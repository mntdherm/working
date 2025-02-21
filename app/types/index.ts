export interface User {
  id: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  created_at: string;
}

export interface AuthError {
  message: string;
  status: number;
}
