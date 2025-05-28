import apiClient from "@/lib/api"

export interface Merchant {
  id: string
  name: string
  siret: string
  category: string
  subcategory: string
  location: string
  address: string
  city: string
  postalCode: string
  transactions: number
  volume: number
  status: "active" | "inactive" | "pending"
  commission: number
  contact: string
  phone: string
  email: string
  registrationDate: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface MerchantFilters {
  status?: string
  category?: string
  city?: string
  period?: string
  search?: string
}

export interface MerchantStats {
  totalActive: number
  averageTransaction: number
  newMerchants: number
  totalVolume: number
  categoryDistribution: {
    category: string
    count: number
    percentage: number
  }[]
}

export const commercantsService = {
  // Get all merchants with filters
  getMerchants: async (filters?: MerchantFilters): Promise<Merchant[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })
    }
    const response = await apiClient.get(`/commercants/?${params.toString()}`)
    return response.data
  },

  // Get merchant by ID
  getMerchant: async (id: string): Promise<Merchant> => {
    const response = await apiClient.get(`/commercants/${id}/`)
    return response.data
  },

  // Create new merchant
  createMerchant: async (merchant: Omit<Merchant, "id" | "registrationDate">): Promise<Merchant> => {
    const response = await apiClient.post("/commercants/", merchant)
    return response.data
  },

  // Update merchant
  updateMerchant: async (id: string, merchant: Partial<Merchant>): Promise<Merchant> => {
    const response = await apiClient.patch(`/commercants/${id}/`, merchant)
    return response.data
  },

  // Delete merchant
  deleteMerchant: async (id: string): Promise<void> => {
    await apiClient.delete(`/commercants/${id}/`)
  },

  // Get merchant statistics
  getStats: async (): Promise<MerchantStats> => {
    const response = await apiClient.get("/commercants/statistiques/")
    return response.data
  },

  // Get merchant transactions
  getMerchantTransactions: async (merchantId: string): Promise<any[]> => {
    const response = await apiClient.get(`/commercants/${merchantId}/transactions/`)
    return response.data
  },

  // Update merchant status
  updateStatus: async (id: string, status: "active" | "inactive" | "pending"): Promise<void> => {
    await apiClient.patch(`/commercants/${id}/statut/`, { status })
  },

  // Export merchants data
  exportMerchants: async (filters?: MerchantFilters): Promise<Blob> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })
    }
    const response = await apiClient.get(`/commercants/export/?${params.toString()}`, {
      responseType: "blob",
    })
    return response.data
  },
}
