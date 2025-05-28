import { api } from "@/lib/api"

export interface ClientCard {
  id: string
  numero: string
  type: "standard" | "premium" | "business"
  statut: "active" | "bloquee" | "suspendue" | "expiree"
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

class ClientCardsService {
  async getCards(): Promise<ClientCard[]> {
    try {
      const response = await api.get("/client/cards")
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les cartes")
    }
  }

  async getCard(cardId: string): Promise<ClientCard> {
    try {
      const response = await api.get(`/client/cards/${cardId}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les détails de la carte")
    }
  }

  async blockCard(cardId: string, reason: string): Promise<void> {
    try {
      await api.post(`/client/cards/${cardId}/block`, { reason })
    } catch (error) {
      throw new Error("Impossible de bloquer la carte")
    }
  }

  async unblockCard(cardId: string): Promise<void> {
    try {
      await api.post(`/client/cards/${cardId}/unblock`)
    } catch (error) {
      throw new Error("Impossible de débloquer la carte")
    }
  }

  async activateCard(cardId: string, pin: string): Promise<void> {
    try {
      await api.post(`/client/cards/${cardId}/activate`, { pin })
    } catch (error) {
      throw new Error("Impossible d'activer la carte")
    }
  }

  async changePIN(cardId: string, currentPin: string, newPin: string): Promise<void> {
    try {
      await api.post(`/client/cards/${cardId}/change-pin`, {
        currentPin,
        newPin,
      })
    } catch (error) {
      throw new Error("Impossible de changer le PIN")
    }
  }

  async updateLimits(cardId: string, limits: CardLimits): Promise<void> {
    try {
      await api.put(`/client/cards/${cardId}/limits`, limits)
    } catch (error) {
      throw new Error("Impossible de modifier les limites")
    }
  }

  async updateSettings(cardId: string, settings: CardSettings): Promise<void> {
    try {
      await api.put(`/client/cards/${cardId}/settings`, settings)
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
      const response = await api.get(`/client/cards/${cardId}/transactions?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique de la carte")
    }
  }

  async requestNewCard(request: CardRequest): Promise<{ requestId: string; estimatedDelivery: string }> {
    try {
      const response = await api.post("/client/cards/request", request)
      return response.data
    } catch (error) {
      throw new Error("Impossible de demander une nouvelle carte")
    }
  }

  async reportLostCard(cardId: string, circumstances: string): Promise<void> {
    try {
      await api.post(`/client/cards/${cardId}/report-lost`, { circumstances })
    } catch (error) {
      throw new Error("Impossible de signaler la perte")
    }
  }

  async requestReplacement(cardId: string, reason: string): Promise<{ requestId: string; cost: number }> {
    try {
      const response = await api.post(`/client/cards/${cardId}/replace`, { reason })
      return response.data
    } catch (error) {
      throw new Error("Impossible de demander un remplacement")
    }
  }

  async getCardStatistics(
    cardId: string,
    period: "week" | "month" | "year",
  ): Promise<{
    totalTransactions: number
    totalAmount: number
    averageTransaction: number
    topMerchants: Array<{ name: string; amount: number; count: number }>
    dailyUsage: Array<{ date: string; amount: number; count: number }>
  }> {
    try {
      const response = await api.get(`/client/cards/${cardId}/statistics?period=${period}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les statistiques")
    }
  }

  // Méthodes utilitaires
  getCardTypeLabel(type: string): string {
    const labels = {
      standard: "Standard",
      premium: "Premium",
      business: "Business",
    }
    return labels[type as keyof typeof labels] || type
  }

  getCardStatusLabel(status: string): string {
    const labels = {
      active: "Active",
      bloquee: "Bloquée",
      suspendue: "Suspendue",
      expiree: "Expirée",
    }
    return labels[status as keyof typeof labels] || status
  }

  getCardStatusColor(status: string): string {
    const colors = {
      active: "bg-green-100 text-green-800",
      bloquee: "bg-red-100 text-red-800",
      suspendue: "bg-yellow-100 text-yellow-800",
      expiree: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
}

export const clientCardsService = new ClientCardsService()
