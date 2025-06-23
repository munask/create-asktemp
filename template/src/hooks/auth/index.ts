import { useCallback, useEffect, useState } from 'react';
import { authHooks, tokenManager } from './config';
import {
  LoginModel,
  LoginResponse,
  UserRegistrationDto,
  ChangePasswordDto,
  ResetUserPasswordDto,
  AuthState,
} from './types';
import {
  createAuthError,
  attemptTokenRefresh,
  handleUnauthorized,
  validateAdminAccess,
  getUserFromToken,
  validatePassword,
  isAdmin,
} from './utils';

// Custom hook for authentication state management
export const useAuthState = (): AuthState & {
  login: (credentials: LoginModel) => Promise<LoginResponse | null>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        const userInfo = getUserFromToken(token);
        if (userInfo) {
          setAuthState({
            isAuthenticated: true,
            user: {
              guidId: userInfo.userId,
              userName: userInfo.username,
              fullName: userInfo.username, // Will be updated from API if needed
              role: userInfo.role,
              isTemporaryPassword: false,
            },
            token,
            isLoading: false,
            error: null,
          });
        } else {
          tokenManager.clearTokens();
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginModel): Promise<LoginResponse | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const loginHook = authHooks.usePostLogin();
      const result = await loginHook.execute(credentials);
      
      if (result) {
        tokenManager.setToken(result.token);
        // Note: The login endpoint doesn't return a refresh token in the current implementation
        // This might need to be adjusted based on your actual API response
        
        setAuthState({
          isAuthenticated: true,
          user: {
            guidId: '', // Will be extracted from token
            userName: result.user.userName,
            fullName: result.user.fullName,
            role: result.user.role,
            isTemporaryPassword: result.user.isTemporaryPassword,
          },
          token: result.token,
          isLoading: false,
          error: null,
        });
        
        return result;
      }
      
      return null;
    } catch (error: any) {
      const authError = createAuthError(error);
      setAuthState(prev => ({ ...prev, isLoading: false, error: authError }));
      throw authError;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const logoutHook = authHooks.usePostLogout();
      await logoutHook.execute();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      tokenManager.clearTokens();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const success = await attemptTokenRefresh();
    if (!success) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
    return success;
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
  };
};

// Login hook with enhanced error handling
export const useLogin = () => {
  const loginHook = authHooks.usePostLogin();
  
  const login = useCallback(async (credentials: LoginModel) => {
    try {
      const result = await loginHook.execute(credentials);
      if (result) {
        tokenManager.setToken(result.token);
      }
      return result;
    } catch (error: any) {
      throw createAuthError(error);
    }
  }, [loginHook]);

  return {
    ...loginHook,
    login,
  };
};

// Change password hook with validation
export const useChangePassword = () => {
  const changePasswordHook = authHooks.usePostChangePassword();
  
  const changePassword = useCallback(async (data: ChangePasswordDto) => {
    const validation = validatePassword(data.newPassword);
    if (!validation.isValid) {
      throw createAuthError({
        message: validation.message,
        status: 400,
      });
    }
    
    try {
      return await changePasswordHook.execute(data);
    } catch (error: any) {
      if (error?.status === 401 || error?.response?.status === 401) {
        return handleUnauthorized(() => changePasswordHook.execute(data));
      }
      throw createAuthError(error);
    }
  }, [changePasswordHook]);

  return {
    ...changePasswordHook,
    changePassword,
  };
};

// Register user hook (admin only)
export const useRegisterUser = (userRole?: string) => {
  const registerHook = authHooks.usePostRegister();
  
  const registerUser = useCallback(async (userData: UserRegistrationDto) => {
    validateAdminAccess(userRole);
    
    try {
      return await registerHook.execute(userData);
    } catch (error: any) {
      if (error?.status === 401 || error?.response?.status === 401) {
        return handleUnauthorized(() => registerHook.execute(userData));
      }
      throw createAuthError(error);
    }
  }, [registerHook, userRole]);

  return {
    ...registerHook,
    registerUser,
  };
};

// Get users hook (admin only)
export const useGetUsers = (userRole?: string) => {
  const usersHook = authHooks.useUsers();
  
  // Validate admin access on hook creation
  useEffect(() => {
    if (userRole !== undefined) {
      validateAdminAccess(userRole);
    }
  }, [userRole]);

  return usersHook;
};

// Reset user password hook (admin only)
export const useResetUserPassword = (userRole?: string) => {
  const resetPasswordHook = authHooks.usePostResetUserPassword();
  
  const resetUserPassword = useCallback(async (data: ResetUserPasswordDto) => {
    validateAdminAccess(userRole);
    
    try {
      return await resetPasswordHook.execute(data);
    } catch (error: any) {
      if (error?.status === 401 || error?.response?.status === 401) {
        return handleUnauthorized(() => resetPasswordHook.execute(data));
      }
      throw createAuthError(error);
    }
  }, [resetPasswordHook, userRole]);

  return {
    ...resetPasswordHook,
    resetUserPassword,
  };
};

// Logout hook
export const useLogout = () => {
  const logoutHook = authHooks.usePostLogout();
  
  const logout = useCallback(async () => {
    try {
      await logoutHook.execute();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      tokenManager.clearTokens();
    }
  }, [logoutHook]);

  return {
    ...logoutHook,
    logout,
  };
};

// Refresh token hook
export const useRefreshToken = () => {
  const refreshHook = authHooks.usePostRefreshToken();
  
  const refreshToken = useCallback(async () => {
    const currentToken = tokenManager.getToken();
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!currentToken || !refreshToken) {
      throw createAuthError({
        message: 'No tokens available for refresh',
        status: 401,
      });
    }
    
    try {
      const result = await refreshHook.execute({
        token: currentToken,
        refreshToken: refreshToken,
      });
      
      if (result) {
        tokenManager.setToken(result.token);
        tokenManager.setRefreshToken(result.refreshToken);
      }
      
      return result;
    } catch (error: any) {
      tokenManager.clearTokens();
      throw createAuthError(error);
    }
  }, [refreshHook]);

  return {
    ...refreshHook,
    refreshToken,
  };
};

// Helper hook to check if user is admin
export const useIsAdmin = (userRole?: string) => {
  return isAdmin(userRole);
};

// Export all hooks and utilities
export * from './types';
export * from './config';
export * from './utils';

// Export the main hooks object for direct access if needed
export { authHooks };   