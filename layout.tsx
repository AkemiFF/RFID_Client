import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import type React from "react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex-1 p-6 md:p-10 ml-0 md:ml-[16rem]">{children}</main>
        </SidebarProvider>
    )
}
