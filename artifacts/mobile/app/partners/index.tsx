import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { OpportunityCard } from "@/components/partners/OpportunityCard";
import { PARTNER_OPPORTUNITIES, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

interface ActionItem {
  label: string;
  sublabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  color: string;
}

const ACTIONS: ActionItem[] = [
  { label: "Opportunités", sublabel: "Trouver des campagnes", icon: "sparkles-outline", screen: "/partners/opportunities", color: "#F59E0B" },
  { label: "Mes ventes", sublabel: "Historique & commissions", icon: "receipt-outline", screen: "/partners/sales", color: "#16A34A" },
  { label: "Mes gains", sublabel: "Revenus & paiements", icon: "cash-outline", screen: "/partners/earnings", color: "#0891B2" },
  { label: "Leaderboard", sublabel: "Top partenaires", icon: "trophy-outline", screen: "/partners/leaderboard", color: "#F59E0B" },
  { label: "Références", sublabel: "Contacts & récompenses", icon: "people-outline", screen: "/partners/referrals", color: "#7C3AED" },
  { label: "Statistiques", sublabel: "Performance & insights", icon: "bar-chart-outline", screen: "/partners/statistics", color: "#6366F1" },
];

export default function PartnersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const featured = PARTNER_OPPORTUNITIES.slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>NAFA Partners</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Gagnez des commissions en aidant vendeurs, agriculteurs et services à trouver des clients.
        </Text>
      </View>

      {/* Stats card */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statsTop}>
          <View>
            <Text style={[styles.statsCaption, { color: colors.mutedForeground }]}>Gains totaux</Text>
            <Text style={[styles.statsAmount, { color: colors.secondary }]}>
              {formatPrice(PARTNER_STATS.totalEarnings)}
            </Text>
          </View>
          <View style={styles.badgesCol}>
            <Badge label="Vérifié" variant="success" />
            <Badge label="Top Ambassador" variant="primary" />
          </View>
        </View>
        <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={[styles.statsItemValue, { color: colors.foreground }]}>
              {PARTNER_STATS.totalSales}
            </Text>
            <Text style={[styles.statsItemLabel, { color: colors.mutedForeground }]}>Ventes</Text>
          </View>
          <View style={[styles.statsMiniDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statsItem}>
            <Text style={[styles.statsItemValue, { color: colors.foreground }]}>
              {PARTNER_STATS.totalReferrals}
            </Text>
            <Text style={[styles.statsItemLabel, { color: colors.mutedForeground }]}>Références</Text>
          </View>
          <View style={[styles.statsMiniDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statsItem}>
            <Text style={[styles.statsItemValue, { color: colors.foreground }]}>
              {PARTNER_STATS.ranking}
            </Text>
            <Text style={[styles.statsItemLabel, { color: colors.mutedForeground }]}>Classement</Text>
          </View>
        </View>
      </View>

      {/* Navigation grid */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explorer le programme</Text>
      <View style={styles.actionGrid}>
        {ACTIONS.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.screen as any)}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: item.color + "18" }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>{item.label}</Text>
            <Text style={[styles.actionSublabel, { color: colors.mutedForeground }]} numberOfLines={1}>
              {item.sublabel}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Featured opportunities */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Opportunités en vedette</Text>
        <Text
          style={[styles.seeAll, { color: colors.secondary }]}
          onPress={() => router.push("/partners/opportunities" as any)}
        >
          Voir tout
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
      >
        {featured.map((opportunity) => (
          <View key={opportunity.id} style={{ width: 300 }}>
            <OpportunityCard opportunity={opportunity} onPress={() => router.push("/partners/opportunities" as any)} />
          </View>
        ))}
      </ScrollView>

      {/* Why NAFA Partners */}
      <View style={[styles.whyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.whyTitle, { color: colors.foreground }]}>Pourquoi NAFA Partners ?</Text>
        <Text style={[styles.whyText, { color: colors.mutedForeground }]}>
          Aidez les agriculteurs, restaurants, services et propriétaires à trouver des clients. Gagnez une commission sans stock et soutenez l'économie locale de Guinée.
        </Text>
        <View style={styles.whyBadges}>
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
  header: { paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  statsCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statsCaption: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  statsAmount: { fontSize: 26, fontFamily: "Inter_700Bold" },
  badgesCol: { gap: 6, alignItems: "flex-end" },
  statsDivider: { height: 1 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statsItem: { flex: 1, alignItems: "center", gap: 4 },
  statsItemValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statsItemLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  statsMiniDivider: { width: 1, height: 28, marginHorizontal: 8 },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    width: "48%",
    flexBasis: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  actionLabel: { fontSize: 13, fontFamily: "Inter_700Bold" },
  actionSublabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  featuredList: { paddingLeft: 16, paddingRight: 16, gap: 12, paddingBottom: 8 },
  whyCard: {
    borderWidth: 1,
    borderRadius: 20,
    margin: 16,
    padding: 16,
    gap: 12,
  },
  whyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  whyText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  whyBadges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
