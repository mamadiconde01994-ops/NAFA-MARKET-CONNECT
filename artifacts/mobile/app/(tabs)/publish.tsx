import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_ACCENT = "#52B788";

/* ── Category config ── */
interface PublishCategory {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}

const PUBLISH_CATS: PublishCategory[] = [
  {
    id: "agriculture",
    label: "Produit agricole",
    subtitle: "Légumes, fruits, céréales…",
    icon: "leaf",
    color: "#16A34A",
    onPress: () => router.push("/product/create" as any),
  },
  {
    id: "real-estate",
    label: "Bien immobilier",
    subtitle: "Maison, appart, terrain…",
    icon: "home",
    color: "#2563EB",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "real-estate", label: "Bien immobilier" } }),
  },
  {
    id: "service",
    label: "Service professionnel",
    subtitle: "Artisan, consultant…",
    icon: "construct",
    color: "#7C3AED",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "service", label: "Service professionnel" } }),
  },
  {
    id: "vehicle",
    label: "Véhicule",
    subtitle: "Voiture, moto, camion…",
    icon: "car",
    color: "#475569",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "vehicle", label: "Véhicule" } }),
  },
  {
    id: "warehouse",
    label: "Entrepôt / Espace",
    subtitle: "Stockage, logistique…",
    icon: "cube",
    color: "#DC2626",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "warehouse", label: "Entrepôt / Espace" } }),
  },
  {
    id: "job",
    label: "Offre d'emploi",
    subtitle: "CDI, CDD, freelance…",
    icon: "briefcase",
    color: "#0891B2",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "job", label: "Offre d'emploi" } }),
  },
  {
    id: "restaurant",
    label: "Restaurant / Menu",
    subtitle: "Plats, livraison, résa…",
    icon: "restaurant",
    color: "#EA580C",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "restaurant", label: "Restaurant / Menu" } }),
  },
  {
    id: "electronics",
    label: "Électronique",
    subtitle: "Téléphones, ordis…",
    icon: "phone-portrait",
    color: "#6366F1",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "electronics", label: "Électronique" } }),
  },
  {
    id: "fashion",
    label: "Mode & Beauté",
    subtitle: "Vêtements, accessoires…",
    icon: "shirt",
    color: "#EC4899",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "fashion", label: "Mode & Beauté" } }),
  },
  {
    id: "furniture",
    label: "Maison & Déco",
    subtitle: "Meubles, électroménager…",
    icon: "bed",
    color: "#0D9488",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "furniture", label: "Maison & Déco" } }),
  },
  {
    id: "construction",
    label: "Construction",
    subtitle: "Matériaux, équipements…",
    icon: "hammer",
    color: "#92400E",
    onPress: () => router.push({ pathname: "/listing/create" as any, params: { category: "construction", label: "Construction" } }),
  },
];

function CategoryCard({ cat, colors }: { cat: PublishCategory; colors: ReturnType<typeof useColors> }) {
  return (
    <Pressable
      onPress={cat.onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.78 : 1,
        },
      ]}
    >
      {/* Icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: cat.color + "18" }]}>
        <Ionicons name={cat.icon} size={26} color={cat.color} />
      </View>

      <View style={styles.cardText}>
        <Text style={[styles.cardLabel, { color: colors.foreground }]} numberOfLines={1}>
          {cat.label}
        </Text>
        <Text style={[styles.cardSub, { color: colors.mutedForeground }]} numberOfLines={1}>
          {cat.subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function PublishScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 80 : 80 + (insets.bottom ?? 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header gradient */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Publier une annonce</Text>
            <Text style={styles.headerSub}>Choisissez une catégorie</Text>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: BRAND_ACCENT + "28" }]}>
            <Ionicons name="add-circle" size={32} color={BRAND_ACCENT} />
          </View>
        </View>

        {/* Tip strip */}
        <View style={[styles.tipStrip, { backgroundColor: "rgba(255,255,255,0.07)" }]}>
          <Ionicons name="flash" size={13} color={BRAND_ACCENT} />
          <Text style={styles.tipText}>Gratuit · Visible dans tout le pays · Livraison possible</Text>
        </View>
      </LinearGradient>

      {/* Category list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CHOISISSEZ UNE CATÉGORIE</Text>

        {PUBLISH_CATS.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} colors={colors} />
        ))}

        <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>
          🔒 Toutes les annonces sont vérifiées avant publication.{"\n"}
          Délai de validation : 24h ouvrées.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.4 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", marginTop: 2 },
  headerBadge: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  tipStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  tipText: { fontSize: 11.5, color: "rgba(255,255,255,0.75)", flex: 1 },

  /* List */
  list: { paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  /* Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardText: { flex: 1, minWidth: 0 },
  cardLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  soonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  soonText: { fontSize: 11, fontWeight: "600" },

  /* Footer */
  footerNote: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 8,
  },
});
