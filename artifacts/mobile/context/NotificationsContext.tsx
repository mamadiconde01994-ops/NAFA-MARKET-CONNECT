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
    message: "Votre commande de 5 kg de tomates fraîches a été confirmée par le vendeur Amadou Diallo.",
    read: false,
    createdAt: ago(8 * M),
    action: { target: "/product/tomates-fraiche", label: "Voir la commande" },
    meta: { amount: 45000, currency: "GNF" },
  },
  {
    id: "n2",
    type: "price_drop",
    title: "Baisse de prix — Riz local",
    message: "Le riz local que vous avez consulté est en promotion : -18% aujourd'hui seulement.",
    read: false,
    createdAt: ago(45 * M),
    action: { target: "/product/riz-local", label: "Voir l'offre" },
    meta: { discount: 18, category: "Agriculture" },
  },
  {
    id: "n3",
    type: "new_listing",
    title: "Nouveau produit disponible",
    message: "Un nouveau lot de mangues Kent vient d'être mis en vente par la ferme Kouyaté à Kindia.",
    read: false,
    createdAt: ago(2 * H),
    action: { target: "/product/mangues-kent", label: "Découvrir" },
    meta: { category: "Fruits" },
  },
  {
    id: "n4",
    type: "message",
    title: "Message de Fatou Camara",
    message: "Bonjour, est-ce que vos tomates sont encore disponibles ? Je voudrais commander 10 kg.",
    read: false,
    createdAt: ago(3 * H + 20 * M),
    action: { target: "/chat", label: "Répondre" },
  },
  {
    id: "n5",
    type: "order",
    title: "Livraison en cours",
    message: "Votre commande #4521 est en route. Le livreur Ibrahima arrive dans environ 30 minutes.",
    read: true,
    createdAt: ago(5 * H),
    action: { target: "/", label: "Suivre" },
    meta: { amount: 120000, currency: "GNF" },
  },
  {
    id: "n6",
    type: "system",
    title: "Profil complété à 80%",
    message: "Ajoutez une photo et votre quartier pour augmenter la confiance des acheteurs.",
    read: true,
    createdAt: ago(D + 2 * H),
    action: { target: "/(auth)/edit-profile", label: "Compléter" },
  },
  {
    id: "n7",
    type: "price_drop",
    title: "Promotion — Huile de palme",
    message: "L'huile de palme rouge est à -22% chez 3 vendeurs de Conakry. Offre valable 24h.",
    read: true,
    createdAt: ago(D + 5 * H),
    action: { target: "/", label: "Voir les offres" },
    meta: { discount: 22, category: "Épicerie" },
  },
  {
    id: "n8",
    type: "new_listing",
    title: "Nouvelle annonce — Restaurant La Savane",
    message: "Le restaurant La Savane vient de publier son menu de la semaine avec de nouveaux plats.",
    read: true,
    createdAt: ago(2 * D + 1 * H),
    action: { target: "/restaurants", label: "Voir le menu" },
    meta: { category: "Restauration" },
  },
  {
    id: "n9",
    type: "order",
    title: "Commande livrée ✓",
    message: "Votre commande de 2 kg de piment et oignons a bien été livrée. Notez votre vendeur !",
    read: true,
    createdAt: ago(3 * D + 4 * H),
    action: { target: "/", label: "Laisser un avis" },
    meta: { amount: 28000, currency: "GNF" },
  },
  {
    id: "n10",
    type: "message",
    title: "Message de Mamadou Bah",
    message: "Merci pour votre achat ! N'hésitez pas à revenir, nous avons de nouveaux produits chaque semaine.",
    read: true,
    createdAt: ago(5 * D),
    action: { target: "/chat", label: "Répondre" },
  },
  {
    id: "n11",
    type: "system",
    title: "Bienvenue sur NAFA Marché 🎉",
    message: "Votre compte est activé. Explorez des milliers de produits frais et de services dans toute la Guinée.",
    read: true,
    createdAt: ago(9 * D),
  },
  {
    id: "n12",
    type: "new_listing",
    title: "Entrepôt disponible à Kaloum",
    message: "Un entrepôt de 500 m² vient d'être mis en location dans la zone portuaire de Kaloum.",
    read: true,
    createdAt: ago(12 * D),
    action: { target: "/warehouses", label: "Voir l'entrepôt" },
    meta: { category: "Logistique" },
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
