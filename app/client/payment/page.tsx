"use client"

import { useState, useRef, useEffect } from "react"
import { QrCodeIcon, CameraIcon, CheckIcon, XIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentData {
  commercant: string
  montant: number
  reference: string
  description: string
}

export default function ClientPayment() {
  const [step, setStep] = useState<"scan" | "confirm" | "success">("scan")
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [selectedCard, setSelectedCard] = useState("1")
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const cartes = [
    { id: "1", numero: "1234567890123456", type: "Standard", solde: 75000 },
    { id: "2", numero: "9876543210987654", type: "Premium", solde: 50000 },
  ]

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " Ar"
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error)
      // Simuler un scan pour la démo
      simulateQRScan()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  const simulateQRScan = () => {
    // Simulation d'un scan QR réussi
    setTimeout(() => {
      const mockPaymentData: PaymentData = {
        commercant: "SuperMarché Plus",
        montant: 15750,
        reference: "PAY-2024-001234",
        description: "Achat alimentaire",
      }
      setPaymentData(mockPaymentData)
      setStep("confirm")
      stopCamera()
    }, 2000)
  }

  const handlePayment = async () => {
    setLoading(true)

    // Simulation du paiement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStep("success")
    setLoading(false)
  }

  const resetPayment = () => {
    setStep("scan")
    setPaymentData(null)
    setCameraActive(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600 mb-2">{formatMontant(paymentData?.montant || 0)} payés à</p>
            <p className="font-medium text-gray-900 mb-6">{paymentData?.commercant}</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Référence de transaction</p>
              <p className="font-mono text-sm">{paymentData?.reference}</p>
            </div>
            <div className="space-y-3">
              <Button onClick={resetPayment} className="w-full">
                Nouveau paiement
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
        <h1 className="text-2xl font-bold text-gray-900">Paiement par QR Code</h1>
        <p className="text-gray-600">Scannez le QR code du commerçant pour payer</p>
      </div>

      {step === "scan" && (
        <div className="space-y-6">
          {/* Scanner QR */}
          <Card>
            <CardHeader>
              <CardTitle>Scanner le QR Code</CardTitle>
              <CardDescription>Pointez votre caméra vers le QR code du commerçant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {!cameraActive ? (
                  <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-8">
                    <QrCodeIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center mb-4">
                      Appuyez sur le bouton pour activer la caméra et scanner le QR code
                    </p>
                    <Button onClick={startCamera}>
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Activer la caméra
                    </Button>
                  </div>
                ) : (
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Overlay de scan */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button variant="secondary" onClick={stopCamera}>
                        <XIcon className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Démo */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Mode démo :</p>
                <p className="text-xs text-blue-600 mb-3">Cliquez sur le bouton ci-dessous pour simuler un scan QR</p>
                <Button size="sm" variant="outline" onClick={simulateQRScan}>
                  Simuler un scan QR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "confirm" && paymentData && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmer le paiement</CardTitle>
            <CardDescription>Vérifiez les détails avant de procéder au paiement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Détails du commerçant */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <QrCodeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{paymentData.commercant}</p>
                  <p className="text-sm text-gray-500">{paymentData.description}</p>
                </div>
              </div>
            </div>

            {/* Montant */}
            <div className="text-center py-6">
              <p className="text-sm text-gray-600 mb-2">Montant à payer</p>
              <p className="text-3xl font-bold text-gray-900">{formatMontant(paymentData.montant)}</p>
            </div>

            {/* Sélection de carte */}
            <div className="space-y-2">
              <Label>Payer avec</Label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                {cartes.map((carte) => (
                  <option key={carte.id} value={carte.id}>
                    Carte {carte.type} - {formatMontant(carte.solde)} disponible
                  </option>
                ))}
              </select>
            </div>

            {/* Vérification du solde */}
            {(() => {
              const carteSelectionnee = cartes.find((c) => c.id === selectedCard)
              const soldeInsuffisant = carteSelectionnee && carteSelectionnee.solde < paymentData.montant

              return soldeInsuffisant ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Solde insuffisant sur cette carte. Veuillez choisir une autre carte ou recharger votre compte.
                  </AlertDescription>
                </Alert>
              ) : null
            })()}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep("scan")} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1"
                disabled={
                  loading ||
                  (() => {
                    const carteSelectionnee = cartes.find((c) => c.id === selectedCard)
                    return carteSelectionnee ? carteSelectionnee.solde < paymentData.montant : true
                  })()
                }
              >
                {loading ? "Paiement en cours..." : "Confirmer le paiement"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
