"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Check, X, Loader2, ArrowRight, QrCode, History, Info, Plus } from "lucide-react"

interface CardInfo {
  number: string
  holder: string
  expiry: string
  balance: number
  id: string
  type: string
}

interface Transaction {
  id: string
  type: "payment" | "recharge" | "refund"
  amount: number
  merchant?: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

type TerminalState = "idle" | "card-detected" | "transaction-form" | "processing" | "success" | "error"

export default function TerminalPage() {
  const [terminalState, setTerminalState] = useState<TerminalState>("idle")
  const [currentAmount, setCurrentAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"payment" | "recharge" | "refund">("payment")
  const [selectedMerchant, setSelectedMerchant] = useState("")
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null)
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null)
  const [recentTransactions] = useState<Transaction[]>([
    {
      id: "TRX-001",
      type: "payment",
      amount: 1.9,
      merchant: "Métro Paris",
      timestamp: "Aujourd'hui, 09:42",
      status: "completed",
    },
    {
      id: "TRX-002",
      type: "recharge",
      amount: 20.0,
      timestamp: "Hier, 18:15",
      status: "completed",
    },
    {
      id: "TRX-003",
      type: "payment",
      amount: 42.35,
      merchant: "Carrefour",
      timestamp: "Hier, 12:18",
      status: "completed",
    },
  ])

  const merchants = ["Carrefour Market", "Métro Paris Ligne 1", "Le Bistrot Parisien", "Orange Mobile", "TotalEnergies"]

  // Simulate card detection
  const simulateCardDetection = () => {
    setCardInfo({
      number: "•••• •••• •••• 4589",
      holder: "Jean Dupont",
      expiry: "12/25",
      balance: 42.5,
      id: "CARD-789456123",
      type: "Standard",
    })
    setTerminalState("card-detected")

    setTimeout(() => {
      setTerminalState("transaction-form")
    }, 2000)
  }

  const addToAmount = (value: string) => {
    if (value === "." && currentAmount.includes(".")) return
    if (currentAmount === "" && value === ".") {
      setCurrentAmount("0.")
    } else {
      setCurrentAmount((prev) => prev + value)
    }
  }

  const clearAmount = () => {
    setCurrentAmount("")
  }

  const setRechargeAmount = (amount: number) => {
    setCurrentAmount(amount.toString())
  }

  const processTransaction = async () => {
    if (!currentAmount || Number.parseFloat(currentAmount) <= 0) {
      alert("Veuillez entrer un montant valide")
      return
    }

    if (transactionType === "payment" && !selectedMerchant) {
      alert("Veuillez sélectionner un commerçant")
      return
    }

    setTerminalState("processing")

    // Simulate processing time
    setTimeout(() => {
      const transaction: Transaction = {
        id: `TRX-${Date.now()}`,
        type: transactionType,
        amount: Number.parseFloat(currentAmount),
        merchant: transactionType === "payment" ? selectedMerchant : undefined,
        timestamp: new Date().toLocaleString("fr-FR"),
        status: "completed",
      }

      setLastTransaction(transaction)

      // Update card balance
      if (cardInfo) {
        const newBalance =
          transactionType === "recharge"
            ? cardInfo.balance + Number.parseFloat(currentAmount)
            : cardInfo.balance - Number.parseFloat(currentAmount)

        setCardInfo((prev) => (prev ? { ...prev, balance: newBalance } : null))
      }

      setTerminalState("success")
    }, 3000)
  }

  const resetTerminal = () => {
    setTerminalState("idle")
    setCurrentAmount("")
    setTransactionType("payment")
    setSelectedMerchant("")
    setCardInfo(null)
    setLastTransaction(null)
  }

