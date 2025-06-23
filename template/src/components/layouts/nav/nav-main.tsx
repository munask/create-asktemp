"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useNavigation } from "@/context/navigation-context"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { setActiveNavigation, activeItem, activeSubItem } = useNavigation()

  const handleMainItemClick = (item: any) => {
    setActiveNavigation(item)
  }

  const handleSubItemClick = (mainItem: any, subItem: any) => {
    setActiveNavigation(mainItem, subItem)
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className="justify-between"
                  isActive={activeItem?.title === item.title && !activeSubItem}
                  onClick={() => handleMainItemClick(item)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="order-1" />}
                    <span className="order-2">{item.title}</span>
                  </div>
                  <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild
                        isActive={activeSubItem?.title === subItem.title && activeItem?.title === item.title}
                      >
                        <a 
                          href={subItem.url}
                          onClick={(e) => {
                            e.preventDefault()
                            handleSubItemClick(item, subItem)
                          }}
                        >
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}