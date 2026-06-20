import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type NotificationType = "order" | "price_drop" | "new_listing" | "message" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  action?: { target?: string; label?: string };
  meta?: { amount?: number; currency?: string; discount?: number; category?: string };
}

interface NotificationsContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/* ── Helper to generate a date relative to now ── */
function ago(ms: number) {
  return new Date(Date.now() - ms).toISOString();
}
const M = 60 * 1000;
const H = 60 * M;
const D = 24 * H;

/* ── Rich mock notifications ── */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "Commande confirmée",
    message: "Votre commande de 5 kg de tomates fraîches a été confirmée par le vendeur Mamadou Diallo.",
    read: false,
    createdAt: ago(8 * M),
    action: { target: "/(tabs)", label: "Voir la commande" },
    meta: { amount: 45000, currency: "GNF" },
  },
  {
    id: "n2",
    type: "price_drop",
    title: "Baisse de prix — Riz local paddy",
    message: "Le riz paddy de Boffa est en promotion : -18% aujourd'hui seulement. Stock limité.",
    read: false,
    createdAt: ago(45 * M),
    action: { target: "/(tabs)", label: "Voir l'offre" },
    meta: { discount: 18, category: "Agriculture" },
  },
  {
    id: "n3",
    type: "new_listing",
    title: "Nouveau lot — Mangues Kent",
    message: "Un nouveau lot de 500 kg de mangues Kent vient d'être mis en vente par la ferme Kouyaté à Kindia.",
    read: false,
    createdAt: ago(2 * H),
    action: { target: "/(tabs)", label: "Découvrir" },
    meta: { category: "Fruits" },
  },
  {
    id: "n4",
    type: "message",
    title: "Message de Fatou Camara",
    message: "Bonjour, est-ce que vos tomates sont encore disponibles ? Je voudrais commander 10 kg pour ma boutique.",
    read: false,
    createdAt: ago(3 * H + 20 * M),
    action: { target: "/(tabs)", label: "Répondre" },
  },
  {
    id: "n5",
    type: "order",
    title: "Livraison en cours",
    message: "Votre commande #4521 est en route. Le livreur Ibrahima Baldé arrive dans environ 30 minutes.",
    read: false,
    createdAt: ago(5 * H),
    action: { target: "/(tabs)", label: "Suivre" },
    meta: { amount: 120000, currency: "GNF" },
  },
  {
    id: "n6",
    type: "price_drop",
    title: "Café robusta à -12% — N'Zérékoré",
    message: "Le café robusta de N'Zérékoré est en promotion jusqu'à ce soir. Commandez maintenant.",
    read: false,
    createdAt: ago(6 * H),
    action: { target: "/(tabs)", label: "Voir l'offre" },
    meta: { discount: 12, category: "Agriculture" },
  },
  {
    id: "n7",
    type: "new_listing",
    title: "Nouvelle propriété — Villa Nongo",
    message: "Une villa en bord de mer à Nongo vient d'être mise en vente. 5 chambres, vue Atlantique.",
    read: true,
    createdAt: ago(D + 1 * H),
    action: { target: "/real-estate/index" as any, label: "Voir l'annonce" },
    meta: { category: "Immobilier" },
  },
  {
    id: "n8",
    type: "system",
    title: "Profil complété à 80%",
    message: "Ajoutez une photo et votre quartier pour augmenter la confiance des acheteurs et vendeurs.",
    read: true,
    createdAt: ago(D + 2 * H),
    action: { target: "/(tabs)/profile", label: "Compléter mon profil" },
  },
  {
    id: "n9",
    type: "price_drop",
    title: "Promotion — Huile de palme rouge",
    message: "L'huile de palme rouge artisanale est à -22% chez 3 vendeurs de Conakry. Offre valable 24h.",
    read: true,
    createdAt: ago(D + 5 * H),
    action: { target: "/(tabs)", label: "Voir les offres" },
    meta: { discount: 22, category: "Épicerie" },
  },
  {
    id: "n10",
    type: "new_listing",
    title: "Nouveau menu — Chez Aminata",
    message: "Le maquis Chez Aminata vient de publier son menu spécial semaine : foufou, gombo, et barracuda grillé.",
    read: true,
    createdAt: ago(2 * D + 1 * H),
    action: { target: "/restaurants/index" as any, label: "Voir le menu" },
    meta: { category: "Restauration" },
  },
  {
    id: "n11",
    type: "order",
    title: "Commande livrée ✓",
    message: "Votre commande de 2 kg de piment rouge et oignons a bien été livrée. Notez votre vendeur !",
    read: true,
    createdAt: ago(3 * D + 4 * H),
    action: { target: "/(tabs)", label: "Laisser un avis" },
    meta: { amount: 28000, currency: "GNF" },
  },
  {
    id: "n12",
    type: "message",
    title: "Message de Alpha Barry",
    message: "Bonjour ! J'ai du fonio blanc de qualité en stock à Mamou. Intéressé(e) pour 50 kg ?",
    read: true,
    createdAt: ago(4 * D),
    action: { target: "/(tabs)", label: "Répondre" },
  },
  {
    id: "n13",
    type: "new_listing",
    title: "Offre d'emploi — Chauffeur logistique",
    message: "NAFA Logistique recherche 3 chauffeurs poids lourd à Conakry. Contrat CDI, permis C requis.",
    read: true,
    createdAt: ago(5 * D),
    action: { target: "/jobs/index" as any, label: "Voir l'offre" },
    meta: { category: "Emploi" },
  },
  {
    id: "n14",
    type: "price_drop",
    title: "Gingembre frais à -15% — Conakry",
    message: "Le gingembre frais de Coyah est en promotion ce week-end. Idéal pour tisanes et cuisine.",
    read: true,
    createdAt: ago(6 * D),
    action: { target: "/(tabs)", label: "Commander" },
    meta: { discount: 15, category: "Agriculture" },
  },
  {
    id: "n15",
    type: "system",
    title: "Entrepôt disponible à Kaloum",
    message: "Un entrepôt de 500 m² en zone portuaire vient d'être mis en location. Idéal import/export.",
    read: true,
    createdAt: ago(8 * D),
    action: { target: "/warehouses/index" as any, label: "Voir l'entrepôt" },
    meta: { category: "Logistique" },
  },
  {
    id: "n16",
    type: "order",
    title: "Paiement reçu ✓",
    message: "Le paiement de 240 000 GNF pour votre vente de mangues (30 kg) a été reçu. Merci !",
    read: true,
    createdAt: ago(9 * D),
    meta: { amount: 240000, currency: "GNF" },
  },
  {
    id: "n17",
    type: "system",
    title: "Bienvenue sur NAFA Marché",
    message: "Votre compte est activé. Explorez des milliers de produits frais et de services dans toute la Guinée.",
    read: true,
    createdAt: ago(14 * D),
  },
];

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
      const next: Notification = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification,
      };
      setNotifications((prev) => [next, ...prev]);
    },
    [],
  );

  const markAsRead = useCallback(
    (id: string) =>
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      ),
    [],
  );

  const markAllAsRead = useCallback(
    () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true }))),
    [],
  );

  const deleteNotification = useCallback(
    (id: string) => setNotifications((prev) => prev.filter((item) => item.id !== id)),
    [],
  );

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({ notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearNotifications }),
    [notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearNotifications],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used within NotificationsProvider");
  return context;
}
