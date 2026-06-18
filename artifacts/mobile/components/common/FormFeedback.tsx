import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export type FormFeedbackType = "success" | "error" | "warning" | "info" | "loading";

interface FormFeedbackProps {
  type: FormFeedbackType;
  message: string;
  visible?: boolean;
  autoHideDuration?: number; // milliseconds
  onDismiss?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: any;
}

const FEEDBACK_CONFIG: Record<
  FormFeedbackType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  success: {
    icon: "checkmark-circle",
    bgColor: "#d1fae5",
    borderColor: "#10b981",
    textColor: "#047857",
    iconColor: "#10b981",
  },
  error: {
    icon: "close-circle",
    bgColor: "#fee2e2",
    borderColor: "#ef4444",
    textColor: "#b91c1c",
    iconColor: "#ef4444",
  },
  warning: {
    icon: "alert-circle",
    bgColor: "#fef3c7",
    borderColor: "#f59e0b",
    textColor: "#92400e",
    iconColor: "#f59e0b",
  },
  info: {
    icon: "information-circle",
    bgColor: "#dbeafe",
    borderColor: "#2563eb",
    textColor: "#1e40af",
    iconColor: "#2563eb",
  },
  loading: {
    icon: "hourglass",
    bgColor: "#f3f4f6",
    borderColor: "#d1d5db",
    textColor: "#4b5563",
    iconColor: "#6b7280",
  },
};

export function FormFeedback({
  type,
  message,
  visible = true,
  autoHideDuration,
  onDismiss,
  icon,
  style,
}: FormFeedbackProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    if (visible && autoHideDuration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDuration, onDismiss]);

  if (!isVisible) return null;

  const config = FEEDBACK_CONFIG[type];
  const displayIcon = icon || config.icon;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        },
        style,
      ]}
    >
      <Ionicons
        name={displayIcon}
        size={type === "loading" ? 20 : 18}
        color={config.iconColor}
        style={type === "loading" ? styles.loadingIcon : {}}
      />
      <Text
        style={[
          // styles.message may be inferred as a union including ViewStyle on some RN TS setups;
          // cast to any to satisfy Text's style typing here.
          (styles.message as any),
          {
            color: config.textColor,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

/**
 * Hook for managing form feedback state
 */
export function useFormFeedback() {
  const [feedback, setFeedback] = useState<{
    type: FormFeedbackType;
    message: string;
    visible: boolean;
  } | null>(null);

  const show = (type: FormFeedbackType, message: string) => {
    setFeedback({ type, message, visible: true });
  };

  const hide = () => {
    setFeedback((prev) => prev ? { ...prev, visible: false } : null);
  };

  const success = (message: string) => show("success", message);
  const error = (message: string) => show("error", message);
  const warning = (message: string) => show("warning", message);
  const info = (message: string) => show("info", message);
  const loading = (message: string) => show("loading", message);

  return {
    feedback,
    show,
    hide,
    success,
    error,
    warning,
    info,
    loading,
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  loadingIcon: {
    // animation is platform-specific; keep empty to satisfy RN style typing
  },
});
