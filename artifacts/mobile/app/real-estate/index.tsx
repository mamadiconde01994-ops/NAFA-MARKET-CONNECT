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

import { PropertyCard } from "@/components/real-estate/PropertyCard";
import { MOCK_PROPERTIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { PropertyType } from "@/types";

const TYPE_FILTERS: { id: PropertyType | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tout", icon: "grid-outline" },
  { id: "house", label: "Maisons", icon: "home-outline" },
  { id: "apartment", label: "Appartements", icon: "business-outline" },
  { id: "land", label: "Terrains", icon: "map-outline" },
  { id: "commercial", label: "Commerce", icon: "storefront-outline" },
];

const TRANSACTION_FILTERS: { id: "all" | "sale" | "rent"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "sale", label: "À vendre" },
  { id: "rent", label: "À louer" },
];

export default function RealEstateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<PropertyType | "all">("all");
  const [transaction, setTransaction] = useState<"all" | "sale" | "rent">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_PROPERTIES.filter((p) => {
    const matchSearch =
      search.length === 0 ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || p.type === type;
    const matchTransaction = transaction === "all" || p.priceType === transaction;
    return matchSearch && matchType && matchTransaction;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#2563EB" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Immo</Text>
          <Text style={styles.headerSub}>Immobilier en Guinée</Text>
        </View>
        <Ionicons name="home" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Ville, quartier, type..."
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

        {/* Transaction filter */}
        <View style={styles.transactionRow}>
          {TRANSACTION_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setTransaction(f.id)}
              style={[
                styles.transactionChip,
                transaction === f.id
                  ? { backgroundColor: "#2563EB" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Text
                style={[
                  styles.transactionLabel,
                  { color: transaction === f.id ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Type filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {TYPE_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setType(f.id)}
              style={[
                styles.typeChip,
                type === f.id
                  ? { backgroundColor: "#2563EB" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons name={f.icon} size={14} color={type === f.id ? "#FFFFFF" : colors.mutedForeground} />
              <Text style={[styles.typeLabel, { color: type === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured */}
        {type === "all" && transaction === "all" && search.length === 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>✨ Biens vedettes</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            >
              {MOCK_PROPERTIES.filter((p) => p.featured).map((p) => (
                <View key={p.id} style={{ width: 240 }}>
                  <PropertyCard property={p} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {type === "all" ? "Toutes les annonces" : TYPE_FILTERS.find((f) => f.id === type)?.label}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} bien{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} horizontal />
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="home-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucun bien trouvé
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
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
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
  transactionRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  transactionChip: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  transactionLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  filterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 4, marginBottom: 8 },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  typeLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
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
