"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Smartphone,
  Camera,
  Save,
  Key,
  MessageSquare,
  Laptop,
  Tablet,
  Plus,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  avatar: string
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  smsEnabled: boolean
  appAuthEnabled: boolean
}

interface NotificationSettings {
  emailTransactions: boolean
  emailPromotions: boolean
  emailNews: boolean
  pushTransactions: boolean
  pushSecurity: boolean
  pushPromotions: boolean
  smsImportant: boolean
  smsSecurity: boolean
}

interface PaymentSettings {
  defaultMethod: string
  dailyLimit: number
  transactionLimit: number
  autoPayments: boolean
  autoNotifications: boolean
}

interface Device {
  id: string
  name: string
  type: "laptop" | "mobile" | "tablet"
  location: string
  lastSeen: string
  current: boolean
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "15 Rue de la Paix, 75002 Paris",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    smsEnabled: true,
    appAuthEnabled: true,
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailTransactions: true,
    emailPromotions: true,
    emailNews: false,
    pushTransactions: true,
    pushSecurity: true,
    pushPromotions: false,
    smsImportant: true,
    smsSecurity: true,
  })

  const [payments, setPayments] = useState<PaymentSettings>({
    defaultMethod: "rfid",
    dailyLimit: 500,
    transactionLimit: 200,
    autoPayments: false,
    autoNotifications: true,
  })

  const [devices] = useState<Device[]>([
    {
      id: "1",
      name: 'MacBook Pro (14", 2021)',
      type: "laptop",
      location: "Paris, France",
      lastSeen: "Actuellement utilisé",
      current: true,
    },
    {
      id: "2",
      name: "iPhone 13 Pro",
      type: "mobile",
      location: "Lyon, France",
      lastSeen: "Connecté il y a 2 heures",
      current: false,
    },
    {
      id: "3",
      name: 'iPad Pro 11"',
      type: "tablet",
      location: "Marseille, France",
      lastSeen: "Connecté il y a 1 semaine",
      current: false,
    },
  ])

  const [passwordModal, setPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleProfileSave = () => {
    console.log("Saving profile:", profile)
    // Implement save functionality
  }

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert("Veuillez remplir tous les champs")
      return
    }

    if (passwordForm.new !== passwordForm.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    if (passwordForm.new.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    console.log("Changing password")
    setPasswordModal(false)
    setPasswordForm({ current: "", new: "", confirm: "" })
    alert("Mot de passe changé avec succès!")
  }

  const handleDeviceDisconnect = (deviceId: string) => {
    console.log("Disconnecting device:", deviceId)
    // Implement disconnect functionality
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="w-6 h-6" />
      case "mobile":
        return <Smartphone className="w-6 h-6" />
      case "tablet":
        return <Tablet className="w-6 h-6" />
      default:
        return <Smartphone className="w-6 h-6" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez les préférences de votre compte et de l'application</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Compte
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Appareils
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      className="h-24 w-24 rounded-full object-cover"
                      src={profile.avatar || "/placeholder.svg"}
                      alt="Profile"
                    />
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full p-2 h-8 w-8">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">Utilisateur Premium</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      rows={2}
                      value={profile.address}
                      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité et connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Mot de passe</h4>
                  <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                </div>
                <Dialog open={passwordModal} onOpenChange={setPasswordModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Key className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier le mot de passe</DialogTitle>
                      <DialogDescription>
                        Entrez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, new: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Minimum 8 caractères avec des chiffres et symboles</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPasswordModal(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Authentification à deux facteurs</h4>
                  <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                </div>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                />
              </div>

              {security.twoFactorEnabled && (
                <div className="ml-4 space-y-2">
                  <p className="text-sm text-gray-600">Méthodes actives :</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">Application d'authentification</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm">SMS (+33 ••• •• •• 78)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Sessions */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Sessions actives</h4>
                <p className="text-sm text-gray-500 mb-4">Voici les appareils actuellement connectés à votre compte</p>

                <div className="space-y-4">
                  {devices
                    .filter((device) => device.current)
                    .map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="text-gray-500 mr-4">{getDeviceIcon(device.type)}</div>
                          <div>
                            <p className="text-sm font-medium">{device.name}</p>
                            <p className="text-xs text-gray-500">
                              {device.location} • {device.lastSeen}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Actuel</Badge>
                      </div>
                    ))}

                  {devices
                    .filter((device) => !device.current)
                    .map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="text-gray-500 mr-4">{getDeviceIcon(device.type)}</div>
                          <div>
                            <p className="text-sm font-medium">{device.name}</p>
                            <p className="text-xs text-gray-500">
                              {device.location} • {device.lastSeen}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDeviceDisconnect(device.id)}>
                          <LogOut className="w-4 h-4 mr-1" />
                          Déconnecter
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Email Notifications */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Notifications par email</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Transactions</p>
                      <p className="text-xs text-gray-500">Recevoir un email pour chaque transaction</p>
                    </div>
                    <Switch
                      checked={notifications.emailTransactions}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, emailTransactions: checked }))
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Promotions</p>
                      <p className="text-xs text-gray-500">Recevoir des offres spéciales et promotions</p>
                    </div>
                    <Switch
                      checked={notifications.emailPromotions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailPromotions: checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nouveautés</p>
                      <p className="text-xs text-gray-500">
                        Recevoir des mises à jour sur les nouvelles fonctionnalités
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNews}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNews: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Notifications push</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Transactions</p>
                      <p className="text-xs text-gray-500">Recevoir une notification pour chaque transaction</p>
                    </div>
                    <Switch
                      checked={notifications.pushTransactions}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, pushTransactions: checked }))
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sécurité</p>
                      <p className="text-xs text-gray-500">Alertes de sécurité et connexions suspectes</p>
                    </div>
                    <Switch
                      checked={notifications.pushSecurity}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushSecurity: checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Promotions</p>
                      <p className="text-xs text-gray-500">Recevoir des offres spéciales et promotions</p>
                    </div>
                    <Switch
                      checked={notifications.pushPromotions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushPromotions: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Notifications SMS</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Transactions importantes</p>
                      <p className="text-xs text-gray-500">Recevoir un SMS pour les transactions supérieures à 100€</p>
                    </div>
                    <Switch
                      checked={notifications.smsImportant}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, smsImportant: checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Alertes de sécurité</p>
                      <p className="text-xs text-gray-500">Recevoir des alertes SMS pour les activités suspectes</p>
                    </div>
                    <Switch
                      checked={notifications.smsSecurity}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, smsSecurity: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Default Payment Method */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Méthode de paiement par défaut</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      payments.defaultMethod === "rfid"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setPayments((prev) => ({ ...prev, defaultMethod: "rfid" }))}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-purple-100 rounded flex items-center justify-center text-purple-600 mr-3">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Carte RFID</p>
                        <p className="text-xs text-gray-500">•••• 4589</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      payments.defaultMethod === "visa"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setPayments((prev) => ({ ...prev, defaultMethod: "visa" }))}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-blue-100 rounded flex items-center justify-center text-blue-600 mr-3">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visa</p>
                        <p className="text-xs text-gray-500">•••• 1234</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      payments.defaultMethod === "bank"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setPayments((prev) => ({ ...prev, defaultMethod: "bank" }))}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-600 mr-3">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Virement bancaire</p>
                        <p className="text-xs text-gray-500">Compte principal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Limits */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Limites de paiement</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dailyLimit">Limite de paiement quotidienne</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <Input
                        id="dailyLimit"
                        type="number"
                        value={payments.dailyLimit}
                        onChange={(e) =>
                          setPayments((prev) => ({ ...prev, dailyLimit: Number.parseInt(e.target.value) }))
                        }
                        className="pl-8 pr-20"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        par jour
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="transactionLimit">Limite de paiement par transaction</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <Input
                        id="transactionLimit"
                        type="number"
                        value={payments.transactionLimit}
                        onChange={(e) =>
                          setPayments((prev) => ({ ...prev, transactionLimit: Number.parseInt(e.target.value) }))
                        }
                        className="pl-8 pr-32"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        par transaction
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automatic Payments */}
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Paiements automatiques</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Autoriser les paiements automatiques</p>
                      <p className="text-xs text-gray-500">
                        Permettre aux commerçants de prélever des paiements automatiques
                      </p>
                    </div>
                    <Switch
                      checked={payments.autoPayments}
                      onCheckedChange={(checked) => setPayments((prev) => ({ ...prev, autoPayments: checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notifications avant prélèvement</p>
                      <p className="text-xs text-gray-500">
                        Recevoir une notification 24h avant un prélèvement automatique
                      </p>
                    </div>
                    <Switch
                      checked={payments.autoNotifications}
                      onCheckedChange={(checked) => setPayments((prev) => ({ ...prev, autoNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Settings */}
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appareils connectés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Device */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">MacBook Pro (14", 2021)</p>
                      <p className="text-xs text-gray-500">Paris, France • Actuellement utilisé</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Appareil actuel</Badge>
                </div>
              </div>

              {/* Other Devices */}
              <div className="space-y-4">
                {devices
                  .filter((device) => !device.current)
                  .map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-4">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{device.name}</p>
                          <p className="text-xs text-gray-500">
                            {device.location} • {device.lastSeen}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDeviceDisconnect(device.id)}>
                        <LogOut className="w-4 h-4 mr-1" />
                        Déconnecter
                      </Button>
                    </div>
                  ))}
              </div>

              {/* Add New Device */}
              <div className="mt-6">
                <Button variant="outline" className="w-full border-dashed border-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un nouvel appareil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
