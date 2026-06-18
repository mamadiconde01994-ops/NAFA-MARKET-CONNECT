import React, { useState } from "react";
import { View, Modal as RNModal, StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Button } from "./Button";

export interface ModalProps {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  isDangerous?: boolean;
}

export function Modal({
  visible,
  title,
  children,
  onClose,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  isDangerous = false,
}: ModalProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 20,
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    footer: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
    },
  });

  return (
    <RNModal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {(onConfirm || onCancel) && (
            <View style={styles.footer}>
              {onCancel && (
                <View style={styles.button}>
                  <Button
                    label={cancelLabel}
                    onPress={onCancel}
                    variant="outline"
                    size="sm"
                  />
                </View>
              )}
              {onConfirm && (
                <View style={styles.button}>
                  <Button
                    label={confirmLabel}
                    onPress={onConfirm}
                    loading={loading}
                    variant={isDangerous ? "destructive" : "primary"}
                    size="sm"
                  />
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
