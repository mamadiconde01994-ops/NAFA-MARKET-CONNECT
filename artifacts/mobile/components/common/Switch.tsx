import React from "react";
import { Platform, View, TouchableOpacity, StyleSheet, Text, Animated } from "react-native";
import { useColors } from "@/hooks/useColors";

export interface SwitchProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, value, onChange, disabled = false }: SwitchProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      opacity: disabled ? 0.5 : 1,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
      flex: 1,
    },
    switch: {
      width: 50,
      height: 28,
      borderRadius: 14,
      padding: 2,
      backgroundColor: value ? colors.primary : colors.border,
      justifyContent: value ? "flex-end" : "flex-start",
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.card,
      elevation: 2,
      ...Platform.select({
        web: { boxShadow: "0px 2px 2px rgba(0,0,0,0.10)" },
        default: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
      }),
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.switch}>
        <View style={styles.thumb} />
      </View>
    </TouchableOpacity>
  );
}
