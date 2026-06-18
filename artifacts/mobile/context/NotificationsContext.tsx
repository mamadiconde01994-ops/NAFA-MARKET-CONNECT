import React, { createContext, useContext, useMemo, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
  action?: { target?: string };
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

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
        const next: Notification = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date().toISOString(),
          read: false,
          ...notification,
        };
        setNotifications((prev) => [next, ...prev]);
      },
      markAsRead: (id: string) =>
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
        ),
      markAllAsRead: () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true }))),
      deleteNotification: (id: string) => setNotifications((prev) => prev.filter((item) => item.id !== id)),
      clearNotifications: () => setNotifications([]),
    }),
    [notifications],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}
