"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { clientPaymentService, type HistoryFilters, type Transaction } from "@/lib/services/client-payment.service"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Activity,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileDown,
  Filter,
  MoreHorizontal,
  Receipt,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionStats {
  totalTransactions: number
  totalDepenses: number
  totalRecus: number
  transactionsMoyennes: number
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalDepenses: 0,
    totalRecus: 0,
    transactionsMoyennes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  // Filtres
  const [filters, setFilters] = useState<HistoryFilters>({
    page: 1,
    limit: 20,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({})
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  // États pour les actions
  const [exporting, setExporting] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    loadHistory()
  }, [filters])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await clientPaymentService.getDetailedHistory(filters)
      setTransactions(response.transactions)
      setStats(response.stats)
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      })
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({ ...prev, search: value, page: 1 }))
  }

  const handleTypeFilter = (type: string) => {
    setFilters((prev) => ({ ...prev, type: type === "all" ? undefined : type, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status === "all" ? undefined : status, page: 1 }))
  }

  const handleDateRangeChange = () => {
    if (dateRange.from) {
      setFilters((prev) => ({
        ...prev,
        dateFrom: dateRange.from?.toISOString(),
        dateTo: dateRange.to?.toISOString(),
        page: 1,
      }))
    }
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const now = new Date()
    let from: Date

    switch (period) {
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }

    setDateRange({ from, to: now })
    setFilters((prev) => ({
      ...prev,
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
      page: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleExport = async (fileFormat: "csv" | "pdf" | "excel") => {
    try {
      setExporting(true)
      const blob = await clientPaymentService.exportTransactions(fileFormat, {
        type: filters.type,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      })

      const filename = `transactions_${fileFormat}_${format(new Date(), "yyyy-MM-dd")}.${fileFormat}`
      clientPaymentService.downloadFile(blob, filename)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const blob = await clientPaymentService.getTransactionReceipt(transactionId)
      const filename = `recu_${transactionId}.pdf`
      clientPaymentService.downloadFile(blob, filename)
    } catch (error) {
      console.error("Erreur lors du téléchargement du reçu:", error)
    }
  }

  const resetFilters = () => {
    setFilters({ page: 1, limit: 20 })
    setSearchTerm("")
    setDateRange({})
    setSelectedPeriod("30d")
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Historique des transactions</h1>
          <p className="text-muted-foreground">Consultez et gérez toutes vos transactions</p>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exporting}>
                <FileDown className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Export PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Export Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={loadHistory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Sur la période sélectionnée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépensé</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {clientPaymentService.formatAmount(stats.totalDepenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reçu</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clientPaymentService.formatAmount(stats.totalRecus)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientPaymentService.formatAmount(stats.transactionsMoyennes)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type de transaction */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select onValueChange={handleTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="ACHAT">Paiements</SelectItem>
                  <SelectItem value="TRANSFERT">Transferts</SelectItem>
                  <SelectItem value="RECHARGE">Dépôts</SelectItem>
                  <SelectItem value="RETRAIT">Retraits</SelectItem>
                  <SelectItem value="REMBOURSEMENT">Remboursements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="VALIDEE">Réussie</SelectItem>
                  <SelectItem value="ECHOUEE">Échouée</SelectItem>
                  <SelectItem value="EN_COURS">En attente</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Période */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">3 derniers mois</SelectItem>
                  <SelectItem value="1y">1 dernière année</SelectItem>
                  <SelectItem value="custom">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plage de dates personnalisée */}
          {selectedPeriod === "custom" && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleDateRangeChange}>Appliquer</Button>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>{pagination.total} transaction(s) trouvée(s)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune transaction trouvée</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {clientPaymentService.getTransactionIcon(transaction.type_transaction)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{transaction.type_display}</h3>
                        <Badge className={clientPaymentService.getStatusColor(transaction.statut)}>
                          {transaction.statut_display}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Réf: {transaction.reference_interne}</p>
                        {transaction.merchant_nom && <p>Commerçant: {transaction.merchant_nom}</p>}
                        {transaction.description && <p>Description: {transaction.description}</p>}
                        <p>{clientPaymentService.formatDate(transaction.date_transaction)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div
                      className={cn(
                        "text-lg font-semibold",
                        clientPaymentService.getTransactionColor(transaction.type_transaction),
                      )}
                    >
                      {transaction.type_transaction === "RECHARGE" ? "+" : "-"}
                      {clientPaymentService.formatAmount(transaction.montant)}
                    </div>

                    {transaction.frais_transaction > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Frais: {clientPaymentService.formatAmount(transaction.frais_transaction)}
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(transaction.id)}>
                          <Receipt className="h-4 w-4 mr-2" />
                          Télécharger reçu
                        </DropdownMenuItem>
                        {transaction.statut === "VALIDEE" && transaction.type_transaction === "ACHAT" && (
                          <DropdownMenuItem
                            onClick={() => {
                              /* TODO: Implémenter demande de remboursement */
                            }}
                          >
                            Demander remboursement
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages}({pagination.total} total)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal détails transaction */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la transaction</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Référence</label>
                <p className="font-mono">{selectedTransaction.reference_interne}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p>{selectedTransaction.type_display}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Montant</label>
                <p className="text-lg font-semibold">
                  {clientPaymentService.formatAmount(selectedTransaction.montant)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Statut</label>
                <Badge className={clientPaymentService.getStatusColor(selectedTransaction.statut)}>
                  {selectedTransaction.statut_display}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p>{clientPaymentService.formatDate(selectedTransaction.date_transaction)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Carte utilisée</label>
                <p className="font-mono">**** {selectedTransaction.carte_numero.slice(-4)}</p>
              </div>

              {selectedTransaction.merchant_nom && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Commerçant</label>
                  <p>{selectedTransaction.merchant_nom}</p>
                </div>
              )}

              {selectedTransaction.description && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p>{selectedTransaction.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Solde avant</label>
                <p>{clientPaymentService.formatAmount(selectedTransaction.solde_avant)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Solde après</label>
                <p>{clientPaymentService.formatAmount(selectedTransaction.solde_apres)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Fermer
              </Button>
              <Button onClick={() => handleDownloadReceipt(selectedTransaction.id)}>
                <Receipt className="h-4 w-4 mr-2" />
                Télécharger reçu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
