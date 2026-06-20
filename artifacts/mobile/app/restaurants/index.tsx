import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { MOCK_RESTAURANTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { RestaurantCuisine } from "@/types";

const CUISINE_FILTERS: { id: RestaurantCuisine | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "guinean", label: "Guinéen" },
  { id: "fastfood", label: "Fast Food" },
  { id: "lebanese", label: "Libanais" },
  { id: "mixed", label: "International" },
  { id: "senegalese", label: "Sénégalais" },
];

export default function RestaurantsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState<RestaurantCuisine | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_RESTAURANTS.filter((r) => {
    const matchSearch =
      search.length === 0 ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());
    const matchCuisine = cuisine === "all" || r.cuisine === cuisine;
    return matchSearch && matchCuisine;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#EA580C" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Food</Text>
          <Text style={styles.headerSub}>Restaurants & livraison</Text>
        </View>
        <Ionicons name="restaurant" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Chercher un restaurant..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Cuisine filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {CUISINE_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setCuisine(f.id)}
              style={[
                styles.filterChip,
                cuisine === f.id
                  ? { backgroundColor: "#EA580C" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: cuisine === f.id ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured */}
        {cuisine === "all" && search.length === 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 14 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="star" size={18} color={colors.secondary} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Populaires
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            >
              {MOCK_RESTAURANTS.filter((r) => r.featured).map((r) => (
                <View key={r.id} style={{ width: 260 }}>
                  <RestaurantCard restaurant={r} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {cuisine === "all" ? "Tous les restaurants" : CUISINE_FILTERS.find((f) => f.id === cuisine)?.label}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} horizontal />
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="restaurant-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucun restaurant trouvé
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  filterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 4, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
