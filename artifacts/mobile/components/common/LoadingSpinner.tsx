import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  size = "large",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        fullScreen && { ...StyleSheet.absoluteFillObject, zIndex: 10 },
        { backgroundColor: fullScreen ? colors.background : "transparent" },
      ]}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