  const renderTerminalDisplay = () => {
    switch (terminalState) {
      case "idle":
        return (
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-gray-800">RFID PAY</div>
            <div className="text-gray-600">Prêt à effectuer une transaction</div>
            <div className="mt-8">
              <div className="relative inline-block">
                <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-4xl animate-pulse">
                  <CreditCard />
                </div>
                <div className="absolute inset-0 rounded-full bg-purple-200 animate-ping opacity-20"></div>
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-4">Approchez votre carte RFID du terminal</div>
            <Button onClick={simulateCardDetection} className="mt-4">
              Simuler détection carte
            </Button>
          </div>
        )

      case "card-detected":
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                <Check />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">Carte détectée</div>
            <div className="text-gray-600">{cardInfo?.number}</div>
            <div className="text-sm text-gray-500">Chargement des informations...</div>
          </div>
        )

      case "transaction-form":
        return (
          <div className="space-y-6 w-full max-w-md mx-auto">
            <div className="text-xl font-bold text-gray-800 text-center">Nouvelle Transaction</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="payment">Paiement</option>
                  <option value="recharge">Recharge</option>
                  <option value="refund">Remboursement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {transactionType === "payment" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commerçant</label>
                <select
                  value={selectedMerchant}
                  onChange={(e) => setSelectedMerchant(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Sélectionnez un commerçant</option>
                  {merchants.map((merchant) => (
                    <option key={merchant} value={merchant}>
                      {merchant}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {transactionType === "recharge" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Options de recharge</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setRechargeAmount(amount)}
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      €{amount}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetTerminal}>
                Annuler
              </Button>
              <Button onClick={processTransaction}>
                Confirmer <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="text-center space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto" />
            <div className="text-xl font-bold text-gray-800">Traitement en cours</div>
            <div className="text-gray-600">Veuillez patienter...</div>
          </div>
        )

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto">
              <Check />
            </div>
            <div className="text-xl font-bold text-gray-800">Transaction réussie</div>
            <div className="text-gray-600">
              Montant: <span className="font-bold">€{currentAmount}</span>
            </div>
            <div className="text-sm text-gray-500">
              ID: <span>{lastTransaction?.id}</span>
            </div>
            <Button onClick={resetTerminal}>Nouvelle transaction</Button>
          </div>
        )

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mx-auto">
              <X />
            </div>
            <div className="text-xl font-bold text-gray-800">Échec de la transaction</div>
            <div className="text-gray-600">Une erreur s'est produite</div>
            <Button onClick={resetTerminal}>Réessayer</Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Terminal de Transaction RFID</h1>
          <p className="text-gray-600">Effectuez des transactions et rechargez des cartes via les bornes RFID</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Historique
          </Button>
          <Button>
            <QrCode className="w-4 h-4 mr-2" />
            Scanner QR Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal RFID */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col h-full min-h-[600px]">
                {/* Screen */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 text-gray-800 rounded-2xl p-8 mb-6 flex-grow flex flex-col justify-center items-center min-h-[400px]">
                  {renderTerminalDisplay()}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-2">
                  {["7", "8", "9", "C"].map((key, index) => (
                    <Button
                      key={key}
                      variant={key === "C" ? "destructive" : "secondary"}
                      className="h-12 text-lg font-bold"
                      onClick={() => (key === "C" ? clearAmount() : addToAmount(key))}
                    >
                      {key}
                    </Button>
                  ))}
                  {["4", "5", "6", "00"].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      className="h-12 text-lg font-bold"
                      onClick={() => addToAmount(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {["1", "2", "3", "0"].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      className="h-12 text-lg font-bold"
                      onClick={() => addToAmount(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  <Button variant="secondary" className="h-12 text-lg font-bold" onClick={() => addToAmount(".")}>
                    .
                  </Button>
                  {["50", "20", "10"].map((amount) => (
                    <Button
                      key={amount}
                      className="h-12 text-lg font-bold bg-purple-600 hover:bg-purple-700"
                      onClick={() => addToAmount(amount)}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Info & Recent Transactions */}
        <div className="space-y-6">
          {/* Card Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations Carte</h2>

              {!cardInfo ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Aucune carte détectée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl">
                      <CreditCard />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-800">Carte RFID</div>
                    <div className="text-gray-600">{cardInfo.number}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Titulaire</p>
                      <p className="text-sm text-gray-900 mt-1">{cardInfo.holder}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expiration</p>
                      <p className="text-sm text-gray-900 mt-1">{cardInfo.expiry}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-500">Solde</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">€{cardInfo.balance.toFixed(2)}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="outline" className="w-full">
                      <Info className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Transactions Récentes</h2>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === "recharge"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? (
                          <Plus className="w-5 h-5" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.merchant || (transaction.type === "recharge" ? "Recharge" : "Transaction")}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          transaction.type === "recharge" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? "+" : "-"}€{transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.type === "recharge" ? "Borne RFID" : transaction.merchant?.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-800">
                  <span>Voir toutes les transactions</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
