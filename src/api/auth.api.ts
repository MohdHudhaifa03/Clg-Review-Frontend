import { api } from './axios';
import type { ApiSuccess, User, UserRole } from '../types';

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string; role: UserRole }) =>
    api.post<ApiSuccess<AuthResponseData>>('/auth/register', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<ApiSuccess<AuthResponseData>>('/auth/login', payload),

  me: () => api.get<ApiSuccess<User>>('/auth/me'),
};
