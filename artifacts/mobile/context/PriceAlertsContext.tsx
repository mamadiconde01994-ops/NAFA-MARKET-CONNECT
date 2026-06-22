import React, { createContext, useCallback, useContext, useState } from "react";
import { useNotifications } from "./NotificationsContext";

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  market: string;
  priceAtAlert: number;
  targetPrice: number;
  createdAt: string;
  active: boolean;
  triggered: boolean;
}

interface PriceAlertsContextValue {
  alerts: PriceAlert[];
  addAlert: (
    product: { id: string; name: string; unit: string; market: string; currentPrice: number },
    targetPrice: number
  ) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  simulateDrop: (alertId: string) => void;
  hasAlert: (productId: string) => boolean;
  getAlert: (productId: string) => PriceAlert | undefined;
}

const PriceAlertsContext = createContext<PriceAlertsContextValue | null>(null);

function fmt(v: number) {
  return v.toLocaleString("fr-GN");
}

const D = 24 * 60 * 60 * 1000;

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: "pa1",
    productId: "mp2",
    productName: "Oignon violet",
    unit: "kg",
    market: "Madina, Conakry",
    priceAtAlert: 6000,
    targetPrice: 4500,
    createdAt: new Date(Date.now() - 2 * D).toISOString(),
    active: true,
    triggered: false,
  },
  {
    id: "pa2",
    productId: "mp5",
    productName: "Mil",
    unit: "bag",
    market: "Kankan",
    priceAtAlert: 25000,
    targetPrice: 20000,
    createdAt: new Date(Date.now() - 5 * D).toISOString(),
    active: true,
    triggered: false,
  },
  {
    id: "pa3",
    productId: "mp8",
    productName: "Ananas",
    unit: "pièce",
    market: "Kindia",
    priceAtAlert: 3000,
    targetPrice: 2200,
    createdAt: new Date(Date.now() - 1 * D).toISOString(),
    active: false,
    triggered: false,
  },
];

export function PriceAlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const { addNotification } = useNotifications();

  const addAlert = useCallback(
    (
      product: { id: string; name: string; unit: string; market: string; currentPrice: number },
      targetPrice: number
    ) => {
      setAlerts((prev) => {
        const existing = prev.findIndex((a) => a.productId === product.id);
        const updated: PriceAlert = {
          id: existing >= 0 ? prev[existing].id : `pa_${Date.now()}`,
          productId: product.id,
          productName: product.name,
          unit: product.unit,
          market: product.market,
          priceAtAlert: product.currentPrice,
          targetPrice,
          createdAt: existing >= 0 ? prev[existing].createdAt : new Date().toISOString(),
          active: true,
          triggered: false,
        };
        if (existing >= 0) {
          const copy = [...prev];
          copy[existing] = updated;
          return copy;
        }
        return [...prev, updated];
      });
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  }, []);

  const simulateDrop = useCallback(
    (alertId: string) => {
      setAlerts((prev) => {
        const alert = prev.find((a) => a.id === alertId);
        if (!alert) return prev;
        const droppedPrice = Math.round(alert.targetPrice * 0.91);
        addNotification({
          type: "price_drop",
          title: `📉 Alerte prix — ${alert.productName}`,
          message: `Le prix est passé sous votre seuil ! ${fmt(droppedPrice)} GNF/${alert.unit} sur ${alert.market}. Votre cible était ${fmt(alert.targetPrice)} GNF.`,
          action: { target: "/price-alerts" as any, label: "Voir mes alertes" },
          meta: {
            discount: Math.round((1 - droppedPrice / alert.priceAtAlert) * 100),
            category: "Agriculture",
          },
        });
        return prev.map((a) => (a.id === alertId ? { ...a, triggered: true } : a));
      });
    },
    [addNotification]
  );

  const hasAlert = useCallback(
    (productId: string) => alerts.some((a) => a.productId === productId && a.active),
    [alerts]
  );

  const getAlert = useCallback(
    (productId: string) => alerts.find((a) => a.productId === productId && a.active),
    [alerts]
  );

  return (
    <PriceAlertsContext.Provider
      value={{ alerts, addAlert, removeAlert, toggleAlert, simulateDrop, hasAlert, getAlert }}
    >
      {children}
    </PriceAlertsContext.Provider>
  );
}

export function usePriceAlerts() {
  const ctx = useContext(PriceAlertsContext);
  if (!ctx) throw new Error("usePriceAlerts must be used within PriceAlertsProvider");
  return ctx;
}
