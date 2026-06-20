import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { rf, rs } from "@/lib/scale";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = useColors();

  const bg: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    outline: "transparent",
    ghost: "transparent",
    destructive: colors.destructive,
  };

  const fg: Record<Variant, string> = {
    primary: colors.primaryForeground,
    secondary: colors.secondaryForeground,
    outline: colors.primary,
    ghost: colors.foreground,
    destructive: colors.destructiveForeground,
  };

  const border: Record<Variant, string | undefined> = {
    primary: undefined,
    secondary: undefined,
    outline: colors.primary,
    ghost: undefined,
    destructive: undefined,
  };

  const height: Record<Size, number> = { sm: rs(44), md: rs(52), lg: rs(60) };
  const fontSize: Record<Size, number> = { sm: rf(14), md: rf(16), lg: rf(18) };
  const hPad: Record<Size, number> = { sm: rs(16), md: rs(22), lg: rs(28) };

  const handlePress = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg[variant],
          borderColor: border[variant],
          borderWidth: variant === "outline" ? 1.5 : 0,
          height: height[size],
          borderRadius: colors.radius,
          opacity: pressed ? 0.75 : isDisabled ? 0.45 : 1,
          width: fullWidth ? "100%" : undefined,
          paddingHorizontal: hPad[size],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg[variant]} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            { color: fg[variant], fontSize: fontSize[size] },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
});
