import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

interface BadgeProps {
  label: string;
  variant?: Variant;
  small?: boolean;
}

export function Badge({ label, variant = "default", small = false }: BadgeProps) {
  const colors = useColors();

  const bg: Record<Variant, string> = {
    default: colors.muted,
    primary: colors.primary,
    secondary: colors.secondary,
    outline: "transparent",
    success: colors.success,
    warning: colors.warning,
    destructive: colors.destructive,
  };

  const fg: Record<Variant, string> = {
    default: colors.mutedForeground,
    primary: colors.primaryForeground,
    secondary: colors.secondaryForeground,
    outline: colors.primary,
    success: colors.successForeground,
    warning: colors.warningForeground,
    destructive: colors.destructiveForeground,
  };

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg[variant],
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: variant === "outline" ? colors.primary : undefined,
          borderRadius: 100,
          paddingHorizontal: small ? 9 : 11,
          paddingVertical: small ? 3 : 5,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: fg[variant], fontSize: small ? 12 : 13 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
