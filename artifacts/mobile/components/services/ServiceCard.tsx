import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { ServiceCategoryId, ServiceProvider } from "@/types";

const CATEGORY_LABELS: Record<ServiceCategoryId, string> = {
  mechanics: "Mécanique",
  electrician: "Électricien",
  plumber: "Plomberie",
  technician: "Technicien",
  freelancer: "Freelance",
  cleaning: "Nettoyage",
  security: "Sécurité",
  transport: "Transport",
  construction: "Construction",
  welder: "Soudure",
};

const CATEGORY_ICONS: Record<ServiceCategoryId, keyof typeof Ionicons.glyphMap> = {
  mechanics: "car-outline",
  electrician: "flash-outline",
  plumber: "water-outline",
  technician: "phone-portrait-outline",
  freelancer: "laptop-outline",
  cleaning: "brush-outline",
  security: "shield-outline",
  transport: "cube-outline",
  construction: "hammer-outline",
  welder: "flame-outline",
};

const PRICE_TYPE_LABELS = {
  per_hour: "/heure",
  per_job: "/mission",
  negotiable: "négociable",
};

interface Props {
  provider: ServiceProvider;
  onPress?: () => void;
}

export function ServiceCard({ provider, onPress }: Props) {
  const colors = useColors();
  const icon = CATEGORY_ICONS[provider.category] ?? "construct-outline";
  const label = CATEGORY_LABELS[provider.category] ?? provider.category;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image
        source={{ uri: provider.image }}
        style={[styles.avatar, { borderRadius: 40 }]}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.info}>
        <View style={styles.row}>
          <View style={[styles.categoryBadge, { backgroundColor: "#7C3AED" + "18" }]}>
            <Ionicons name={icon} size={11} color="#7C3AED" />
            <Text style={[styles.categoryText, { color: "#7C3AED" }]}>
              {label}
            </Text>
          </View>
          {provider.verified && (
            <View style={styles.row}>
              <Ionicons name="checkmark-circle" size={13} color="#16A34A" />
              <Text style={[styles.verifiedText, { color: "#16A34A" }]}>Vérifié</Text>
            </View>
          )}
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {provider.name}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {provider.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.row}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {provider.rating.toFixed(1)} ({provider.reviewCount})
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {provider.city}
            </Text>
          </View>
          {provider.price > 0 ? (
            <Text style={[styles.price, { color: "#7C3AED" }]}>
              {formatPrice(provider.price)}
              <Text style={[styles.priceType, { color: colors.mutedForeground }]}>
                {" "}{PRICE_TYPE_LABELS[provider.priceType]}
              </Text>
            </Text>
          ) : (
            <Text style={[styles.price, { color: "#7C3AED" }]}>Sur devis</Text>
          )}
        </View>
        <View style={styles.skillsRow}>
          {provider.skills.slice(0, 3).map((skill) => (
            <View key={skill} style={[styles.skillChip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.skillText, { color: colors.mutedForeground }]}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  avatar: { width: 70, height: 70 },
  info: { flex: 1, gap: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  verifiedText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  name: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  footer: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 2 },
  meta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  price: { fontSize: 13, fontFamily: "Inter_700Bold" },
  priceType: { fontSize: 11, fontFamily: "Inter_400Regular" },
  skillsRow: { flexDirection: "row", gap: 4, flexWrap: "wrap", marginTop: 4 },
  skillChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  skillText: { fontSize: 10, fontFamily: "Inter_400Regular" },
});
