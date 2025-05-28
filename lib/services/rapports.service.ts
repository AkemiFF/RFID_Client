import apiClient from "../api"

export interface ReportStats {
  totalExpenses: number
  totalTransactions: number
  totalMerchants: number
  totalSavings: number
  expensesTrend: number
  transactionsTrend: number
  merchantsTrend: number
  savingsTrend: number
}

export interface ReportTransaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  card: string
  status: "completed" | "pending" | "failed"
  location: string
}

export interface DateRange {
  from: string
  to: string
}

export interface ChartData {
  labels: string[]
  datasets: any[]
}

class RapportsService {
  async getReportStats(dateRange: DateRange): Promise<ReportStats> {
    try {
      const response = await apiClient.get("/api/rapports/stats/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      throw error
    }
  }

  async getTransactions(
    dateRange: DateRange,
    page = 1,
    limit = 10,
  ): Promise<{
    transactions: ReportTransaction[]
    total: number
    pages: number
  }> {
    try {
      const response = await apiClient.get("/api/rapports/transactions/", {
        params: { ...dateRange, page, limit },
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error)
      throw error
    }
  }

  async getSpendingTrend(dateRange: DateRange): Promise<ChartData> {
    try {
      const response = await apiClient.get("/api/rapports/spending-trend/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération de la tendance des dépenses:", error)
      throw error
    }
  }

  async getCategoryDistribution(dateRange: DateRange): Promise<ChartData> {
    try {
      const response = await apiClient.get("/api/rapports/category-distribution/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération de la répartition par catégorie:", error)
      throw error
    }
  }

  async exportReport(format: "pdf" | "excel" | "csv", dateRange: DateRange): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/rapports/export/${format}/`, {
        params: dateRange,
        responseType: "blob",
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de l'export du rapport:", error)
      throw error
    }
  }

  async getMerchantReport(dateRange: DateRange): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/rapports/merchants/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du rapport des commerçants:", error)
      throw error
    }
  }

  async getLocationReport(dateRange: DateRange): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/rapports/locations/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du rapport des localisations:", error)
      throw error
    }
  }

  async getCardReport(dateRange: DateRange): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/rapports/cards/", {
        params: dateRange,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du rapport des cartes:", error)
      throw error
    }
  }
}

export const rapportsService = new RapportsService()
