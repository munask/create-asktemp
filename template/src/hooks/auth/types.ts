// Authentication related TypeScript interfaces
// These interfaces match the DTOs from the ASP.NET Core API

// Request DTOs
export interface LoginModel {
  username: string;
  password: string;
}

export interface UserRegistrationDto {
  username: string;
  password: string;
  role: string;
  fullName: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResetUserPasswordDto {
  guidId: string;
}

export interface RefreshTokenDto {
  token: string;
  refreshToken: string;
}

// Response DTOs
export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiration: Date;
  userId: string;
  username: string;
  role: string;
  fullName: string;
  isTemporaryPassword: boolean;
}

export interface TokenResponseDto {
  token: string;
  refreshToken: string;
  expiration: Date;
}

export interface User {
  guidId: string;
  userName: string;
  fullName: string;
  role: string;
  isTemporaryPassword: boolean;
}

// Login Response (matches the controller response structure)
export interface LoginResponse {
  token: string;
  user: {
    userName: string;
    fullName: string;
    role: string;
    isTemporaryPassword: boolean;
  };
}

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
}

// Error types for better error handling
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Auth context state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: AuthError | null;
}

// Utility types for hook responses
export type AuthHookResponse<T> = {
  data: T | null;
  error: AuthError | null;
  loading: boolean;
  refresh: () => Promise<void>;
  mutate: (newData?: T) => void;
};

export type AuthMutationResponse<TData, TRequest> = {
  data: TData | null;
  error: AuthError | null;
  loading: boolean;
  execute: (requestData?: TRequest) => Promise<TData | null>;
  reset: () => void;
};