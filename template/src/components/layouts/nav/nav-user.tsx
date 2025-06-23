"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronsUpDown, Lock, LogOut, Moon, Sun, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChangePasswordModal } from "@/components/modals/change-password-modal";
import { LogoutConfirmationModal } from "@/components/modals/logout-confirmation-modal";
import { useTheme } from "@/context/theme-context";

export function NavUser({
  user,
}: {
  user: {
    fullName: string;
    userName: string;
  };
}) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isDark, setTheme } = useTheme();

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const getThemeIcon = () => {
    return isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    return isDark ? "الوضع الفاتح" : "الوضع المظلم";
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs">{user.userName}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-right text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs">{user.userName}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Settings Section */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer text-right"
                  dir="rtl"
                  onClick={handleChangePassword}
                >
                  <Lock className="ml-2 h-4 w-4" />
                  تغيير كلمة المرور
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-right"
                  dir="rtl"
                  onClick={handleThemeToggle}
                >
                  {getThemeIcon()}
                  <span className="ml-2">{getThemeLabel()}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                className="cursor-pointer text-right text-destructive focus:text-destructive"
                dir="rtl"
                onClick={handleLogout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Modals */}
      <ChangePasswordModal
        open={showChangePasswordModal}
        onOpenChange={setShowChangePasswordModal}
      />

      <LogoutConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
      />
    </>
  );
}
