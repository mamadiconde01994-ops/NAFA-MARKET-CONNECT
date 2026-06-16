import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
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

import { MOCK_PROPERTIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { PropertyType } from "@/types";

const TYPE_LABELS: Record<PropertyType, string> = {
  house: "Maison",
  apartment: "Appartement",
  land: "Terrain",
  commercial: "Local commercial",
  warehouse: "Entrepôt",
};

export default function PropertyDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  if (!property) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.foreground }}>Bien immobilier non trouvé</Text>
      </View>
    );
  }

  const priceLabel = property.priceType === "rent"
    ? `${formatPrice(property.price)} / mois`
    : formatPrice(property.price);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Hero */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: property.images[0] }}
            style={[styles.heroImage, { marginTop: topPad }]}
            contentFit="cover"
            transition={300}
          />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: topPad + 12, backgroundColor: "rgba(0,0,0,0.4)" }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={[styles.typeBadge, { top: topPad + 12, backgroundColor: "#2563EB" }]}>
            <Text style={styles.typeBadgeText}>{TYPE_LABELS[property.type]}</Text>
          </View>
        </View>

        {/* Main info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[
              styles.transactionBadge,
              { backgroundColor: property.priceType === "rent" ? "#DBEAFE" : "#DCFCE7" },
            ]}>
              <Text style={[
                styles.transactionText,
                { color: property.priceType === "rent" ? "#2563EB" : "#16A34A" },
              ]}>
                {property.priceType === "rent" ? "À LOUER" : "À VENDRE"}
              </Text>
            </View>
            <Text style={[styles.city, { color: colors.mutedForeground }]}>
              {property.city}
            </Text>
          </View>

          <Text style={[styles.propertyTitle, { color: colors.foreground }]}>
            {property.title}
          </Text>

          <Text style={[styles.price, { color: "#2563EB" }]}>{priceLabel}</Text>

          {/* Specs */}
          <View style={[styles.specsRow, { backgroundColor: colors.muted, borderRadius: colors.radius - 2 }]}>
            <View style={styles.specItem}>
              <Ionicons name="resize-outline" size={18} color="#2563EB" />
              <Text style={[styles.specValue, { color: colors.foreground }]}>{property.surface} m²</Text>
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Surface</Text>
            </View>
            {property.bedrooms != null && (
              <>
                <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
                <View style={styles.specItem}>
                  <Ionicons name="bed-outline" size={18} color="#2563EB" />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>{property.bedrooms}</Text>
                  <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Chambres</Text>
                </View>
              </>
            )}
            {property.bathrooms != null && (
              <>
                <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
                <View style={styles.specItem}>
                  <Ionicons name="water-outline" size={18} color="#2563EB" />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>{property.bathrooms}</Text>
                  <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Sdb</Text>
                </View>
              </>
            )}
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {property.description}
          </Text>

          {/* Address */}
          <View style={[styles.addressCard, { backgroundColor: colors.muted, borderRadius: colors.radius - 4 }]}>
            <Ionicons name="location-outline" size={16} color="#2563EB" />
            <Text style={[styles.addressText, { color: colors.foreground }]}>
              {property.address}, {property.city}
            </Text>
          </View>
        </View>

        {/* Agent */}
        <View style={[styles.agentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.agentTitle, { color: colors.mutedForeground }]}>AGENT IMMOBILIER</Text>
          <View style={styles.agentRow}>
            <View style={[styles.agentAvatar, { backgroundColor: "#2563EB" }]}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.agentName, { color: colors.foreground }]}>{property.agentName}</Text>
              <Text style={[styles.agentPhone, { color: colors.mutedForeground }]}>{property.agentPhone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: "#2563EB", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="call-outline" size={18} color="#FFFFFF" />
          <Text style={styles.ctaBtnText}>Contacter l'agent</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: "100%", height: 260 },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  infoCard: {
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  transactionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  transactionText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  city: { fontSize: 13, fontFamily: "Inter_400Regular" },
  propertyTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  price: { fontSize: 22, fontFamily: "Inter_700Bold" },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  specItem: { flex: 1, alignItems: "center", gap: 3 },
  specValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  specLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  specDivider: { width: 1, height: 36 },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  addressCard: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  addressText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  agentCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  agentTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  agentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  agentAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  agentName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  agentPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ctaBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
