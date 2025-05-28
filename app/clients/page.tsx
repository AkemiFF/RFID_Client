"use client"

import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/Modal"
import StatusBadge from "@/components/ui/StatusBadge"
import {
  PlusIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  CreditCardIcon,
  CurrencyEuroIcon,
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  ReceiptRefundIcon,
  ClockIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  profession: string
  typePiece: string
  numeroPiece: string
  rfidCards: string[]
  registrationDate: string
  totalSpent: string
  transactionCount: number
  status: "active" | "inactive" | "pending"
}

interface CarteDisponible {
  id: string
  code_uid: string
  numero_serie: string
  type_carte: "STANDARD" | "PREMIUM" | "ENTREPRISE"
  plafond_quotidien: number
  plafond_mensuel: number
  solde_maximum: number
  date_expiration: string
  statut: "DISPONIBLE" | "ACTIVE" | "BLOQUEE"
}

const clients: Client[] = [
  {
    id: "CLI-789456",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "12 Rue de la Paix",
    city: "Paris",
    postalCode: "75001",
    dateNaissance: "15/03/1985",
    lieuNaissance: "Paris",
    nationalite: "Française",
    profession: "Ingénieur",
    typePiece: "CNI",
    numeroPiece: "123456789",
    rfidCards: ["RFID-7894-5612-3456"],
    registrationDate: "15/03/2022",
    totalSpent: "€1,245.60",
    transactionCount: 42,
    status: "active",
  },
  {
    id: "CLI-321654",
    firstName: "Marie",
    lastName: "Lambert",
    email: "marie.lambert@email.com",
    phone: "+33 6 98 76 54 32",
    address: "45 Avenue des Champs",
    city: "Lyon",
    postalCode: "69001",
    dateNaissance: "22/08/1990",
    lieuNaissance: "Lyon",
    nationalite: "Française",
    profession: "Médecin",
    typePiece: "CNI",
    numeroPiece: "987654321",
    rfidCards: ["RFID-3216-5498-7654"],
    registrationDate: "22/08/2021",
    totalSpent: "€876.30",
    transactionCount: 28,
    status: "active",
  },
  {
    id: "CLI-987123",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@email.com",
    phone: "+33 6 45 67 89 01",
    address: "78 Rue de la République",
    city: "Marseille",
    postalCode: "13001",
    dateNaissance: "05/09/1988",
    lieuNaissance: "Marseille",
    nationalite: "Française",
    profession: "Avocat",
    typePiece: "PASSEPORT",
    numeroPiece: "12AB34567",
    rfidCards: ["RFID-9871-2365-4789"],
    registrationDate: "05/09/2022",
    totalSpent: "€342.50",
    transactionCount: 15,
    status: "inactive",
  },
]

const cartesDisponibles: CarteDisponible[] = [
  {
    id: "1",
    code_uid: "RFID-1234-5678-9012",
    numero_serie: "SN001234567",
    type_carte: "STANDARD",
    plafond_quotidien: 100,
    plafond_mensuel: 2000,
    solde_maximum: 500,
    date_expiration: "12/2025",
    statut: "DISPONIBLE",
  },
  {
    id: "2",
    code_uid: "RFID-2345-6789-0123",
    numero_serie: "SN002345678",
    type_carte: "PREMIUM",
    plafond_quotidien: 200,
    plafond_mensuel: 5000,
    solde_maximum: 1000,
    date_expiration: "06/2026",
    statut: "DISPONIBLE",
  },
  {
    id: "3",
    code_uid: "RFID-3456-7890-1234",
    numero_serie: "SN003456789",
    type_carte: "ENTREPRISE",
    plafond_quotidien: 500,
    plafond_mensuel: 10000,
    solde_maximum: 2000,
    date_expiration: "09/2027",
    statut: "DISPONIBLE",
  },
  {
    id: "4",
    code_uid: "RFID-4567-8901-2345",
    numero_serie: "SN004567890",
    type_carte: "STANDARD",
    plafond_quotidien: 100,
    plafond_mensuel: 2000,
    solde_maximum: 500,
    date_expiration: "03/2025",
    statut: "DISPONIBLE",
  },
]

