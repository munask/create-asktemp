"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationItem {
  title: string
  url: string
  icon?: React.ComponentType
  isActive?: boolean
  items?: NavigationItem[]
}

interface BreadcrumbItem {
  title: string
  url: string
  isActive?: boolean
}

interface NavigationContextType {
  activeItem: NavigationItem | null
  activeSubItem: NavigationItem | null
  breadcrumbs: BreadcrumbItem[]
  setActiveNavigation: (item: NavigationItem, subItem?: NavigationItem) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<NavigationItem | null>(null)
  const [activeSubItem, setActiveSubItem] = useState<NavigationItem | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

  const setActiveNavigation = (item: NavigationItem, subItem?: NavigationItem) => {
    setActiveItem(item)
    setActiveSubItem(subItem || null)
    
    // Build breadcrumbs
    const newBreadcrumbs: BreadcrumbItem[] = [
      { title: 'الرئيسية', url: '#' }
    ]
    
    if (item) {
      newBreadcrumbs.push({
        title: item.title,
        url: item.url,
        isActive: !subItem
      })
    }
    
    if (subItem) {
      newBreadcrumbs.push({
        title: subItem.title,
        url: subItem.url,
        isActive: true
      })
    }
    
    setBreadcrumbs(newBreadcrumbs)
  }

  return (
    <NavigationContext.Provider value={{
      activeItem,
      activeSubItem,
      breadcrumbs,
      setActiveNavigation
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}