import { api } from './axios';
import type { ApiSuccess, Review } from '../types';

export interface ReviewListParams {
  page?: number;
  limit?: number;
  search?: string;
  collegeId?: string;
  rating?: number;
  userId?: string;
}

export interface ReviewInput {
  collegeId: string;
  rating: number;
  comment: string;
}

export const reviewApi = {
  list: (params: ReviewListParams) => api.get<ApiSuccess<Review[]>>('/reviews', { params }),
  getById: (id: string) => api.get<ApiSuccess<Review>>(`/reviews/${id}`),
  create: (payload: ReviewInput) => api.post<ApiSuccess<Review>>('/reviews', payload),
  update: (id: string, payload: Partial<Pick<ReviewInput, 'rating' | 'comment'>>) =>
    api.put<ApiSuccess<Review>>(`/reviews/${id}`, payload),
  remove: (id: string) => api.delete<ApiSuccess<{ id: string }>>(`/reviews/${id}`),
};
