import { MessageSquare, Trophy, Users, HelpCircle, Settings, Mic, History, TrendingUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Start Debate",
    url: "#",
    icon: Mic,
  },
  {
    title: "Debate History",
    url: "#",
    icon: History,
  },
  {
    title: "Leaderboard",
    url: "#",
    icon: Trophy,
  },
  {
    title: "Trending Topics",
    url: "#",
    icon: TrendingUp,
  },
  {
    title: "How it works",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Join the Team",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PolicyPulse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
