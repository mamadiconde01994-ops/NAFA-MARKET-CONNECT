import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PARTNER_LEADERBOARD } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { Badge } from "@/components/common/Badge";

export default function PartnerLeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Leaderboard</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Découvrez les meilleurs partenaires et leur impact économique local.</Text>
      </View>

      <View style={styles.list}>
        {PARTNER_LEADERBOARD.map((entry) => (
          <View key={entry.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.rankRow}>
              <Text style={[styles.rank, { color: colors.secondary }]}>{entry.rank}</Text>
              <Badge label={entry.badge} variant={entry.rank === 1 ? "primary" : entry.rank <= 3 ? "secondary" : "default"} />
            </View>
            <View style={styles.infoRow}>
              <View>
                <Text style={[styles.name, { color: colors.foreground }]}>{entry.name}</Text>
                <Text style={[styles.role, { color: colors.mutedForeground }]}>{entry.role}</Text>
              </View>
              <Text style={[styles.earnings, { color: colors.secondary }]}>{entry.earnings.toLocaleString("fr-FR")} GNF</Text>
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
  list: { paddingHorizontal: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rank: { fontSize: 26, fontFamily: "Inter_700Bold" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  name: { fontSize: 15, fontFamily: "Inter_700Bold" },
  role: { fontSize: 12, fontFamily: "Inter_400Regular" },
  earnings: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
