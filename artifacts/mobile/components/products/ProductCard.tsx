import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/common/Badge";
import { CATEGORIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice, formatUnit } from "@/lib/format";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const colors = useColors();
  const cat = CATEGORIES.find((c) => c.id === product.category);

  const handlePress = () => {
    router.push(`/product/${product.id}` as `/${string}`);
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
        <Image
          source={{ uri: product.images[0] }}
          style={[styles.hImage, { borderRadius: colors.radius - 2 }]}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.hInfo}>
          <Badge
            label={cat?.name ?? product.category}
            variant="outline"
            small
          />
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text style={[styles.price, { color: colors.secondary }]}>
            {formatPrice(product.price)}
            <Text style={[styles.unit, { color: colors.mutedForeground }]}>
              {" "}
              {formatUnit(product.unit)}
            </Text>
          </Text>
          <View style={styles.row}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {product.rating.toFixed(1)} · {product.location}
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
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.images[0] }}
          style={[
            styles.vImage,
            { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius },
          ]}
          contentFit="cover"
          transition={300}
        />
        {product.featured && (
          <View
            style={[
              styles.featuredBadge,
              { backgroundColor: colors.secondary, borderRadius: 6 },
            ]}
          >
            <Text style={styles.featuredText}>Vedette</Text>
          </View>
        )}
      </View>
      <View style={styles.vInfo}>
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text style={[styles.price, { color: colors.secondary }]}>
          {formatPrice(product.price)}
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            {" "}
            {formatUnit(product.unit)}
          </Text>
        </Text>
        <View style={styles.row}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {product.rating.toFixed(1)}
          </Text>
          <Text style={[styles.dot, { color: colors.border }]}>·</Text>
          <Ionicons
            name="location-outline"
            size={11}
            color={colors.mutedForeground}
          />
          <Text
            style={[styles.meta, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {product.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  vCard: {
    flex: 1,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageWrap: { position: "relative" },
  vImage: { width: "100%", height: 140 },
  vInfo: { padding: 10, gap: 4 },
  hCard: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  hImage: { width: 110, height: 110 },
  hInfo: { flex: 1, padding: 12, gap: 4, justifyContent: "center" },
  name: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  unit: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 3 },
  meta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 11 },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  featuredText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
});
