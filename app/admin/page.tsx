"use client"

import { useQuery } from "react-query"
import Layout from "@/components/layout/Layout"
import { cartesService } from "@/lib/services/cartes.service"
import { transactionsService } from "@/lib/services/transactions.service"
import {
  CreditCardIcon,
  ArrowsRightLeftIcon,
  TicketIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ArrowUpIcon,
  ShoppingBagIcon,
  WalletIcon,
  TruckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

export default function Dashboard() {
  const { data: cartesData } = useQuery("cartes-stats", () => cartesService.getCartes({ page_size: 1 }))

  const { data: transactionsData } = useQuery("transactions-recent", () =>
    transactionsService.getTransactions({ page_size: 4 }),
  )

  const stats = [
    {
      name: "Cartes actives",
      value: "1,248",
      change: "+12%",
      changeType: "positive",
      icon: CreditCardIcon,
      color: "purple",
    },
    {
      name: "Transactions",
      value: "3,456",
      change: "+8%",
      changeType: "positive",
      icon: ArrowsRightLeftIcon,
      color: "blue",
    },
    {
      name: "Tickets vendus",
      value: "892",
      change: "+15%",
      changeType: "positive",
      icon: TicketIcon,
      color: "green",
    },
    {
      name: "Revenu total",
      value: "$24,780",
      change: "+18%",
      changeType: "positive",
      icon: CurrencyDollarIcon,
      color: "yellow",
    },
  ]

  const recentTransactions = [
    {
      id: "1",
      merchant: "Supermarket ABC",
      date: "12 juin 2023, 09:45",
      amount: -45.2,
      type: "RFID Pay",
      icon: ShoppingBagIcon,
      color: "purple",
    },
    {
      id: "2",
      merchant: "Concert d'été",
      date: "10 juin 2023, 14:30",
      amount: -89.0,
      type: "Ticket Place",
      icon: TicketIcon,
      color: "blue",
    },
    {
      id: "3",
      merchant: "Rechargement",
      date: "8 juin 2023, 08:15",
      amount: 200.0,
      type: "RFID Pay",
      icon: WalletIcon,
      color: "green",
    },
    {
      id: "4",
      merchant: "Transport public",
      date: "5 juin 2023, 17:20",
      amount: -1.8,
      type: "RFID Pay",
      icon: TruckIcon,
      color: "yellow",
    },
  ]

  const platforms = [
    {
      name: "Ticket Place",
      connected: true,
      connectedSince: "10 mai 2023",
      icon: TicketIcon,
    },
    {
      name: "Food Delivery",
      connected: false,
      icon: ShoppingBagIcon,
    },
    {
      name: "CinéPass",
      connected: false,
      icon: TicketIcon,
    },
  ]

  return (
    <Layout searchPlaceholder="Rechercher...">
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600">Plateforme unifiée de gestion des paiements RFID et Ticket Place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    {stat.change} depuis hier
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* RFID Card Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Votre carte RFID</h2>
              <button className="text-purple-600 hover:text-purple-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            <div className="rfid-card p-6 text-white mb-4 relative">
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                RFID Pay
              </div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs text-gray-400">Solde</p>
                  <p className="text-2xl font-bold">$1,245.00</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Numéro de carte</p>
                  <p className="text-sm font-mono">•••• •••• •••• 4589</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400">Titulaire</p>
                  <p className="text-sm">Jean Dupont</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Expire le</p>
                  <p className="text-sm">12/25</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="bg-purple-100 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition">
                <PlusIcon className="h-4 w-4 inline mr-1" />
                Recharger
              </button>
              <button className="bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                <ArrowsRightLeftIcon className="h-4 w-4 inline mr-1" />
                Transférer
              </button>
              <button className="bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Paramètres
              </button>
            </div>
          </div>

          {/* Ticket Place Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Votre ticket actif</h2>
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            <div className="ticket-card p-6 text-white mb-4 relative">
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                Ticket Place
              </div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs text-gray-300">Événement</p>
                  <p className="text-xl font-bold">Concert d'été</p>
                  <p className="text-xs mt-2 text-gray-300">Stade de France</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-300">Numéro de ticket</p>
                  <p className="text-sm font-mono">#TP-78945612</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-300">Date</p>
                  <p className="text-sm">15 Juillet 2023, 20:00</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-300">Statut</p>
                  <p className="text-sm text-green-400">Actif</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                Afficher QR
              </button>
              <button className="bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Détails
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Ce ticket est lié à votre carte RFID #4589</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Activité récente</h2>
              <a href="/transactions" className="text-sm text-purple-600 hover:text-purple-800">
                Voir tout
              </a>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-card p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`p-3 rounded-full bg-${transaction.color}-100 text-${transaction.color}-600 mr-3`}
                      >
                        <transaction.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{transaction.merchant}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Linked Platforms */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Plateformes liées</h2>
              <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Lier
              </button>
            </div>
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center p-3 rounded-lg border border-gray-200">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <platform.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{platform.name}</p>
                    <p className="text-xs text-gray-500">
                      {platform.connected ? `Connecté depuis le ${platform.connectedSince}` : "Non connecté"}
                    </p>
                  </div>
                  <div className="text-green-500">
                    {platform.connected ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <button className="text-purple-600 hover:text-purple-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Actions rapides</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-2">
                  <PlusIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Créer une carte</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2">
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Transférer</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mb-2">
                  <TicketIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Acheter ticket</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 transition">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-2">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Générer rapport</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
