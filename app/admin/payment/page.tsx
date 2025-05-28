"use client"

import Layout from "@/components/layout/Layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from "@/components/ui/Modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  QrCodeIcon,
  ReceiptRefundIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import { StoreIcon } from "lucide-react"
import { useState } from "react"

interface PaymentData {
  beneficiary: string
  category: string
  amount: string
  note: string
  paymentMethod: string
}

const categories = [
  { name: "Commerces", icon: StoreIcon, color: "purple" },
  { name: "Transports", icon: TruckIcon, color: "blue" },
  { name: "Restaurants", icon: BuildingOfficeIcon, color: "green" },
  { name: "Contacts", icon: UsersIcon, color: "yellow" },
  { name: "Services", icon: BoltIcon, color: "red" },
  { name: "Autres", icon: EllipsisHorizontalIcon, color: "indigo" },
]

const favorites = [
  { name: "Carrefour Market", category: "Supermarché", icon: StoreIcon, color: "purple" },
  { name: "Métro Paris", category: "Transport", icon: TruckIcon, color: "blue" },
  { name: "Le Bistrot", category: "Restaurant", icon: BuildingOfficeIcon, color: "green" },
  { name: "Marie Lambert", category: "Contact", icon: UsersIcon, color: "yellow" },
]

const recentMerchants = [
  { name: "EDF", category: "Électricité", icon: BoltIcon, color: "red" },
  { name: "UGC Cinéma", category: "Loisirs", icon: BuildingOfficeIcon, color: "indigo" },
  { name: "SNCF", category: "Transport", icon: TruckIcon, color: "blue" },
  { name: "Starbucks", category: "Café", icon: BuildingOfficeIcon, color: "green" },
]

