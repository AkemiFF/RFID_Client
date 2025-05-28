"use client"

import { useState, useEffect } from "react"
import {
  ShieldIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
  SmartphoneIcon,
  CreditCardIcon,
  GlobeIcon,
  LockIcon,
  CheckIcon,
  XIcon as XMarkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface UserSettings {
  notifications: {
    transactions: boolean
    security: boolean
    marketing: boolean
    email: boolean
    sms: boolean
    push: boolean
  }
  security: {
    twoFactorEnabled: boolean
    biometricEnabled: boolean
    sessionTimeout: number
  }
  privacy: {
    showBalance: boolean
    shareData: boolean
    profileVisible: boolean
  }
  limits: {
    dailyLimit: number
    monthlyLimit: number
    singleTransactionLimit: number
  }
  preferences: {
    language: string
    currency: string
    theme: string
    dateFormat: string
  }
}

export default function ClientSettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      transactions: true,
      security: true,
      marketing: false,
      email: true,
      sms: true,
      push: true,
    },
    security: {
      twoFactorEnabled: false,
      biometricEnabled: true,
      sessionTimeout: 30,
    },
    privacy: {
      showBalance: true,
      shareData: false,
      profileVisible: true,
    },
    limits: {
      dailyLimit: 50000,
      monthlyLimit: 500000,
      singleTransactionLimit: 25000,
    },
    preferences: {
      language: "fr",
      currency: "MGA",
      theme: "light",
      dateFormat: "DD/MM/YYYY",
    },
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [activeSection, setActiveSection] = useState("security")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 8 caractères" })
      return
    }

    setLoading(true)
    try {
      // Simulation API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage({ type: "success", text: "Mot de passe modifié avec succès" })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la modification du mot de passe" })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Simulation API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage({ type: "success", text: "Paramètres sauvegardés avec succès" })
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la sauvegarde" })
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    { id: "security", name: "Sécurité", icon: ShieldIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "privacy", name: "Confidentialité", icon: EyeIcon },
    { id: "limits", name: "Limites", icon: CreditCardIcon },
    { id: "preferences", name: "Préférences", icon: GlobeIcon },
  ]

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et paramètres de sécurité</p>
      </div>

      {/* Message de feedback */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? <CheckIcon className="h-5 w-5" /> : <XMarkIcon className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des sections */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-purple-50 text-purple-700 border-r-2 border-purple-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <section.icon className="mr-3 h-5 w-5" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Contenu des sections */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section Sécurité */}
          {activeSection === "security" && (
            <div className="space-y-6">
              {/* Changement de mot de passe */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LockIcon className="mr-2 h-5 w-5" />
                    Mot de passe
                  </CardTitle>
                  <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} disabled={loading} className="w-full">
                    {loading ? "Modification..." : "Modifier le mot de passe"}
                  </Button>
                </CardContent>
              </Card>

              {/* Authentification à deux facteurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SmartphoneIcon className="mr-2 h-5 w-5" />
                    Authentification à deux facteurs
                  </CardTitle>
                  <CardDescription>Renforcez la sécurité de votre compte avec la 2FA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa">Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">
                        {settings.security.twoFactorEnabled ? "Activée" : "Désactivée"}
                      </p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSettings("security", "twoFactorEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="biometric">Authentification biométrique</Label>
                      <p className="text-sm text-gray-500">Empreinte digitale ou reconnaissance faciale</p>
                    </div>
                    <Switch
                      id="biometric"
                      checked={settings.security.biometricEnabled}
                      onCheckedChange={(checked) => updateSettings("security", "biometricEnabled", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Délai d'expiration de session (minutes)</Label>
                    <select
                      id="session-timeout"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 heure</option>
                      <option value={120}>2 heures</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section Notifications */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellIcon className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Types de notifications</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-transactions">Transactions</Label>
                      <p className="text-sm text-gray-500">Notifications pour vos paiements et transferts</p>
                    </div>
                    <Switch
                      id="notif-transactions"
                      checked={settings.notifications.transactions}
                      onCheckedChange={(checked) => updateSettings("notifications", "transactions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-security">Sécurité</Label>
                      <p className="text-sm text-gray-500">Alertes de sécurité et connexions</p>
                    </div>
                    <Switch
                      id="notif-security"
                      checked={settings.notifications.security}
                      onCheckedChange={(checked) => updateSettings("notifications", "security", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-marketing">Marketing</Label>
                      <p className="text-sm text-gray-500">Offres spéciales et nouveautés</p>
                    </div>
                    <Switch
                      id="notif-marketing"
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => updateSettings("notifications", "marketing", checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Canaux de notification</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-email">Email</Label>
                      <p className="text-sm text-gray-500">Notifications par email</p>
                    </div>
                    <Switch
                      id="notif-email"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-sms">SMS</Label>
                      <p className="text-sm text-gray-500">Notifications par SMS</p>
                    </div>
                    <Switch
                      id="notif-sms"
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => updateSettings("notifications", "sms", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notif-push">Push</Label>
                      <p className="text-sm text-gray-500">Notifications push sur l'application</p>
                    </div>
                    <Switch
                      id="notif-push"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Confidentialité */}
          {activeSection === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <EyeIcon className="mr-2 h-5 w-5" />
                  Confidentialité
                </CardTitle>
                <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-balance">Afficher le solde</Label>
                    <p className="text-sm text-gray-500">Afficher votre solde sur le dashboard</p>
                  </div>
                  <Switch
                    id="show-balance"
                    checked={settings.privacy.showBalance}
                    onCheckedChange={(checked) => updateSettings("privacy", "showBalance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-data">Partage de données</Label>
                    <p className="text-sm text-gray-500">Autoriser le partage de données anonymisées</p>
                  </div>
                  <Switch
                    id="share-data"
                    checked={settings.privacy.shareData}
                    onCheckedChange={(checked) => updateSettings("privacy", "shareData", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visible">Profil visible</Label>
                    <p className="text-sm text-gray-500">Rendre votre profil visible aux autres utilisateurs</p>
                  </div>
                  <Switch
                    id="profile-visible"
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) => updateSettings("privacy", "profileVisible", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Limites */}
          {activeSection === "limits" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5" />
                  Limites de transaction
                </CardTitle>
                <CardDescription>Gérez vos limites de dépenses pour plus de sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-limit">Limite quotidienne (MGA)</Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    value={settings.limits.dailyLimit}
                    onChange={(e) => updateSettings("limits", "dailyLimit", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">Maximum par jour : 100,000 MGA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly-limit">Limite mensuelle (MGA)</Label>
                  <Input
                    id="monthly-limit"
                    type="number"
                    value={settings.limits.monthlyLimit}
                    onChange={(e) => updateSettings("limits", "monthlyLimit", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">Maximum par mois : 1,000,000 MGA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="single-limit">Limite par transaction (MGA)</Label>
                  <Input
                    id="single-limit"
                    type="number"
                    value={settings.limits.singleTransactionLimit}
                    onChange={(e) =>
                      updateSettings("limits", "singleTransactionLimit", Number.parseInt(e.target.value))
                    }
                  />
                  <p className="text-sm text-gray-500">Maximum par transaction : 50,000 MGA</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note :</strong> Les modifications de limites peuvent prendre jusqu'à 24h pour être
                    effectives.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Préférences */}
          {activeSection === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GlobeIcon className="mr-2 h-5 w-5" />
                  Préférences
                </CardTitle>
                <CardDescription>Personnalisez votre expérience utilisateur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <select
                    id="language"
                    value={settings.preferences.language}
                    onChange={(e) => updateSettings("preferences", "language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fr">Français</option>
                    <option value="mg">Malagasy</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <select
                    id="currency"
                    value={settings.preferences.currency}
                    onChange={(e) => updateSettings("preferences", "currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="MGA">Ariary (MGA)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dollar US (USD)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <select
                    id="theme"
                    value={settings.preferences.theme}
                    onChange={(e) => updateSettings("preferences", "theme", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Format de date</Label>
                  <select
                    id="date-format"
                    value={settings.preferences.dateFormat}
                    onChange={(e) => updateSettings("preferences", "dateFormat", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={loading} className="px-8">
              {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
