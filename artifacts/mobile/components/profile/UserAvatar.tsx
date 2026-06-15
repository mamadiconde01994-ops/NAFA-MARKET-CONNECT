import React from "react";
import { Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface UserAvatarProps {
  name: string;
  size?: number;
  variant?: "primary" | "muted" | "accent";
}

export function UserAvatar({ name, size = 40, variant = "primary" }: UserAvatarProps) {
  const colors = useColors();

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "accent"
        ? colors.secondary
        : colors.muted;

  const fg =
    variant === "primary"
      ? colors.primaryForeground
      : variant === "accent"
        ? colors.secondaryForeground
        : colors.mutedForeground;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: Math.round(size * 0.38),
          color: fg,
          fontFamily: "Inter_600SemiBold",
          letterSpacing: 0.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
