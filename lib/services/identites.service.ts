import api from "../api"
import { apiAdmin } from "../api-service"

export interface Personne {
  id: string
  nom: string
  prenom: string
  date_naissance: string
  lieu_naissance: string
  nationalite: string
  profession?: string
  type_piece: "CNI" | "PASSEPORT" | "PERMIS"
  numero_piece: string
  telephone?: string
  email?: string
  adresse?: string
  statut: "ACTIF" | "INACTIF" | "SUSPENDU"
}

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
}

class IdentitesService {
  async getPersonnes(filters: any = {}) {
    const response = await apiAdmin.get("/identites/personnes/", { params: filters })
    return response.data
  }

  async getPersonne(id: string) {
    const response = await api.get(`/identites/personnes/${id}/`)
    return response.data
  }

  async createPersonne(data: Partial<Personne>) {
    const response = await api.post("/identites/personnes/", data)
    return response.data
  }

  async updatePersonne(id: string, data: Partial<Personne>) {
    const response = await api.patch(`/identites/personnes/${id}/`, data)
    return response.data
  }

  async getEntreprises(filters: any = {}) {
    const response = await api.get("/identites/entreprises/", { params: filters })
    return response.data
  }

  async getEntreprise(id: string) {
    const response = await api.get(`/identites/entreprises/${id}/`)
    return response.data
  }

  async createEntreprise(data: Partial<Entreprise>) {
    const response = await api.post("/identites/entreprises/", data)
    return response.data
  }

  async updateEntreprise(id: string, data: Partial<Entreprise>) {
    const response = await api.patch(`/identites/entreprises/${id}/`, data)
    return response.data
  }
}

export const identitesService = new IdentitesService()
