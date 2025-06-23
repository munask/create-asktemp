import { createApiHooks, createEndpoint, ApiConfig } from 'api-hooks-generator';
import {
  LoginModel,
  LoginResponse,
  UserRegistrationDto,
  User,
  ChangePasswordDto,
  ResetUserPasswordDto,
  RefreshTokenDto,
  TokenResponseDto,
  ApiResponse
} from './types';

// Token management utilities
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setRefreshToken: (refreshToken: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// API Configuration
const apiConfig: ApiConfig = {
  baseURL: 'http://localhost:5075/api/',
  timeout: 10000,
  
  // Authentication configuration
  auth: {
    type: 'Bearer',
    tokenGetter: () => tokenManager.getToken(),
  },
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // Define all authentication endpoints
  endpoints: {
    // Login endpoint (no auth required)
    'login': createEndpoint<LoginModel, LoginResponse>({
      url: 'auth/login',
      method: 'POST',
      requiresAuth: false,
    }),
    
    // Logout endpoint (requires auth)
    'logout': createEndpoint<void, ApiResponse>({
      url: 'auth/logout',
      method: 'POST',
      requiresAuth: true,
    }),
    
    // Change password endpoint (requires auth)
    'change-password': createEndpoint<ChangePasswordDto, ApiResponse>({
      url: 'auth/change-password',
      method: 'POST',
      requiresAuth: true,
    }),
    
    // Refresh token endpoint (no auth required - uses refresh token)
    'refresh-token': createEndpoint<RefreshTokenDto, TokenResponseDto>({
      url: 'auth/refresh-token',
      method: 'POST',
      requiresAuth: false,
    }),
    
    // Register user endpoint (admin only, requires auth)
    'register': createEndpoint<UserRegistrationDto, ApiResponse>({
      url: 'auth/register',
      method: 'POST',
      requiresAuth: true,
    }),
    
    // Get users endpoint (admin only, requires auth)
    'users': createEndpoint<void, User[]>({
      url: 'auth/users',
      method: 'GET',
      requiresAuth: true,
    }),
    
    // Reset user password endpoint (admin only, requires auth)
    'reset-user-password': createEndpoint<ResetUserPasswordDto, ApiResponse>({
      url: 'auth/reset-user-password',
      method: 'POST',
      requiresAuth: true,
    }),
  },
};

// Create the API hooks
export const authHooks = createApiHooks(apiConfig);

// Export the configuration for potential customization
export { apiConfig };