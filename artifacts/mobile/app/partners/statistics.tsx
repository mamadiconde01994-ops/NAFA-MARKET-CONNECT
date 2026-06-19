import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

interface StatBoxProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  colors: ReturnType<typeof useColors>;
}

function StatBox({ icon, label, value, color, colors }: StatBoxProps) {
  return (
    <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function PartnerStatisticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const stats = [
    {
      icon: "receipt-outline" as const,
      label: "Ventes totales",
      value: String(PARTNER_STATS.totalSales),
      color: colors.secondary,
    },
    {
      icon: "people-outline" as const,
      label: "Références",
      value: String(PARTNER_STATS.totalReferrals),
      color: colors.primary,
    },
    {
      icon: "trophy-outline" as const,
      label: "Classement",
      value: PARTNER_STATS.ranking,
      color: "#F59E0B",
    },
    {
      icon: "cash-outline" as const,
      label: "Gains totaux",
      value: formatPrice(PARTNER_STATS.totalEarnings),
      color: colors.success,
    },
  ];

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Statistiques</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status badge */}
        <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.statusTitle, { color: colors.foreground }]}>Statut partenaire</Text>
              <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
                Performance de vos campagnes NAFA Partners
              </Text>
            </View>
            <Badge
              label={PARTNER_STATS.verifiedStatus ? "Vérifié" : "En attente"}
              variant={PARTNER_STATS.verifiedStatus ? "success" : "warning"}
            />
          </View>
        </View>

        {/* Stats grid */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Vue d'ensemble</Text>
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <StatBox key={s.label} {...s} colors={colors} />
          ))}
        </View>

        {/* Insight cards */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conseils de performance</Text>
        <View style={styles.insightList}>
          <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.insightIcon, { backgroundColor: "#16A34A18" }]}>
              <Ionicons name="leaf" size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightTitle, { color: colors.foreground }]}>Focus Agriculture</Text>
              <Text style={[styles.insightText, { color: colors.mutedForeground }]}>
                Les campagnes agricoles sont prioritaires. Aidez les fermiers à vendre du riz, tomates, mangues et huile de palme.
              </Text>
            </View>
          </View>

          <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.insightIcon, { backgroundColor: "#6366F118" }]}>
              <Ionicons name="star" size={18} color="#6366F1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightTitle, { color: colors.foreground }]}>Confiance et visibilité</Text>
              <Text style={[styles.insightText, { color: colors.mutedForeground }]}>
                Un bon classement augmente votre visibilité auprès des vendeurs et des entreprises cherchant des partenaires fiables.
              </Text>
            </View>
          </View>

          <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.insightIcon, { backgroundColor: "#F59E0B18" }]}>
              <Ionicons name="flash" size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightTitle, { color: colors.foreground }]}>Augmentez vos gains</Text>
              <Text style={[styles.insightText, { color: colors.mutedForeground }]}>
                Partagez des opportunités avec vos contacts locaux pour augmenter vos commissions et atteindre le statut Elite.
              </Text>
            </View>
          </View>
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
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  statusTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  statusSub: { fontSize: 12, fontFamily: "Inter_400Regular", maxWidth: 220 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    width: "48%",
    flexBasis: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    alignItems: "flex-start",
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  insightList: { paddingHorizontal: 16, gap: 10 },
  insightCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  insightText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
