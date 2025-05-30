"use client"

import { useState, useEffect } from "react"
import {
  CalendarIcon,
  SearchIcon,
  DownloadIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon,
  CreditCardIcon,
  SendIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Transaction {
  id: string
  date: string
  type: "paiement" | "transfert_envoye" | "transfert_recu" | "depot" | "retrait" | "remboursement"
  montant: number
  description: string
  reference: string
  statut: "reussie" | "echouee" | "en_attente" | "annulee"
  commercant?: string
  destinataire?: string
  expediteur?: string
  carteUtilisee?: string
  frais: number
  soldeApres: number
  canal: "rfid" | "qr" | "mobile" | "web"
  localisation?: string
}

interface TransactionStats {
  totalTransactions: number
  totalDepenses: number
  totalRecus: number
  transactionsMoyennes: number
  periodeActive: string
}

export default function ClientHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    loadTransactions()
  }, [selectedPeriod, dateRange])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, selectedType, selectedStatus])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // Simulation des données - remplacer par l'appel API réel
      const mockTransactions: Transaction[] = [
        {
          id: "TXN001",
          date: "2024-01-27T14:30:00Z",
          type: "paiement",
          montant: 15000,
          description: "Achat supermarché",
          reference: "PAY-2024-001",
          statut: "reussie",
          commercant: "SuperMarché Plus",
          carteUtilisee: "•••• 1234",
          frais: 0,
          soldeApres: 85000,
          canal: "rfid",
          localisation: "Antananarivo",
        },
        {
          id: "TXN002",
          date: "2024-01-27T10:15:00Z",
          type: "depot",
          montant: 50000,
          description: "Rechargement carte",
          reference: "DEP-2024-001",
          statut: "reussie",
          carteUtilisee: "•••• 1234",
          frais: 0,
          soldeApres: 100000,
          canal: "mobile",
        },
        {
          id: "TXN003",
          date: "2024-01-26T19:45:00Z",
          type: "paiement",
          montant: 8500,
          description: "Restaurant",
          reference: "PAY-2024-002",
          statut: "reussie",
          commercant: "Chez Marie",
          carteUtilisee: "•••• 1234",
          frais: 0,
          soldeApres: 50000,
          canal: "qr",
          localisation: "Antananarivo",
        },
        {
          id: "TXN004",
          date: "2024-01-26T08:20:00Z",
          type: "transfert_envoye",
          montant: 25000,
          description: "Transfert à Jean",
          reference: "TRF-2024-001",
          statut: "reussie",
          destinataire: "Jean Rakoto (+261 34 12 345 67)",
          carteUtilisee: "•••• 1234",
          frais: 250,
          soldeApres: 58500,
          canal: "mobile",
        },
        {
          id: "TXN005",
          date: "2024-01-25T16:30:00Z",
          type: "transfert_recu",
          montant: 30000,
          description: "Transfert de Marie",
          reference: "TRF-2024-002",
          statut: "reussie",
          expediteur: "Marie Rabe (+261 33 98 765 43)",
          carteUtilisee: "•••• 1234",
          frais: 0,
          soldeApres: 83750,
          canal: "mobile",
        },
        {
          id: "TXN006",
          date: "2024-01-25T11:15:00Z",
          type: "paiement",
          montant: 12000,
          description: "Pharmacie",
          reference: "PAY-2024-003",
          statut: "echouee",
          commercant: "Pharmacie Centrale",
          carteUtilisee: "•••• 1234",
          frais: 0,
          soldeApres: 53750,
          canal: "rfid",
          localisation: "Antananarivo",
        },
        {
          id: "TXN007",
          date: "2024-01-24T14:00:00Z",
          type: "retrait",
          montant: 20000,
          description: "Retrait DAB",
          reference: "WTH-2024-001",
          statut: "reussie",
          carteUtilisee: "•••• 1234",
          frais: 500,
          soldeApres: 53750,
          canal: "rfid",
          localisation: "Antananarivo",
        },
      ]

      setTransactions(mockTransactions)

      // Calcul des statistiques
      const totalDepenses = mockTransactions
        .filter((t) => ["paiement", "transfert_envoye", "retrait"].includes(t.type) && t.statut === "reussie")
        .reduce((sum, t) => sum + t.montant + t.frais, 0)

      const totalRecus = mockTransactions
        .filter((t) => ["depot", "transfert_recu", "remboursement"].includes(t.type) && t.statut === "reussie")
        .reduce((sum, t) => sum + t.montant, 0)

      setStats({
        totalTransactions: mockTransactions.length,
        totalDepenses,
        totalRecus,
        transactionsMoyennes: mockTransactions.length > 0 ? Math.round(totalDepenses / mockTransactions.length) : 0,
        periodeActive: "30 derniers jours",
      })
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.commercant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.destinataire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.expediteur?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType)
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter((t) => t.statut === selectedStatus)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "paiement":
        return <CreditCardIcon className="h-4 w-4" />
      case "transfert_envoye":
        return <SendIcon className="h-4 w-4" />
      case "transfert_recu":
        return <ArrowDownIcon className="h-4 w-4" />
      case "depot":
        return <PlusIcon className="h-4 w-4" />
      case "retrait":
        return <MinusIcon className="h-4 w-4" />
      case "remboursement":
        return <RefreshCwIcon className="h-4 w-4" />
      default:
        return <CreditCardIcon className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "paiement":
        return "text-red-600"
      case "transfert_envoye":
        return "text-orange-600"
      case "transfert_recu":
        return "text-green-600"
      case "depot":
        return "text-green-600"
      case "retrait":
        return "text-red-600"
      case "remboursement":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (statut: string) => {
    const variants = {
      reussie: "bg-green-100 text-green-800",
      echouee: "bg-red-100 text-red-800",
      en_attente: "bg-yellow-100 text-yellow-800",
      annulee: "bg-gray-100 text-gray-800",
    }

    const labels = {
      reussie: "Réussie",
      echouee: "Échouée",
      en_attente: "En attente",
      annulee: "Annulée",
    }

    return <Badge className={variants[statut as keyof typeof variants]}>{labels[statut as keyof typeof labels]}</Badge>
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " Ar"
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: fr })
  }

  const exportTransactions = () => {
    // Logique d'export - peut être CSV, PDF, etc.
    console.log("Export des transactions")
  }

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des transactions</h1>
          <p className="text-gray-600">Consultez toutes vos opérations</p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total dépensé</p>
                  <p className="text-2xl font-bold text-red-600">{formatAmount(stats.totalDepenses)}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowUpIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total reçu</p>
                  <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalRecus)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moyenne/transaction</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.transactionsMoyennes)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <RefreshCwIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type de transaction */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="paiement">Paiements</SelectItem>
                <SelectItem value="transfert_envoye">Transferts envoyés</SelectItem>
                <SelectItem value="transfert_recu">Transferts reçus</SelectItem>
                <SelectItem value="depot">Dépôts</SelectItem>
                <SelectItem value="retrait">Retraits</SelectItem>
                <SelectItem value="remboursement">Remboursements</SelectItem>
              </SelectContent>
            </Select>

            {/* Statut */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="reussie">Réussie</SelectItem>
                <SelectItem value="echouee">Échouée</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>

            {/* Période */}
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">3 derniers mois</SelectItem>
                <SelectItem value="365">12 derniers mois</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>

            {/* Date personnalisée */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Choisir dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredTransactions.length)} sur{" "}
            {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
                    <div className={getTransactionColor(transaction.type)}>{getTransactionIcon(transaction.type)}</div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{transaction.reference}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.commercant && (
                        <>
                          <span>•</span>
                          <span>{transaction.commercant}</span>
                        </>
                      )}
                      {transaction.destinataire && (
                        <>
                          <span>•</span>
                          <span>{transaction.destinataire}</span>
                        </>
                      )}
                      {transaction.expediteur && (
                        <>
                          <span>•</span>
                          <span>{transaction.expediteur}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                      {["paiement", "transfert_envoye", "retrait"].includes(transaction.type) ? "-" : "+"}
                      {formatAmount(transaction.montant)}
                    </p>
                    {transaction.frais > 0 && (
                      <p className="text-sm text-gray-500">Frais: {formatAmount(transaction.frais)}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(transaction.statut)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Télécharger reçu
                        </DropdownMenuItem>
                        {transaction.statut === "reussie" && transaction.type === "paiement" && (
                          <DropdownMenuItem>
                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                            Demander remboursement
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

            {currentTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune transaction trouvée</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
