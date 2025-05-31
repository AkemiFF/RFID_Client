"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import Layout from "@/components/layout/Layout"
import Modal from "@/components/ui/Modal"
import StatusBadge from "@/components/ui/StatusBadge"
import { cartesService, type CarteRFID, type CarteFilters } from "@/lib/services/cartes.service"
import { identitesService } from "@/lib/services/identites.service"
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export default function CardsPage() {
  const [filters, setFilters] = useState<CarteFilters>({
    page: 1,
    page_size: 10,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CarteRFID | null>(null)

  const {
    data: cartes,
    isLoading,
    refetch,
  } = useQuery(["cartes", filters], () => cartesService.getCartes(filters), { keepPreviousData: true })

  const { data: personnes } = useQuery("personnes", () => identitesService.getPersonnes({ page_size: 100 }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Fonction pour filtrer les cartes côté frontend
  const filterCartes = (cartes: CarteRFID[], filters: CarteFilters) => {
    if (!cartes) return cartes

    return cartes.filter((carte) => {
      // Filtre par statut
      if (filters.statut && carte.statut !== filters.statut) {
        return false
      }

      // Filtre par type de carte
      if (filters.type_carte && carte.type_carte !== filters.type_carte) {
        return false
      }

      // Filtre par assignation
      if (filters.assignation) {
        const isAssigned = carte.personne || carte.entreprise
        if (filters.assignation === "assigned" && !isAssigned) {
          return false
        }
        if (filters.assignation === "unassigned" && isAssigned) {
          return false
        }
      }

      // Filtre par recherche
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = [
          carte.numero_serie,
          carte.code_uid,
          carte.personne?.nom,
          carte.personne?.prenom,
          carte.personne?.email,
          carte.entreprise?.raison_sociale,
          carte.entreprise?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        if (!searchableText.includes(searchTerm)) {
          return false
        }
      }

      return true
    })
  }

  const handleCreateCard = async (data: any) => {
    try {
      // Vérifier s'il y a une assignation
      const hasAssignment = data.personne || data.entreprise

      const cardData = {
        ...data,
        // Champs financiers avec valeurs par défaut
        plafond_quotidien: Number.parseFloat(data.plafond_quotidien) || 1000,
        plafond_mensuel: Number.parseFloat(data.plafond_mensuel) || 5000,
        solde_maximum: Number.parseFloat(data.solde_maximum) || 10000,

        // Champs requis générés automatiquement
        code_uid: `UID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        numero_serie: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        version_securite: "v1.0",
        cle_chiffrement: `KEY_${Math.random().toString(36).substr(2, 32)}`,

        // Statut par défaut INACTIVE, ACTIVE seulement si assignée
        statut: hasAssignment ? "ACTIVE" : "INACTIVE",

        // Autres champs
        lieu_emission: "Agence principale",

        // Nettoyer les champs vides pour éviter les erreurs
        personne: data.personne || null,
        entreprise: data.entreprise || null,
      }

      await cartesService.createCarte(cardData)
      toast.success(`Carte créée avec succès ${hasAssignment ? "et activée" : "(statut: inactive)"}`)
      setIsCreateModalOpen(false)
      reset()
      refetch()
    } catch (error: any) {
      console.error("Erreur lors de la création:", error)
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || "Erreur lors de la création de la carte"
      toast.error(errorMessage)
    }
  }

  const handleBlockCard = async (cardId: string) => {
    try {
      await cartesService.blockerCarte(cardId, "Blocage manuel")
      toast.success("Carte bloquée avec succès")
      refetch()
    } catch (error) {
      toast.error("Erreur lors du blocage de la carte")
    }
  }

  const handleActivateCard = async (cardId: string) => {
    try {
      await cartesService.activerCarte(cardId)
      toast.success("Carte activée avec succès")
      refetch()
    } catch (error) {
      toast.error("Erreur lors de l'activation de la carte")
    }
  }

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "STANDARD":
        return "purple"
      case "PREMIUM":
        return "blue"
      case "ENTREPRISE":
        return "green"
      default:
        return "gray"
    }
  }

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case "STANDARD":
        return "Standard"
      case "PREMIUM":
        return "Premium"
      case "ENTREPRISE":
        return "Entreprise"
      default:
        return type
    }
  }

  // Appliquer les filtres aux cartes
  const filteredCartes = filterCartes(cartes?.results || [], filters)

  return (
    <Layout searchPlaceholder="Rechercher des cartes...">
      <div className="animate-fade-in">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des cartes RFID</h1>
            <p className="text-gray-600">Gérez toutes les cartes RFID associées à votre plateforme</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Créer une carte
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={filters.statut || ""}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value || undefined })}
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="BLOQUEE">Bloquée</option>
                <option value="EXPIREE">Expirée</option>
                <option value="PERDUE">Perdue</option>
                <option value="VOLEE">Volée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de carte</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={filters.type_carte || ""}
                onChange={(e) => setFilters({ ...filters, type_carte: e.target.value || undefined })}
              >
                <option value="">Tous les types</option>
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
                <option value="ENTREPRISE">Entreprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignation</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={filters.assignation || ""}
                onChange={(e) => setFilters({ ...filters, assignation: e.target.value || undefined })}
              >
                <option value="">Toutes les cartes</option>
                <option value="assigned">Cartes assignées</option>
                <option value="unassigned">Cartes non assignées</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Numéro de série, nom..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ page: 1, page_size: 10 })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50 transition"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Affichage du nombre de résultats filtrés */}
          <div className="mt-3 text-sm text-gray-600">
            {filteredCartes.length} carte(s) trouvée(s) sur {cartes?.results?.length || 0} au total
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Chargement...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro de carte
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titulaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Solde
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date création
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCartes.map((carte: CarteRFID) => (
                      <tr key={carte.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-10 w-10 bg-${getCardTypeColor(carte.type_carte)}-100 rounded-full flex items-center justify-center text-${getCardTypeColor(carte.type_carte)}-600`}
                            >
                              <CreditCardIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                •••• •••• •••• {carte.numero_serie.slice(-4)}
                              </div>
                              <div className="text-sm text-gray-500">{carte.numero_serie}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {carte.personne
                              ? `${carte.personne.prenom || ''} ${carte.personne.nom || ''}`.trim() || "Nom non renseigné"
                              : carte.entreprise
                                ? carte.entreprise.raison_sociale
                                : "Non assigné"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {carte.personne?.email || carte.entreprise?.email || (
                              <span className="italic text-gray-400">En attente d'assignation</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            Ar{Number(carte.solde || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getCardTypeColor(carte.type_carte)}-100 text-${getCardTypeColor(carte.type_carte)}-800`}
                          >
                            {getCardTypeLabel(carte.type_carte)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={carte.statut} type="carte" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(carte.date_emission).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedCard(carte)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir les détails"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            {!carte.personne && !carte.entreprise && (
                              <button className="text-green-600 hover:text-green-900" title="Assigner à une personne">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            )}
                            <button className="text-purple-600 hover:text-purple-900" title="Modifier">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            {carte.statut === "ACTIVE" ? (
                              <button
                                onClick={() => handleBlockCard(carte.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Bloquer la carte"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateCard(carte.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Activer la carte"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!cartes?.previous}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!cartes?.next}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de{" "}
                      <span className="font-medium">{((filters.page || 1) - 1) * (filters.page_size || 10) + 1}</span> à{" "}
                      <span className="font-medium">
                        {Math.min((filters.page || 1) * (filters.page_size || 10), cartes?.count || 0)}
                      </span>{" "}
                      sur <span className="font-medium">{cartes?.count || 0}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        disabled={!cartes?.previous}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-purple-50 text-sm font-medium text-purple-600">
                        {filters.page || 1}
                      </span>
                      <button
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        disabled={!cartes?.next}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Card Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une nouvelle carte RFID"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreateCard)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de carte</label>
            <select
              {...register("type_carte", { required: "Le type de carte est requis" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Sélectionnez un type</option>
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="ENTREPRISE">Entreprise</option>
            </select>
            {errors.type_carte && <p className="mt-1 text-sm text-red-600">{errors.type_carte.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personne (optionnel)
              <span className="text-xs text-gray-500 font-normal ml-2">- Peut être assignée ultérieurement</span>
            </label>
            <select
              {...register("personne")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Aucune assignation pour le moment</option>
              {personnes?.results?.map((personne: any) => (
                <option key={personne.id} value={personne.id}>
                  {personne.prenom} {personne.nom} ({personne.email})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Si aucune personne n'est sélectionnée, la carte sera créée avec le statut "Inactive" et devra être
              assignée avant activation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plafond quotidien (Ar)</label>
              <input
                type="number"
                step="0.01"
                {...register("plafond_quotidien")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="1000.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plafond mensuel (Ar)</label>
              <input
                type="number"
                step="0.01"
                {...register("plafond_mensuel")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="5000.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input
              type="date"
              {...register("date_expiration", { required: "La date d'expiration est requise" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.date_expiration && (
              <p className="mt-1 text-sm text-red-600">{errors.date_expiration.message as string}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Créer la carte
            </button>
          </div>
        </form>
      </Modal>

      {/* Card Details Modal */}
      {selectedCard && (
        <Modal isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} title="Détails de la carte" size="xl">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de la carte</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Numéro de série</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.numero_serie}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Code UID</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.code_uid}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900">{getCardTypeLabel(selectedCard.type_carte)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Statut</dt>
                    <dd>
                      <StatusBadge status={selectedCard.statut} type="carte" />
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations financières</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Solde actuel</dt>
                    <dd className="text-sm text-gray-900 font-semibold">
                      Ar{Number(selectedCard.solde || 0).toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Plafond quotidien</dt>
                    <dd className="text-sm text-gray-900">Ar{Number(selectedCard.plafond_quotidien || 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Plafond mensuel</dt>
                    <dd className="text-sm text-gray-900">Ar{Number(selectedCard.plafond_mensuel || 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre de transactions</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.nombre_transactions}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Titulaire</h3>
              {selectedCard.personne ? (
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedCard.personne.prenom} {selectedCard.personne.nom}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.personne.email}</dd>
                  </div>
                </dl>
              ) : selectedCard.entreprise ? (
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Raison sociale</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.entreprise.raison_sociale}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedCard.entreprise.email}</dd>
                  </div>
                </dl>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Aucun titulaire assigné</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Cette carte est inactive et doit être assignée à une personne ou une entreprise avant d'être
                    activée.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
              {selectedCard.statut === "ACTIVE" ? (
                <button
                  onClick={() => {
                    handleBlockCard(selectedCard.id)
                    setSelectedCard(null)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Bloquer la carte
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateCard(selectedCard.id)
                    setSelectedCard(null)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  disabled={!selectedCard.personne && !selectedCard.entreprise}
                  title={
                    !selectedCard.personne && !selectedCard.entreprise ? "Assignez d'abord la carte à une personne" : ""
                  }
                >
                  Activer la carte
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
