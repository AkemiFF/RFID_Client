"use client"

import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from "@/components/ui/Modal"
import StatusBadge from "@/components/ui/StatusBadge"
import {
  ArrowDownTrayIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  EnvelopeIcon,
  EyeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"

// Services API (assurez-vous que les chemins d'import sont corrects)

import {
  identitesService,
  type Personne as PersonneAPI,
  type Entreprise as EntrepriseAPI,
} from "@/lib/services/identites.service" // Ajustez le chemin
import { cartesService, type CarteDisponibleAPI } from "@/lib/services/cartes.service" // Ajustez le chemin

// Interface Client unifiée pour le frontend
interface Client {
  id: string
  type: "person" | "company"
  // Champs Personne
  prenom?: string // anciennement firstName
  nom?: string // anciennement lastName
  date_naissance?: string
  lieu_naissance?: string
  nationalite?: string
  profession?: string
  type_piece?: string // CNI, PASSEPORT, PERMIS
  numero_piece?: string
  // Champs Entreprise
  raison_sociale?: string // anciennement raisonSociale
  forme_juridique?: string
  stat?: string
  nif?: string
  tva_intracom?: string // anciennement tvaIntracom
  secteur_activite?: string // anciennement secteurActivite
  numero_rcs?: string // anciennement numeroRcs
  date_creation_entreprise?: string
  // Champs communs
  email: string
  telephone: string 
  adresse: string
  adresse_siege: string 
  ville?: string 
  code_postal?: string 
  // Champs du backend pour affichage
  cartes_rfid_details?: { id: string; code_uid: string; numero_serie: string; type_carte: string; statut: string }[]
  nombre_cartes?: number
  date_creation: string 
  statut: "ACTIF" | "INACTIF" | "SUSPENDU" | "ACTIVE" | "INACTIVE" | "SUSPENDUE"

}

// Interface pour les cartes disponibles dans le modal, alignée avec CarteDisponibleAPI
interface CarteDisponible extends CarteDisponibleAPI {}

const recentTransactions = [
  // Gardé pour l'exemple, à remplacer par des données réelles si besoin
  {
    clientName: "Jean Dupont",
    description: "Achat billet concert Coldplay",
    amount: "+€89.00",
    date: "15/07/2023 14:32",
    cardId: "RFID-7894",
    type: "ticket",
  },
  // ... autres transactions ...
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [cartesDisponibles, setCartesDisponibles] = useState<CarteDisponible[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [loadingCartes, setLoadingCartes] = useState(true)

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addStep, setAddStep] = useState(1)
  const [selectedCards, setSelectedCards] = useState<string[]>([]) 
  const [searchCards, setSearchCards] = useState("")
  const [clientType, setClientType] = useState<"person" | "company">("person")

  const initialNewClientState = {
    // Personne
    prenom: "",
    nom: "",
    date_naissance: "",
    lieu_naissance: "",
    nationalite: "Française", // Default
    profession: "",
    type_piece: "CNI", // Default
    numero_piece: "",
    // Entreprise
    raison_sociale: "",
    forme_juridique: "",
    stat: "",
    nif: "",
    tva_intracom: "",
    secteur_activite: "",
    numero_rcs: "",
    date_creation_entreprise: "",
    // Commun
    email: "",
    telephone: "",
    adresse: "", 
    status: "ACTIF", 
  }
  const [newClient, setNewClient] = useState<Partial<Client>>(initialNewClientState)

  const [filters, setFilters] = useState({
    status: "all",
    clientType: "all",
    sortBy: "registration", 
    search: "",
  })

  const fetchClients = async () => {
    setLoadingClients(true)
    try {
      const personnesPromise = identitesService.getPersonnes({
        // Ajoutez ici les filtres si l'API les supporte pour la recherche initiale
        // search: filters.search,
        // statut: filters.status !== "all" ? filters.status : undefined,
      })
      const entreprisesPromise = identitesService.getEntreprises({
        // search: filters.search,
        // statut: filters.status !== "all" ? filters.status : undefined,
      })

      const [personnesRes, entreprisesRes] = await Promise.all([personnesPromise, entreprisesPromise])

      const fetchedPersonnes: Client[] = (personnesRes.results || personnesRes).map((p: PersonneAPI) => ({
        ...p,
        id: p.id,
        type: "person",
    
      }))

      const fetchedEntreprises: Client[] = (entreprisesRes.results || entreprisesRes).map((e: EntrepriseAPI) => ({
        ...e,
        id: e.id,
        type: "company",
        adresse: e.adresse_siege, 
        // rfidCards: e.cartes_rfid_details?.map(c => c.code_uid) || [],
      }))

      let combinedClients = [...fetchedPersonnes, ...fetchedEntreprises]

      // Filtrage côté client (si non fait côté serveur pour la recherche globale)
      if (filters.search) {
        combinedClients = combinedClients.filter((client) =>
          `${client.prenom || ""} ${client.nom || ""} ${client.raison_sociale || ""} ${client.email || ""}`
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
        )
      }
      if (filters.status !== "all") {
        combinedClients = combinedClients.filter(
          (client) => client.statut.toUpperCase() === filters.status.toUpperCase(),
        )
      }
      if (filters.clientType !== "all") {
        combinedClients = combinedClients.filter((client) => client.type === filters.clientType)
      }

      // Tri (exemple simple, à améliorer)
      if (filters.sortBy === "registration") {
        combinedClients.sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
      } else if (filters.sortBy === "name") {
        combinedClients.sort((a, b) => {
          const nameA = a.type === "person" ? `${a.nom} ${a.prenom}` : a.raison_sociale
          const nameB = b.type === "person" ? `${b.nom} ${b.prenom}` : b.raison_sociale
          return nameA!.localeCompare(nameB!)
        })
      }

      setClients(combinedClients)
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error)
      // Gérer l'erreur, afficher un message à l'utilisateur
    } finally {
      setLoadingClients(false)
    }
  }

  const fetchCartesDisponibles = async () => {
    setLoadingCartes(true)
    try {
      const cartes = await cartesService.getCartesDisponibles()
      // Mapper si nécessaire pour correspondre à l'interface CarteDisponible du frontend
      setCartesDisponibles(
        cartes.map((c) => ({
          ...c,
          // Assurez-vous que les champs de l'interface CarteDisponible sont présents
          // Si plafond_quotidien etc. ne viennent pas de l'API, mettez des valeurs par défaut ou rendez les optionnels
          plafond_quotidien: c.plafond_quotidien || 0, // Exemple de valeur par défaut
          plafond_mensuel: c.plafond_mensuel || 0,
          solde_maximum: c.solde_maximum || 0,
          date_expiration: c.date_expiration || "N/A",
        })),
      )
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes disponibles:", error)
    } finally {
      setLoadingCartes(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [filters.search, filters.status, filters.clientType, filters.sortBy]) // Re-fetch si les filtres changent

  useEffect(() => {
    if (showAddModal) {
      fetchCartesDisponibles() // Charger les cartes quand le modal s'ouvre
    }
  }, [showAddModal])

  const openDetailsModal = (client: Client) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const openAddModal = () => {
    setShowAddModal(true)
    setAddStep(1)
    setClientType("person")
    setSelectedCards([])
    setNewClient({ ...initialNewClientState, statut: "ACTIF" })
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setAddStep(1)
    setSelectedCards([])
  }

  const nextStep = () => {
    // TODO: Ajouter validation des champs de l'étape 1 avant de passer à la suite
    if (addStep < 2) setAddStep(addStep + 1)
  }

  const prevStep = () => {
    if (addStep > 1) setAddStep(addStep - 1)
  }

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const handleClientTypeChange = (type: "person" | "company") => {
    setClientType(type)
    setNewClient((prev) => ({
      ...initialNewClientState, // Réinitialiser les champs spécifiques
      email: prev.email, // Conserver les champs communs si déjà saisis
      telephone: prev.telephone,
      adresse: prev.adresse,
      statut: type === "person" ? "ACTIF" : "ACTIVE", // Ajuster le statut par défaut
    }))
  }

  const handleSubmit = async () => {
    try {
        if (clientType === "person") {
          const formattedDate = newClient.date_naissance 
                ? new Date(newClient.date_naissance).toISOString().split('T')[0]
                : '';
            const personneData: Partial<PersonneAPI> = {
                nom: newClient.nom,
                prenom: newClient.prenom,
                date_naissance: formattedDate,
                lieu_naissance: newClient.lieu_naissance,
                nationalite: newClient.nationalite,
                profession: newClient.profession,
                type_piece: newClient.type_piece as PersonneAPI["type_piece"],
                numero_piece: newClient.numero_piece,
                telephone: newClient.telephone,
                email: newClient.email,
                adresse: newClient.adresse,
                statut: newClient.statut as PersonneAPI["statut"],
                carte_ids: selectedCards,
            };

            await identitesService.createPersonne(personneData);
            alert("Personne créée avec succès !");
            fetchClients();
            closeAddModal();
        } else {
          const formattedDate = newClient.date_creation_entreprise
                ? new Date(newClient.date_creation_entreprise).toISOString().split('T')[0]
                : '';
            const entrepriseData: Partial<EntrepriseAPI> = {
                raison_sociale: newClient.raison_sociale,
                forme_juridique: newClient.forme_juridique,
                stat: newClient.stat,
                nif: newClient.nif,
                tva_intracom: newClient.tva_intracom,
                telephone: newClient.telephone,
                email: newClient.email,
                adresse_siege: newClient.adresse,
                date_creation_entreprise: formattedDate,
                secteur_activite: newClient.secteur_activite,
                numero_rcs: newClient.numero_rcs,
                statut: newClient.statut as EntrepriseAPI["statut"],
                carte_ids: selectedCards,
            };

            await identitesService.createEntreprise(entrepriseData);
            alert("Entreprise créée avec succès !");
            fetchClients();
            closeAddModal();
        }
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);
        alert(`Erreur: ${error instanceof Error ? error.message : "Une erreur inconnue est survenue"}`);
    }
};



  const filteredCardsForModal = cartesDisponibles.filter(
    (carte) =>
      carte.code_uid.toLowerCase().includes(searchCards.toLowerCase()) ||
      carte.numero_serie.toLowerCase().includes(searchCards.toLowerCase()) ||
      carte.type_carte.toLowerCase().includes(searchCards.toLowerCase()),
  )

  if (loadingClients) {
    // Optionnel: Affichez un indicateur de chargement plus centralisé
    // return <Layout><div className="p-6 text-center">Chargement des clients...</div></Layout>;
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Clients</h1>
          <p className="text-gray-600">Gérez les clients et leurs cartes RFID associées</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={openAddModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Stats Cards - Remplacer par des données dynamiques si possible */}
      {/* ... vos stats cards ... */}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un client (nom, email...)"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.clientType}
                onChange={(e) => setFilters((prev) => ({ ...prev, clientType: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous types</option>
                <option value="person">Personnes</option>
                <option value="company">Entreprises</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="ACTIF">Actif (Personne)</option>
                <option value="INACTIF">Inactif (Personne)</option>
                <option value="SUSPENDU">Suspendu (Personne)</option>
                <option value="ACTIVE">Active (Entreprise)</option>
                <option value="INACTIVE">Inactive (Entreprise)</option>
                <option value="SUSPENDUE">Suspendue (Entreprise)</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="registration">Date d'inscription</option>
                <option value="name">Nom (A-Z)</option>
                {/* <option value="spending">Dépenses</option> */}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Liste des clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingClients && <div className="p-6 text-center">Chargement des données...</div>}
          {!loadingClients && clients.length === 0 && <div className="p-6 text-center">Aucun client trouvé.</div>}
          {!loadingClients && clients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cartes RFID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activité</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.type === "person" ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Personne</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Entreprise
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.type === "person" ? `${client.prenom} ${client.nom}` : client.raison_sociale}
                            </div>
                            <div className="text-sm text-gray-500">ID: {client.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.nombre_cartes || 0} carte(s)</div>
                        {client.cartes_rfid_details && client.cartes_rfid_details.length > 0 && (
                          <div className="text-sm text-gray-500" title={client.cartes_rfid_details[0].code_uid}>
                            {client.cartes_rfid_details[0].numero_serie.substring(0, 10)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.telephone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(client.date_creation).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.type === "person" ? client.profession : client.secteur_activite}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client.totalSpent || "N/A"}</div>
                        <div className="text-sm text-gray-500">{client.transactionCount || 0} transactions</div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={client.statut as any} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Button variant="ghost" size="sm" onClick={() => openDetailsModal(client)}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Modifier (Non implémenté)">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Gérer cartes (Non implémenté)">
                            <CreditCardIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination (à implémenter si nécessaire avec l'API) */}
        </CardContent>
      </Card>

      {/* Recent Activity & Client Distribution (gardé pour l'exemple) */}
      {/* ... vos sections Recent Activity et Client Distribution ... */}

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title={`Ajouter un nouveau client - Étape ${addStep}/2`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Progress Bar */}
          {/* ... votre progress bar ... */}

          {/* Step 1: Client Information */}
          {addStep === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <Label>Type de client *</Label>
                <div className="flex space-x-4">
                  <Button
                    variant={clientType === "person" ? "default" : "outline"}
                    onClick={() => handleClientTypeChange("person")}
                  >
                    Personne physique
                  </Button>
                  <Button
                    variant={clientType === "company" ? "default" : "outline"}
                    onClick={() => handleClientTypeChange("company")}
                  >
                    Entreprise
                  </Button>
                </div>
              </div>

              {clientType === "person" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        placeholder="Prénom"
                        value={newClient.prenom}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, prenom: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        placeholder="Nom"
                        value={newClient.nom}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, nom: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email_person">Email *</Label>
                      <Input
                        id="email_person"
                        type="email"
                        placeholder="Adresse email"
                        value={newClient.email}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone_person">Téléphone</Label>
                      <Input
                        id="telephone_person"
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={newClient.telephone}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, telephone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adresse_person">Adresse *</Label>
                    <Input
                      id="adresse_person"
                      placeholder="Adresse complète"
                      value={newClient.adresse}
                      onChange={(e) => setNewClient((prev) => ({ ...prev, adresse: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_naissance">Date de naissance *</Label>
                      <Input
                        id="date_naissance"
                        type="date"
                        value={newClient.date_naissance}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, date_naissance: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lieu_naissance">Lieu de naissance *</Label>
                      <Input
                        id="lieu_naissance"
                        placeholder="Lieu de naissance"
                        value={newClient.lieu_naissance}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, lieu_naissance: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nationalite">Nationalité *</Label>
                      <select
                        id="nationalite"
                        value={newClient.nationalite}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, nationalite: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Française">Française</option>
                        <option value="Malgache">Malgache</option>
                        <option value="Étrangère">Autre étrangère</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        placeholder="Profession"
                        value={newClient.profession}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, profession: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type_piece">Type de pièce *</Label>
                      <select
                        id="type_piece"
                        value={newClient.type_piece}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, type_piece: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="CNI">Carte Nationale d'Identité</option>
                        <option value="PASSEPORT">Passeport</option>
                        <option value="PERMIS">Permis de conduire</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="numero_piece">Numéro de pièce *</Label>
                      <Input
                        id="numero_piece"
                        placeholder="Numéro de pièce d'identité"
                        value={newClient.numero_piece}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, numero_piece: e.target.value }))}
                      />
                    </div>
                  </div>
                </> // Entreprise
              ) : (
                <>
                  <div>
                    <Label htmlFor="raison_sociale">Raison sociale *</Label>
                    <Input
                      id="raison_sociale"
                      placeholder="Raison sociale"
                      value={newClient.raison_sociale}
                      onChange={(e) => setNewClient((prev) => ({ ...prev, raison_sociale: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email_company">Email *</Label>
                      <Input
                        id="email_company"
                        type="email"
                        placeholder="Adresse email"
                        value={newClient.email}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone_company">Téléphone</Label>
                      <Input
                        id="telephone_company"
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={newClient.telephone}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, telephone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adresse_company">Adresse siège social *</Label>
                    <Input
                      id="adresse_company"
                      placeholder="Adresse complète du siège"
                      value={newClient.adresse}
                      onChange={(e) => setNewClient((prev) => ({ ...prev, adresse: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="forme_juridique">Forme juridique *</Label>
                      <Input
                        id="forme_juridique"
                        placeholder="SARL, SA, EURL..."
                        value={newClient.forme_juridique}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, forme_juridique: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stat">STAT *</Label>
                      <Input
                        id="stat"
                        placeholder="Numéro STAT"
                        value={newClient.stat}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, stat: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nif">NIF *</Label>
                      <Input
                        id="nif"
                        placeholder="Numéro NIF"
                        value={newClient.nif}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, nif: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tva_intracom">TVA Intracom</Label>
                      <Input
                        id="tva_intracom"
                        placeholder="TVA Intracom"
                        value={newClient.tva_intracom}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, tva_intracom: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="secteur_activite">Secteur d'activité *</Label>
                      <Input
                        id="secteur_activite"
                        placeholder="Secteur d'activité"
                        value={newClient.secteur_activite}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, secteur_activite: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero_rcs">Numéro RCS</Label>
                      <Input
                        id="numero_rcs"
                        placeholder="Numéro RCS"
                        value={newClient.numero_rcs}
                        onChange={(e) => setNewClient((prev) => ({ ...prev, numero_rcs: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date_creation_entreprise">Date de création entreprise *</Label>
                    <Input
                      id="date_creation_entreprise"
                      type="date"
                      value={newClient.date_creation_entreprise}
                      onChange={(e) => setNewClient((prev) => ({ ...prev, date_creation_entreprise: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Statut</Label>
                <select
                  value={newClient.statut}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, statut: e.target.value as Client["statut"] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {clientType === "person" ? (
                    <>
                      {" "}
                      <option value="ACTIF">Actif</option> <option value="INACTIF">Inactif</option>{" "}
                      <option value="SUSPENDU">Suspendu</option>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <option value="ACTIVE">Active</option> <option value="INACTIVE">Inactive</option>{" "}
                      <option value="SUSPENDUE">Suspendue</option>{" "}
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Card Assignment */}
          {addStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">Assigner des cartes RFID</h4>
                <div className="text-sm text-gray-500">{selectedCards.length} carte(s) sélectionnée(s)</div>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher une carte (UID, N° Série)..."
                  value={searchCards}
                  onChange={(e) => setSearchCards(e.target.value)}
                  className="pl-10"
                />
              </div>
              {loadingCartes && <div className="text-center py-8 text-gray-500">Chargement des cartes...</div>}
              {!loadingCartes && (
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredCardsForModal.map((carte) => (
                    <div
                      key={carte.id}
                      className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer ${selectedCards.includes(carte.id) ? "bg-purple-50 border-purple-200" : ""}`}
                      onClick={() => toggleCardSelection(carte.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCards.includes(carte.id)}
                            onChange={() => toggleCardSelection(carte.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{carte.code_uid}</span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${carte.type_carte === "STANDARD" ? "bg-blue-100 text-blue-800" : carte.type_carte === "PREMIUM" ? "bg-purple-100 text-purple-800" : "bg-yellow-100 text-yellow-800"}`}
                              >
                                {carte.type_carte}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              SN: {carte.numero_serie} • Expire: {carte.date_expiration || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* Les infos de plafond ne sont pas dans CarteRFIDSimpleSerializer, donc optionnelles */}
                          {carte.plafond_quotidien && (
                            <div className="text-sm text-gray-900">Plafond: €{carte.plafond_quotidien}/jour</div>
                          )}
                          {carte.solde_maximum && (
                            <div className="text-xs text-gray-500">Max: €{carte.solde_maximum}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loadingCartes && filteredCardsForModal.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCardIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune carte disponible trouvée pour les critères actuels.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {addStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={closeAddModal}>
                Annuler
              </Button>
              {addStep < 2 ? (
                <Button onClick={nextStep}>
                  Suivant
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Créer le client</Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Client Detail Modal (Adaptation des champs) */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Détails du client" size="lg">
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  {/* ... Avatar et nom/raison sociale ... */}
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedClient.type === "person"
                      ? `${selectedClient.prenom} ${selectedClient.nom}`
                      : selectedClient.raison_sociale}
                  </h4>
                  <p className="text-sm text-gray-500">ID: {selectedClient.id.substring(0, 12)}...</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedClient.statut as any} />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {selectedClient.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {selectedClient.telephone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {selectedClient.adresse}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Inscrit le {new Date(selectedClient.date_creation).toLocaleDateString()}
                  </div>

                  {selectedClient.type === "person" ? (
                    <>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Né le{" "}
                        {selectedClient.date_naissance
                          ? new Date(selectedClient.date_naissance).toLocaleDateString()
                          : "N/A"}{" "}
                        à {selectedClient.lieu_naissance || "N/A"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <GlobeAltIcon className="h-4 w-4 mr-2" />
                        {selectedClient.nationalite}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        {selectedClient.profession || "N/A"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-sm text-gray-500">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                        {selectedClient.forme_juridique}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <TagIcon className="h-4 w-4 mr-2" />
                        STAT: {selectedClient.stat} | NIF: {selectedClient.nif}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        {selectedClient.secteur_activite}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Cartes RFID associées ({selectedClient.nombre_cartes || 0})
                  </h5>
                  {selectedClient.cartes_rfid_details &&
                    selectedClient.cartes_rfid_details.map((card, index) => (
                      <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {card.code_uid} ({card.numero_serie})
                          </p>
                          <p className="text-xs text-gray-500">
                            {card.type_carte} - Statut: {card.statut}
                          </p>
                        </div>
                        {/* Actions sur les cartes (non implémenté) */}
                      </div>
                    ))}
                  {(!selectedClient.cartes_rfid_details || selectedClient.cartes_rfid_details.length === 0) && (
                    <p className="text-sm text-gray-500">Aucune carte RFID associée.</p>
                  )}
                </div>
                {/* Les dépenses et transactions nécessitent des données/endpoints supplémentaires */}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowDetailsModal(false)}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