const allMerchants = [
  { name: "Carrefour Market", category: "Commerce", lastTransaction: "14/06/2023", amount: "€42.35", favorite: true },
  { name: "Métro Paris", category: "Transport", lastTransaction: "15/06/2023", amount: "€1.90", favorite: true },
  {
    name: "Le Bistrot Parisien",
    category: "Restaurant",
    lastTransaction: "10/06/2023",
    amount: "€28.50",
    favorite: false,
  },
  { name: "Marie Lambert", category: "Contact", lastTransaction: "05/06/2023", amount: "€15.00", favorite: true },
]

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    beneficiary: "",
    category: "",
    amount: "",
    note: "",
    paymentMethod: "card",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const selectBeneficiary = (name: string, category: string) => {
    setPaymentData((prev) => ({ ...prev, beneficiary: name, category }))
    setCurrentStep(2)
  }

  const setQuickAmount = (amount: number) => {
    setPaymentData((prev) => ({ ...prev, amount: amount.toString() }))
  }

  const confirmPayment = () => {
    setShowSuccessModal(true)
  }

  const resetPayment = () => {
    setPaymentData({
      beneficiary: "",
      category: "",
      amount: "",
      note: "",
      paymentMethod: "card",
    })
    setCurrentStep(1)
    setShowSuccessModal(false)
  }

  const renderStepIndicator = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                {step < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : <span>{step}</span>}
              </div>
              <div className={`ml-3 text-sm font-medium ${step <= currentStep ? "text-purple-600" : "text-gray-500"}`}>
                {step === 1 && "Bénéficiaire"}
                {step === 2 && "Montant"}
                {step === 3 && "Confirmation"}
              </div>
              {step < 3 && <div className="flex-1 border-t-2 border-gray-200 mx-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="merchant-category flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all"
              >
                <div
                  className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center text-${category.color}-600 mb-2`}
                >
                  <category.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Favoris</CardTitle>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.name}
                className="merchant-item flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => selectBeneficiary(favorite.name, favorite.category)}
              >
                <div
                  className={`flex-shrink-0 h-12 w-12 bg-${favorite.color}-100 rounded-full flex items-center justify-center text-${favorite.color}-600`}
                >
                  <favorite.icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">{favorite.name}</div>
                  <div className="text-xs text-gray-500">{favorite.category}</div>
                </div>
                <StarIcon className="h-5 w-5 text-purple-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Récents</CardTitle>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMerchants.map((merchant) => (
              <div
                key={merchant.name}
                className="merchant-item flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => selectBeneficiary(merchant.name, merchant.category)}
              >
                <div
                  className={`flex-shrink-0 h-12 w-12 bg-${merchant.color}-100 rounded-full flex items-center justify-center text-${merchant.color}-600`}
                >
                  <merchant.icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                  <div className="text-xs text-gray-500">{merchant.category}</div>
                </div>
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Merchants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tous les bénéficiaires</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              A-Z
            </Button>
            <Button variant="outline" size="sm">
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bénéficiaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière transaction
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allMerchants.map((merchant) => (
                  <tr
                    key={merchant.name}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => selectBeneficiary(merchant.name, merchant.category)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <StoreIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                          <div className="text-sm text-gray-500">{merchant.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{merchant.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{merchant.lastTransaction}</div>
                      <div className="text-sm text-gray-500">{merchant.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Payer
                        </Button>
                        <Button variant="ghost" size="sm">
                          {merchant.favorite ? (
                            <StarIcon className="h-4 w-4 text-purple-600" />
                          ) : (
                            <StarIcon className="h-4 w-4" />
                          )}
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
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <StoreIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-medium text-gray-900">{paymentData.beneficiary}</div>
              <div className="text-sm text-gray-500">{paymentData.category}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  id="amount"
                  className="pl-7 pr-12 py-4 text-xl"
                  placeholder="0.00"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, amount: e.target.value }))}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Select defaultValue="EUR">
                    <SelectTrigger className="w-20 border-0 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label>Montant rapide</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[5, 10, 20, 50, 100, 200].map((amount) => (
                  <Button key={amount} variant="outline" onClick={() => setQuickAmount(amount)}>
                    €{amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="note">Note (optionnel)</Label>
              <Input
                id="note"
                placeholder="Ex: Courses du week-end"
                value={paymentData.note}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>

            <div>
              <Label>Méthode de paiement</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    id="payment-card"
                    name="payment-method"
                    type="radio"
                    checked={paymentData.paymentMethod === "card"}
                    onChange={() => setPaymentData((prev) => ({ ...prev, paymentMethod: "card" }))}
                    className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
                  />
                  <label htmlFor="payment-card" className="ml-3 flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2">
                      <CreditCardIcon className="h-4 w-4" />
                    </div>
                    Carte RFID •••• 4589
                  </label>
                </div>
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    id="payment-bank"
                    name="payment-method"
                    type="radio"
                    checked={paymentData.paymentMethod === "bank"}
                    onChange={() => setPaymentData((prev) => ({ ...prev, paymentMethod: "bank" }))}
                    className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
                  />
                  <label htmlFor="payment-bank" className="ml-3 flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                      <BuildingOfficeIcon className="h-4 w-4" />
                    </div>
                    Virement bancaire
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Continuer
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Paiement prêt à être envoyé</h2>
            <p className="mt-2 text-gray-600">Vérifiez les détails de votre transaction avant de confirmer</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">Destinataire</div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <StoreIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{paymentData.beneficiary}</div>
                  <div className="text-xs text-gray-500">{paymentData.category}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">Montant</div>
              <div className="text-2xl font-bold text-purple-600">€{paymentData.amount}</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">Frais</div>
              <div className="text-lg text-gray-600">€0.00</div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">Total</div>
                <div className="text-xl font-bold text-gray-900">€{paymentData.amount}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">Méthode de paiement</div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <CreditCardIcon className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Carte RFID •••• 4589</div>
                </div>
              </div>
            </div>

            {paymentData.note && (
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">Note</div>
                <div className="text-sm text-gray-600">{paymentData.note}</div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button onClick={confirmPayment}>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Confirmer le paiement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Effectuer un paiement</h1>
          <p className="text-gray-600">
            {currentStep === 1 && "Sélectionnez le bénéficiaire de votre transaction"}
            {currentStep === 2 && "Entrez le montant à payer"}
            {currentStep === 3 && "Confirmez votre transaction"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <QrCodeIcon className="h-4 w-4 mr-2" />
            Scanner QR
          </Button>
          {currentStep === 1 && (
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau bénéficiaire
            </Button>
          )}
        </div>
      </div>

      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Paiement effectué avec succès!"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Destinataire:</span>
              <span className="text-sm font-medium text-gray-900">{paymentData.beneficiary}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Montant:</span>
              <span className="text-sm font-medium text-gray-900">€{paymentData.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date:</span>
              <span className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Référence:</span>
              <span className="text-sm font-medium text-gray-900">RFID-{Math.random().toString(36).substr(2, 9)}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={resetPayment} className="flex-1">
              Fermer
            </Button>
            <Button className="flex-1">
              <ReceiptRefundIcon className="h-4 w-4 mr-2" />
              Voir le reçu
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
