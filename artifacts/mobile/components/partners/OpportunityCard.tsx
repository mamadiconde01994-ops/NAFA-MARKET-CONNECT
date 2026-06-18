import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/common/Badge";
import { formatPrice } from "@/lib/format";
import type { PartnerOpportunity } from "@/types";
import { useColors } from "@/hooks/useColors";

interface OpportunityCardProps {
  opportunity: PartnerOpportunity;
  onPress?: () => void;
}

export function OpportunityCard({ opportunity, onPress }: OpportunityCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
            {opportunity.title}
          </Text>
          <Text style={[styles.seller, { color: colors.mutedForeground }]}>Vendeur · {opportunity.sellerName}</Text>
        </View>
        <Badge label={opportunity.badge} variant={opportunity.sector === "Agriculture" ? "success" : "secondary"} />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{opportunity.city}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Commission {opportunity.commissionRate}%</Text>
        </View>
      </View>
      <View style={styles.valuesRow}>
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Prix cible</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>{formatPrice(opportunity.price)}</Text>
        </View>
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Gain estimé</Text>
          <Text style={[styles.value, { color: colors.secondary }]}>{formatPrice(opportunity.estimatedEarnings)}</Text>
        </View>
      </View>
      <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Campagne: {opportunity.campaignType}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },
  seller: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
