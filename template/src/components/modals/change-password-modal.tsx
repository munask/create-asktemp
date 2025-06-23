"use client"

import * as React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChangePassword } from "@/hooks/auth"
import { ChangePasswordDto } from "@/hooks/auth/types"
import { validatePassword } from "@/hooks/auth/utils"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: "",
    newPassword: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { changePassword, loading, error } = useChangePassword()

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setFormData({ currentPassword: "", newPassword: "" })
      setConfirmPassword("")
      setFormErrors({})
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }, [open])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate current password
    if (!formData.currentPassword.trim()) {
      errors.currentPassword = "كلمة المرور الحالية مطلوبة"
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      errors.newPassword = "كلمة المرور الجديدة مطلوبة"
    } else {
      const passwordValidation = validatePassword(formData.newPassword)
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.message || "كلمة المرور غير صالحة"
      }
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "تأكيد كلمة المرور مطلوب"
    } else if (confirmPassword !== formData.newPassword) {
      errors.confirmPassword = "كلمات المرور غير متطابقة"
    }

    // Check if new password is different from current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      errors.newPassword = "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await changePassword(formData)
      onOpenChange(false)
      // You might want to show a success toast here
    } catch (err) {
      // Error is handled by the hook and displayed below
      console.error("Change password error:", err)
    }
  }

  const handleInputChange = (field: keyof ChangePasswordDto | 'confirmPassword', value: string) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value)
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-right">
            <Lock className="h-5 w-5" />
            تغيير كلمة المرور
          </DialogTitle>
          <DialogDescription className="text-right">
            أدخل كلمة المرور الحالية والجديدة لتحديث كلمة المرور الخاصة بك
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Field */}
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-right block">
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`pr-10 text-right ${formErrors.currentPassword ? 'border-destructive' : ''}`}
                placeholder="أدخل كلمة المرور الحالية"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.currentPassword && (
              <p className="text-sm text-destructive text-right">{formErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-right block">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`pr-10 text-right ${formErrors.newPassword ? 'border-destructive' : ''}`}
                placeholder="أدخل كلمة المرور الجديدة"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.newPassword && (
              <p className="text-sm text-destructive text-right">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-right block">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pr-10 text-right ${formErrors.confirmPassword ? 'border-destructive' : ''}`}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-destructive text-right">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Display API Error */}
          {error && (
            <div className="text-sm text-destructive text-right p-3 bg-destructive/10 rounded-md">
              {error.message}
            </div>
          )}

          {/* Password Requirements */}
          <div className="text-xs text-muted-foreground text-right bg-muted/50 p-3 rounded-md">
            <p className="font-medium mb-1">متطلبات كلمة المرور:</p>
            <ul className="space-y-1">
              <li>• 6 أحرف على الأقل</li>
              <li>• يجب أن تحتوي على أحرف وأرقام</li>
              <li>• يجب أن تكون مختلفة عن كلمة المرور الحالية</li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}