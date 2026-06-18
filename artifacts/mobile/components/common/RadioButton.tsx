import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export interface RadioOption {
  label: string;
  value: string | number;
}

export interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: RadioGroupProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    container: {
      gap: 8,
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: value === options[0]?.value ? colors.primary : colors.border,
      backgroundColor:
        value === options[0]?.value ? `${colors.primary}10` : "transparent",
      opacity: disabled ? 0.5 : 1,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: value === options[0]?.value ? colors.primary : colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {options.map((option, idx) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.option, { borderColor: value === option.value ? colors.primary : colors.border }]}
          onPress={() => !disabled && onChange(option.value)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={styles.radio}>
            {value === option.value && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
