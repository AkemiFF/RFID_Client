import api from "../api"

export interface Notification {
  id: string
  destinataire: string
  type_notification: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  canal: "EMAIL" | "SMS" | "PUSH" | "INTERNE"
  titre: string
  message: string
  priorite: "BASSE" | "NORMALE" | "HAUTE" | "CRITIQUE"
  statut: "EN_ATTENTE" | "ENVOYE" | "ECHEC" | "LU"
  date_creation: string
  date_envoi?: string
  date_lecture?: string
}

class NotificationsService {
  async getNotifications(filters: any = {}) {
    const response = await api.get("/notifications/notifications/", { params: filters })
    return response.data
  }

  async createNotification(data: Partial<Notification>) {
    const response = await api.post("/notifications/notifications/", data)
    return response.data
  }

  async markAsRead(notificationIds: string[]) {
    const response = await api.post("/notifications/notifications/mark_as_read/", {
      notification_ids: notificationIds,
    })
    return response.data
  }

  async resendNotification(id: string) {
    const response = await api.post(`/notifications/notifications/${id}/resend/`)
    return response.data
  }
}

export const notificationsService = new NotificationsService()
