import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpportunityCard } from "@/components/partners/OpportunityCard";
import { PARTNER_OPPORTUNITIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["Tous", "Agriculture", "Restaurants", "Immobilier", "Services"];

export default function PartnerOpportunitiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = React.useState("Tous");

  const opportunities =
    activeFilter === "Tous"
      ? PARTNER_OPPORTUNITIES
      : PARTNER_OPPORTUNITIES.filter((item) => item.sector === activeFilter);

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Opportunités</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <View style={styles.intro}>
          <Text style={[styles.introText, { color: colors.mutedForeground }]}>
            Choisissez les campagnes les plus adaptées à votre réseau local et gagnez des commissions.
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    { color: active ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Count */}
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {opportunities.length} opportunité{opportunities.length !== 1 ? "s" : ""}
        </Text>

        {/* Opportunity list */}
        <View style={styles.list}>
          {opportunities.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Aucune opportunité dans ce secteur pour le moment.
              </Text>
            </View>
          ) : (
            opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          )}
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
  intro: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  introText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  filterRow: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
    paddingVertical: 12,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  count: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, gap: 12, paddingBottom: 8 },
  emptyBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
