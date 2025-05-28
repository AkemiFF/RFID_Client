import clsx from "clsx"

interface StatusBadgeProps {
  status: string
  type?: "carte" | "transaction" | "notification"
}

const statusConfig = {
  carte: {
    ACTIVE: { label: "Actif", className: "status-active" },
    BLOQUEE: { label: "Bloquée", className: "status-blocked" },
    EXPIREE: { label: "Expirée", className: "status-inactive" },
    PERDUE: { label: "Perdue", className: "status-inactive" },
    VOLEE: { label: "Volée", className: "status-blocked" },
  },
  transaction: {
    EN_COURS: { label: "En cours", className: "status-pending" },
    VALIDEE: { label: "Validée", className: "status-active" },
    ECHOUEE: { label: "Échouée", className: "status-inactive" },
    ANNULEE: { label: "Annulée", className: "status-inactive" },
  },
  notification: {
    EN_ATTENTE: { label: "En attente", className: "status-pending" },
    ENVOYE: { label: "Envoyé", className: "status-active" },
    ECHEC: { label: "Échec", className: "status-inactive" },
    LU: { label: "Lu", className: "status-active" },
  },
}

export default function StatusBadge({ status, type = "carte" }: StatusBadgeProps) {
  const config = statusConfig[type][status as keyof (typeof statusConfig)[typeof type]]

  if (!config) {
    return <span className="status-badge bg-gray-100 text-gray-800">{status}</span>
  }

  return <span className={clsx("status-badge", config.className)}>{config.label}</span>
}
