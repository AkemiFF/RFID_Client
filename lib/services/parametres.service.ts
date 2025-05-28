import { apiClient } from "./api"

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  avatar: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  smsEnabled: boolean
  appAuthEnabled: boolean
  lastPasswordChange: string
}

export interface NotificationSettings {
  emailTransactions: boolean
  emailPromotions: boolean
  emailNews: boolean
  pushTransactions: boolean
  pushSecurity: boolean
  pushPromotions: boolean
  smsImportant: boolean
  smsSecurity: boolean
}

export interface PaymentSettings {
  defaultMethod: string
  dailyLimit: number
  transactionLimit: number
  autoPayments: boolean
  autoNotifications: boolean
}

export interface Device {
  id: string
  name: string
  type: "laptop" | "mobile" | "tablet"
  location: string
  lastSeen: string
  current: boolean
  userAgent: string
  ipAddress: string
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
}

class ParametresService {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get("/api/parametres/profile/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error)
      throw error
    }
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.patch("/api/parametres/profile/", profile)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      throw error
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await apiClient.post("/api/parametres/upload-avatar/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.avatar_url
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'avatar:", error)
      throw error
    }
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await apiClient.get("/api/parametres/security/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres de sécurité:", error)
      throw error
    }
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    try {
      const response = await apiClient.patch("/api/parametres/security/", settings)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres de sécurité:", error)
      throw error
    }
  }

  async changePassword(request: PasswordChangeRequest): Promise<boolean> {
    try {
      const response = await apiClient.post("/api/parametres/change-password/", {
        current_password: request.currentPassword,
        new_password: request.newPassword,
      })
      return response.data.success
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error)
      throw error
    }
  }

  async enableTwoFactor(): Promise<{
    qrCode: string
    backupCodes: string[]
  }> {
    try {
      const response = await apiClient.post("/api/parametres/enable-2fa/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de l'activation de la 2FA:", error)
      throw error
    }
  }

  async disableTwoFactor(code: string): Promise<boolean> {
    try {
      const response = await apiClient.post("/api/parametres/disable-2fa/", {
        verification_code: code,
      })
      return response.data.success
    } catch (error) {
      console.error("Erreur lors de la désactivation de la 2FA:", error)
      throw error
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiClient.get("/api/parametres/notifications/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres de notification:", error)
      throw error
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await apiClient.patch("/api/parametres/notifications/", settings)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres de notification:", error)
      throw error
    }
  }

  async getPaymentSettings(): Promise<PaymentSettings> {
    try {
      const response = await apiClient.get("/api/parametres/payment/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres de paiement:", error)
      throw error
    }
  }

  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
    try {
      const response = await apiClient.patch("/api/parametres/payment/", settings)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres de paiement:", error)
      throw error
    }
  }

  async getDevices(): Promise<Device[]> {
    try {
      const response = await apiClient.get("/api/parametres/devices/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des appareils:", error)
      throw error
    }
  }

  async disconnectDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/api/parametres/disconnect-device/${deviceId}/`)
      return response.data.success
    } catch (error) {
      console.error("Erreur lors de la déconnexion de l'appareil:", error)
      throw error
    }
  }

  async getActiveSessions(): Promise<Device[]> {
    try {
      const response = await apiClient.get("/api/parametres/active-sessions/")
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions actives:", error)
      throw error
    }
  }

  async revokeAllSessions(): Promise<boolean> {
    try {
      const response = await apiClient.post("/api/parametres/revoke-all-sessions/")
      return response.data.success
    } catch (error) {
      console.error("Erreur lors de la révocation de toutes les sessions:", error)
      throw error
    }
  }
}

export const parametresService = new ParametresService()
