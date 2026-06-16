import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Restaurant } from "@/types";

const CUISINE_LABELS: Record<string, string> = {
  guinean: "Guinéen",
  senegalese: "Sénégalais",
  lebanese: "Libanais",
  french: "Français",
  chinese: "Chinois",
  fastfood: "Fast Food",
  mixed: "International",
};

function PriceRange({ range }: { range: 1 | 2 | 3 }) {
  return (
    <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: "#F59E0B" }}>
      {"GNF".repeat(range)}
      <Text style={{ opacity: 0.3 }}>{"GNF".repeat(3 - range)}</Text>
    </Text>
  );
}

interface Props {
  restaurant: Restaurant;
  horizontal?: boolean;
}

export function RestaurantCard({ restaurant, horizontal = false }: Props) {
  const colors = useColors();

  const handlePress = () => {
    router.push(`/restaurants/${restaurant.id}` as any);
  };

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
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: restaurant.images[0] }}
            style={[styles.hImage, { borderTopLeftRadius: colors.radius, borderBottomLeftRadius: colors.radius }]}
            contentFit="cover"
            transition={300}
          />
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <Text style={styles.closedText}>Fermé</Text>
            </View>
          )}
        </View>
        <View style={styles.hInfo}>
          <View style={styles.row}>
            <Text style={[styles.cuisine, { color: "#EA580C" }]}>
              {CUISINE_LABELS[restaurant.cuisine] ?? restaurant.cuisine}
            </Text>
            <PriceRange range={restaurant.priceRange} />
          </View>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {restaurant.name}
          </Text>
          <View style={styles.row}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount})
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {restaurant.deliveryTime} min
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}>·</Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {(restaurant.deliveryFee / 1000).toFixed(0)}K livraison
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
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: restaurant.images[0] }}
          style={[styles.vImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        {restaurant.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: "#EA580C" }]}>
            <Text style={styles.featuredText}>Populaire</Text>
          </View>
        )}
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Fermé</Text>
          </View>
        )}
      </View>
      <View style={styles.vInfo}>
        <View style={styles.row}>
          <Text style={[styles.cuisine, { color: "#EA580C" }]}>
            {CUISINE_LABELS[restaurant.cuisine] ?? restaurant.cuisine}
          </Text>
          <PriceRange range={restaurant.priceRange} />
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {restaurant.name}
        </Text>
        <View style={styles.row}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {restaurant.rating.toFixed(1)}
          </Text>
          <Text style={[styles.dot, { color: colors.border }]}>·</Text>
          <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {restaurant.deliveryTime} min
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  vCard: { flex: 1, borderWidth: 1, overflow: "hidden" },
  vImage: { width: "100%", height: 140 },
  vInfo: { padding: 10, gap: 4 },
  hCard: { flexDirection: "row", borderWidth: 1, overflow: "hidden", marginBottom: 10 },
  hImage: { width: 110, height: 110 },
  hInfo: { flex: 1, padding: 12, gap: 4, justifyContent: "center" },
  name: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },
  cuisine: { fontSize: 11, fontFamily: "Inter_500Medium" },
  meta: { fontSize: 11, fontFamily: "Inter_400Regular" },
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
  featuredText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  closedText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 14 },
});
