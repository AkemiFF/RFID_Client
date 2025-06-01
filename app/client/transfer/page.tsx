"use client"

import { useState, useEffect } from "react"
import { ArrowRightIcon, UserIcon, CheckIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { transactionsService, CreateTransactionData } from "../services/transactions.service"

interface Contact {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  avatar?: string
}

interface Carte {
  id: string
  numero: string
  type: string
  solde: number
}

export default function ClientTransfer() {
  const [step, setStep] = useState(1)
  const [transferData, setTransferData] = useState({
    destinataire: "",
    montant: "",
    motif: "",
    carteSource: "",
    carteDestinataire: "",
  })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [cartes, setCartes] = useState<Carte[]>([])
  const [transactionResult, setTransactionResult] = useState<any>(null)

  // Contacts récents simulés (vous pouvez les récupérer depuis votre API)
  const contactsRecents: Contact[] = [
    { id: 1, nom: "Martin", prenom: "Sophie", telephone: "+261 34 12 345 67", email: "sophie.martin@email.com" },
    { id: 2, nom: "Raddkoto", prenom: "Jean", telephone: "+261 33 98 765 43", email: "jean.rakoto@email.com" },
    { id: 3, nom: "Andry", prenom: "Marie", telephone: "+261 32 55 444 33", email: "marie.andry@email.com" },
  ]

  // Simulation des cartes (remplacez par un appel API réel)
  useEffect(() => {
    // Ici vous pouvez appeler votre API pour récupérer les cartes de l'utilisateur
    const cartesSimulees: Carte[] = [
      { id: "1", numero: "1234567890123456", type: "Standard", solde: 75000 },
      { id: "2", numero: "9876543210987654", type: "Premium", solde: 50000 },
    ]
    setCartes(cartesSimulees)
    if (cartesSimulees.length > 0) {
      setTransferData(prev => ({ ...prev, carteSource: cartesSimulees[0].id }))
    }
  }, [])

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " Ar"
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setTransferData({ ...transferData, destinataire: contact.telephone })
  }

  const calculateFees = (montant: number): number => {
    // Logique de calcul des frais selon vos règles métier
    if (montant <= 10000) return 0
    if (montant <= 50000) return Math.ceil(montant * 0.01) // 1%
    return Math.ceil(montant * 0.005) // 0.5% pour les gros montants
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const montant = parseInt(transferData.montant)
      const frais = calculateFees(montant)
      
      // Vérifier le solde disponible
      const carteSource = cartes.find(c => c.id === transferData.carteSource)
      if (!carteSource || carteSource.solde < (montant + frais)) {
        throw new Error("Solde insuffisant pour effectuer cette transaction")
      }

      // Préparer les données de transaction
      const transactionData: CreateTransactionData = {
        carte: transferData.carteSource,
        type_transaction: "TRANSFERT",
        montant: montant,
        description: transferData.motif || "Transfert d'argent",
        categorie: "TRANSFERT",
        localisation: "Client Mobile", // Vous pouvez récupérer la géolocalisation
      }

      // Créer la transaction
      const result = await transactionsService.createTransaction(transactionData)
      
      if (result.statut === "VALIDEE") {
        setTransactionResult(result)
        setSuccess(true)
      } else {
        throw new Error(result.message_erreur || "Erreur lors du transfert")
      }

    } catch (err: any) {
      console.error("Erreur lors du transfert:", err)
      setError(err.message || "Une erreur est survenue lors du transfert")
    } finally {
      setLoading(false)
    }
  }

  const resetTransfer = () => {
    setStep(1)
    setTransferData({ 
      destinataire: "", 
      montant: "", 
      motif: "", 
      carteSource: cartes.length > 0 ? cartes[0].id : "",
      carteDestinataire: ""
    })
    setSelectedContact(null)
    setSuccess(false)
    setError("")
    setTransactionResult(null)
  }

  if (success && transactionResult) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Transfert réussi !</h2>
            <p className="text-gray-600 mb-4">
              {formatMontant(parseInt(transferData.montant))} ont été envoyés à {selectedContact?.prenom}{" "}
              {selectedContact?.nom || transferData.destinataire}
            </p>
            
            {/* Détails de la transaction */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Détails de la transaction</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Référence:</span>
                  <span className="font-mono">{transactionResult.reference_interne}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(transactionResult.date_transaction).toLocaleString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nouveau solde:</span>
                  <span className="font-semibold">{formatMontant(transactionResult.solde_apres)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={resetTransfer} className="w-full">
                Nouveau transfert
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                Retour au dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfert d'argent</h1>
        <p className="text-gray-600">Envoyez de l'argent rapidement et en sécurité</p>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-purple-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisir le destinataire</CardTitle>
            <CardDescription>Sélectionnez un contact ou saisissez un numéro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contacts récents */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Contacts récents</Label>
              <div className="grid grid-cols-1 gap-3">
                {contactsRecents.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? "border-purple-500 bg-purple-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.prenom} {contact.nom}
                        </p>
                        <p className="text-sm text-gray-500">{contact.telephone}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ou saisir manuellement */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinataire">Numéro de carte ou téléphone</Label>
              <Input
                id="destinataire"
                placeholder="Numéro de carte ou téléphone du destinataire"
                value={transferData.destinataire}
                onChange={(e) => setTransferData({ ...transferData, destinataire: e.target.value })}
              />
            </div>

            <Button onClick={() => setStep(2)} className="w-full" disabled={!transferData.destinataire}>
              Continuer
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Montant et détails</CardTitle>
            <CardDescription>Saisissez le montant à transférer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destinataire sélectionné */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Destinataire</p>
              <p className="font-medium text-gray-900">
                {selectedContact ? `${selectedContact.prenom} ${selectedContact.nom}` : transferData.destinataire}
              </p>
            </div>

            {/* Carte source */}
            <div className="space-y-2">
              <Label>Carte source</Label>
              <select
                value={transferData.carteSource}
                onChange={(e) => setTransferData({ ...transferData, carteSource: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                {cartes.map((carte) => (
                  <option key={carte.id} value={carte.id}>
                    Carte {carte.type} - {formatMontant(carte.solde)} disponible
                  </option>
                ))}
              </select>
            </div>

            {/* Montant */}
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (Ar)</Label>
              <Input
                id="montant"
                type="number"
                placeholder="0"
                value={transferData.montant}
                onChange={(e) => setTransferData({ ...transferData, montant: e.target.value })}
                className="text-lg"
              />
              {transferData.montant && (
                <p className="text-sm text-gray-500">
                  Frais: {formatMontant(calculateFees(parseInt(transferData.montant) || 0))}
                </p>
              )}
            </div>

            {/* Montants rapides */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Montants rapides</Label>
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 25000, 50000].map((montant) => (
                  <button
                    key={montant}
                    onClick={() => setTransferData({ ...transferData, montant: montant.toString() })}
                    className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {formatMontant(montant)}
                  </button>
                ))}
              </div>
            </div>

            {/* Motif */}
            <div className="space-y-2">
              <Label htmlFor="motif">Motif (optionnel)</Label>
              <Input
                id="motif"
                placeholder="Ex: Remboursement, cadeau..."
                value={transferData.motif}
                onChange={(e) => setTransferData({ ...transferData, motif: e.target.value })}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1"
                disabled={!transferData.montant || parseInt(transferData.montant) <= 0}
              >
                Continuer
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>Vérifiez les détails de votre transfert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Destinataire</span>
                <span className="font-medium">
                  {selectedContact ? `${selectedContact.prenom} ${selectedContact.nom}` : transferData.destinataire}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Montant</span>
                <span className="font-medium text-lg">{formatMontant(parseInt(transferData.montant))}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Frais</span>
                <span className="font-medium">{formatMontant(calculateFees(parseInt(transferData.montant)))}</span>
              </div>
              {transferData.motif && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Motif</span>
                  <span className="font-medium">{transferData.motif}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg font-bold">
                <span>Total à débiter</span>
                <span>{formatMontant(parseInt(transferData.montant) + calculateFees(parseInt(transferData.montant)))}</span>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Le transfert sera effectué immédiatement et ne pourra pas être annulé.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={loading}>
                Modifier
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? "Envoi en cours..." : "Confirmer le transfert"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}