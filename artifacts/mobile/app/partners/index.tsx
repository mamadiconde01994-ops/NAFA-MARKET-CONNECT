import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { OpportunityCard } from "@/components/partners/OpportunityCard";
import { Button } from "@/components/common/Button";
import { PARTNER_OPPORTUNITIES, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function PartnersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const featured = PARTNER_OPPORTUNITIES.filter((_, index) => index < 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>NAFA Partners</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Gagnez des commissions en aidant les vendeurs, agriculteurs et services à trouver des clients.</Text>
      </View>

      <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{PARTNER_STATS.totalSales}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Ventes</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{PARTNER_STATS.totalReferrals}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Références</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricValue, { color: colors.secondary }]}>{formatPrice(PARTNER_STATS.totalEarnings)}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Gains</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricValue, { color: colors.foreground }]}>{PARTNER_STATS.ranking}</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Classement</Text>
          </View>
        </View>
        <View style={styles.badgesRow}>
          <Badge label="Vérifié" variant="success" />
          <Badge label="Top Ambassador" variant="primary" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explorer le programme</Text>
      </View>
      <View style={styles.actionGrid}>
        {[
          { label: "Opportunités", icon: "sparkles-outline", screen: "/partners/opportunities" },
          { label: "Mes ventes", icon: "receipt-outline", screen: "/partners/sales" },
          { label: "Mes gains", icon: "cash-outline", screen: "/partners/earnings" },
          { label: "Leaderboard", icon: "trophy-outline", screen: "/partners/leaderboard" },
          { label: "Références", icon: "people-outline", screen: "/partners/referrals" },
          { label: "Statistiques", icon: "bar-chart-outline", screen: "/partners/statistics" },
        ].map((item) => (
          <View key={item.label} style={styles.actionItem}>
            <Button
              label={item.label}
              onPress={() => router.push(item.screen as any)}
              variant="outline"
              fullWidth
            />
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Opportunités en vedette</Text>
        <Text style={[styles.seeAll, { color: colors.secondary }]} onPress={() => router.push("/partners/opportunities" as any)}>
          Voir tout
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredList}>
        {featured.map((opportunity) => (
          <View key={opportunity.id} style={{ width: 320 }}>
            <OpportunityCard
              opportunity={opportunity}
              onPress={() => router.push(`/partners/opportunities` as any)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.explainCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.explainTitle, { color: colors.foreground }]}>Pourquoi NAFA Partners ?</Text>
        <Text style={[styles.explainText, { color: colors.mutedForeground }]}>
          Aidez les agriculteurs, restaurants, services et propriétaires à trouver des clients. Gagnez une commission sans stock et soutenez l'économie locale.
        </Text>
        <View style={styles.badgeWrap}>
          <Badge label="Agriculture prioritaire" variant="success" />
          <Badge label="Confiance locale" variant="secondary" />
          <Badge label="Commission rapide" variant="primary" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  statusCard: { borderWidth: 1, borderRadius: 20, padding: 16, marginHorizontal: 16, gap: 16 },
  metricsRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  metricBlock: { flex: 1 },
  metricValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  metricLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 4 },
  badgesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  actionItem: { flexBasis: "48%" },
  featuredList: { paddingLeft: 16, gap: 12, paddingBottom: 8 },
  explainCard: { borderWidth: 1, borderRadius: 20, margin: 16, padding: 16, gap: 12 },
  explainTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  explainText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  badgeWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
