"use client"

import * as React from "react"
import {
  Home,
  Info,
  Projector,
  ShieldUser,
} from "lucide-react"

import { NavMain } from "@/components/layouts/nav/nav-main"
import { NavUser } from "@/components/layouts/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthState } from "@/hooks/auth"
import locals from "@/locals"

// Navigation menu data
const navigationItems = [
  {
    title: locals.home,
    url: "#",
    icon: Home,
    isActive: true,
    items: [
      {
        title: locals.dashboard,
        url: "#",
      },
      {
        title: locals.reports,
        url: "#",
      }
    ],
  },
  {
    title: locals.informations,
    url: "#",
    icon: Info,
    items: [
      {
        title: locals.delete,
        url: "#",
      },
      {
        title: locals.edit,
        url: "#",
      },
      {
        title: locals.add,
        url: "#",
      },
    ],
  },
  {
    title: locals.management,
    url: "#",
    icon: ShieldUser,
    items: [
      {
        title: locals.users,
        url: "#",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuthState()

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden">
            <div className="flex items-center gap-2 order-1">
              <Projector className="size-6 shrink-0" />
              <div className="flex flex-col min-w-0 text-right">
                <span className="font-bold text-sm truncate">{locals.title}</span>
                <span className="text-xs text-muted-foreground truncate">{locals.subtitle}</span>
              </div>
            </div>
          </div>  
        </SidebarHeader>
        
        <SidebarContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            جاري التحميل...
          </div>
        </SidebarContent>
        
        <SidebarRail />
      </Sidebar>
    )
  }

  // Fallback user data if auth user is not available
  const displayUser = user || {
    fullName: "مستخدم",
    userName: "user"
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden">
          <div className="flex items-center gap-2 order-1">
            <Projector className="size-6 shrink-0" />
            <div className="flex flex-col min-w-0 text-right">
              <span className="font-bold text-sm truncate">{locals.title}</span>
              <span className="text-xs text-muted-foreground truncate">{locals.subtitle}</span>
            </div>
          </div>
        </div>  
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}