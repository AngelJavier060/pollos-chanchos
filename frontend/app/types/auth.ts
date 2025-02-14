export interface User {
  id: number;
  usuario: string;
  correo: string;
  rol: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface ApiError extends Error {
  status?: number;
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}