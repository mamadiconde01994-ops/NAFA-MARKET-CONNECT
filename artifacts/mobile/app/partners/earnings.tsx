import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { PARTNER_EARNINGS_HISTORY, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive"> = {
  Payé: "success",
  "En attente": "warning",
  Annulé: "destructive",
};

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mes gains</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryCaption, { color: colors.mutedForeground }]}>Total gagné</Text>
          <Text style={[styles.summaryAmount, { color: colors.secondary }]}>
            {formatPrice(PARTNER_STATS.totalEarnings)}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubLabel, { color: colors.mutedForeground }]}>Ventes totales</Text>
              <Text style={[styles.summarySubValue, { color: colors.foreground }]}>{PARTNER_STATS.totalSales}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubLabel, { color: colors.mutedForeground }]}>Classement</Text>
              <Text style={[styles.summarySubValue, { color: colors.foreground }]}>#{PARTNER_STATS.ranking}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubLabel, { color: colors.mutedForeground }]}>Statut</Text>
              <Badge
                label={PARTNER_STATS.verifiedStatus ? "Vérifié" : "En attente"}
                variant={PARTNER_STATS.verifiedStatus ? "success" : "warning"}
              />
            </View>
          </View>
        </View>

        {/* History section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Historique des revenus</Text>
          <Button label="Demander paiement" onPress={handleRequestPayment} variant="outline" />
        </View>

        <View style={styles.list}>
          {PARTNER_EARNINGS_HISTORY.map((entry) => (
            <View
              key={entry.id}
              style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.historyLeft}>
                <View style={[styles.historyIconBox, { backgroundColor: colors.muted }]}>
                  <Ionicons name="cash-outline" size={18} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyLabel, { color: colors.foreground }]}>{entry.label}</Text>
                  {entry.date && (
                    <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>{entry.date}</Text>
                  )}
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={[styles.historyAmount, { color: colors.secondary }]}>
                  {formatPrice(entry.amount)}
                </Text>
                {entry.status && (
                  <Badge
                    label={entry.status}
                    variant={STATUS_VARIANT[entry.status] ?? "default"}
                  />
                )}
              </View>
            </View>
          ))}
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
    gap: 12,
  },
  summaryCaption: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  summaryAmount: { fontSize: 32, fontFamily: "Inter_700Bold" },
  summaryRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  summarySubItem: { flex: 1, alignItems: "center", gap: 4 },
  summarySubLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  summarySubValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  summaryDivider: { width: 1, height: 32, marginHorizontal: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 16, gap: 10 },
  historyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  historyLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  historyLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  historyDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  historyRight: { alignItems: "flex-end", gap: 4 },
  historyAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
