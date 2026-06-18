import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export type VerificationStatus = "verified" | "new" | "top-seller" | "trusted" | "none";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  horizontal?: boolean;
}

const BADGE_CONFIG: Record<
  VerificationStatus,
  {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  verified: {
    icon: "checkmark-circle",
    label: "Vérifié",
    color: "#059669",
    bgColor: "#d1fae5",
  },
  "top-seller": {
    icon: "star",
    label: "Top Vendeur",
    color: "#d97706",
    bgColor: "#fef3c7",
  },
  trusted: {
    icon: "shield-checkmark",
    label: "De confiance",
    color: "#2563eb",
    bgColor: "#dbeafe",
  },
  new: {
    icon: "sparkles",
    label: "Nouveau",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  none: {
    icon: "help-circle",
    label: "",
    color: "#6b7280",
    bgColor: "transparent",
  },
};

export function VerificationBadge({
  status,
  size = "md",
  horizontal = false,
}: VerificationBadgeProps) {
  const colors = useColors();
  const config = BADGE_CONFIG[status];

  if (status === "none") return null;

  const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 14;
  const fontSize = size === "sm" ? 10 : size === "lg" ? 13 : 11;
  const padding = size === "sm" ? 4 : size === "lg" ? 8 : 6;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          paddingHorizontal: padding + 4,
          paddingVertical: padding,
          flexDirection: horizontal ? "row" : "column",
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={iconSize}
        color={config.color}
        style={horizontal ? { marginRight: 4 } : { marginBottom: 2 }}
      />
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

export function SellerInfoCard({
  sellerName,
  sellerImage,
  verification,
  rating,
  totalSales,
  responseTime,
}: {
  sellerName: string;
  sellerImage?: string;
  verification: VerificationStatus;
  rating: number;
  totalSales: number;
  responseTime?: string;
}) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.sellerHeader}>
        <View
          style={[
            styles.sellerAvatar,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: colors.primary, fontSize: 20 },
            ]}
          >
            {sellerName[0]}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.sellerName,
              { color: colors.foreground },
            ]}
          >
            {sellerName}
          </Text>
          <VerificationBadge status={verification} size="sm" horizontal />
        </View>
      </View>

      <View
        style={[
          styles.statsRow,
          { borderTopColor: colors.border },
        ]}
      >
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Note
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text
              style={[
                styles.statValue,
                { color: colors.foreground },
              ]}
            >
              {rating.toFixed(1)}
            </Text>
          </View>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Ventes
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: colors.foreground },
            ]}
          >
            {totalSales}+
          </Text>
        </View>
        {responseTime && (
          <>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Réponse
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.foreground },
                ]}
              >
                {responseTime}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: 6,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
  },
  cardContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
  },
  sellerName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 8,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 20,
  },
});
