import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from "react-native";

export interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  required?: boolean;
  hint?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderTextColor?: string;
  errorColor?: string;
  labelColor?: string;
  hintColor?: string;
}

export const Input = React.forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      error,
      icon,
      rightIcon,
      onRightIconPress,
      required = false,
      hint,
      borderColor = "#E2E8F0",
      backgroundColor = "#FFFFFF",
      textColor = "#1E293B",
      placeholderTextColor = "#94A3B8",
      errorColor = "#DC2626",
      labelColor = "#64748B",
      hintColor = "#94A3B8",
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const effectiveBorderColor = error
      ? errorColor
      : isFocused
      ? "#2563EB"
      : borderColor;

    return (
      <View style={styles.container}>
        {label && (
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: labelColor }]}>
              {label}
              {required && <Text style={{ color: errorColor }}>*</Text>}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              borderColor: effectiveBorderColor,
              backgroundColor,
            },
          ]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isFocused ? "#2563EB" : labelColor}
              style={styles.leftIcon}
            />
          )}

          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: textColor,
                paddingLeft: icon ? 32 : 12,
              },
              style,
            ]}
            placeholderTextColor={placeholderTextColor}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              hitSlop={8}
              style={styles.rightIcon}
            >
              {rightIcon}
            </Pressable>
          )}
        </View>

        {error && (
          <View style={styles.errorRow}>
            <Ionicons
              name="alert-circle-outline"
              size={14}
              color={errorColor}
            />
            <Text style={[styles.error, { color: errorColor }]}>
              {error}
            </Text>
          </View>
        )}

        {hint && !error && (
          <Text style={[styles.hint, { color: hintColor }]}>
            {hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: 12,
    height: 52,
  },
  leftIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 10,
  },
  rightIcon: {
    padding: 4,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  error: {
    fontSize: 13,
    fontWeight: "500",
  },
  hint: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: "400",
  },
});
