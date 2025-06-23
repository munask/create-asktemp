"use client"

import * as React from "react"
import { LogOut, AlertTriangle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/auth"

interface LogoutConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutConfirmationModal({ open, onOpenChange }: LogoutConfirmationModalProps) {
  const { logout, loading, error } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
      onOpenChange(false)
      // The logout hook handles token clearing and redirects
      // You might want to add a redirect here if needed
      window.location.href = '/login'
    } catch (err) {
      console.error("Logout error:", err)
      // Even if logout API fails, we should still clear tokens and redirect
      // The logout hook already handles token clearing
      window.location.href = '/login'
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-right">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            تأكيد تسجيل الخروج
          </DialogTitle>
          <DialogDescription className="text-right">
            هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <LogOut className="h-8 w-8 text-muted-foreground" />
            <div className="text-right">
              <p className="text-sm font-medium">سيتم إنهاء جلستك الحالية</p>
              <p className="text-xs text-muted-foreground mt-1">
                ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى النظام
              </p>
            </div>
          </div>
        </div>

        {/* Display API Error (if any) */}
        {error && (
          <div className="text-sm text-destructive text-right p-3 bg-destructive/10 rounded-md">
            {error.message}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              "جاري تسجيل الخروج..."
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}