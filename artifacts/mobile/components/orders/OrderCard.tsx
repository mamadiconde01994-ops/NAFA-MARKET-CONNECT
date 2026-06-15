import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/common/Badge";
import { useColors } from "@/hooks/useColors";
import {
  formatDate,
  formatPrice,
  formatStatusLabel,
  formatStatusVariant,
} from "@/lib/format";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const colors = useColors();
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const firstItem = order.items[0];

  return (
    <Pressable
      onPress={onPress}
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
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Text style={[styles.id, { color: colors.mutedForeground }]}>
            #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Badge
            label={formatStatusLabel(order.status)}
            variant={formatStatusVariant(order.status)}
            small
          />
        </View>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          {formatDate(order.createdAt)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.body}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>
            {firstItem?.productName ?? ""}
            {order.items.length > 1 && (
              <Text style={{ color: colors.mutedForeground }}>
                {" "}+{order.items.length - 1} article{order.items.length > 2 ? "s" : ""}
              </Text>
            )}
          </Text>
          <View style={styles.sellerRow}>
            <Ionicons name="storefront-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.seller, { color: colors.mutedForeground }]}>
              {order.sellerName}
            </Text>
          </View>
        </View>

        <View style={styles.amountWrap}>
          <Text style={[styles.amount, { color: colors.secondary }]}>
            {formatPrice(order.totalAmount)}
          </Text>
          <Text style={[styles.qty, { color: colors.mutedForeground }]}>
            {itemCount} article{itemCount > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    paddingBottom: 10,
  },
  idRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  id: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  date: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginHorizontal: 14 },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingTop: 10,
    gap: 8,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  seller: { fontSize: 12, fontFamily: "Inter_400Regular" },
  amountWrap: { alignItems: "flex-end", gap: 2 },
  amount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  qty: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
