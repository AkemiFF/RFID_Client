import { apiClient } from "@/lib/api"

export interface PaymentRequest {
  beneficiary: string
  category: string
  amount: number
  note?: string
  paymentMethod: string
  cardId: string
}

export interface PaymentResponse {
  id: string
  reference: string
  status: "success" | "failed" | "pending"
  amount: number
  beneficiary: string
  date: string
  receipt?: string
}

export interface Beneficiary {
  id: string
  name: string
  category: string
  type: "merchant" | "contact"
  favorite: boolean
  lastTransaction?: {
    date: string
    amount: number
  }
}

export const paiementsService = {
  // Get beneficiaries
  getBeneficiaries: async (): Promise<Beneficiary[]> => {
    const response = await apiClient.get("/paiements/beneficiaires/")
    return response.data
  },

  // Get favorite beneficiaries
  getFavorites: async (): Promise<Beneficiary[]> => {
    const response = await apiClient.get("/paiements/favoris/")
    return response.data
  },

  // Get recent beneficiaries
  getRecent: async (): Promise<Beneficiary[]> => {
    const response = await apiClient.get("/paiements/recents/")
    return response.data
  },

  // Process payment
  processPayment: async (payment: PaymentRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post("/paiements/traiter/", payment)
    return response.data
  },

  // Add beneficiary to favorites
  addToFavorites: async (beneficiaryId: string): Promise<void> => {
    await apiClient.post(`/paiements/favoris/${beneficiaryId}/`)
  },

  // Remove from favorites
  removeFromFavorites: async (beneficiaryId: string): Promise<void> => {
    await apiClient.delete(`/paiements/favoris/${beneficiaryId}/`)
  },

  // Get payment receipt
  getReceipt: async (paymentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/paiements/${paymentId}/recu/`, {
      responseType: "blob",
    })
    return response.data
  },
}
