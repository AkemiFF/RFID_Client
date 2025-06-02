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
  carte_ids?: string[] // Ajout du champ pour l'assignation
}

class IdentitesService {
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
            'nom', 'prenom', 'date_naissance', 'lieu_naissance',
            'nationalite', 'type_piece', 'numero_piece'
        ];
        
        const missingFields = requiredFields.filter(field => !data[field as keyof Personne]);
        if (missingFields.length > 0) {
            throw new Error(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
        }

        // Formater la date correctement
        const formattedData = {
            ...data,
            date_naissance: data.date_naissance 
                ? new Date(data.date_naissance).toISOString().split('T')[0]
                : null,
            carte_ids: data.carte_ids || []
        };

        const response = await apiAdmin.post("/identites/personnes/", formattedData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de la personne:", error);
        
        let errorMessage = "Une erreur est survenue";
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response: any };
            // Si le backend a renvoyé une erreur structurée
            if (err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
                if (err.response.data.details) {
                    errorMessage += `: ${JSON.stringify(err.response.data.details)}`;
                }
            } else {
                errorMessage = err.response.data || "Erreur serveur";
            }
        } else if (typeof error === "object" && error !== null && "request" in error) {
            errorMessage = "Pas de réponse du serveur";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
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
            'raison_sociale', 'forme_juridique', 'stat', 'nif',
            'adresse_siege', 'date_creation_entreprise', 'secteur_activite'
        ];
        
        const missingFields = requiredFields.filter(field => !data[field as keyof Entreprise]);
        if (missingFields.length > 0) {
            throw new Error(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
        }
        const formattedData = {
            ...data,
            date_naissance: data.date_creation_entreprise 
                ? new Date(data.date_creation_entreprise).toISOString().split('T')[0]
                : null,
            carte_ids: data.carte_ids || []
        };
        const response = await apiAdmin.post("/identites/entreprises/", {
            ...data,
            carte_ids: data.carte_ids || []
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de l'entreprise:", error);
        throw error;
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
