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

import { ServiceCard } from "@/components/services/ServiceCard";
import { MOCK_SERVICES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ServiceCategoryId } from "@/types";

const CATEGORY_FILTERS: { id: ServiceCategoryId | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tous", icon: "grid-outline" },
  { id: "mechanics", label: "Mécanique", icon: "car-outline" },
  { id: "electrician", label: "Électricien", icon: "flash-outline" },
  { id: "plumber", label: "Plomberie", icon: "water-outline" },
  { id: "technician", label: "Technicien", icon: "phone-portrait-outline" },
  { id: "cleaning", label: "Nettoyage", icon: "sparkles-outline" },
  { id: "transport", label: "Transport", icon: "cube-outline" },
  { id: "security", label: "Sécurité", icon: "shield-outline" },
  { id: "freelancer", label: "Freelance", icon: "laptop-outline" },
];

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ServiceCategoryId | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_SERVICES.filter((s) => {
    const matchSearch =
      search.length === 0 ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category === "all" || s.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#7C3AED" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Services</Text>
          <Text style={styles.headerSub}>Artisans & professionnels</Text>
        </View>
        <Ionicons name="construct" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Chercher un service, compétence..."
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

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {CATEGORY_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setCategory(f.id)}
              style={[
                styles.filterChip,
                category === f.id
                  ? { backgroundColor: "#7C3AED" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons
                name={f.icon}
                size={14}
                color={category === f.id ? "#FFFFFF" : colors.mutedForeground}
              />
              <Text style={[styles.filterLabel, { color: category === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: "#F3E8FF", borderRadius: colors.radius }]}>
          <Ionicons name="information-circle-outline" size={18} color="#7C3AED" />
          <Text style={styles.infoText}>
            Tous nos prestataires sont vérifiés. Demandez un devis avant de vous engager.
          </Text>
        </View>

        {/* Results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {category === "all"
                ? "Tous les prestataires"
                : CATEGORY_FILTERS.find((f) => f.id === category)?.label}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} prestataire{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {filtered.map((s) => (
              <ServiceCard
                key={s.id}
                provider={s}
                onPress={() => router.push(`/services/${s.id}` as any)}
              />
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="construct-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucun prestataire trouvé
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
  filterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 4, marginBottom: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: "#7C3AED", lineHeight: 17 },
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
