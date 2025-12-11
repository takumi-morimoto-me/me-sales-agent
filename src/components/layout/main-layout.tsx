"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function MainLayout({ children, title, actions }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {title && <h1 className="text-sm font-semibold">{title}</h1>}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
