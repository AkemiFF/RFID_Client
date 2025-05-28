import type React from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"

interface LayoutProps {
  children: React.ReactNode
  title?: string
  searchPlaceholder?: string
}

export default function Layout({ children, title, searchPlaceholder }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} searchPlaceholder={searchPlaceholder} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
