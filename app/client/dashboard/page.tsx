"use client"

import { useState, useEffect } from "react"
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  SlashIcon as EyeSlashIcon,
  PlusIcon,
  SendIcon,
  QrCodeIcon,
  HistoryIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clientCardsService } from "@/lib/services/client-cards.service"

interface Transaction {
  id: number
  type: "credit" | "debit"
  montant: number
  description: string
  date: string
  commercant?: string
}

interface CarteRFID {
  id: number
  numero: string
  type: "standard" | "premium" | "business" | string
  solde: number
  statut: "active" | "bloquee" | "suspendue" | "expiree"
  dateExpiration: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartes, setCartes] = useState<CarteRFID[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les données utilisateur
        const userData = localStorage.getItem("auth")
        if (userData) {
          const authData = JSON.parse(userData)
          setUser(authData)

          // Récupérer les cartes depuis l'API
          const cards = await clientCardsService.getCards()
          console.log(cards);

          setCartes(cards.map(card => ({
            id: parseInt(card.id),
            numero: card.numero,
            type: clientCardsService.getCardTypeLabel(card.type),
            solde: card.solde,
            statut: card.statut,
            dateExpiration: card.dateExpiration
          })))

          // Récupérer les transactions pour toutes les cartes
          const allTransactions = []
          for (const card of cards) {
            const { transactions } = await clientCardsService.getCardTransactions(card.id)
            allTransactions.push(...transactions.map((t, i) => ({
              id: parseInt(`${card.id}${i}`),
              type: t.type,
              montant: t.montant,
              description: t.description,
              date: t.date,
              commercant: t.commercant
            })))
          }
          setTransactions(allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        // Fallback aux données simulées en cas d'erreur
        setCartes([
          {
            id: 1,
            numero: "1234567890123456",
            type: "Standard",
            solde: 75000,
            statut: "active",
            dateExpiration: "2025-12-31",
          },
          {
            id: 2,
            numero: "9876543210987654",
            type: "Premium",
            solde: 50000,
            statut: "active",
            dateExpiration: "2026-06-30",
          },
        ])
        setTransactions([
          {
            id: 1,
            type: "debit",
            montant: 15000,
            description: "Achat supermarché",
            date: new Date().toISOString(),
            commercant: "SuperMarché Plus",
          },
          {
            id: 2,
            type: "credit",
            montant: 50000,
            description: "Rechargement carte",
            date: new Date(Date.now() - 86400000).toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatMontant = (montant: number) => {
    return clientCardsService.formatAmount(montant)
  }

  const soldeTotal = cartes.reduce((total, carte) => total + carte.solde, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.user?.username} ! 👋</h1>
          <p className="text-gray-600">Voici un aperçu de votre compte</p>
        </div>
      </div>

      {/* Solde principal */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Solde total</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold">{showBalance ? formatMontant(soldeTotal) : "••••••"}</p>
                <button onClick={() => setShowBalance(!showBalance)} className="text-purple-200 hover:text-white">
                  {showBalance ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <CreditCardIcon className="h-8 w-8 text-purple-200" />
          </div>

          <div className="flex space-x-4 mt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/client/transfer")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Transférer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/client/payment")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <QrCodeIcon className="h-4 w-4 mr-2" />
              Payer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/client/transfer")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SendIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Transférer</h3>
            <p className="text-sm text-gray-500">Envoyer de l'argent</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/client/payment")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCodeIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Payer QR</h3>
            <p className="text-sm text-gray-500">Scanner pour payer</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/client/recharge")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PlusIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Recharger</h3>
            <p className="text-sm text-gray-500">Ajouter des fonds</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/client/history")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HistoryIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900">Historique</h3>
            <p className="text-sm text-gray-500">Voir les transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes cartes */}
        <Card>
          <CardHeader>
            <CardTitle>Mes cartes RFID</CardTitle>
            <CardDescription>Gérez vos cartes de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartes.map((carte) => (
                <div
                  key={carte.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/client/cards/${carte.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <CreditCardIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Carte {carte.type}</p>
                      <p className="text-sm text-gray-500">•••• {carte.numero.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{showBalance ? formatMontant(carte.solde) : "••••••"}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${carte.statut === "active"
                        ? "bg-green-100 text-green-800"
                        : carte.statut === "bloquee"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {clientCardsService.getCardStatusLabel(carte.statut)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>Vos dernières opérations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                        }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.commercant || new Date(transaction.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatMontant(transaction.montant)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/client/history")}>
              Voir tout l'historique
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}