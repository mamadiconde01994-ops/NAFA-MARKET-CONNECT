import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher des produits...",
  onPress,
  editable = true,
  autoFocus = false,
  onSubmit,
  style,
}: SearchBarProps) {
  const colors = useColors();

  const inner = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
        style,
      ]}
    >
      <Ionicons name="search-outline" size={20} color={colors.mutedForeground} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        editable={editable}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.mutedForeground}
          />
        </Pressable>
      )}
    </View>
  );

  if (!editable && onPress) {
    return (
      <Pressable onPress={onPress} style={style}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 13,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    padding: 0,
    margin: 0,
  },
});
