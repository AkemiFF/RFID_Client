"use client"

import Layout from "@/components/layout/Layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { ArrowUp, BarChart3, CreditCard, Download, Euro, FileText, Filter, PiggyBank, Store } from "lucide-react"
import { useState } from "react"
import { Doughnut, Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

interface ReportStats {
  totalExpenses: number
  totalTransactions: number
  totalMerchants: number
  totalSavings: number
  expensesTrend: number
  transactionsTrend: number
  merchantsTrend: number
  savingsTrend: number
}

interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  card: string
  status: "completed" | "pending" | "failed"
  location: string
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "2023-06-01",
    to: "2023-06-30",
  })

  const [stats, setStats] = useState<ReportStats>({
    totalExpenses: 1456,
    totalTransactions: 42,
    totalMerchants: 18,
    totalSavings: 124,
    expensesTrend: 12,
    transactionsTrend: 8,
    merchantsTrend: 3,
    savingsTrend: 8.5,
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TRX-001",
      date: "15/06/2023",
      merchant: "Carrefour Market",
      category: "Épicerie",
      amount: 56.78,
      card: "•••• 4589",
      status: "completed",
      location: "Paris 15ème",
    },
    {
      id: "TRX-002",
      date: "14/06/2023",
      merchant: "Le Petit Bistrot",
      category: "Restaurant",
      amount: 32.5,
      card: "•••• 1234",
      status: "completed",
      location: "Lyon 2ème",
    },
    {
      id: "TRX-003",
      date: "13/06/2023",
      merchant: "TotalEnergies",
      category: "Transport",
      amount: 45.2,
      card: "•••• 4589",
      status: "completed",
      location: "Boulogne-Billancourt",
    },
    {
      id: "TRX-004",
      date: "12/06/2023",
      merchant: "UGC Ciné Cité",
      category: "Loisirs",
      amount: 24.0,
      card: "•••• 1234",
      status: "completed",
      location: "Lille",
    },
    {
      id: "TRX-005",
      date: "11/06/2023",
      merchant: "Zara",
      category: "Vêtements",
      amount: 89.95,
      card: "•••• 4589",
      status: "pending",
      location: "Paris Haussmann",
    },
  ])

  // Chart data
  const spendingChartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Dépenses 2023",
        data: [450, 520, 480, 560, 610, 680, 720, 690, 750, 820, 790, 850],
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Dépenses 2022",
        data: [400, 460, 420, 490, 540, 600, 650, 620, 680, 750, 710, 780],
        borderColor: "#9ca3af",
        backgroundColor: "rgba(156, 163, 175, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const categoryChartData = {
    labels: ["Épicerie", "Restaurants", "Transport", "Loisirs", "Vêtements", "Autres"],
    datasets: [
      {
        data: [35, 25, 15, 10, 10, 5],
        backgroundColor: ["#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value + "€",
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${percentage}% (${value}€)`
          },
        },
      },
    },
    cutout: "70%",
  }

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`)
    // Implement export functionality
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Complété</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "épicerie":
        return "🛒"
      case "restaurant":
        return "🍽️"
      case "transport":
        return "🚗"
      case "loisirs":
        return "🎬"
      case "vêtements":
        return "👕"
      default:
        return "📦"
    }
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
            <p className="text-gray-600">Analysez vos données financières et transactions</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Période d'analyse</h3>
                <p className="text-sm text-gray-500">Sélectionnez une période pour générer des rapports</p>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-auto"
                />
                <span className="text-gray-500">à</span>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-auto"
                />
                <Button>
                  <Filter className="w-4 h-4 mr-2" />
                  Appliquer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dépenses totales</p>
                  <p className="text-2xl font-semibold text-gray-900">€{stats.totalExpenses}</p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {stats.expensesTrend}% vs période précédente
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Euro className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {stats.transactionsTrend}% vs période précédente
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Commerçants</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalMerchants}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {stats.merchantsTrend} nouveaux
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Store className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Économies</p>
                  <p className="text-2xl font-semibold text-gray-900">€{stats.totalSavings}</p>
                  <p className="text-sm text-yellow-600 flex items-center mt-1">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {stats.savingsTrend}% de réduction
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <PiggyBank className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Trend */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tendance des dépenses</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Mensuel
                  </Button>
                  <Button variant="ghost" size="sm">
                    Hebdo
                  </Button>
                  <Button variant="ghost" size="sm">
                    Quotidien
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={spendingChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Répartition par catégorie</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Card>
          <Tabs defaultValue="transactions" className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="merchants">Commerçants</TabsTrigger>
                <TabsTrigger value="locations">Localisations</TabsTrigger>
                <TabsTrigger value="cards">Cartes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transactions" className="mt-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commerçant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Carte
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                              <Store className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                              <div className="text-sm text-gray-500">{transaction.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">{getCategoryIcon(transaction.category)}</span>
                            <span className="text-sm text-gray-900">{transaction.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-900">{transaction.card}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button variant="outline">Précédent</Button>
                  <Button variant="outline">Suivant</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur{" "}
                      <span className="font-medium">{transactions.length}</span> transactions
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
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
              </div>
            </TabsContent>

            <TabsContent value="merchants">
              <div className="p-6 text-center text-gray-500">
                <Store className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Rapport des commerçants en cours de développement</p>
              </div>
            </TabsContent>

            <TabsContent value="locations">
              <div className="p-6 text-center text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Rapport des localisations en cours de développement</p>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="p-6 text-center text-gray-500">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Rapport des cartes en cours de développement</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Export Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Exporter des rapports</h3>
                <p className="text-sm text-gray-500">Générez et téléchargez des rapports détaillés</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button variant="outline" onClick={() => handleExport("pdf")}>
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport("excel")}>
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport("csv")}>
                  <FileText className="w-4 h-4 mr-2 text-purple-500" />
                  CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div></Layout>
  )
}
