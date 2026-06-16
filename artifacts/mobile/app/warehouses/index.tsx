import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import { MOCK_WAREHOUSES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { Warehouse } from "@/types";

function WarehouseCard({ warehouse }: { warehouse: Warehouse }) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: warehouse.images[0] }}
          style={[styles.cardImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        <View style={[
          styles.availabilityBadge,
          { backgroundColor: warehouse.available ? "#DCFCE7" : "#FEE2E2" },
        ]}>
          <View style={[
            styles.availabilityDot,
            { backgroundColor: warehouse.available ? "#16A34A" : "#DC2626" },
          ]} />
          <Text style={[
            styles.availabilityText,
            { color: warehouse.available ? "#16A34A" : "#DC2626" },
          ]}>
            {warehouse.available ? "Disponible" : "Occupé"}
          </Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.warehouseName, { color: colors.foreground }]} numberOfLines={1}>
          {warehouse.name}
        </Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{warehouse.city}</Text>
          <Text style={[styles.dot, { color: colors.border }]}>·</Text>
          <Ionicons name="resize-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{warehouse.surfaceM2} m²</Text>
        </View>
        <Text style={[styles.price, { color: "#DC2626" }]}>
          {formatPrice(warehouse.pricePerMonth)}
          <Text style={[styles.perMonth, { color: colors.mutedForeground }]}> / mois</Text>
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {warehouse.description}
        </Text>
        <View style={styles.featuresRow}>
          {warehouse.features.slice(0, 3).map((f) => (
            <View key={f} style={[styles.featureChip, { backgroundColor: colors.muted }]}>
              <Ionicons name="checkmark" size={11} color="#DC2626" />
              <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
            </View>
          ))}
          {warehouse.features.length > 3 && (
            <Text style={[styles.moreFeatures, { color: colors.mutedForeground }]}>
              +{warehouse.features.length - 3}
            </Text>
          )}
        </View>
        <View style={styles.agentRow}>
          <View style={[styles.agentAvatar, { backgroundColor: "#DC2626" }]}>
            <Ionicons name="person" size={14} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.agentName, { color: colors.foreground }]}>{warehouse.ownerName}</Text>
            <Text style={[styles.agentPhone, { color: colors.mutedForeground }]}>{warehouse.ownerPhone}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>{warehouse.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function WarehousesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const available = MOCK_WAREHOUSES.filter((w) => w.available);
  const occupied = MOCK_WAREHOUSES.filter((w) => !w.available);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#DC2626" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Warehouses</Text>
          <Text style={styles.headerSub}>Entrepôts & stockage</Text>
        </View>
        <Ionicons name="cube" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Coming soon banner */}
        <View style={[styles.comingSoonBanner, { backgroundColor: "#FEF3C7", borderRadius: colors.radius }]}>
          <Ionicons name="construct-outline" size={18} color="#F59E0B" />
          <View style={{ flex: 1 }}>
            <Text style={styles.comingSoonTitle}>Module en développement</Text>
            <Text style={styles.comingSoonText}>
              La gestion d'inventaire complète sera disponible prochainement. Parcourez les entrepôts disponibles dès maintenant.
            </Text>
          </View>
        </View>

        {/* Available */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              ✅ Entrepôts disponibles
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {available.length}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {available.map((w) => (
              <WarehouseCard key={w.id} warehouse={w} />
            ))}
          </View>
        </View>

        {/* Occupied */}
        {occupied.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Bientôt disponibles
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {occupied.map((w) => (
                <WarehouseCard key={w.id} warehouse={w} />
              ))}
            </View>
          </View>
        )}
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
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  comingSoonBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 16,
    padding: 14,
  },
  comingSoonTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#92400E", marginBottom: 2 },
  comingSoonText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#92400E", lineHeight: 17 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderWidth: 1, overflow: "hidden" },
  cardImage: { width: "100%", height: 180 },
  availabilityBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  availabilityDot: { width: 7, height: 7, borderRadius: 4 },
  availabilityText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardInfo: { padding: 14, gap: 8 },
  warehouseName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 12 },
  price: { fontSize: 18, fontFamily: "Inter_700Bold" },
  perMonth: { fontSize: 13, fontFamily: "Inter_400Regular" },
  description: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  featuresRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featureText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  moreFeatures: { fontSize: 11, fontFamily: "Inter_400Regular" },
  agentRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  agentAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  agentName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  agentPhone: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
