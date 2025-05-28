"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  CurrencyEuroIcon,
  BuildingStorefrontIcon,
  TicketIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"

const navigation = [
  { name: "Tableau de bord", href: "/", icon: HomeIcon },
  { name: "Gestion des cartes", href: "/cards", icon: CreditCardIcon },
  { name: "Transactions", href: "/transactions", icon: ArrowsRightLeftIcon },
  { name: "Paiement", href: "/payment", icon: CurrencyEuroIcon },
  { name: "Commerçants", href: "/merchants", icon: BuildingStorefrontIcon },
  { name: "Ticket Place", href: "/tickets", icon: TicketIcon },
  { name: "Clients", href: "/clients", icon: UsersIcon },
  { name: "Rapports", href: "/reports", icon: ChartBarIcon },
  { name: "Paramètres", href: "/settings", icon: CogIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 gradient-bg text-white">
        <div className="flex items-center justify-center h-16 px-4">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">RFID Pay</span>
          </div>
        </div>

        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx("sidebar-item", isActive && "bg-white bg-opacity-10")}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto px-4 py-4">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs font-medium text-white text-opacity-70">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
