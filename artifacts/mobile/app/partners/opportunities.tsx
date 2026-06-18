import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpportunityCard } from "@/components/partners/OpportunityCard";
import { PARTNER_OPPORTUNITIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["Tous", "Agriculture", "Restaurants", "Immobilier", "Services"];

export default function PartnerOpportunitiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = React.useState("Tous");

  const opportunities = activeFilter === "Tous"
    ? PARTNER_OPPORTUNITIES
    : PARTNER_OPPORTUNITIES.filter((item) => item.sector === activeFilter);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Opportunités NAFA Partners</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Choisissez les campagnes les plus adaptées à votre réseau local.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((filter) => (
          <Text
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterLabel,
              {
                color: activeFilter === filter ? colors.foreground : colors.mutedForeground,
                backgroundColor: activeFilter === filter ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {filter}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.list}> 
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
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
  filterRow: { paddingLeft: 16, paddingRight: 16, gap: 10, marginBottom: 16 },
  filterLabel: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  list: { paddingHorizontal: 16, gap: 12 },
});
