"use client"

import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/Modal"
import StatusBadge from "@/components/ui/StatusBadge"
import {
  PlusIcon,
  ArrowDownTrayIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  TruckIcon,
  FilmIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"

interface Merchant {
  id: string
  name: string
  siret: string
  category: string
  subcategory: string
  location: string
  address: string
  transactions: number
  volume: string
  status: "active" | "inactive" | "pending"
  commission: number
  contact: string
  phone: string
  email: string
  registrationDate: string
}

const merchants: Merchant[] = [
  {
    id: "MCH-78945612",
    name: "Le Bistrot Parisien",
    siret: "12345678901234",
    category: "Restauration",
    subcategory: "Restaurant",
    location: "Paris 5ème",
    address: "12 Rue de la Montagne",
    transactions: 142,
    volume: "€3,245.80",
    status: "active",
    commission: 1.4,
    contact: "Jean Martin",
    phone: "06 12 34 56 78",
    email: "contact@bistrot-parisien.fr",
    registrationDate: "15/03/2022",
  },
  {
    id: "MCH-32165498",
    name: "Carrefour Market",
    siret: "98765432109876",
    category: "Commerce",
    subcategory: "Supermarché",
    location: "Lyon 2ème",
    address: "45 Rue de la République",
    transactions: 326,
    volume: "€8,742.15",
    status: "active",
    commission: 1.2,
    contact: "Marie Dubois",
    phone: "04 78 90 12 34",
    email: "lyon@carrefour.fr",
    registrationDate: "22/08/2021",
  },
  {
    id: "MCH-98712365",
    name: "Métro Paris Ligne 1",
    siret: "45678912304567",
    category: "Transport",
    subcategory: "Transport public",
    location: "Paris 1er",
    address: "1 Place de la Concorde",
    transactions: 1842,
    volume: "€3,501.80",
    status: "active",
    commission: 0.8,
    contact: "Service Client RATP",
    phone: "01 23 45 67 89",
    email: "partenaires@ratp.fr",
    registrationDate: "10/01/2020",
  },
  {
    id: "MCH-45678923",
    name: "Le Bar à Vin",
    siret: "78912345607890",
    category: "Loisirs",
    subcategory: "Bar",
    location: "Marseille 6ème",
    address: "78 Rue Paradis",
    transactions: 87,
    volume: "€1,245.30",
    status: "inactive",
    commission: 1.6,
    contact: "Pierre Rossi",
    phone: "04 91 23 45 67",
    email: "contact@bar-a-vin.fr",
    registrationDate: "05/09/2022",
  },
  {
    id: "MCH-65412378",
    name: "Salon de Coiffure",
    siret: "56789012345678",
    category: "Services",
    subcategory: "Coiffure",
    location: "Lille Centre",
    address: "23 Rue Nationale",
    transactions: 42,
    volume: "€630.00",
    status: "pending",
    commission: 2.0,
    contact: "Sophie Leroy",
    phone: "03 20 12 34 56",
    email: "salon@coiffure-lille.fr",
    registrationDate: "30/05/2023",
  },
]

const categories = [
  { name: "Restauration", count: 64, icon: BuildingOfficeIcon, color: "purple" },
  { name: "Commerce", count: 92, icon: BuildingStorefrontIcon, color: "blue" },
  { name: "Transport", count: 45, icon: TruckIcon, color: "green" },
  { name: "Loisirs", count: 47, icon: FilmIcon, color: "yellow" },
]

export default function MerchantsPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    city: "all",
    period: "all",
  })

  const openDetailsModal = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setShowDetailsModal(true)
  }

  const filteredMerchants = merchants.filter((merchant) => {
    if (filters.status !== "all" && merchant.status !== filters.status) return false
    if (filters.category !== "all" && merchant.category !== filters.category) return false
    return true
  })

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Commerçants</h1>
          <p className="text-gray-600">Gérez tous les commerçants partenaires de RFID Pay</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un commerçant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Commerçants actifs</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">248</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+5.2%</span> ce mois
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BuildingStorefrontIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Transactions moyennes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">€24.50</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+3.8%</span> ce mois
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nouveaux commerçants</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">18</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">-2.1%</span> vs mois dernier
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <PlusIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Volume total</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">€42,850</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+12.5%</span> ce mois
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Catégories de commerçants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <div className={`bg-${category.color}-100 p-2 rounded-lg mr-3`}>
                  <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{category.name}</p>
                  <p className="text-sm font-bold text-gray-800">{category.count} commerçants</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="Restauration">Restauration</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Loisirs">Loisirs</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ville</Label>
              <Select value={filters.city} onValueChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes villes</SelectItem>
                  <SelectItem value="Paris">Paris</SelectItem>
                  <SelectItem value="Lyon">Lyon</SelectItem>
                  <SelectItem value="Marseille">Marseille</SelectItem>
                  <SelectItem value="Lille">Lille</SelectItem>
                  <SelectItem value="Toulouse">Toulouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date d'ajout</Label>
              <Select
                value={filters.period}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, period: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes périodes</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setFilters({ status: "all", category: "all", city: "all", period: "all" })}
            >
              Réinitialiser
            </Button>
            <Button>Appliquer les filtres</Button>
          </div>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Commerçant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du commerce
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
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
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{merchant.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <BuildingStorefrontIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                          <div className="text-sm text-gray-500">SIRET: {merchant.siret}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{merchant.category}</div>
                      <div className="text-sm text-gray-500">{merchant.subcategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{merchant.location}</div>
                      <div className="text-sm text-gray-500">{merchant.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{merchant.transactions}</div>
                      <div className="text-sm text-gray-500">{merchant.volume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={merchant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openDetailsModal(merchant)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChartBarIcon className="h-4 w-4" />
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

      {/* Merchant Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Détails du commerçant ${selectedMerchant?.id}`}
        size="large"
      >
        {selectedMerchant && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <BuildingStorefrontIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <div className="text-lg font-bold text-gray-900">{selectedMerchant.name}</div>
                  <div className="text-sm text-gray-500">SIRET: {selectedMerchant.siret}</div>
                  <div className="mt-1">
                    <StatusBadge status={selectedMerchant.status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Informations générales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Catégorie</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedMerchant.category} - {selectedMerchant.subcategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMerchant.registrationDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Taux de commission</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMerchant.commission}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact principal</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedMerchant.contact} - {selectedMerchant.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Localisation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMerchant.address}</p>
                  <p className="text-sm text-gray-900">{selectedMerchant.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMerchant.email}</p>
                </div>
              </div>
              <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Carte de localisation</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Statistiques</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Transactions totales</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedMerchant.transactions}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Volume total</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedMerchant.volume}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Moyenne/transaction</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    €
                    {(
                      Number.parseFloat(selectedMerchant.volume.replace("€", "").replace(",", "")) /
                      selectedMerchant.transactions
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </Button>
              <Button>
                <PencilIcon className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Merchant Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un nouveau commerçant"
        size="large"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nom du commerce</Label>
              <Input placeholder="Nom du commerce" />
            </div>
            <div>
              <Label>SIRET</Label>
              <Input placeholder="Numéro SIRET" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restauration">Restauration</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="loisirs">Loisirs</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sous-catégorie</Label>
                <Input placeholder="Ex: Restaurant, Supermarché, etc." />
              </div>
            </div>
            <div>
              <Label>Taux de commission (%)</Label>
              <Input type="number" step="0.01" defaultValue="1.4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact principal</Label>
                <Input placeholder="Nom du contact" />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input type="tel" placeholder="Numéro de téléphone" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Adresse email" />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input placeholder="Adresse complète" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code postal</Label>
                <Input placeholder="Code postal" />
              </div>
              <div>
                <Label>Ville</Label>
                <Input placeholder="Ville" />
              </div>
            </div>
            <div>
              <Label>Statut</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Annuler
            </Button>
            <Button>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
