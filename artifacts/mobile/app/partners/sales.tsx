import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { PARTNER_SALES, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function PartnerSalesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const paid = PARTNER_SALES.filter((s) => s.status === "Payé");
  const pending = PARTNER_SALES.filter((s) => s.status !== "Payé");

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mes ventes</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryCaption, { color: colors.mutedForeground }]}>Commission totale</Text>
          <Text style={[styles.summaryAmount, { color: colors.secondary }]}>
            {formatPrice(PARTNER_STATS.totalEarnings)}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>{paid.length}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Payées</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{pending.length}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>En attente</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{PARTNER_SALES.length}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total</Text>
            </View>
          </View>
        </View>

        {/* Sales list */}
        <Text style={[styles.listTitle, { color: colors.foreground }]}>Détail des ventes</Text>
        <View style={styles.list}>
          {PARTNER_SALES.map((sale) => {
            return (
              <View
                key={sale.id}
                style={[styles.saleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.saleTop}>
                  <View style={[styles.saleIconBox, { backgroundColor: colors.muted }]}>
                    <Ionicons name="bag-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.saleProduct, { color: colors.foreground }]}>
                      {sale.product}
                    </Text>
                    <Text style={[styles.saleBuyer, { color: colors.mutedForeground }]}>
                      {sale.buyerName}
                    </Text>
                  </View>
                  <Badge label={sale.status} variant={sale.status === "Payé" ? "success" : "warning"} />
                </View>
                <View style={[styles.saleBottom, { borderTopColor: colors.border }]}>
                  <Text style={[styles.saleDate, { color: colors.mutedForeground }]}>{sale.date}</Text>
                  <Text style={[styles.saleAmount, { color: colors.secondary }]}>
                    {formatPrice(sale.commission)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 10,
  },
  summaryCaption: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  summaryAmount: { fontSize: 32, fontFamily: "Inter_700Bold" },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  statDivider: { width: 1, height: 32, marginHorizontal: 8 },
  listTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, gap: 10 },
  saleCard: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  saleTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  saleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saleProduct: { fontSize: 14, fontFamily: "Inter_700Bold" },
  saleBuyer: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  saleBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  saleDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  saleAmount: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
