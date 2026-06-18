import React, { useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onSelect,
  placeholder = "Sélectionner...",
  error,
  disabled = false,
}: DropdownProps) {
  const { colors } = useColors();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const styles = StyleSheet.create({
    container: {
      gap: 6,
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutedForeground,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: error ? "#EF4444" : colors.border,
      borderRadius: 8,
      minHeight: 44,
    },
    buttonText: {
      fontSize: 14,
      color: selectedOption ? colors.text : colors.mutedForeground,
      fontWeight: "500",
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: "80%",
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    options: {
      paddingVertical: 8,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionSelected: {
      backgroundColor: colors.background,
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    error: {
      fontSize: 12,
      color: "#EF4444",
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{displayLabel}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable
            style={styles.modal}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{label || placeholder}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.options}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                >
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={colors.primary}
                    />
                  )}
                  <Text style={styles.optionText}>{option.label}</Text>
                  {value === option.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
