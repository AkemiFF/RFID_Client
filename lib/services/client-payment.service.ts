import apiClient from "../api-service"

export interface PaymentRequest {
  montant: number
  carteId: string
  commercantId: string
  description?: string
  qrData?: string
}

export interface TransferRequest {
  montant: number
  carteSourceId: string
  destinataire: string
  motif?: string
  type: "telephone" | "email" | "carte"
}

export interface QRPaymentData {
  commercant: string
  montant: number
  reference: string
  description: string
  commercantId: string
  validUntil: string
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  reference: string
  montant: number
  frais: number
  nouveauSolde: number
  message: string
}

export interface Transaction {
  id: string
  reference_interne: string
  reference_externe?: string
  type_transaction: string
  type_display: string
  statut: string
  statut_display: string
  montant: number
  frais_transaction: number
  devise: string
  solde_avant: number
  solde_apres: number
  merchant_id?: string
  merchant_nom?: string
  terminal_id?: string
  description?: string
  categorie?: string
  localisation?: string
  date_transaction: string
  date_validation?: string
  carte_numero: string
  coordonnees_gps?: {
    type: string
    coordinates: [number, number]
  }
}

export interface TransactionStats {
  totalTransactions: number
  totalDepenses: number
  totalRecus: number
  transactionsMoyennes: number
}

export interface DetailedHistoryResponse {
  transactions: Transaction[]
  total: number
  page: number
  totalPages: number
  stats: TransactionStats
}

export interface StatisticsResponse {
  totalTransactions: number
  totalDepenses: number
  totalRecus: number
  transactionsMoyennes: number
  repartitionParType: Array<{
    type: string
    count: number
    amount: number
  }>
  evolutionMensuelle: Array<{
    month: string
    depenses: number
    recus: number
  }>
  topCommerçants: Array<{
    name: string
    amount: number
    count: number
  }>
}

export interface HistoryFilters {
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

class ClientPaymentService {
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResult> {
    try {
      const response = await apiClient.post("/client/payments/process", paymentData)
      return response.data
    } catch (error) {
      throw new Error("Échec du paiement")
    }
  }

  async processTransfer(transferData: TransferRequest): Promise<PaymentResult> {
    try {
      const response = await apiClient.post("/client/transfers/process", transferData)
      return response.data
    } catch (error) {
      throw new Error("Échec du transfert")
    }
  }

  async parseQRCode(qrData: string): Promise<QRPaymentData> {
    try {
      const response = await apiClient.post("/client/payments/parse-qr", { qrData })
      return response.data
    } catch (error) {
      throw new Error("QR Code invalide")
    }
  }

  async validatePayment(paymentData: PaymentRequest): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await apiClient.post("/client/payments/validate", paymentData)
      return response.data
    } catch (error) {
      throw new Error("Impossible de valider le paiement")
    }
  }

  async getPaymentHistory(
    page = 1,
    limit = 20,
  ): Promise<{
    transactions: Transaction[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const response = await apiClient.get(`/transactions/client/payments/history?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique")
    }
  }

  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get(`/transactions/transactions/${transactionId}/`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les détails de la transaction")
    }
  }

  async cancelTransaction(transactionId: string): Promise<void> {
    try {
      await apiClient.post(`/transactions/transactions/${transactionId}/cancel/`)
    } catch (error) {
      throw new Error("Impossible d'annuler la transaction")
    }
  }

  async getPaymentLimits(carteId: string): Promise<{
    plafondJournalier: number
    plafondMensuel: number
    utiliseJournalier: number
    utiliseMensuel: number
  }> {
    try {
      const response = await apiClient.get(`/cartes/cartes/${carteId}/limits/`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les limites")
    }
  }

  async requestRefund(transactionId: string, reason: string): Promise<void> {
    try {
      await apiClient.post(`/transactions/client/payments/transactions/${transactionId}/refund/`, { reason })
    } catch (error) {
      throw new Error("Impossible de demander un remboursement")
    }
  }

  async getDetailedHistory(filters: HistoryFilters = {}): Promise<DetailedHistoryResponse> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await apiClient.get(`/transactions/client/payments/detailed-history/?${params}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique détaillé")
    }
  }

  async getTransactionStatistics(
    period: "7d" | "30d" | "90d" | "1y" | "custom",
    customRange?: { from: string; to: string },
  ): Promise<StatisticsResponse> {
    try {
      const params = new URLSearchParams({ period })
      if (customRange) {
        params.append("from", customRange.from)
        params.append("to", customRange.to)
      }

      const response = await apiClient.get(`/transactions/client/payments/statistics/?${params}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les statistiques")
    }
  }

  async exportTransactions(
    format: "csv" | "pdf" | "excel",
    filters: {
      type?: string
      status?: string
      dateFrom?: string
      dateTo?: string
    } = {},
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({ format })
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await apiClient.get(`/transactions/client/payments/export/?${params}`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw new Error("Impossible d'exporter les transactions")
    }
  }

  async getTransactionReceipt(transactionId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/transactions/client/payments/transactions/${transactionId}/receipt/`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw new Error("Impossible de télécharger le reçu")
    }
  }

  // Méthodes utilitaires pour l'historique
  getTransactionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      ACHAT: "Paiement",
      TRANSFERT: "Transfert",
      RECHARGE: "Dépôt",
      RETRAIT: "Retrait",
      REMBOURSEMENT: "Remboursement",
    }
    return labels[type] || type
  }

  getTransactionStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      VALIDEE: "Réussie",
      ECHOUEE: "Échouée",
      EN_COURS: "En attente",
      ANNULEE: "Annulée",
    }
    return labels[status] || status
  }

  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      ACHAT: "💳",
      TRANSFERT: "📤",
      RECHARGE: "➕",
      RETRAIT: "➖",
      REMBOURSEMENT: "🔄",
    }
    return icons[type] || "💰"
  }

  getTransactionColor(type: string): string {
    const colors: Record<string, string> = {
      ACHAT: "text-red-600",
      TRANSFERT: "text-orange-600",
      RECHARGE: "text-green-600",
      RETRAIT: "text-purple-600",
      REMBOURSEMENT: "text-blue-600",
    }
    return colors[type] || "text-gray-600"
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      VALIDEE: "bg-green-100 text-green-800",
      ECHOUEE: "bg-red-100 text-red-800",
      EN_COURS: "bg-yellow-100 text-yellow-800",
      ANNULEE: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Méthodes utilitaires
  formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-FR").format(amount) + " Ar"
  }

  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  calculateFees(amount: number, paymentType: "payment" | "transfer"): number {
    // Logique de calcul des frais
    if (paymentType === "transfer") {
      return amount > 50000 ? Math.floor(amount * 0.01) : 0 // 1% pour les gros transferts
    }
    return 0 // Paiements gratuits
  }

  validateAmount(amount: number, availableBalance: number): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: "Le montant doit être supérieur à 0" }
    }
    if (amount > availableBalance) {
      return { valid: false, error: "Solde insuffisant" }
    }
    if (amount > 1000000) {
      return { valid: false, error: "Montant trop élevé (max: 1,000,000 Ar)" }
    }
    return { valid: true }
  }
}

export const clientPaymentService = new ClientPaymentService()
