import React from "react";
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useColors } from "@/hooks/useColors";

/**
 * Semantic heading component for accessibility
 */
export interface SemanticHeadingProps {
  level: 1 | 2 | 3 | 4;
  children: string;
  style?: TextStyle;
}

export function SemanticHeading({
  level,
  children,
  style,
}: SemanticHeadingProps) {
  const { colors } = useColors();

  const fontSizes = [32, 28, 24, 20];
  const fontSize = fontSizes[level - 1];

  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 12,
        },
        style,
      ]}
      accessibilityRole="header"
    >
      {children}
    </Text>
  );
}

/**
 * Focus-visible button wrapper for keyboard navigation
 */
export interface AccessibleButtonProps {
  onPress: () => void;
  children: React.ReactNode | ((focused: boolean) => React.ReactNode);
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
}

export function AccessibleButton({
  onPress,
  children,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}: AccessibleButtonProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const { colors } = useColors();

  const styles = StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 4,
      opacity: disabled ? 0.5 : 1,
    },
    outline: {
      borderWidth: isFocused ? 2 : 0,
      borderColor: isFocused ? colors.primary : "transparent",
    },
  });

  return (
    <View
      style={styles.button}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      {typeof children === "function" ? children(isFocused) : children}
    </View>
  );
}

/**
 * Error display with accessibility announcement
 */
export interface AccessibleErrorProps {
  message: string;
  role?: "alert" | "status";
}

export function AccessibleError({ message, role = "alert" }: AccessibleErrorProps) {
  const accessibilityRole = role === "alert" ? "alert" : undefined;

  React.useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  return (
    <View
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: "#FEE2E2",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderLeftWidth: 4,
        borderLeftColor: "#DC2626",
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "#7F1D1D",
          fontSize: 13,
          fontWeight: "500",
        }}
      >
        {message}
      </Text>
    </View>
  );
}

/**
 * Screen reader friendly form label
 */
export interface AccessibleLabelProps {
  htmlFor?: string;
  children: string;
  required?: boolean;
}

export function AccessibleLabel({
  htmlFor,
  children,
  required = false,
}: AccessibleLabelProps) {
  const { colors } = useColors();

  return (
    <Text
      accessible
      accessibilityRole="text"
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: colors.mutedForeground,
        marginBottom: 8,
      }}
    >
      {children}
      {required && <Text style={{ color: "#DC2626" }}> *</Text>}
    </Text>
  );
}

/**
 * Skip to main content link for keyboard navigation
 */
export function SkipToMainContent() {
  return (
    <Text
      accessible
      accessibilityRole="link"
      accessibilityLabel="Passer au contenu principal"
      style={{
        position: "absolute",
        top: -40,
        left: 0,
        backgroundColor: "#000",
        color: "#FFF",
        padding: 8,
      }}
    >
      Passer au contenu principal
    </Text>
  );
}
