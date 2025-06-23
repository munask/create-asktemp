import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar"
import { NavigationProvider } from "@/context/navigation-context"
import { ThemeProvider } from "@/context/theme-context"
import { DynamicBreadcrumbs } from "@/components/layouts/dynamic-breadcrumbs"
import { Separator } from "@/components/ui/separator"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicBreadcrumbs />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </NavigationProvider>
    </ThemeProvider>
  )
}