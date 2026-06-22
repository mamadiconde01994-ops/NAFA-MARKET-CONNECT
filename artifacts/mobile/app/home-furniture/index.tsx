import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function HomeFurnitureScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#0D9488" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Maison</Text>
          <Text style={styles.headerSub}>Bientôt disponible</Text>
        </View>
        <Ionicons name="bed" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Coming Soon Section */}
        <View style={[styles.comingSoonContainer, { paddingVertical: 80 }]}>
          <View style={[styles.iconCircle, { backgroundColor: "#0D948822" }]}>
            <Ionicons name="bed-outline" size={64} color="#0D9488" />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Meubles & Décoration
          </Text>

          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Meubles, décoration, articles ménagers et bien plus pour transformer votre maison.
          </Text>

          <View style={[styles.featureList, { marginTop: 32 }]}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              <Text style={[styles.featureText, { color: colors.foreground }]}>
                Designs modernes
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              <Text style={[styles.featureText, { color: colors.foreground }]}>
                Qualité garantie
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              <Text style={[styles.featureText, { color: colors.foreground }]}>
                Installation disponible
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: "#0D9488",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.buttonText}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  comingSoonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 16 },
  featureList: { width: "100%", gap: 12 },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: { fontSize: 14, fontWeight: "500" },
  button: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
});
