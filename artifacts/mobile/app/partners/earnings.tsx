import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { PARTNER_EARNINGS_HISTORY, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function PartnerEarningsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleRequestPayment = () => {
    Alert.alert(
      "Demande envoyée",
      "Votre demande de paiement a été prise en compte. Nous vous tiendrons informé dès que possible.",
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Mes gains</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Suivez vos revenus et les paiements de vos commissions.</Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total gagné</Text>
            <Text style={[styles.summaryValue, { color: colors.secondary }]}>{formatPrice(PARTNER_STATS.totalEarnings)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Statut</Text>
            <Badge label={PARTNER_STATS.verifiedStatus ? "Trusté" : "En validation"} variant={PARTNER_STATS.verifiedStatus ? "success" : "warning"} />
          </View>
        </View>
      </View>

      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Historique des revenus</Text>
          <Button label="Demander paiement" onPress={handleRequestPayment} variant="outline" />
        </View>
        {PARTNER_EARNINGS_HISTORY.map((entry) => (
          <View key={entry.id} style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.historyLabel, { color: colors.foreground }]}>{entry.label}</Text>
            <Text style={[styles.historyAmount, { color: colors.secondary }]}>{formatPrice(entry.amount)}</Text>
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
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  summaryValue: { fontSize: 28, fontFamily: "Inter_700Bold" },
  historySection: { paddingHorizontal: 16, gap: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  historyCard: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  historyLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  historyAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
