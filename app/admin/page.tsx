"use client"

import { useQuery } from "react-query"
import Layout from "@/components/layout/Layout"
import { cartesService } from "@/lib/services/cartes.service"
import { transactionsService } from "@/lib/services/transactions.service"
import { identitesService } from "@/lib/services/identites.service"
import {
  CreditCardIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  WalletIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"

// Composant de chargement réutilisable
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-purple-600 ${sizeClasses[size]}`}
      ></div>
    </div>
  )
}

// Composant d'erreur réutilisable
const ErrorMessage = ({ message, retry }: { message: string; retry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center">
    <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mb-2" />
    <p className="text-red-600 text-sm mb-2">{message}</p>
    {retry && (
      <button onClick={retry} className="text-purple-600 hover:text-purple-800 text-sm underline">
        Réessayer
      </button>
    )}
  </div>
)

// Fonction utilitaire pour s'assurer qu'une valeur est un nombre
const ensureNumber = (value: any): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Fonction utilitaire pour formater les montants
const formatAmount = (amount: any): string => {
  const numAmount = ensureNumber(amount)
  return numAmount.toFixed(2)
}

export default function Dashboard() {
  // Requêtes pour récupérer les données réelles depuis l'API
  const {
    data: cartesData,
    isLoading: isLoadingCartes,
    error: cartesError,
    refetch: refetchCartes,
  } = useQuery("cartes-stats", () => cartesService.getCartesStats(), {
    retry: 2,
    refetchInterval: 5 * 60 * 1000, // Actualiser toutes les 5 minutes
    staleTime: 2 * 60 * 1000, // Considérer les données comme fraîches pendant 2 minutes
  })

  const {
    data: clientsData,
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients,
  } = useQuery("clients-stats", () => identitesService.getClientsStats(), {
    retry: 2,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  })

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery("transactions-recent", () => transactionsService.getTransactionsT({ page_size: 5 }), {
    retry: 2,
    refetchInterval: 2 * 60 * 1000, // Actualiser plus fréquemment pour les transactions
    staleTime: 1 * 60 * 1000,
  })

  const {
    data: alertesData,
    isLoading: isLoadingAlertes,
    error: alertesError,
    refetch: refetchAlertes,
  } = useQuery("alertes", () => cartesService.getAlertes(), {
    retry: 2,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  })

  // Statistiques principales avec gestion des états de chargement et d'erreur
  const stats = [
    {
      name: "Clients actifs",
      value: isLoadingClients ? "..." : clientsError ? "Erreur" : clientsData?.total?.toLocaleString() || "0",
      change: clientsData?.change || "+0%",
      changeType: clientsData?.changeType || "positive",
      icon: UserIcon,
      color: "purple",
      isLoading: isLoadingClients,
      error: clientsError,
    },
    {
      name: "Cartes actives",
      value: isLoadingCartes ? "..." : cartesError ? "Erreur" : cartesData?.actives?.toLocaleString() || "0",
      change: cartesData?.change || "+0%",
      changeType: cartesData?.changeType || "positive",
      icon: CreditCardIcon,
      color: "blue",
      isLoading: isLoadingCartes,
      error: cartesError,
    },
    {
      name: "Transactions",
      value: isLoadingTransactions
        ? "..."
        : transactionsError
          ? "Erreur"
          : transactionsData?.total?.toLocaleString() || "0",
      change: transactionsData?.change || "+0%",
      changeType: transactionsData?.changeType || "positive",
      icon: ArrowsRightLeftIcon,
      color: "green",
      isLoading: isLoadingTransactions,
      error: transactionsError,
    },
    {
      name: "Alertes",
      value: isLoadingAlertes
        ? "..."
        : alertesError
          ? "Erreur"
          : Array.isArray(alertesData)
            ? alertesData.length.toString()
            : alertesData?.alertes?.length?.toString() || "0",
      change: alertesData?.change || "-0%",
      changeType: alertesData?.changeType || "negative",
      icon: ExclamationTriangleIcon,
      color: "yellow",
      isLoading: isLoadingAlertes,
      error: alertesError,
    },
  ]

  // Types de cartes avec données réelles
  const cardTypes = [
    {
      name: "Standard",
      value: cartesData?.standard || 0,
      color: "bg-blue-500",
      total: cartesData?.total || 1,
    },
    {
      name: "Premium",
      value: cartesData?.premium || 0,
      color: "bg-purple-500",
      total: cartesData?.total || 1,
    },
    {
      name: "Expirées",
      value: cartesData?.expirees || 0,
      color: "bg-yellow-500",
      total: cartesData?.total || 1,
    },
    {
      name: "Bloquées",
      value: cartesData?.bloquees || 0,
      color: "bg-red-500",
      total: cartesData?.total || 1,
    },
  ]

  // Top clients avec données réelles
  const topClients = clientsData?.topClients || []

  // Alertes avec gestion des différents formats de données
  const alertes = Array.isArray(alertesData) ? alertesData : alertesData?.alertes || []

  // Transactions avec gestion des différents formats de données
  const transactions = transactionsData?.transactions || []

  return (
    <Layout searchPlaceholder="Rechercher clients, cartes...">
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord RFID</h1>
          <p className="text-gray-600">Vue d'ensemble du système de gestion RFID</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 card-hover">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-center mt-1">
                    {stat.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    )}
                  </div>
                  {!stat.isLoading && !stat.error && (
                    <p
                      className={`text-xs ${
                        stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                      } mt-1 flex items-center`}
                    >
                      {stat.changeType === "positive" ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {stat.change} depuis hier
                    </p>
                  )}
                  {stat.error && <p className="text-xs text-red-500 mt-1">Erreur de chargement</p>}
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
          {/* Répartition des cartes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Types de cartes</h2>
              <button className="text-sm text-purple-600 hover:text-purple-800">Voir détails</button>
            </div>
            {isLoadingCartes ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : cartesError ? (
              <ErrorMessage message="Erreur lors du chargement des données des cartes" retry={refetchCartes} />
            ) : (
              <div className="space-y-4">
                {cardTypes.map((type) => (
                  <div key={type.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{type.name}</span>
                      <span className="font-medium">{type.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${type.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min((type.value / type.total) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top clients */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Top clients</h2>
              <button className="text-sm text-purple-600 hover:text-purple-800">Voir tout</button>
            </div>
            {isLoadingClients ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : clientsError ? (
              <ErrorMessage message="Erreur lors du chargement des clients" retry={refetchClients} />
            ) : topClients.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Aucun client trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          client.type === "person" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {client.type === "person" ? (
                          <UserIcon className="h-5 w-5" />
                        ) : (
                          <BuildingOfficeIcon className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.type === "person" ? "Personne" : "Entreprise"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{client.usage} cartes</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alertes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Alertes récentes</h2>
              <button className="text-sm text-purple-600 hover:text-purple-800">Voir tout</button>
            </div>
            {isLoadingAlertes ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : alertesError ? (
              <ErrorMessage message="Erreur lors du chargement des alertes" retry={refetchAlertes} />
            ) : alertes.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune alerte</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {alertes.slice(0, 4).map((alerte) => (
                  <div key={alerte.id} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {alerte.critique ? (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{alerte.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {new Date(alerte.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions récentes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Transactions récentes</h2>
              <button className="text-sm text-purple-600 hover:text-purple-800">Voir tout</button>
            </div>
            {isLoadingTransactions ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : transactionsError ? (
              <ErrorMessage message="Erreur lors du chargement des transactions" retry={refetchTransactions} />
            ) : transactions.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Aucune transaction récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const montant = ensureNumber(transaction.montant)
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full ${
                            montant > 0 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                          } mr-3`}
                        >
                          {montant > 0 ? <WalletIcon className="h-5 w-5" /> : <ShoppingBagIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {transaction.client_nom || "Transaction anonyme"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleString()} • {transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${montant > 0 ? "text-green-600" : "text-gray-800"}`}>
                          {montant > 0 ? "+" : ""}
                          {formatAmount(montant)} Ar
                        </p>
                        <p className="text-xs text-gray-500">
                          UID: {transaction.carte_uid?.substring(0, 8) || "N/A"}...
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Actions rapides</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 group">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-2 group-hover:bg-purple-200 transition-colors">
                  <PlusIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Créer client</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:bg-blue-200 transition-colors">
                  <CreditCardIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Générer carte</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all duration-200 group">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mb-2 group-hover:bg-green-200 transition-colors">
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Transactions</p>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 transition-all duration-200 group">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-2 group-hover:bg-yellow-200 transition-colors">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">Rapports</p>
              </button>
            </div>
          </div>
        </div>

        {/* Indicateur de dernière mise à jour */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Dernière mise à jour: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </Layout>
  )
}
