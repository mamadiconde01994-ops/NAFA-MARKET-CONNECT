import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { colors } = useColors();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = Date.now().toString();
      const toast: ToastMessage = { id, message, type, duration };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const contextValue: ToastContextValue = {
    toast: addToast,
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    warning: (msg, duration) => addToast(msg, "warning", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}) {
  const { colors } = useColors();

  const getStyle = (type: ToastType) => {
    switch (type) {
      case "success":
        return { bg: "#ECFDF5", text: "#065F46", icon: "checkmark-circle" as const };
      case "error":
        return { bg: "#FEF2F2", text: "#7F1D1D", icon: "alert-circle" as const };
      case "warning":
        return { bg: "#FFFBEB", text: "#78350F", icon: "warning" as const };
      case "info":
      default:
        return { bg: "#EFF6FF", text: "#0C2340", icon: "information-circle" as const };
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 20,
      left: 16,
      right: 16,
      zIndex: 1000,
    },
    toast: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    text: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => {
        const style = getStyle(t.type);
        return (
          <View
            key={t.id}
            style={[styles.toast, { backgroundColor: style.bg }]}
          >
            <Ionicons name={style.icon} size={20} color={style.text} />
            <Text style={[styles.text, { color: style.text }]}>{t.message}</Text>
          </View>
        );
      })}
    </View>
  );
}
