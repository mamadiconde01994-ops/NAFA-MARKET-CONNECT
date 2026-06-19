import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { PARTNER_LEADERBOARD } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7F32"];
const RANK_ICONS: ("trophy" | "medal" | "ribbon")[] = ["trophy", "medal", "ribbon"];

export default function PartnerLeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Leaderboard</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Podium top 3 */}
        <View style={[styles.podiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.podiumTitle, { color: colors.foreground }]}>🏆 Top 3 Partenaires</Text>
          <Text style={[styles.podiumSub, { color: colors.mutedForeground }]}>
            Meilleurs ambassadeurs NAFA ce mois-ci
          </Text>
          <View style={styles.podiumRow}>
            {PARTNER_LEADERBOARD.slice(0, 3).map((entry, i) => (
              <View key={entry.id} style={styles.podiumItem}>
                <View
                  style={[
                    styles.podiumIcon,
                    {
                      backgroundColor: RANK_COLORS[i] + "22",
                      borderColor: RANK_COLORS[i] + "55",
                    },
                  ]}
                >
                  <Ionicons name={RANK_ICONS[i]} size={24} color={RANK_COLORS[i]} />
                </View>
                <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>
                  {entry.name.split(" ")[0]}
                </Text>
                <Text style={[styles.podiumEarnings, { color: colors.secondary }]}>
                  {entry.earnings.toLocaleString("fr-FR")} GNF
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Full list */}
        <Text style={[styles.listTitle, { color: colors.foreground }]}>Classement complet</Text>
        <View style={styles.list}>
          {PARTNER_LEADERBOARD.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const rankColor = isTop3 ? RANK_COLORS[entry.rank - 1] : colors.mutedForeground;
            return (
              <View
                key={entry.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: isTop3 ? rankColor + "44" : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.rankBox,
                    { backgroundColor: isTop3 ? rankColor + "22" : colors.muted },
                  ]}
                >
                  <Text style={[styles.rankText, { color: rankColor }]}>{entry.rank}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.foreground }]}>{entry.name}</Text>
                  <Text style={[styles.role, { color: colors.mutedForeground }]}>{entry.role}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={[styles.earnings, { color: colors.secondary }]}>
                    {entry.earnings.toLocaleString("fr-FR")} GNF
                  </Text>
                  <Badge
                    label={entry.badge}
                    variant={entry.rank === 1 ? "primary" : entry.rank <= 3 ? "secondary" : "default"}
                  />
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
  podiumCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  podiumTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  podiumSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  podiumRow: { flexDirection: "row", justifyContent: "space-around", paddingTop: 8 },
  podiumItem: { alignItems: "center", gap: 8, flex: 1 },
  podiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumName: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  podiumEarnings: { fontSize: 10, fontFamily: "Inter_500Medium" },
  listTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, gap: 10 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  name: { fontSize: 14, fontFamily: "Inter_700Bold" },
  role: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  rightCol: { alignItems: "flex-end", gap: 4 },
  earnings: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
