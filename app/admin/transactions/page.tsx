"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  Download,
  Eye,
  Receipt,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { transactionsService, type Transaction, type TransactionFilters } from "@/lib/services/transactions.service"

const statusConfig = {
  VALIDEE: {
    label: "Réussie",
    variant: "default" as const,
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  ECHOUEE: {
    label: "Échouée",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  EN_COURS: {
    label: "En attente",
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  ANNULEE: {
    label: "Remboursée",
    variant: "outline" as const,
    icon: RotateCcw,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
}

const typeConfig = {
  ACHAT: { label: "Achat", color: "text-purple-600" },
  RETRAIT: { label: "Retrait", color: "text-red-600" },
  RECHARGE: { label: "Recharge", color: "text-green-600" },
  TRANSFERT: { label: "Transfert", color: "text-blue-600" },
}

interface Stats {
  today: number
  totalAmount: number
  successRate: number
  averageAmount: number
  todayChange: number
  amountChange: number
  rateChange: number
  avgChange: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    page_size: 10,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState<Stats>({
    today: 0,
    totalAmount: 0,
    successRate: 0,
    averageAmount: 0,
    todayChange: 0,
    amountChange: 0,
    rateChange: 0,
    avgChange: 0,
  })

  const calculateBasicStats = (transactions: Transaction[], dateFilter?: string) => {
    const filteredTransactions = dateFilter
      ? transactions.filter(t => t.date_transaction.split('T')[0] === dateFilter)
      : transactions

    if (filteredTransactions.length === 0) {
      return {
        today: 0,
        totalAmount: 0,
        successRate: 0,
        averageAmount: 0,
      }
    }

    const totalAmount = filteredTransactions.reduce(
      (sum, t) => sum + parseFloat(String(t.montant)),
      0
    )

    const successfulTransactions = filteredTransactions.filter(
      t => t.statut === 'VALIDEE'
    ).length

    const successRate = (successfulTransactions / filteredTransactions.length) * 100
    const averageAmount = totalAmount / filteredTransactions.length

    return {
      today: filteredTransactions.length,
      totalAmount,
      successRate,
      averageAmount,
    }
  }

  const calculateStats = async (currentTransactions: Transaction[]) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const todayTransactions = currentTransactions.filter(t =>
      t.date_transaction.split('T')[0] === todayStr
    )

    let yesterdayTransactions: Transaction[] = []
    try {
      const yesterdayResponse = await transactionsService.getTransactions({
        date_debut: yesterdayStr,
        date_fin: yesterdayStr
      })
      yesterdayTransactions = yesterdayResponse.results || yesterdayResponse
    } catch (error) {
      console.error("Erreur récup données hier", error)
    }

    const currentStats = calculateBasicStats(currentTransactions, todayStr)
    const yesterdayStats = calculateBasicStats(yesterdayTransactions, yesterdayStr)

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? 0 : 100
      return ((current - previous) / previous) * 100
    }

    return {
      today: currentStats.today,
      totalAmount: currentStats.totalAmount,
      successRate: currentStats.successRate,
      averageAmount: currentStats.averageAmount,
      todayChange: calculateChange(currentStats.today, yesterdayStats.today),
      amountChange: calculateChange(currentStats.totalAmount, yesterdayStats.totalAmount),
      rateChange: calculateChange(currentStats.successRate, yesterdayStats.successRate),
      avgChange: calculateChange(currentStats.averageAmount, yesterdayStats.averageAmount),
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await transactionsService.getTransactions(filters)
        setTransactions(response.results || response)

        const calculatedStats = await calculateStats(response.results || response)
        setStats(calculatedStats)
      } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters])

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  const exportTransactions = async () => {
    try {
      console.log("Exporting transactions...")
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    }
  }

  const formatAmount = (amount: number | string) => {
    const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amountNumber)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getCardLastFour = (cardId: string) => {
    return cardId.slice(-4).padStart(4, "•")
  }

  return (
    <Layout title="Gestion des transactions" searchPlaceholder="Rechercher des transactions...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des transactions</h1>
            <p className="text-gray-600">Suivez et gérez toutes les transactions effectuées avec RFID Pay</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transactions aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
                  <p
                    className={`text-sm mt-1 flex items-center ${stats.todayChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.todayChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.todayChange).toFixed(1)}% vs hier
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Montant total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatAmount(stats.totalAmount)}</p>
                  <p
                    className={`text-sm mt-1 flex items-center ${stats.amountChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.amountChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.amountChange).toFixed(1)}% vs hier
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Taux de réussite</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.successRate.toFixed(1)}%</p>
                  <p
                    className={`text-sm mt-1 flex items-center ${stats.rateChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.rateChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.rateChange).toFixed(1)}% vs hier
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction moyenne</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatAmount(stats.averageAmount)}</p>
                  <p
                    className={`text-sm mt-1 flex items-center ${stats.avgChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.avgChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.avgChange).toFixed(1)}% vs hier
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des transactions..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={filters.statut} onValueChange={(value) => handleFilterChange("statut", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les statuts</SelectItem>
                    <SelectItem value="VALIDEE">Réussie</SelectItem>
                    <SelectItem value="ECHOUEE">Échouée</SelectItem>
                    <SelectItem value="EN_COURS">En attente</SelectItem>
                    <SelectItem value="ANNULEE">Remboursée</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.type_transaction}
                  onValueChange={(value) => handleFilterChange("type_transaction", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les types</SelectItem>
                    <SelectItem value="ACHAT">Achat</SelectItem>
                    <SelectItem value="RETRAIT">Retrait</SelectItem>
                    <SelectItem value="RECHARGE">Recharge</SelectItem>
                    <SelectItem value="TRANSFERT">Transfert</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={filters.date_debut}
                  onChange={(e) => handleFilterChange("date_debut", e.target.value)}
                  placeholder="Date début"
                />

                <Input
                  type="date"
                  value={filters.date_fin}
                  onChange={(e) => handleFilterChange("date_fin", e.target.value)}
                  placeholder="Date fin"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transaction</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Carte / Client</TableHead>
                    <TableHead>Commerçant</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucune transaction trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => {
                      const status = statusConfig[transaction.statut]
                      const type = typeConfig[transaction.type_transaction]
                      const StatusIcon = status.icon

                      return (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{transaction.reference_interne}</div>
                              <div className={`text-sm ${type.color}`}>{type.label}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm text-gray-900">{formatDate(transaction.date_transaction)}</div>
                              <div className="text-sm text-gray-500">{formatTime(transaction.date_transaction)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  •••• {getCardLastFour(transaction.carte)}
                                </div>
                                <div className="text-sm text-gray-500">Client #{transaction.carte.slice(0, 8)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm text-gray-900">
                                {transaction.merchant_nom || "Commerçant inconnu"}
                              </div>
                              <div className="text-sm text-gray-500">{transaction.categorie || "Non catégorisé"}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-gray-900">
                              {formatAmount(transaction.montant)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Détails de la transaction {transaction.reference_interne}</DialogTitle>
                                  </DialogHeader>
                                  {selectedTransaction && (
                                    <div className="space-y-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Date et heure</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {formatDate(selectedTransaction.date_transaction)} à{" "}
                                              {formatTime(selectedTransaction.date_transaction)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Statut</p>
                                            <div className="mt-1">
                                              <Badge className={statusConfig[selectedTransaction.statut].className}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig[selectedTransaction.statut].label}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Montant</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {formatAmount(selectedTransaction.montant)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Type</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {typeConfig[selectedTransaction.type_transaction].label}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border-t pt-4">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Informations carte</h4>
                                        <div className="flex items-center">
                                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                                            <CreditCard className="h-4 w-4" />
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">
                                              •••• •••• •••• {getCardLastFour(selectedTransaction.carte)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              Solde avant: {formatAmount(selectedTransaction.solde_avant)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              Solde après: {formatAmount(selectedTransaction.solde_apres)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {selectedTransaction.merchant_nom && (
                                        <div className="border-t pt-4">
                                          <h4 className="text-md font-medium text-gray-900 mb-3">
                                            Informations commerçant
                                          </h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm font-medium text-gray-500">Nom</p>
                                              <p className="text-sm text-gray-900 mt-1">
                                                {selectedTransaction.merchant_nom}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-gray-500">ID Commerçant</p>
                                              <p className="text-sm text-gray-900 mt-1">
                                                {selectedTransaction.merchant_id || "N/A"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-gray-500">Terminal</p>
                                              <p className="text-sm text-gray-900 mt-1">
                                                {selectedTransaction.terminal_id || "N/A"}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium text-gray-500">Localisation</p>
                                              <p className="text-sm text-gray-900 mt-1">
                                                {selectedTransaction.localisation || "N/A"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div className="border-t pt-4">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">
                                          Détails supplémentaires
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">ID Transaction</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedTransaction.id}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Référence interne</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {selectedTransaction.reference_interne}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Référence externe</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {selectedTransaction.reference_externe || "N/A"}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Frais</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {formatAmount(selectedTransaction.frais_transaction)}
                                            </p>
                                          </div>
                                        </div>
                                        {selectedTransaction.description && (
                                          <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                              {selectedTransaction.description}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <Button variant="outline">
                                          <Printer className="h-4 w-4 mr-2" />
                                          Imprimer
                                        </Button>
                                        <Button>
                                          <Receipt className="h-4 w-4 mr-2" />
                                          Reçu
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm">
                                <Receipt className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à{" "}
                <span className="font-medium">{Math.min(filters.page_size || 10, transactions.length)}</span> sur{" "}
                <span className="font-medium">{transactions.length}</span> résultats
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                  disabled={(filters.page || 1) <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  disabled={transactions.length < (filters.page_size || 10)}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}