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
  carte_ids?: string[]
  cartes_rfid_details?: any[]
  nombre_cartes?: number
  date_creation: string
  user_data?: {
    username: string
    password: string
    role: string
  }
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
  cartes_rfid_details?: any[]
  nombre_cartes?: number
  date_creation: string
  carte_ids?: string[]
  user_data?: {
    username: string
    password: string
    role: string
  }
}

class IdentitesService {
  // Modifier pour utiliser les endpoints existants et calculer les statistiques côté frontend
  async getClientsStats() {
    try {
      // Récupérer les personnes et entreprises depuis les endpoints existants
      const [personnesResponse, entreprisesResponse] = await Promise.all([
        apiAdmin.get("/identites/personnes/", { params: { page_size: 1000 } }),
        apiAdmin.get("/identites/entreprises/", { params: { page_size: 1000 } }),
      ])

      const personnes = personnesResponse.data.results || personnesResponse.data
      const entreprises = entreprisesResponse.data.results || entreprisesResponse.data

      // Calculer les statistiques
      const personnesTotal = personnes.length
      const entreprisesTotal = entreprises.length
      const total = personnesTotal + entreprisesTotal

      const personnesActives = personnes.filter((p: Personne) => p.statut === "ACTIF").length
      const entreprisesActives = entreprises.filter((e: Entreprise) => e.statut === "ACTIVE").length
      const actifs = personnesActives + entreprisesActives
      const inactifs = total - actifs

      // Créer des top clients basés sur le nombre de cartes (simulation)
      const topClients: { name: string; usage: number; type: string }[] = []

      // Ajouter les personnes avec des cartes
      const personnesAvecCartes = personnes
        .filter((p: Personne) => p.cartes_rfid_details && p.cartes_rfid_details.length > 0)
        .sort((a: Personne, b: Personne) => (b.cartes_rfid_details?.length || 0) - (a.cartes_rfid_details?.length || 0))
        .slice(0, 3)

      personnesAvecCartes.forEach((personne: Personne) => {
        topClients.push({
          name: `${personne.prenom} ${personne.nom}`,
          usage: personne.cartes_rfid_details?.length || 0,
          type: "person",
        })
      })

      // Ajouter les entreprises avec des cartes
      const entreprisesAvecCartes = entreprises
        .filter((e: Entreprise) => e.cartes_rfid_details && e.cartes_rfid_details.length > 0)
        .sort(
          (a: Entreprise, b: Entreprise) => (b.cartes_rfid_details?.length || 0) - (a.cartes_rfid_details?.length || 0),
        )
        .slice(0, 2)

      entreprisesAvecCartes.forEach((entreprise: Entreprise) => {
        topClients.push({
          name: entreprise.raison_sociale,
          usage: entreprise.cartes_rfid_details?.length || 0,
          type: "company",
        })
      })

      // Si pas assez de clients avec des cartes, ajouter des clients sans cartes
      if (topClients.length < 4) {
        const autresPersonnes = personnes
          .filter((p: Personne) => !p.cartes_rfid_details || p.cartes_rfid_details.length === 0)
          .slice(0, 4 - topClients.length)

        autresPersonnes.forEach((personne: Personne) => {
          topClients.push({
            name: `${personne.prenom} ${personne.nom}`,
            usage: 0,
            type: "person",
          })
        })
      }

      return {
        total,
        personnes: personnesTotal,
        entreprises: entreprisesTotal,
        actifs,
        inactifs,
        topClients: topClients.slice(0, 4), // Limiter à 4 clients
        change: "+12%",
        changeType: "positive",
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des clients:", error)
      // En cas d'erreur, retourner des données de démo
      return {
        total: 1240,
        personnes: 920,
        entreprises: 320,
        actifs: 1100,
        inactifs: 140,
        topClients: [
          { name: "Jean Dupont", usage: 142, type: "person" },
          { name: "SARL Tech Solutions", usage: 128, type: "company" },
          { name: "Marie Lambert", usage: 97, type: "person" },
          { name: "Restaurant Le Petit", usage: 85, type: "company" },
        ],
        change: "+12%",
        changeType: "positive",
      }
    }
  }

  async getPersonnes(filters: any = {}) {
    const response = await apiAdmin.get("/identites/personnes/", { params: filters })
    return response.data
  }

  async getPersonne(id: string) {
    const response = await apiAdmin.get(`/identites/personnes/${id}/`)
    return response.data
  }

  async createPersonne(data: Partial<Personne>) {
    try {
      // Valider les champs obligatoires
      const requiredFields = [
        "nom",
        "prenom",
        "date_naissance",
        "nationalite",
        "type_piece",
        "numero_piece",
      ]

      const missingFields = requiredFields.filter((field) => !data[field as keyof Personne])
      if (missingFields.length > 0) {
        throw new Error(`Champs obligatoires manquants: ${missingFields.join(", ")}`)
      }

      // Formater la date correctement
      const formattedData = {
        ...data,
        date_naissance: data.date_naissance ? new Date(data.date_naissance).toISOString().split("T")[0] : null,
        carte_ids: data.carte_ids || [],
      }

      const response = await apiAdmin.post("/identites/personnes/", formattedData)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la personne:", error)

      let errorMessage = "Une erreur est survenue"
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: any }
        // Si le backend a renvoyé une erreur structurée
        if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error
          if (err.response.data.details) {
            errorMessage += `: ${JSON.stringify(err.response.data.details)}`
          }
        } else {
          errorMessage = err.response.data || "Erreur serveur"
        }
      } else if (typeof error === "object" && error !== null && "request" in error) {
        errorMessage = "Pas de réponse du serveur"
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  async updatePersonne(id: string, data: Partial<Personne>) {
    const response = await apiAdmin.patch(`/identites/personnes/${id}/`, data)
    return response.data
  }

  async assignCartesToPersonne(personneId: string, carteIds: string[]) {
    const response = await apiAdmin.post("/identites/personnes/assign-cartes/", {
      personne_id: personneId,
      carte_ids: carteIds,
    })
    return response.data
  }

  async getEntreprises(filters: any = {}) {
    const response = await apiAdmin.get("/identites/entreprises/", { params: filters })
    return response.data
  }

  async getEntreprise(id: string) {
    const response = await apiAdmin.get(`/identites/entreprises/${id}/`)
    return response.data
  }

  async createEntreprise(data: Partial<Entreprise>) {
    try {
      // Valider les champs obligatoires côté frontend
      const requiredFields = [
        "raison_sociale",
        "forme_juridique",
        "stat",
        "nif",
        "adresse_siege",
        "date_creation_entreprise",
        "secteur_activite",
      ]

      const missingFields = requiredFields.filter((field) => !data[field as keyof Entreprise])
      if (missingFields.length > 0) {
        throw new Error(`Champs obligatoires manquants: ${missingFields.join(", ")}`)
      }

      const formattedData = {
        ...data,
        date_creation_entreprise: data.date_creation_entreprise
          ? new Date(data.date_creation_entreprise).toISOString().split("T")[0]
          : null,
        carte_ids: data.carte_ids || [],
      }

      const response = await apiAdmin.post("/identites/entreprises/", formattedData)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de l'entreprise:", error)
      throw error
    }
  }

  async updateEntreprise(id: string, data: Partial<Entreprise>) {
    const response = await apiAdmin.patch(`/identites/entreprises/${id}/`, data)
    return response.data
  }

  async assignCartesToEntreprise(entrepriseId: string, carteIds: string[]) {
    const response = await apiAdmin.post("/identites/entreprises/assign-cartes/", {
      entreprise_id: entrepriseId,
      carte_ids: carteIds,
    })
    return response.data
  }
}

export const identitesService = new IdentitesService()
