import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { Property, PropertyType } from "@/types";

const TYPE_LABELS: Record<PropertyType, string> = {
  house: "Maison",
  apartment: "Appartement",
  land: "Terrain",
  commercial: "Commerce",
  warehouse: "Entrepôt",
};

const TYPE_ICONS: Record<PropertyType, keyof typeof Ionicons.glyphMap> = {
  house: "home-outline",
  apartment: "business-outline",
  land: "map-outline",
  commercial: "storefront-outline",
  warehouse: "cube-outline",
};

interface Props {
  property: Property;
  horizontal?: boolean;
}

export function PropertyCard({ property, horizontal = false }: Props) {
  const colors = useColors();

  const handlePress = () => {
    router.push(`/real-estate/${property.id}` as any);
  };

  const priceLabel = property.priceType === "rent"
    ? `${formatPrice(property.price)} /mois`
    : formatPrice(property.price);

  if (horizontal) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.hCard,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={[styles.hImage, { borderTopLeftRadius: colors.radius, borderBottomLeftRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.hInfo}>
          <View style={styles.row}>
            <Ionicons name={TYPE_ICONS[property.type]} size={11} color="#2563EB" />
            <Text style={[styles.type, { color: "#2563EB" }]}>
              {TYPE_LABELS[property.type]}
            </Text>
            {property.priceType === "rent" && (
              <View style={[styles.rentBadge, { backgroundColor: "#DBEAFE" }]}>
                <Text style={{ fontSize: 9, color: "#2563EB", fontFamily: "Inter_600SemiBold" }}>À LOUER</Text>
              </View>
            )}
          </View>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {property.title}
          </Text>
          <Text style={[styles.price, { color: "#2563EB" }]}>
            {priceLabel}
          </Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {property.city}
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}>·</Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {property.surface} m²
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.vCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View>
        <Image
          source={{ uri: property.images[0] }}
          style={[styles.vImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        {property.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: "#2563EB" }]}>
            <Text style={styles.featuredText}>Vedette</Text>
          </View>
        )}
        {property.priceType === "rent" && (
          <View style={[styles.typeBadge, { backgroundColor: "#DBEAFE" }]}>
            <Text style={{ fontSize: 9, color: "#2563EB", fontFamily: "Inter_600SemiBold" }}>À LOUER</Text>
          </View>
        )}
      </View>
      <View style={styles.vInfo}>
        <View style={styles.row}>
          <Ionicons name={TYPE_ICONS[property.type]} size={11} color="#2563EB" />
          <Text style={[styles.type, { color: "#2563EB" }]}>{TYPE_LABELS[property.type]}</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {property.title}
        </Text>
        <Text style={[styles.price, { color: "#2563EB" }]}>{priceLabel}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
            {property.city}
          </Text>
          {property.bedrooms && (
            <>
              <Text style={[styles.dot, { color: colors.border }]}>·</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                {property.bedrooms} ch.
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  vCard: { flex: 1, borderWidth: 1, overflow: "hidden" },
  vImage: { width: "100%", height: 175 },
  vInfo: { padding: 14, gap: 6 },
  hCard: { flexDirection: "row", borderWidth: 1, overflow: "hidden", marginBottom: 12 },
  hImage: { width: 130, height: 130 },
  hInfo: { flex: 1, padding: 14, gap: 6, justifyContent: "center" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", lineHeight: 22 },
  type: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  price: { fontSize: 17, fontFamily: "Inter_700Bold" },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 11 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  rentBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
});
