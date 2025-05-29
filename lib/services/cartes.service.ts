import api from "@/lib/api"
import { apiAdmin } from "../api-service"

export interface CarteRFID {
  id: string
  code_uid: string
  numero_serie: string
  type_carte: "STANDARD" | "PREMIUM" | "ENTREPRISE"
  solde: number
  plafond_quotidien: number
  plafond_mensuel: number
  solde_maximum: number
  statut: "ACTIVE" | "BLOQUEE" | "EXPIREE" | "PERDUE" | "VOLEE" | "INACTIVE"
  motif_blocage?: string
  date_emission: string
  date_activation?: string
  date_expiration: string
  lieu_emission: string
  derniere_utilisation?: string
  nombre_transactions: number
  personne?: {
    id: string
    nom: string
    prenom: string
    email: string
  }
  entreprise?: {
    id: string
    raison_sociale: string
    email: string
  }
}

export interface CreateCarteData {
  personne?: string
  entreprise?: string
  type_carte: string
  plafond_quotidien: number
  plafond_mensuel: number
  solde_maximum: number
  date_expiration: string
  lieu_emission: string
}

export interface CarteFilters {
  statut?: string
  type_carte?: string
  date_creation?: string
  search?: string
  page?: number
  page_size?: number
  assignation?: string  
}

class CartesService {
    async getCartes(filters: CarteFilters = {}) {
    // Copier les filtres pour ne pas modifier l'objet original
    const apiFilters = { ...filters }

    // Supprimer le filtre d'assignation car il est géré côté client
    delete apiFilters.assignation

    const response = await apiAdmin.get("/cartes/cartes/", { params: apiFilters })
    return response.data
  }

  async getCarte(id: string) {
    const response = await apiAdmin.get(`/cartes/cartes/${id}/`)
    return response.data
  }

  async createCarte(data: CreateCarteData) {
    const response = await apiAdmin.post("/cartes/cartes/", data)
    return response.data
  }

  async updateCarte(id: string, data: Partial<CreateCarteData>) {
    const response = await apiAdmin.patch(`/cartes/cartes/${id}/`, data)
    return response.data
  }

  async deleteCarte(id: string) {
    await apiAdmin.delete(`/cartes/cartes/${id}/`)
  }

  async blockerCarte(id: string, motif: string) {
    const response = await apiAdmin.patch(`/cartes/cartes/${id}/`, {
      statut: "BLOQUEE",
      motif_blocage: motif,
    })
    return response.data
  }

  async activerCarte(id: string) {
    const response = await apiAdmin.patch(`/cartes/cartes/${id}/`, {
      statut: "ACTIVE",
      date_activation: new Date().toISOString(),
    })
    return response.data
  }

  async getHistoriqueStatuts(carteId: string) {
    const response = await apiAdmin.get(`/cartes/historique-statuts/?carte=${carteId}`)
    return response.data
  }
}
export const cartesService = new CartesService()
