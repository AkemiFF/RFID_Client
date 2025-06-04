"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clientCardsService, type ClientCard } from "@/lib/services/client-cards.service"
import {
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  History,
  Plus,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ClientCardsPage() {
  const [cards, setCards] = useState<ClientCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true)
        const data = await clientCardsService.getCards();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array");
        }
        setCards(data)
        setError(null)
      } catch (err) {
        setError("Impossible de charger vos cartes. Veuillez réessayer.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  const handleCardClick = (cardId: string) => {
    router.push(`/client/cards/${cardId}`)
  }

  const handleRequestNewCard = () => {
    router.push("/client/cards/request")
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case "ENTREPRISE":
        return <Building className="h-6 w-6" />
      case "PREMIUM":
        return <CreditCard className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes Cartes</h1>
        <Button onClick={handleRequestNewCard}>
          <Plus className="mr-2 h-4 w-4" /> Demander une carte
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <div>
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm text-muted-foreground">Veuillez vérifier votre connexion et réessayer.</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : cards.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Aucune carte trouvée</p>
                <p className="text-sm text-muted-foreground">
                  Vous n&apos;avez pas encore de carte. Demandez votre première carte maintenant.
                </p>
              </div>
              <Button onClick={handleRequestNewCard}>
                <Plus className="mr-2 h-4 w-4" /> Demander une carte
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Cartes actives</TabsTrigger>
            <TabsTrigger value="all">Toutes les cartes</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards
                .filter((card) => card.statut === "ACTIVE")
                .map((card) => (
                  <Card
                    key={card.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick(card.id)}
                    style={{ borderTop: `4px solid ${card.couleur}` }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCardIcon(card.type)}
                          {card.nomPersonnalise || clientCardsService.getCardTypeLabel(card.type)}
                        </CardTitle>
                        <Badge variant="outline" className={clientCardsService.getCardStatusColor(card.statut)}>
                          {clientCardsService.getCardStatusLabel(card.statut)}
                        </Badge>
                      </div>
                      <CardDescription>{clientCardsService.formatCardNumber(card.numero)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Solde disponible</span>
                        <span className="text-xl font-bold">{clientCardsService.formatAmount(card.solde)}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilisation quotidienne</span>
                          <span>
                            {clientCardsService.calculateUsagePercentage(
                              card.utiliseJournalier,
                              card.plafondJournalier,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={clientCardsService.calculateUsagePercentage(
                            card.utiliseJournalier,
                            card.plafondJournalier,
                          )}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Exp: {clientCardsService.formatDate(card.dateExpiration)}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span>{card.nombreTransactions} trans.</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between w-full text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Frais: {clientCardsService.formatAmount(card.fraisMensuels)}/mois</span>
                        </div>
                        <div className="flex items-center text-primary">
                          <span>Détails</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(card.id)}
                  style={{ borderTop: `4px solid ${card.couleur}` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCardIcon(card.type)}
                        {card.nomPersonnalise || clientCardsService.getCardTypeLabel(card.type)}
                      </CardTitle>
                      <Badge variant="outline" className={clientCardsService.getCardStatusColor(card.statut)}>
                        {clientCardsService.getCardStatusLabel(card.statut)}
                      </Badge>
                    </div>
                    <CardDescription>{clientCardsService.formatCardNumber(card.numero)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Solde disponible</span>
                      <span className="text-xl font-bold">{clientCardsService.formatAmount(card.solde)}</span>
                    </div>

                    {card.statut === "ACTIVE" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilisation quotidienne</span>
                          <span>
                            {clientCardsService.calculateUsagePercentage(
                              card.utiliseJournalier,
                              card.plafondJournalier,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={clientCardsService.calculateUsagePercentage(
                            card.utiliseJournalier,
                            card.plafondJournalier,
                          )}
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Exp: {clientCardsService.formatDate(card.dateExpiration)}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <span>{card.nombreTransactions} trans.</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between w-full text-sm">
                      <div className="flex items-center text-muted-foreground">
                        {card.statut === "ACTIVE" ? (
                          <>
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>Frais: {clientCardsService.formatAmount(card.fraisMensuels)}/mois</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              Dernière mise à jour:{" "}
                              {card.dernierUtilisation ? new Date(card.dernierUtilisation).toLocaleDateString() : "N/A"}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-primary">
                        <span>Détails</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Protégez vos cartes contre la fraude et les utilisations non autorisées.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/client/security")}>
              Paramètres de sécurité
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Préférences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Personnalisez vos cartes et définissez vos préférences de notification.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/client/settings")}>
              Gérer les préférences
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualisez vos habitudes de dépenses et suivez votre utilisation.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/client/statistics")}>
              Voir les statistiques
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
