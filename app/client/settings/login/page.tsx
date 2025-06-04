"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveAdminAuthData } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { CreditCardIcon, EyeIcon, SlashIcon as EyeSlashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLogin() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        cardNumber: "",
    })
    const [loginMethod, setLoginMethod] = useState<"email" | "card">("email")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()

            saveAdminAuthData(data)
            console.log("Login successful", data)

            router.push("/admin")
        } catch (err) {
            setError("Identifiants incorrects. Veuillez réessayer.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCardIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">RFID Pay</CardTitle>
                    <CardDescription>Connectez-vous à votre compte client</CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Méthode de connexion */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setLoginMethod("email")}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${loginMethod === "email" ? "bg-white text-purple-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod("card")}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${loginMethod === "card" ? "bg-white text-purple-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Carte RFID
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {loginMethod === "email" ? (
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Numéro de carte RFID</Label>
                                <Input
                                    id="cardNumber"
                                    type="text"
                                    placeholder="1234567890123456"
                                    value={formData.cardNumber}
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button className="text-sm text-purple-600 hover:text-purple-500">Mot de passe oublié ?</button>
                    </div>

                    {/* Démo */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-2">Démo :</p>
                        <p className="text-xs text-blue-600">Utilisez n'importe quel email/carte et mot de passe pour tester</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
