"use client"

import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
import StatusBadge from "@/components/ui/StatusBadge"
import {
  PlusIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  CreditCardIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"
import { identitesService, type Entreprise } from "@/lib/services/identites.service"
import { cartesService, type CarteRFID } from "@/lib/services/cartes.service"

interface EntrepriseWithStats extends Entreprise {
  nombre_employes?: number
  nombre_cartes?: number
  chiffre_affaires?: string
}

const entreprises: EntrepriseWithStats[] = [
  {
    id: "ENT-789456",
    raison_sociale: "TechCorp Solutions",
    forme_juridique: "SARL",
    stat: "20123456789012",
    nif: "123456789",
    tva_intracom: "FR12345678901",
    telephone: "+33 1 23 45 67 89",
    email: "contact@techcorp.fr",
    adresse_siege: "15 Avenue des Champs-Élysées, 75008 Paris",
    date_creation_entreprise: "2018-03-15",
    secteur_activite: "Technologies de l'information",
    numero_rcs: "RCS Paris 123456789",
    statut: "ACTIVE",
    nombre_employes: 45,
    nombre_cartes: 52,
    chiffre_affaires: "€2.5M",
  },
  {
    id: "ENT-321654",
    raison_sociale: "Green Energy France",
    forme_juridique: "SAS",
    stat: "20123456789013",
    nif: "987654321",
    tva_intracom: "FR98765432109",
    telephone: "+33 4 56 78 90 12",
    email: "info@greenenergy.fr",
    adresse_siege: "42 Rue de la République, 69002 Lyon",
    date_creation_entreprise: "2020-01-10",
    secteur_activite: "Énergies renouvelables",
    numero_rcs: "RCS Lyon 987654321",
    statut: "ACTIVE",
    nombre_employes: 28,
    nombre_cartes: 35,
    chiffre_affaires: "€1.8M",
  },
  {
    id: "ENT-987123",
    raison_sociale: "Marseille Logistics",
    forme_juridique: "SA",
    stat: "20123456789014",
    nif: "456789123",
    tva_intracom: "FR45678912345",
    telephone: "+33 4 91 23 45 67",
    email: "contact@marseille-logistics.fr",
    adresse_siege: "78 Boulevard National, 13003 Marseille",
    date_creation_entreprise: "2015-09-22",
    secteur_activite: "Transport et logistique",
    numero_rcs: "RCS Marseille 456789123",
    statut: "ACTIVE",
    nombre_employes: 67,
    nombre_cartes: 78,
    chiffre_affaires: "€4.2M",
  },
  {
    id: "ENT-456789",
    raison_sociale: "Digital Marketing Pro",
    forme_juridique: "EURL",
    stat: "20123456789015",
    nif: "789123456",
    tva_intracom: "",
    telephone: "+33 2 34 56 78 90",
    email: "hello@digitalmarketing.fr",
    adresse_siege: "23 Rue des Entrepreneurs, 44000 Nantes",
    date_creation_entreprise: "2021-06-08",
    secteur_activite: "Marketing digital",
    numero_rcs: "RCS Nantes 789123456",
    statut: "INACTIVE",
    nombre_employes: 12,
    nombre_cartes: 8,
    chiffre_affaires: "€650K",
  },
]

const cartesDisponibles: CarteRFID[] = [
  {
    id: "CARD-001",
    code_uid: "UID-001-789456",
    numero_serie: "RFID-7894-5612-3456",
    type_carte: "STANDARD",
    solde: 0,
    plafond_quotidien: 100,
    plafond_mensuel: 2000,
    solde_maximum: 500,
    statut: "ACTIVE",
    date_emission: "2023-01-15T10:30:00Z",
    date_expiration: "2025-12-31",
    lieu_emission: "Paris",
    nombre_transactions: 0,
    version_securite: "v2.1",
    cle_chiffrement: "encrypted_key_001",
    date_creation: "2023-01-15T10:30:00Z",
    date_modification: "2023-01-15T10:30:00Z",
  },
  {
    id: "CARD-002",
    code_uid: "UID-002-321654",
    numero_serie: "RFID-3216-5498-7654",
    type_carte: "PREMIUM",
    solde: 0,
    plafond_quotidien: 200,
    plafond_mensuel: 5000,
    solde_maximum: 1000,
    statut: "ACTIVE",
    date_emission: "2023-02-20T14:15:00Z",
    date_expiration: "2025-12-31",
    lieu_emission: "Lyon",
    nombre_transactions: 0,
    version_securite: "v2.1",
    cle_chiffrement: "encrypted_key_002",
    date_creation: "2023-02-20T14:15:00Z",
    date_modification: "2023-02-20T14:15:00Z",
  },
  {
    id: "CARD-003",
    code_uid: "UID-003-987123",
    numero_serie: "RFID-9871-2365-4789",
    type_carte: "ENTREPRISE",
    solde: 0,
    plafond_quotidien: 500,
    plafond_mensuel: 10000,
    solde_maximum: 2000,
    statut: "ACTIVE",
    date_emission: "2023-03-10T09:45:00Z",
    date_expiration: "2025-12-31",
    lieu_emission: "Marseille",
    nombre_transactions: 0,
    version_securite: "v2.1",
    cle_chiffrement: "encrypted_key_003",
    date_creation: "2023-03-10T09:45:00Z",
    date_modification: "2023-03-10T09:45:00Z",
  },
]

export default function EntreprisesPage() {
  const [selectedEntreprise, setSelectedEntreprise] = useState<EntrepriseWithStats | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addStep, setAddStep] = useState(1) // 1: Info entreprise, 2: Assignation cartes
  const [selectedCartes, setSelectedCartes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    statut: "all",
    secteur: "all",
    sortBy: "raison_sociale",
  })

  // Formulaire d'ajout d'entreprise
  const [formData, setFormData] = useState({
    raison_sociale: "",
    forme_juridique: "",
    stat: "",
    nif: "",
    tva_intracom: "",
    telephone: "",
    email: "",
    adresse_siege: "",
    date_creation_entreprise: "",
    secteur_activite: "",
    numero_rcs: "",
  })

  const openDetailsModal = (entreprise: EntrepriseWithStats) => {
    setSelectedEntreprise(entreprise)
    setShowDetailsModal(true)
  }

  const openAddModal = () => {
    setShowAddModal(true)
    setAddStep(1)
    setSelectedCartes([])
    setFormData({
      raison_sociale: "",
      forme_juridique: "",
      stat: "",
      nif: "",
      tva_intracom: "",
      telephone: "",
      email: "",
      adresse_siege: "",
      date_creation_entreprise: "",
      secteur_activite: "",
      numero_rcs: "",
    })
  }

  const handleNextStep = () => {
    if (addStep === 1) {
      // Validation des champs obligatoires
      if (!formData.raison_sociale || !formData.stat || !formData.nif) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }
      setAddStep(2)
    }
  }

  const handlePrevStep = () => {
    if (addStep === 2) {
      setAddStep(1)
    }
  }

  const handleCarteSelection = (carteId: string) => {
    setSelectedCartes((prev) => (prev.includes(carteId) ? prev.filter((id) => id !== carteId) : [...prev, carteId]))
  }

  const handleSubmit = async () => {
    try {
      // Créer l'entreprise
      const newEntreprise = await identitesService.createEntreprise(formData)

      // Assigner les cartes sélectionnées
      for (const carteId of selectedCartes) {
        await cartesService.updateCarte(carteId, {
          entreprise: newEntreprise.id,
        })
      }

      alert(`Entreprise créée avec succès ! ${selectedCartes.length} carte(s) assignée(s).`)
      setShowAddModal(false)
      // Recharger la liste des entreprises
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Erreur lors de la création de l'entreprise")
    }
  }

  const filteredEntreprises = entreprises.filter((entreprise) => {
    const matchesSearch =
      entreprise.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.secteur_activite.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatut = filters.statut === "all" || entreprise.statut === filters.statut
    const matchesSecteur = filters.secteur === "all" || entreprise.secteur_activite === filters.secteur

    return matchesSearch && matchesStatut && matchesSecteur
  })

  return (
    <Layout title="Gestion des Entreprises" searchPlaceholder="Rechercher une entreprise...">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Entreprises</h1>
          <p className="text-gray-600">Gérez les entreprises clientes et leurs cartes RFID</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={openAddModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Entreprises actives</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">156</p>
                <p className="text-xs text-green-600 mt-1">
                  <span className="font-medium">+8.2%</span> ce mois
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nouvelles entreprises</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                <p className="text-xs text-blue-600 mt-1">
                  <span className="font-medium">+3</span> cette semaine
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total employés</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">2,847</p>
                <p className="text-xs text-purple-600 mt-1">
                  <span className="font-medium">+156</span> ce mois
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cartes assignées</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">3,124</p>
                <p className="text-xs text-yellow-600 mt-1">
                  <span className="font-medium">+89</span> ce mois
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Recherche</Label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Nom, email, secteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Statut</Label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters((prev) => ({ ...prev, statut: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDUE">Suspendue</option>
              </select>
            </div>
            <div>
              <Label>Secteur d'activité</Label>
              <select
                value={filters.secteur}
                onChange={(e) => setFilters((prev) => ({ ...prev, secteur: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les secteurs</option>
                <option value="Technologies de l'information">IT</option>
                <option value="Énergies renouvelables">Énergie</option>
                <option value="Transport et logistique">Transport</option>
                <option value="Marketing digital">Marketing</option>
              </select>
            </div>
            <div>
              <Label>Trier par</Label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="raison_sociale">Nom (A-Z)</option>
                <option value="date_creation_entreprise">Date de création</option>
                <option value="nombre_employes">Nombre d'employés</option>
                <option value="chiffre_affaires">Chiffre d'affaires</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entreprises Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des entreprises ({filteredEntreprises.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Secteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cartes
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
                {filteredEntreprises.map((entreprise) => (
                  <tr key={entreprise.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <BuildingOfficeIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entreprise.raison_sociale}</div>
                          <div className="text-sm text-gray-500">
                            {entreprise.forme_juridique} • {entreprise.nif}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entreprise.email}</div>
                      <div className="text-sm text-gray-500">{entreprise.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entreprise.secteur_activite}</div>
                      <div className="text-sm text-gray-500">CA: {entreprise.chiffre_affaires}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entreprise.nombre_employes}</div>
                      <div className="text-sm text-gray-500">employés</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entreprise.nombre_cartes}</div>
                      <div className="text-sm text-gray-500">cartes actives</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={entreprise.statut.toLowerCase()} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => openDetailsModal(entreprise)}>
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
        </CardContent>
      </Card>

      {/* Add Enterprise Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Nouvelle entreprise - Étape ${addStep}/2`}
        size="xl"
      >
        {addStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Raison sociale *</Label>
                <Input
                  value={formData.raison_sociale}
                  onChange={(e) => setFormData((prev) => ({ ...prev, raison_sociale: e.target.value }))}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label>Forme juridique</Label>
                <select
                  value={formData.forme_juridique}
                  onChange={(e) => setFormData((prev) => ({ ...prev, forme_juridique: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                  <option value="SA">SA</option>
                  <option value="EURL">EURL</option>
                  <option value="SNC">SNC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>STAT *</Label>
                <Input
                  value={formData.stat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stat: e.target.value }))}
                  placeholder="20123456789012"
                />
              </div>
              <div>
                <Label>NIF *</Label>
                <Input
                  value={formData.nif}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nif: e.target.value }))}
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TVA Intracommunautaire</Label>
                <Input
                  value={formData.tva_intracom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tva_intracom: e.target.value }))}
                  placeholder="FR12345678901"
                />
              </div>
              <div>
                <Label>Numéro RCS</Label>
                <Input
                  value={formData.numero_rcs}
                  onChange={(e) => setFormData((prev) => ({ ...prev, numero_rcs: e.target.value }))}
                  placeholder="RCS Paris 123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@entreprise.fr"
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={formData.telephone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            <div>
              <Label>Adresse du siège</Label>
              <Textarea
                value={formData.adresse_siege}
                onChange={(e) => setFormData((prev) => ({ ...prev, adresse_siege: e.target.value }))}
                placeholder="Adresse complète du siège social"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de création</Label>
                <Input
                  type="date"
                  value={formData.date_creation_entreprise}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date_creation_entreprise: e.target.value }))}
                />
              </div>
              <div>
                <Label>Secteur d'activité</Label>
                <Input
                  value={formData.secteur_activite}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secteur_activite: e.target.value }))}
                  placeholder="Technologies de l'information"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleNextStep}>
                Suivant
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {addStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assignation des cartes RFID</h3>
              <p className="text-sm text-gray-500">
                Sélectionnez les cartes à assigner à l'entreprise {formData.raison_sociale}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Cartes disponibles</h4>
                <span className="text-sm text-gray-500">{selectedCartes.length} carte(s) sélectionnée(s)</span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartesDisponibles.map((carte) => (
                  <div
                    key={carte.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                      selectedCartes.includes(carte.id)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCarteSelection(carte.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCartes.includes(carte.id)}
                        onChange={() => handleCarteSelection(carte.id)}
                        className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                          <CreditCardIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{carte.numero_serie}</div>
                          <div className="text-sm text-gray-500">
                            {carte.type_carte} • Expire: {new Date(carte.date_expiration).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Plafond: €{carte.plafond_quotidien}/jour</div>
                      <div className="text-sm text-gray-500">Max: €{carte.solde_maximum}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              <div className="space-x-3">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Créer l'entreprise
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Enterprise Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Détails de l'entreprise"
        size="xl"
      >
        {selectedEntreprise && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                    <BuildingOfficeIcon className="h-12 w-12" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 text-center">{selectedEntreprise.raison_sociale}</h4>
                  <p className="text-sm text-gray-500">{selectedEntreprise.forme_juridique}</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedEntreprise.statut.toLowerCase()} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">STAT</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.stat}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">NIF</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.nif}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.telephone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.adresse_siege}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Secteur d'activité</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedEntreprise.secteur_activite}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedEntreprise.date_creation_entreprise).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-700">Employés</p>
                    <p className="text-xl font-bold text-gray-800">{selectedEntreprise.nombre_employes}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-700">Cartes actives</p>
                    <p className="text-xl font-bold text-gray-800">{selectedEntreprise.nombre_cartes}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-700">Chiffre d'affaires</p>
                    <p className="text-xl font-bold text-gray-800">{selectedEntreprise.chiffre_affaires}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline">
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Gérer les cartes
              </Button>
              <Button>
                <PencilIcon className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
