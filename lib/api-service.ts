import { getAdminToken, getClientToken } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import axios from "axios"

// Créer une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})


apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = await getClientToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs d'authentification (401)
    // if (error.response && error.response.status === 401) {
    //   // Rediriger vers la page de connexion si on est côté client
    //   if (typeof window !== "undefined") {
    //     localStorage.removeItem("auth")
    //     window.location.href = "/login"
    //   }
    // }
    return Promise.reject(error)
  },
)



// Créer une instance axios pour l'admin avec la configuration de base
const apiAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL || `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiAdmin.interceptors.request.use(
  async (config) => {
    // Récupérer le token depuis localStorage (côté client uniquement)
    if (typeof window !== "undefined") {
      const token = await getAdminToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs de réponse
apiAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs d'authentification (401)
    // if (error.response && error.response.status === 401) {
    //   // Rediriger vers la page de connexion si on est côté client
    //   if (typeof window !== "undefined") {
    //     localStorage.removeItem("auth")
    //     window.location.href = "/login"
    //   }
    // }
    return Promise.reject(error)
  },
)

export { apiAdmin }
export default apiClient