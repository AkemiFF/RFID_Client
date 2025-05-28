import api from "@/lib/api"

export interface ClientUser {
  id: number
  prenom: string
  nom: string
  email: string
  telephone: string
  dateNaissance: string
  adresse: string
  statut: "actif" | "suspendu" | "bloque"
  cartes: ClientCard[]
}

export interface ClientCard {
  id: number
  numero: string
  type: string
  solde: number
  statut: "active" | "bloquee" | "expiree"
  dateExpiration: string
  plafondJournalier: number
  plafondMensuel: number
}

export interface LoginCredentials {
  email?: string
  cardNumber?: string
  password: string
}

export interface Transaction {
  id: number
  type: "credit" | "debit"
  montant: number
  description: string
  date: string
  commercant?: string
  reference: string
  statut: "reussie" | "echouee" | "en_attente"
}

class ClientAuthService {
  async login(credentials: LoginCredentials): Promise<{ user: ClientUser; token: string }> {
    try {
      const response = await api.post("/client/auth/login", credentials)
      return response.data
    } catch (error) {
      throw new Error("Échec de la connexion")
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/client/auth/logout")
      localStorage.removeItem("client_token")
      localStorage.removeItem("client_user")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  async getCurrentUser(): Promise<ClientUser> {
    try {
      const response = await api.get("/client/auth/me")
      return response.data
    } catch (error) {
      throw new Error("Impossible de récupérer les informations utilisateur")
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await api.post("/client/auth/refresh")
      return response.data.token
    } catch (error) {
      throw new Error("Impossible de renouveler le token")
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post("/client/auth/change-password", {
        currentPassword,
        newPassword,
      })
    } catch (error) {
      throw new Error("Impossible de changer le mot de passe")
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post("/client/auth/forgot-password", { email })
    } catch (error) {
      throw new Error("Impossible d'envoyer l'email de réinitialisation")
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/client/auth/reset-password", { token, newPassword })
    } catch (error) {
      throw new Error("Impossible de réinitialiser le mot de passe")
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("client_token")
  }

  getStoredUser(): ClientUser | null {
    const userData = localStorage.getItem("client_user")
    return userData ? JSON.parse(userData) : null
  }

  getStoredToken(): string | null {
    return localStorage.getItem("client_token")
  }
}

export const clientAuthService = new ClientAuthService()
