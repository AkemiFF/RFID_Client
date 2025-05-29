import api from "../api"
import { apiAdmin } from "../api-service"

export interface Transaction {
  id: string
  carte: string
  type_transaction: "ACHAT" | "RETRAIT" | "RECHARGE" | "TRANSFERT"
  montant: number
  solde_avant: number
  solde_apres: number
  merchant_id?: string
  merchant_nom?: string
  terminal_id?: string
  reference_externe?: string
  reference_interne: string
  description?: string
  categorie?: string
  localisation?: string
  statut: "EN_COURS" | "VALIDEE" | "ECHOUEE" | "ANNULEE"
  code_erreur?: string
  message_erreur?: string
  frais_transaction: number
  devise: string
  date_transaction: string
  date_validation?: string
}

export interface CreateTransactionData {
  carte: string
  type_transaction: string
  montant: number
  merchant_id?: string
  merchant_nom?: string
  terminal_id?: string
  description?: string
  categorie?: string
  localisation?: string
}

export interface TransactionFilters {
  carte?: string
  type_transaction?: string
  statut?: string
  date_debut?: string
  date_fin?: string
  search?: string
  page?: number
  page_size?: number
}

class TransactionsService {
  async getTransactions(filters: TransactionFilters = {}) {
    const response = await apiAdmin.get("/transactions/transactions/", { params: filters })
    return response.data
  }

  async getTransaction(id: string) {
    const response = await api.get(`/transactions/transactions/${id}/`)
    return response.data
  }

  async createTransaction(data: CreateTransactionData) {
    const response = await api.post("/transactions/transactions/", data)
    return response.data
  }

  async reprocessTransaction(id: string) {
    const response = await api.post(`/transactions/transactions/${id}/reprocess/`)
    return response.data
  }

  async getRechargements(filters: any = {}) {
    const response = await apiAdmin.get("/transactions/rechargements/", { params: filters })
    return response.data
  }

  async createRechargement(data: any) {
    const response = await api.post("/transactions/rechargements/", data)
    return response.data
  }
}

export const transactionsService = new TransactionsService()
