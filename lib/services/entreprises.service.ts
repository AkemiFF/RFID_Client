import api from "../api"

export interface Entreprise {
  id: string
  raison_sociale: string
  forme_juridique: string
  stat: string
  nif: string
  tva_intracom?: string
  telephone?: string
  email?: string
  adresse_siege: string
  date_creation_entreprise: string
  secteur_activite: string
  numero_rcs?: string
  statut: "ACTIVE" | "INACTIVE" | "SUSPENDUE"
  nombre_employes?: number
  nombre_cartes?: number
  chiffre_affaires?: string
  date_creation?: string
  date_modification?: string
}

export interface CreateEntrepriseData {
  raison_sociale: string
  forme_juridique: string
  stat: string
  nif: string
  tva_intracom?: string
  telephone?: string
  email?: string
  adresse_siege: string
  date_creation_entreprise: string
  secteur_activite: string
  numero_rcs?: string
}

export interface EntrepriseFilters {
  statut?: string
  secteur_activite?: string
  search?: string
  page?: number
  page_size?: number
}

export interface AssignCarteData {
  entreprise_id: string
  carte_ids: string[]
}

class EntreprisesService {
  async getEntreprises(filters: EntrepriseFilters = {}) {
    const response = await api.get("/identites/entreprises/", { params: filters })
    return response.data
  }

  async getEntreprise(id: string) {
    const response = await api.get(`/identites/entreprises/${id}/`)
    return response.data
  }

  async createEntreprise(data: CreateEntrepriseData) {
    const response = await api.post("/identites/entreprises/", data)
    return response.data
  }

  async updateEntreprise(id: string, data: Partial<CreateEntrepriseData>) {
    const response = await api.patch(`/identites/entreprises/${id}/`, data)
    return response.data
  }

  async deleteEntreprise(id: string) {
    await api.delete(`/identites/entreprises/${id}/`)
  }

  async getEntrepriseCartes(id: string) {
    const response = await api.get(`/identites/entreprises/${id}/cartes/`)
    return response.data
  }

  async assignCartes(data: AssignCarteData) {
    const response = await api.post("/identites/entreprises/assign-cartes/", data)
    return response.data
  }

  async unassignCarte(entrepriseId: string, carteId: string) {
    const response = await api.delete(`/identites/entreprises/${entrepriseId}/cartes/${carteId}/`)
    return response.data
  }

  async getEntrepriseStats(id: string) {
    const response = await api.get(`/identites/entreprises/${id}/stats/`)
    return response.data
  }

  async getEntrepriseTransactions(id: string, filters: any = {}) {
    const response = await api.get(`/identites/entreprises/${id}/transactions/`, { params: filters })
    return response.data
  }

  async suspendEntreprise(id: string, motif: string) {
    const response = await api.patch(`/identites/entreprises/${id}/`, {
      statut: "SUSPENDUE",
      motif_suspension: motif,
    })
    return response.data
  }

  async activerEntreprise(id: string) {
    const response = await api.patch(`/identites/entreprises/${id}/`, {
      statut: "ACTIVE",
    })
    return response.data
  }
}

export const entreprisesService = new EntreprisesService()