const recentTransactions = [
  {
    clientName: "Jean Dupont",
    description: "Achat billet concert Coldplay",
    amount: "+€89.00",
    date: "15/07/2023 14:32",
    cardId: "RFID-7894",
    type: "ticket",
  },
  {
    clientName: "Marie Lambert",
    description: "Achat billet cinéma Avengers 5",
    amount: "+€12.50",
    date: "22/08/2023 20:15",
    cardId: "RFID-3216",
    type: "cinema",
  },
  {
    clientName: "Pierre Martin",
    description: "Remboursement billet théâtre",
    amount: "-€45.00",
    date: "05/09/2023 19:30",
    cardId: "RFID-9871",
    type: "refund",
  },
]

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addStep, setAddStep] = useState(1)
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [searchCards, setSearchCards] = useState("")
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "Française",
    profession: "",
    typePiece: "CNI",
    numeroPiece: "",
    status: "active",
  })
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "registration",
    search: "",
  })

  const openDetailsModal = (client: Client) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const openAddModal = () => {
    setShowAddModal(true)
    setAddStep(1)
    setSelectedCards([])
    setNewClient({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      dateNaissance: "",
      lieuNaissance: "",
      nationalite: "Française",
      profession: "",
      typePiece: "CNI",
      numeroPiece: "",
      status: "active",
    })
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setAddStep(1)
    setSelectedCards([])
  }

  const nextStep = () => {
    if (addStep < 2) setAddStep(addStep + 1)
  }

  const prevStep = () => {
    if (addStep > 1) setAddStep(addStep - 1)
  }

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const handleSubmit = () => {
    console.log("Nouveau client:", newClient)
    console.log("Cartes sélectionnées:", selectedCards)
    // Ici, vous ajouteriez la logique pour créer le client et assigner les cartes
    closeAddModal()
  }

  const filteredClients = clients.filter((client) => {
    if (filters.status !== "all" && client.status !== filters.status) return false
    if (
      filters.search &&
      !`${client.firstName} ${client.lastName} ${client.email}`.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    return true
  })

  const filteredCards = cartesDisponibles.filter(
    (carte) =>
      carte.code_uid.toLowerCase().includes(searchCards.toLowerCase()) ||
      carte.numero_serie.toLowerCase().includes(searchCards.toLowerCase()) ||
      carte.type_carte.toLowerCase().includes(searchCards.toLowerCase()),
  )

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients actifs</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">1,248</p>
                <p className="text-xs text-green-600 mt-1">
                  <span className="font-medium">+5.2%</span> ce mois
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nouveaux clients</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">87</p>
                <p className="text-xs text-green-600 mt-1">
                  <span className="font-medium">+12.4%</span> ce mois
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cartes assignées</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">1,156</p>
                <p className="text-xs text-red-600 mt-1">
                  <span className="font-medium">-2.1%</span> ce mois
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dépenses moyennes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">€142.50</p>
                <p className="text-xs text-green-600 mt-1">
                  <span className="font-medium">+8.7%</span> ce mois
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CurrencyEuroIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un client..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="registration">Date d'inscription</option>
                <option value="name">Nom (A-Z)</option>
                <option value="spending">Dépenses</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Liste des clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.rfidCards.length} carte(s)</div>
                      <div className="text-sm text-gray-500">
                        {client.rfidCards[0] && client.rfidCards[0].substring(0, 15)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.registrationDate}</div>
                      <div className="text-sm text-gray-500">{client.profession}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.totalSpent}</div>
                      <div className="text-sm text-gray-500">{client.transactionCount} transactions</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => openDetailsModal(client)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <CreditCardIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage <span className="font-medium">1</span> à{" "}
              <span className="font-medium">{filteredClients.length}</span> sur{" "}
              <span className="font-medium">1248</span> clients
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Précédent
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-start pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <ReceiptRefundIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{transaction.clientName}</p>
                      <p className="text-sm font-medium text-gray-900">{transaction.amount}</p>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {transaction.date} - Carte {transaction.cardId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                Voir toutes les transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon className="h-16 w-16" />
                </div>
                <p className="text-sm text-gray-500">Graphique de répartition en cours de développement</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Clients actifs</span>
                </div>
                <span className="text-sm font-medium text-gray-900">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Nouveaux clients</span>
                </div>
                <span className="text-sm font-medium text-gray-900">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Clients inactifs</span>
                </div>
                <span className="text-sm font-medium text-gray-900">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">Clients en attente</span>
                </div>
                <span className="text-sm font-medium text-gray-900">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title={`Ajouter un nouveau client - Étape ${addStep}/2`}
        size="large"
      >
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${addStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                {addStep > 1 ? <CheckIcon className="h-4 w-4" /> : "1"}
              </div>
              <div className={`h-1 w-16 ${addStep >= 2 ? "bg-purple-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${addStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {addStep === 1 ? "Informations du client" : "Assignation des cartes"}
            </div>
          </div>

          {/* Step 1: Client Information */}
          {addStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom *</Label>
                  <Input
                    placeholder="Prénom"
                    value={newClient.firstName}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Nom *</Label>
                  <Input
                    placeholder="Nom"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="Adresse email"
                    value={newClient.email}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Téléphone *</Label>
                  <Input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Adresse *</Label>
                <Input
                  placeholder="Adresse complète"
                  value={newClient.address}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ville *</Label>
                  <Input
                    placeholder="Ville"
                    value={newClient.city}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Code postal *</Label>
                  <Input
                    placeholder="Code postal"
                    value={newClient.postalCode}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de naissance *</Label>
                  <Input
                    type="date"
                    value={newClient.dateNaissance}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, dateNaissance: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Lieu de naissance *</Label>
                  <Input
                    placeholder="Lieu de naissance"
                    value={newClient.lieuNaissance}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, lieuNaissance: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nationalité *</Label>
                  <select
                    value={newClient.nationalite}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, nationalite: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Française">Française</option>
                    <option value="Étrangère">Étrangère</option>
                  </select>
                </div>
                <div>
                  <Label>Profession</Label>
                  <Input
                    placeholder="Profession"
                    value={newClient.profession}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, profession: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de pièce *</Label>
                  <select
                    value={newClient.typePiece}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, typePiece: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="CNI">Carte Nationale d'Identité</option>
                    <option value="PASSEPORT">Passeport</option>
                    <option value="PERMIS">Permis de conduire</option>
                  </select>
                </div>
                <div>
                  <Label>Numéro de pièce *</Label>
                  <Input
                    placeholder="Numéro de pièce d'identité"
                    value={newClient.numeroPiece}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, numeroPiece: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Statut</Label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
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
                  placeholder="Rechercher une carte..."
                  value={searchCards}
                  onChange={(e) => setSearchCards(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredCards.map((carte) => (
                  <div
                    key={carte.id}
                    className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      selectedCards.includes(carte.id) ? "bg-purple-50 border-purple-200" : ""
                    }`}
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
                              className={`px-2 py-1 text-xs rounded-full ${
                                carte.type_carte === "STANDARD"
                                  ? "bg-blue-100 text-blue-800"
                                  : carte.type_carte === "PREMIUM"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {carte.type_carte}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            SN: {carte.numero_serie} • Expire: {carte.date_expiration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">Plafond: €{carte.plafond_quotidien}/jour</div>
                        <div className="text-xs text-gray-500">Max: €{carte.solde_maximum}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCardIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune carte disponible trouvée</p>
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

      {/* Client Detail Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Détails du client"
        size="large"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                    <UserIcon className="h-12 w-12" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">ID: {selectedClient.id}</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedClient.status} />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {selectedClient.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {selectedClient.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {selectedClient.address}, {selectedClient.city}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Inscrit le {selectedClient.registrationDate}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Cartes RFID associées</h5>
                  {selectedClient.rfidCards.map((card, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{card}</p>
                        <p className="text-xs text-gray-500">Carte principale</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ArrowPathIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <NoSymbolIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Dépenses totales</p>
                    <p className="text-xl font-bold text-gray-800">{selectedClient.totalSpent}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Transactions</p>
                    <p className="text-xl font-bold text-gray-800">{selectedClient.transactionCount}</p>
                  </div>
                </div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Dernières transactions</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                        <ReceiptRefundIcon className="h-3 w-3" />
                      </div>
                      <span>Achat billet concert</span>
                    </div>
                    <span className="font-medium">+€89.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        <ReceiptRefundIcon className="h-3 w-3" />
                      </div>
                      <span>Restauration</span>
                    </div>
                    <span className="font-medium">+€32.50</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                        <ReceiptRefundIcon className="h-3 w-3" />
                      </div>
                      <span>Parking</span>
                    </div>
                    <span className="font-medium">+€12.00</span>
                  </div>
                </div>
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
