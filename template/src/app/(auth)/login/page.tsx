"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, UserIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LoginModel {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<LoginModel>({
    username: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};
    
    if (!credentials.username.trim()) {
      errors.username = 'اسم المستخدم مطلوب';
    }
    
    if (!credentials.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (credentials.password.length < 4) {
      errors.password = 'كلمة المرور قصيرة جداً';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5075/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Set token in cookie for middleware
        document.cookie = `authToken=${data.token}; path=/; secure; samesite=strict`;
        // Redirect to home page using window.location
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginModel, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4" dir="rtl">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-right">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-muted-foreground text-right">
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-right block">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`text-right pr-10 ${validationErrors.username ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {validationErrors.username && (
                  <p className="text-sm text-destructive text-right">{validationErrors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-right block">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`text-right pr-10 pl-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-destructive text-right">{validationErrors.password}</p>
                )}
              </div>

              {/* Login Error */}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-right">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  أو
                </span>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                نسيت كلمة المرور؟
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            بتسجيل الدخول، فإنك توافق على{' '}
            <Button variant="link" className="text-xs p-0 h-auto">
              شروط الخدمة
            </Button>{' '}
            و{' '}
            <Button variant="link" className="text-xs p-0 h-auto">
              سياسة الخصوصية
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}