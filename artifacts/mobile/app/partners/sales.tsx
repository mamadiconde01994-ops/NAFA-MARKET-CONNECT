import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { PARTNER_SALES, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function PartnerSalesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Mes ventes</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Suivez vos commissions et l'état des ventes accompagnées.</Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Commission totale</Text>
        <Text style={[styles.summaryValue, { color: colors.secondary }]}>{formatPrice(PARTNER_STATS.totalEarnings)}</Text>
      </View>

      <View style={styles.list}>
        {PARTNER_SALES.map((sale) => (
          <View key={sale.id} style={[styles.saleCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.rowTop}>
              <View>
                <Text style={[styles.saleProduct, { color: colors.foreground }]}>{sale.product}</Text>
                <Text style={[styles.saleBuyer, { color: colors.mutedForeground }]}>{sale.buyerName}</Text>
              </View>
              <Badge label={sale.status} variant={sale.status === "Payé" ? "success" : "warning"} />
            </View>
            <View style={styles.rowBottom}>
              <Text style={[styles.saleDate, { color: colors.mutedForeground }]}>{sale.date}</Text>
              <Text style={[styles.saleAmount, { color: colors.secondary }]}>{formatPrice(sale.commission)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  summaryCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginHorizontal: 16, marginBottom: 20 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  summaryValue: { fontSize: 28, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 16, gap: 12 },
  saleCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  saleProduct: { fontSize: 15, fontFamily: "Inter_700Bold" },
  saleBuyer: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  saleDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  saleAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
