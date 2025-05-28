"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Plus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Shield,
  X,
  BarChart3,
  Activity,
  Zap,
  RefreshCw,
  Search,
  Info,
} from "lucide-react"
import {
  clientCardsService,
  type ClientCard,
  type CardTransaction,
  type CardRequest,
  type CardLimits,
  type CardSettings,
} from "@/lib/services/client-cards.service"

export default function ClientCardsPage() {
  const [cards, setCards] = useState<ClientCard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<ClientCard | null>(null)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [showNewCardModal, setShowNewCardModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showLimitsModal, setShowLimitsModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showLostCardModal, setShowLostCardModal] = useState(false)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>([])
  const [showBalances, setShowBalances] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // États pour les formulaires
  const [newCardRequest, setNewCardRequest] = useState<CardRequest>({
    type: "standard",
    motif: "",
    adresseLivraison: "",
    urgence: false,
  })

  const [pinForm, setPinForm] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  })

  const [limitsForm, setLimitsForm] = useState<CardLimits>({
    plafondJournalier: 0,
    plafondMensuel: 0,
  })

  const [settingsForm, setSettingsForm] = useState<CardSettings>({
    notifications: {
      transactions: true,
      limites: true,
      securite: true,
    },
    securite: {
      pinRequis: true,
      biometrieActive: false,
      limiteGeographique: false,
    },
    preferences: {
      nomPersonnalise: "",
      couleur: "#6366f1",
    },
  })

  const [lostCardForm, setLostCardForm] = useState({
    circumstances: "",
  })

  const [replaceForm, setReplaceForm] = useState({
    reason: "",
  })

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      setLoading(true)
      const data = await clientCardsService.getCards()
      setCards(data)
    } catch (error) {
      console.error("Erreur lors du chargement des cartes:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCardTransactions = async (cardId: string) => {
    try {
      const data = await clientCardsService.getCardTransactions(cardId)
      setCardTransactions(data.transactions)
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error)
    }
  }

  const handleCardAction = async (action: string, cardId: string) => {
    try {
      switch (action) {
        case "block":
          await clientCardsService.blockCard(cardId, "Blocage demandé par le client")
          break
        case "unblock":
          await clientCardsService.unblockCard(cardId)
          break
        case "activate":
          // Ouvrir le modal PIN pour activation
          setShowPinModal(true)
          return
      }
      await loadCards()
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error)
    }
  }

  const handlePinChange = async () => {
    if (!selectedCard) return

    if (pinForm.newPin !== pinForm.confirmPin) {
      alert("Les nouveaux PINs ne correspondent pas")
      return
    }

    try {
      await clientCardsService.changePIN(selectedCard.id, pinForm.currentPin, pinForm.newPin)
      setShowPinModal(false)
      setPinForm({ currentPin: "", newPin: "", confirmPin: "" })
      alert("PIN modifié avec succès")
    } catch (error) {
      console.error("Erreur lors du changement de PIN:", error)
    }
  }

  const handleLimitsUpdate = async () => {
    if (!selectedCard) return

    try {
      await clientCardsService.updateLimits(selectedCard.id, limitsForm)
      setShowLimitsModal(false)
      await loadCards()
      alert("Limites mises à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour des limites:", error)
    }
  }

  const handleSettingsUpdate = async () => {
    if (!selectedCard) return

    try {
      await clientCardsService.updateSettings(selectedCard.id, settingsForm)
      setShowSettingsModal(false)
      await loadCards()
      alert("Paramètres mis à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error)
    }
  }

  const handleNewCardRequest = async () => {
    try {
      const result = await clientCardsService.requestNewCard(newCardRequest)
      setShowNewCardModal(false)
      setNewCardRequest({
        type: "standard",
        motif: "",
        adresseLivraison: "",
        urgence: false,
      })
      alert(`Demande envoyée ! ID: ${result.requestId}. Livraison estimée: ${result.estimatedDelivery}`)
    } catch (error) {
      console.error("Erreur lors de la demande de carte:", error)
    }
  }

  const handleReportLost = async () => {
    if (!selectedCard) return

    try {
      await clientCardsService.reportLostCard(selectedCard.id, lostCardForm.circumstances)
      setShowLostCardModal(false)
      setLostCardForm({ circumstances: "" })
      await loadCards()
      alert("Perte signalée avec succès")
    } catch (error) {
      console.error("Erreur lors du signalement:", error)
    }
  }

  const handleRequestReplacement = async () => {
    if (!selectedCard) return

    try {
      const result = await clientCardsService.requestReplacement(selectedCard.id, replaceForm.reason)
      setShowReplaceModal(false)
      setReplaceForm({ reason: "" })
      alert(`Remplacement demandé ! ID: ${result.requestId}. Coût: ${result.cost} Ar`)
    } catch (error) {
      console.error("Erreur lors de la demande de remplacement:", error)
    }
  }

  const openCardDetails = (card: ClientCard) => {
    setSelectedCard(card)
    setShowCardDetails(true)
    loadCardTransactions(card.id)

    // Pré-remplir les formulaires
    setLimitsForm({
      plafondJournalier: card.plafondJournalier,
      plafondMensuel: card.plafondMensuel,
    })

    setSettingsForm({
      notifications: {
        transactions: true,
        limites: true,
        securite: true,
      },
      securite: {
        pinRequis: true,
        biometrieActive: false,
        limiteGeographique: false,
      },
      preferences: {
        nomPersonnalise: card.nomPersonnalise || "",
        couleur: card.couleur,
      },
    })
  }

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.nomPersonnalise?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || card.statut === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalBalance = cards.reduce((sum, card) => sum + card.solde, 0)
  const activeCards = cards.filter((card) => card.statut === "active").length
  const totalTransactions = cards.reduce((sum, card) => sum + card.nombreTransactions, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Cartes</h1>
          <p className="text-gray-600">Gérez vos cartes RFID et leurs paramètres</p>
        </div>
        <Button onClick={() => setShowNewCardModal(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle carte
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde total</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {showBalances ? clientCardsService.formatAmount(totalBalance) : "••••••"}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setShowBalances(!showBalances)}>
                    {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cartes actives</p>
                <p className="text-2xl font-bold text-gray-900">{activeCards}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total cartes</p>
                <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par numéro ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Active</option>
          <option value="bloquee">Bloquée</option>
          <option value="suspendue">Suspendue</option>
          <option value="expiree">Expirée</option>
        </select>
      </div>

      {/* Liste des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: card.couleur }} />
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" style={{ color: card.couleur }} />
                  <Badge className={clientCardsService.getCardStatusColor(card.statut)}>
                    {clientCardsService.getCardStatusLabel(card.statut)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openCardDetails(card)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCard(card)
                      setShowSettingsModal(true)
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Numéro de carte</p>
                  <p className="font-mono text-lg font-semibold">{clientCardsService.formatCardNumber(card.numero)}</p>
                </div>

                {card.nomPersonnalise && (
                  <div>
                    <p className="text-sm text-gray-600">Nom personnalisé</p>
                    <p className="font-medium">{card.nomPersonnalise}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{clientCardsService.getCardTypeLabel(card.type)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Solde</p>
                  <p className="text-xl font-bold" style={{ color: card.couleur }}>
                    {showBalances ? clientCardsService.formatAmount(card.solde) : "••••••"}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Limite journalière</span>
                    <span>
                      {clientCardsService.calculateUsagePercentage(card.utiliseJournalier, card.plafondJournalier)}%
                    </span>
                  </div>
                  <Progress
                    value={clientCardsService.calculateUsagePercentage(card.utiliseJournalier, card.plafondJournalier)}
                    className="h-2"
                  />
                </div>

                {clientCardsService.isCardExpiringSoon(card.dateExpiration) && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Expire bientôt</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {card.statut === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCardAction("block", card.id)}
                    className="flex-1"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Bloquer
                  </Button>
                )}
                {card.statut === "bloquee" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCardAction("unblock", card.id)}
                    className="flex-1"
                  >
                    <Unlock className="w-4 h-4 mr-1" />
                    Débloquer
                  </Button>
                )}
                {card.statut === "suspendue" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCard(card)
                      setShowPinModal(true)
                    }}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Activer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal détails de carte */}
      {showCardDetails && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Détails de la carte</h2>
                <Button variant="ghost" onClick={() => setShowCardDetails(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Numéro</Label>
                      <p className="font-mono text-lg">{clientCardsService.formatCardNumber(selectedCard.numero)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Type</Label>
                      <p>{clientCardsService.getCardTypeLabel(selectedCard.type)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Statut</Label>
                      <Badge className={clientCardsService.getCardStatusColor(selectedCard.statut)}>
                        {clientCardsService.getCardStatusLabel(selectedCard.statut)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Solde actuel</Label>
                      <p className="text-2xl font-bold text-green-600">
                        {clientCardsService.formatAmount(selectedCard.solde)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Limites et utilisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Limite journalière</span>
                        <span>
                          {clientCardsService.formatAmount(selectedCard.utiliseJournalier)} /{" "}
                          {clientCardsService.formatAmount(selectedCard.plafondJournalier)}
                        </span>
                      </div>
                      <Progress
                        value={clientCardsService.calculateUsagePercentage(
                          selectedCard.utiliseJournalier,
                          selectedCard.plafondJournalier,
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Limite mensuelle</span>
                        <span>
                          {clientCardsService.formatAmount(selectedCard.utiliseMensuel)} /{" "}
                          {clientCardsService.formatAmount(selectedCard.plafondMensuel)}
                        </span>
                      </div>
                      <Progress
                        value={clientCardsService.calculateUsagePercentage(
                          selectedCard.utiliseMensuel,
                          selectedCard.plafondMensuel,
                        )}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Frais mensuels</Label>
                      <p>{clientCardsService.formatAmount(selectedCard.fraisMensuels)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPinModal(true)
                        setShowCardDetails(false)
                      }}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <Shield className="w-6 h-6" />
                      <span className="text-sm">Changer PIN</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowLimitsModal(true)
                        setShowCardDetails(false)
                      }}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">Modifier limites</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowLostCardModal(true)
                        setShowCardDetails(false)
                      }}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <AlertTriangle className="w-6 h-6" />
                      <span className="text-sm">Signaler perte</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReplaceModal(true)
                        setShowCardDetails(false)
                      }}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <RefreshCw className="w-6 h-6" />
                      <span className="text-sm">Remplacer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions récentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Transactions récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cardTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transaction.type === "credit" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {clientCardsService.formatAmount(transaction.montant)}
                          </p>
                          <Badge
                            className={
                              transaction.statut === "reussie"
                                ? "bg-green-100 text-green-800"
                                : transaction.statut === "echouee"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {transaction.statut}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Modal nouvelle carte */}
      {showNewCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Demander une nouvelle carte</h2>
                <Button variant="ghost" onClick={() => setShowNewCardModal(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="cardType">Type de carte</Label>
                <select
                  id="cardType"
                  value={newCardRequest.type}
                  onChange={(e) => setNewCardRequest({ ...newCardRequest, type: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="standard">Standard (Gratuite)</option>
                  <option value="premium">Premium (5,000 Ar)</option>
                  <option value="business">Business (10,000 Ar)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="motif">Motif de la demande</Label>
                <Textarea
                  id="motif"
                  value={newCardRequest.motif}
                  onChange={(e) => setNewCardRequest({ ...newCardRequest, motif: e.target.value })}
                  placeholder="Expliquez pourquoi vous avez besoin de cette carte..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="adresse">Adresse de livraison</Label>
                <Textarea
                  id="adresse"
                  value={newCardRequest.adresseLivraison}
                  onChange={(e) => setNewCardRequest({ ...newCardRequest, adresseLivraison: e.target.value })}
                  placeholder="Adresse complète pour la livraison..."
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgence"
                  checked={newCardRequest.urgence}
                  onChange={(e) => setNewCardRequest({ ...newCardRequest, urgence: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="urgence">Livraison urgente (+2,000 Ar)</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewCardModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleNewCardRequest} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Demander
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal changement PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Changer le PIN</h2>
                <Button variant="ghost" onClick={() => setShowPinModal(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="currentPin">PIN actuel</Label>
                <Input
                  id="currentPin"
                  type="password"
                  value={pinForm.currentPin}
                  onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                  maxLength={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPin">Nouveau PIN</Label>
                <Input
                  id="newPin"
                  type="password"
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                  maxLength={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPin">Confirmer le nouveau PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                  maxLength={4}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPinModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handlePinChange} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal modification limites */}
      {showLimitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Modifier les limites</h2>
                <Button variant="ghost" onClick={() => setShowLimitsModal(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="dailyLimit">Limite journalière (Ar)</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={limitsForm.plafondJournalier}
                  onChange={(e) => setLimitsForm({ ...limitsForm, plafondJournalier: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlyLimit">Limite mensuelle (Ar)</Label>
                <Input
                  id="monthlyLimit"
                  type="number"
                  value={limitsForm.plafondMensuel}
                  onChange={(e) => setLimitsForm({ ...limitsForm, plafondMensuel: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">Les modifications prendront effet dans 24h</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowLimitsModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleLimitsUpdate} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal signalement perte */}
      {showLostCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Signaler une perte</h2>
                <Button variant="ghost" onClick={() => setShowLostCardModal(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Cette action bloquera immédiatement votre carte</span>
                </div>
              </div>

              <div>
                <Label htmlFor="circumstances">Circonstances de la perte</Label>
                <Textarea
                  id="circumstances"
                  value={lostCardForm.circumstances}
                  onChange={(e) => setLostCardForm({ ...lostCardForm, circumstances: e.target.value })}
                  placeholder="Décrivez les circonstances de la perte..."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowLostCardModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleReportLost} className="flex-1 bg-red-600 hover:bg-red-700">
                  Signaler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal demande remplacement */}
      {showReplaceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Demander un remplacement</h2>
                <Button variant="ghost" onClick={() => setShowReplaceModal(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="reason">Raison du remplacement</Label>
                <select
                  id="reason"
                  value={replaceForm.reason}
                  onChange={(e) => setReplaceForm({ ...replaceForm, reason: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sélectionnez une raison</option>
                  <option value="defectueuse">Carte défectueuse</option>
                  <option value="endommagee">Carte endommagée</option>
                  <option value="usure">Usure normale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">Frais de remplacement: 3,000 Ar</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowReplaceModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleRequestReplacement} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Demander
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
