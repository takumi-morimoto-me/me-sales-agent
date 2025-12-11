"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  Target,
  Send,
  BarChart3,
  Inbox,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "ホーム",
    url: "/",
    icon: Home,
  },
  {
    title: "プロジェクト",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "ターゲット",
    url: "/targets",
    icon: Target,
  },
  {
    title: "アプローチ",
    url: "/outbound",
    icon: Send,
  },
  {
    title: "分析",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "受信トレイ",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "名刺",
    url: "/business-cards",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2 pr-0">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
              isCollapsed && "size-8"
            )}
          >
            <Send className="size-4" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-semibold">Sales Agent</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupContent className="px-0">
            <SidebarMenu className="!gap-1">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="!h-9 px-2"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span className="text-xs font-semibold">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 pr-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="設定"
              className="!h-9 px-2"
            >
              <Link href="/settings">
                <Settings className="size-4" />
                <span className="text-xs font-semibold">設定</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
