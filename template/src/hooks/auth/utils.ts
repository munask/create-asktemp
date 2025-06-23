import { tokenManager, authHooks } from './config';
import { AuthError, RefreshTokenDto } from './types';

// Error message translations (Arabic to English)
const errorMessages: Record<string, string> = {
  'Username or password is incorrect': 'اسم المستخدم أو كلمة المرور غير صحيحة',
  'Current password is incorrect': 'كلمة المرور الحالية غير صحيحة',
  'Username already exists': 'اسم المستخدم موجود بالفعل',
  'User not found': 'المستخدم غير موجود',
  'Invalid token': 'الرمز المميز غير صالح',
  'Invalid refresh token': 'رمز التحديث غير صالح',
  'Unauthorized': 'غير مخول',
  'Access denied': 'تم رفض الوصول',
  'Network error': 'خطأ في الشبكة',
  'Server error': 'خطأ في الخادم',
};

// Translate error messages to Arabic
export const translateError = (message: string): string => {
  return errorMessages[message] || message;
};

// Create custom error with Arabic translation
export const createAuthError = (error: any): AuthError => {
  const status = error?.response?.status || error?.status;
  const message = error?.response?.data?.message || error?.message || 'Unknown error';
  
  return {
    message: translateError(message),
    status,
    code: error?.response?.data?.code || error?.code,
    details: error?.response?.data || error,
  };
};

// Check if user has admin role
export const isAdmin = (userRole?: string): boolean => {
  return userRole?.toLowerCase() === 'admin';
};

// Check if token is expired (basic check)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// Automatic token refresh logic
export const attemptTokenRefresh = async (): Promise<boolean> => {
  try {
    const currentToken = tokenManager.getToken();
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!currentToken || !refreshToken) {
      return false;
    }
    
    // Use the refresh token hook
    const refreshHook = authHooks.usePostRefreshToken();
    const refreshData: RefreshTokenDto = {
      token: currentToken,
      refreshToken: refreshToken,
    };
    
    const result = await refreshHook.execute(refreshData);
    
    if (result) {
      tokenManager.setToken(result.token);
      tokenManager.setRefreshToken(result.refreshToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    tokenManager.clearTokens();
    return false;
  }
};

// Handle 401 responses with automatic retry
export const handleUnauthorized = async (originalRequest: () => Promise<any>): Promise<any> => {
  const refreshSuccess = await attemptTokenRefresh();
  
  if (refreshSuccess) {
    // Retry the original request with new token
    return originalRequest();
  } else {
    // Redirect to login or handle logout
    tokenManager.clearTokens();
    throw createAuthError({
      status: 401,
      message: 'Session expired. Please login again.',
    });
  }
};

// Validate admin access for admin-only operations
export const validateAdminAccess = (userRole?: string): void => {
  if (!isAdmin(userRole)) {
    throw createAuthError({
      status: 403,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

// Extract user info from token
export const getUserFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.nameid || payload.sub,
      username: payload.unique_name || payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// Password validation utility
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل',
    };
  }
  
  // Add more validation rules as needed
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: 'كلمة المرور يجب أن تحتوي على أحرف وأرقام',
    };
  }
  
  return { isValid: true };
};

// Check if password is temporary (User1234)
export const isTemporaryPassword = (password: string): boolean => {
  return password === 'User1234';
};

// Format user display name
export const formatUserDisplayName = (user: { fullName?: string; userName?: string }): string => {
  return user.fullName || user.userName || 'Unknown User';
};

// Local storage helpers with error handling
export const safeLocalStorage = {
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};