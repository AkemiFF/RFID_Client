import api from "@/lib/api"
import { apiAdmin } from "../api-service"
import  apiClient from "../api-service"
export interface ClientCard {
  id: string
  numero: string
  type: "STANDARD" | "PREMIUM" | "ENTREPRISE"
  statut: "ACTIVE" | "BLOQUEE" | "EXPIREE" | "PERDUE" | "VOLEE"
  solde: number
  dateCreation: string
  dateExpiration: string
  plafondJournalier: number
  plafondMensuel: number
  utiliseJournalier: number
  utiliseMensuel: number
  dernierUtilisation?: string
  nombreTransactions: number
  fraisMensuels: number
  couleur: string
  nomPersonnalise?: string
}

export interface CardTransaction {
  id: string
  date: string
  type: "credit" | "debit"
  montant: number
  description: string
  commercant?: string
  reference: string
  statut: "reussie" | "echouee" | "en_attente"
  frais: number
}

export interface CardRequest {
  type: "standard" | "premium" | "business"
  motif: string
  adresseLivraison: string
  urgence: boolean
}

export interface CardLimits {
  plafondJournalier: number
  plafondMensuel: number
}

export interface CardSettings {
  notifications: {
    transactions: boolean
    limites: boolean
    securite: boolean
  }
  securite: {
    pinRequis: boolean
    biometrieActive: boolean
    limiteGeographique: boolean
  }
  preferences: {
    nomPersonnalise: string
    couleur: string
  }
}

export interface CardStatistics {
  totalTransactions: number
  totalAmount: number
  averageTransaction: number
  topMerchants: Array<{ name: string; amount: number; count: number }>
  dailyUsage: Array<{ date: string; amount: number; count: number }>
}

class ClientCardsService {
  async getCards(): Promise<ClientCard[]> {
    try {
      const response = await apiAdmin.get("/client/cards")
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les cartes")
    }
  }

  async getCard(cardId: string): Promise<ClientCard> {
    try {
      const response = await apiAdmin.get(`/client/cards/${cardId}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les détails de la carte")
    }
  }

  async blockCard(cardId: string, reason: string): Promise<void> {
    try {
      await apiClient.post(`/cartes/client/cards/${cardId}/block/`, { reason })
    } catch (error) {
      throw new Error("Impossible de bloquer la carte")
    }
  }

  async unblockCard(cardId: string): Promise<void> {
    try {
      await apiClient.post(`/cartes/client/cards/${cardId}/unblock/`)
    } catch (error) {
      throw new Error("Impossible de débloquer la carte")
    }
  }

  async activateCard(cardId: string, pin: string): Promise<void> {
    try {
      await apiClient.post(`/cartes/client/cards/${cardId}/activate/`, { pin })
    } catch (error) {
      throw new Error("Impossible d'activer la carte")
    }
  }

  async changePIN(cardId: string, currentPin: string, newPin: string): Promise<void> {
    try {
      await apiClient.post(`/cartes/client/cards/${cardId}/change_pin/`, {
        currentPin,
        newPin,
      })
    } catch (error) {
      throw new Error("Impossible de changer le PIN")
    }
  }

  async updateLimits(cardId: string, limits: CardLimits): Promise<void> {
    try {
      await apiClient.put(`/cartes/client/cards/${cardId}/limits/`, limits)
    } catch (error) {
      throw new Error("Impossible de modifier les limites")
    }
  }

  async updateSettings(cardId: string, settings: CardSettings): Promise<void> {
    try {
      await apiClient.put(`/cartes/client/cards/${cardId}/settings/`, settings)
    } catch (error) {
      throw new Error("Impossible de modifier les paramètres")
    }
  }

  async getCardTransactions(
    cardId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    transactions: CardTransaction[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const response = await apiClient.get(`/cartes/client/cards/${cardId}/transactions/?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique de la carte")
    }
  }

  async requestNewCard(request: CardRequest): Promise<{ requestId: string; estimatedDelivery: string }> {
    try {
      const response = await apiClient.post("/cartes/client/cards/request/", request)
      return response.data
    } catch (error) {
      throw new Error("Impossible de demander une nouvelle carte")
    }
  }

  async reportLostCard(cardId: string, circumstances: string): Promise<void> {
    try {
      await apiClient.post(`/cartes/client/cards/${cardId}/report_lost/`, { circumstances })
    } catch (error) {
      throw new Error("Impossible de signaler la perte")
    }
  }

  async requestReplacement(cardId: string, reason: string): Promise<{ requestId: string; cost: number }> {
    try {
      const response = await apiClient.post(`/cartes/client/cards/${cardId}/replace/`, { reason })
      return response.data
    } catch (error) {
      throw new Error("Impossible de demander un remplacement")
    }
  }

  async getCardStatistics(cardId: string, period: "week" | "month" | "year"): Promise<CardStatistics> {
    try {
      const response = await apiClient.get(`/cartes/client/cards/${cardId}/statistics/?period=${period}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les statistiques")
    }
  }

  // Méthodes utilitaires
  getCardTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      STANDARD: "Standard",
      PREMIUM: "Premium",
      ENTREPRISE: "Business",
    }
    return labels[type] || type
  }

  getCardStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: "Active",
      BLOQUEE: "Bloquée",
      EXPIREE: "Expirée",
      PERDUE: "Perdue",
      VOLEE: "Volée",
    }
    return labels[status] || status
  }

  getCardStatusColor(status: string): string {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      BLOQUEE: "bg-red-100 text-red-800",
      EXPIREE: "bg-gray-100 text-gray-800",
      PERDUE: "bg-yellow-100 text-yellow-800",
      VOLEE: "bg-orange-100 text-orange-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  getCardTypeColor(type: string): string {
    const colors: Record<string, string> = {
      STANDARD: "bg-gray-100 text-gray-800",
      PREMIUM: "bg-amber-100 text-amber-800",
      ENTREPRISE: "bg-emerald-100 text-emerald-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  formatCardNumber(numero: string): string {
    return numero.replace(/(.{4})/g, "$1 ").trim()
  }

  isCardExpiringSoon(dateExpiration: string): boolean {
    const expiry = new Date(dateExpiration)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  calculateUsagePercentage(used: number, limit: number): number {
    return limit > 0 ? Math.round((used / limit) * 100) : 0
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-FR").format(amount) + " Ar"
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  getCardIcon(type: string): string {
    const icons: Record<string, string> = {
      STANDARD: "credit-card",
      PREMIUM: "credit-card",
      ENTREPRISE: "building",
    }
    return icons[type] || "credit-card"
  }
}

export const clientCardsService = new ClientCardsService()
