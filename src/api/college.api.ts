import { api } from './axios';
import type { ApiSuccess, College } from '../types';

export interface CollegeListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CollegeInput {
  name: string;
  location: string;
  description?: string;
  website?: string;
}

export const collegeApi = {
  list: (params: CollegeListParams) => api.get<ApiSuccess<College[]>>('/colleges', { params }),
  getById: (id: string) => api.get<ApiSuccess<College>>(`/colleges/${id}`),
  create: (payload: CollegeInput) => api.post<ApiSuccess<College>>('/colleges', payload),
  update: (id: string, payload: Partial<CollegeInput>) =>
    api.put<ApiSuccess<College>>(`/colleges/${id}`, payload),
  remove: (id: string) => api.delete<ApiSuccess<{ id: string }>>(`/colleges/${id}`),
};
