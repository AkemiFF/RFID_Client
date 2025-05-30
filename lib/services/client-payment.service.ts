import api from "@/lib/api"

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
  date: string
  type: string
  montant: number
  statut: string
  description: string
}

class ClientPaymentService {
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResult> {
    try {
      const response = await api.post("/client/payments/process", paymentData)
      return response.data
    } catch (error) {
      throw new Error("Échec du paiement")
    }
  }

  async processTransfer(transferData: TransferRequest): Promise<PaymentResult> {
    try {
      const response = await api.post("/client/transfers/process", transferData)
      return response.data
    } catch (error) {
      throw new Error("Échec du transfert")
    }
  }

  async parseQRCode(qrData: string): Promise<QRPaymentData> {
    try {
      const response = await api.post("/client/payments/parse-qr", { qrData })
      return response.data
    } catch (error) {
      throw new Error("QR Code invalide")
    }
  }

  async validatePayment(paymentData: PaymentRequest): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await api.post("/client/payments/validate", paymentData)
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
      const response = await api.get(`/client/payments/history?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique")
    }
  }

  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    try {
      const response = await api.get(`/client/payments/transactions/${transactionId}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les détails de la transaction")
    }
  }

  async cancelTransaction(transactionId: string): Promise<void> {
    try {
      await api.post(`/client/payments/transactions/${transactionId}/cancel`)
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
      const response = await api.get(`/client/cards/${carteId}/limits`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les limites")
    }
  }

  async requestRefund(transactionId: string, reason: string): Promise<void> {
    try {
      await api.post(`/client/payments/transactions/${transactionId}/refund`, { reason })
    } catch (error) {
      throw new Error("Impossible de demander un remboursement")
    }
  }

  async getDetailedHistory(
    filters: {
      type?: string
      status?: string
      dateFrom?: string
      dateTo?: string
      search?: string
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    transactions: Transaction[]
    total: number
    page: number
    totalPages: number
    stats: {
      totalTransactions: number
      totalDepenses: number
      totalRecus: number
      transactionsMoyennes: number
    }
  }> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await api.get(`/client/payments/detailed-history?${params}`)
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer l'historique détaillé")
    }
  }

  async getTransactionStatistics(
    period: "7d" | "30d" | "90d" | "1y" | "custom",
    customRange?: { from: string; to: string },
  ): Promise<{
    totalTransactions: number
    totalDepenses: number
    totalRecus: number
    transactionsMoyennes: number
    repartitionParType: Array<{ type: string; count: number; amount: number }>
    evolutionMensuelle: Array<{ month: string; depenses: number; recus: number }>
    topCommerçants: Array<{ name: string; amount: number; count: number }>
  }> {
    try {
      const params = new URLSearchParams({ period })
      if (customRange) {
        params.append("from", customRange.from)
        params.append("to", customRange.to)
      }

      const response = await api.get(`/client/payments/statistics?${params}`)
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

      const response = await api.get(`/client/payments/export?${params}`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw new Error("Impossible d'exporter les transactions")
    }
  }

  async getTransactionReceipt(transactionId: string): Promise<Blob> {
    try {
      const response = await api.get(`/client/payments/transactions/${transactionId}/receipt`, {
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      throw new Error("Impossible de télécharger le reçu")
    }
  }

  // Méthodes utilitaires pour l'historique
  getTransactionTypeLabel(type: string): string {
    const labels = {
      paiement: "Paiement",
      transfert_envoye: "Transfert envoyé",
      transfert_recu: "Transfert reçu",
      depot: "Dépôt",
      retrait: "Retrait",
      remboursement: "Remboursement",
    }
    return labels[type as keyof typeof labels] || type
  }

  getTransactionStatusLabel(status: string): string {
    const labels = {
      reussie: "Réussie",
      echouee: "Échouée",
      en_attente: "En attente",
      annulee: "Annulée",
    }
    return labels[status as keyof typeof labels] || status
  }

  getChannelLabel(channel: string): string {
    const labels = {
      rfid: "Carte RFID",
      qr: "QR Code",
      mobile: "Application mobile",
      web: "Site web",
    }
    return labels[channel as keyof typeof labels] || channel
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
