"use client"

import type React from "react"

import {
  ArrowRightLeftIcon,
  CreditCardIcon,
  HistoryIcon,
  HomeIcon,
  LogOutIcon,
  QrCodeIcon,
  SettingsIcon,
} from "lucide-react"
import { Inter } from "next/font/google"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth")
    const userData = localStorage.getItem("auth")

    if (!token && pathname !== "/client/login") {
      router.push("/client/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("client_token")
    localStorage.removeItem("client_user")
    router.push("/client/login")
  }

  // Ne pas afficher la navigation sur la page de connexion
  if (pathname === "/client/login") {
    return (
      <html lang="fr">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">{children}</div>
        </body>
      </html>
    )
  }

  const navigation = [
    { name: "Accueil", href: "/client/dashboard", icon: HomeIcon },
    { name: "Transfert", href: "/client/transfer", icon: ArrowRightLeftIcon },
    { name: "Paiement QR", href: "/client/payment", icon: QrCodeIcon },
    { name: "Mes Cartes", href: "/client/cards", icon: CreditCardIcon },
    { name: "Historique", href: "/client/history", icon: HistoryIcon },
    { name: "Paramètres", href: "/client/settings", icon: SettingsIcon },
  ]

  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-purple-600">RFID Pay</h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {user && (
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <LogOutIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <nav className="w-64 bg-white shadow-sm min-h-screen">
              <div className="p-4">
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => router.push(item.href)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                            ? "bg-purple-100 text-purple-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
