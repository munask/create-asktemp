"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context"
import { useSidebar } from "@/components/ui/sidebar"

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  const { state } = useSidebar()

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  // When sidebar is collapsed, show only the icon button
  if (state === "collapsed") {
    return (
      <div className="flex justify-center p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          aria-label={isDark ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع المظلم'}
          className="h-8 w-8 hover:bg-sidebar-accent"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  // When sidebar is expanded, show full layout with text and icon
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-2 mx-2 rounded-md hover:bg-sidebar-accent cursor-pointer" onClick={handleThemeToggle}>
      <span className="text-sm font-medium text-sidebar-foreground">
        {isDark ? 'الوضع الفاتح' : 'الوضع المظلم'}
      </span>
      <div className="flex items-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-sidebar-foreground" />
        ) : (
          <Moon className="h-4 w-4 text-sidebar-foreground" />
        )}
      </div>
    </div>
  )
}