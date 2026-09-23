export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  description: string | null;
  website: string | null;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
  reviewer?: { id: string; name: string };
  college?: { id: string; name: string };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}
