import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";

export default function PartnerStatisticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Statistiques</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Performance de vos campagnes et classements au sein de NAFA Partners.</Text>
      </View>

      <View style={[styles.statsGrid, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{PARTNER_STATS.totalSales}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Ventes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{PARTNER_STATS.totalReferrals}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Références</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{PARTNER_STATS.ranking}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Classement</Text>
        </View>
        <View style={styles.statItem}>
          <Badge label={PARTNER_STATS.verifiedStatus ? "Verified Partner" : "Pending"} variant={PARTNER_STATS.verifiedStatus ? "success" : "warning"} />
          <Text style={[styles.statLabel, { color: colors.mutedForeground, marginTop: 8 }]}>Statut de confiance</Text>
        </View>
      </View>

      <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.insightTitle, { color: colors.foreground }]}>Focus Agriculture</Text>
        <Text style={[styles.insightText, { color: colors.mutedForeground }]}>Les campagnes agricoles sont prioritaires pour NAFA Partners. Aidez les fermiers à vendre du riz, tomates, mangues et huile de palme.</Text>
      </View>

      <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.insightTitle, { color: colors.foreground }]}>Confiance et performance</Text>
        <Text style={[styles.insightText, { color: colors.mutedForeground }]}>Un bon classement augmente votre visibilité auprès des vendeurs et des entreprises cherchant des partenaires fiables.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  statsGrid: { borderWidth: 1, borderRadius: 20, padding: 16, marginHorizontal: 16, gap: 16 },
  statItem: { padding: 12, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 6 },
  insightCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginHorizontal: 16, marginTop: 16, gap: 8 },
  insightTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  insightText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
