import apiClient from "../api"

export interface CardInfo {
  number: string
  holder: string
  expiry: string
  balance: number
  id: string
  type: string
  status: "active" | "blocked" | "expired"
}

export interface TerminalTransaction {
  id: string
  type: "payment" | "recharge" | "refund"
  amount: number
  merchant?: string
  cardId: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  reference: string
}

export interface TransactionRequest {
  type: "payment" | "recharge" | "refund"
  amount: number
  cardId: string
  merchant?: string
  note?: string
}

class TerminalService {
  async detectCard(cardNumber: string): Promise<CardInfo> {
    try {
      const response = await apiClient.post("/api/terminal/detect-card/", {
        card_number: cardNumber,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la détection de la carte:", error)
      throw error
    }
  }

  async processTransaction(request: TransactionRequest): Promise<TerminalTransaction> {
    try {
      const response = await apiClient.post("/api/terminal/process-transaction/", {
        type: request.type,
        amount: request.amount,
        card_id: request.cardId,
        merchant: request.merchant,
        note: request.note,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors du traitement de la transaction:", error)
      throw error
    }
  }

  async getCardBalance(cardId: string): Promise<number> {
    try {
      const response = await apiClient.get(`/api/terminal/card-balance/${cardId}/`)
      return response.data.balance
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error)
      throw error
    }
  }

  async getRecentTransactions(cardId: string, limit = 10): Promise<TerminalTransaction[]> {
    try {
      const response = await apiClient.get(`/api/terminal/recent-transactions/${cardId}/`, {
        params: { limit },
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions récentes:", error)
      throw error
    }
  }

  async validateTransaction(transactionId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/api/terminal/validate-transaction/${transactionId}/`)
      return response.data.valid
    } catch (error) {
      console.error("Erreur lors de la validation de la transaction:", error)
      throw error
    }
  }

  async cancelTransaction(transactionId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/api/terminal/cancel-transaction/${transactionId}/`)
      return response.data.cancelled
    } catch (error) {
      console.error("Erreur lors de l'annulation de la transaction:", error)
      throw error
    }
  }

  async getTerminalStatus(): Promise<{
    online: boolean
    lastPing: string
    version: string
  }> {
    try {
      const response = await apiClient.get("/api/terminal/status/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du statut du terminal:", error)
      throw error
    }
  }

  async getMerchants(): Promise<
    Array<{
      id: string
      name: string
      category: string
      active: boolean
    }>
  > {
    try {
      const response = await apiClient.get("/api/terminal/merchants/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des commerçants:", error)
      throw error
    }
  }
}

export const terminalService = new TerminalService()
