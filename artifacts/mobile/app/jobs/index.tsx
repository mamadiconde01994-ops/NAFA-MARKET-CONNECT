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

import { MOCK_JOBS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { ContractType, Job, JobCategory } from "@/types";

const CATEGORY_FILTERS: { id: JobCategory | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tous", icon: "grid-outline" },
  { id: "agriculture", label: "Agriculture", icon: "leaf-outline" },
  { id: "restaurant", label: "Restauration", icon: "restaurant-outline" },
  { id: "construction", label: "Construction", icon: "hammer-outline" },
  { id: "transport", label: "Transport", icon: "car-outline" },
  { id: "tech", label: "Tech", icon: "phone-portrait-outline" },
  { id: "trade", label: "Commerce", icon: "storefront-outline" },
  { id: "security", label: "Sécurité", icon: "shield-outline" },
  { id: "domestic", label: "Domestique", icon: "home-outline" },
];

const CONTRACT_LABELS: Record<ContractType, string> = {
  full_time: "Temps plein",
  part_time: "Temps partiel",
  temporary: "Temporaire",
  freelance: "Freelance",
};

const CONTRACT_COLORS: Record<ContractType, string> = {
  full_time: "#16A34A",
  part_time: "#2563EB",
  temporary: "#F59E0B",
  freelance: "#7C3AED",
};

const CATEGORY_COLORS: Partial<Record<JobCategory, string>> = {
  agriculture: "#16A34A",
  restaurant: "#EA580C",
  construction: "#92400E",
  transport: "#DC2626",
  tech: "#6366F1",
  trade: "#0891B2",
  security: "#475569",
  domestic: "#EC4899",
};

function JobCard({ job }: { job: Job }) {
  const colors = useColors();
  const catColor = CATEGORY_COLORS[job.category] ?? "#0891B2";
  const contractColor = CONTRACT_COLORS[job.contractType];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          borderLeftWidth: 4,
          borderLeftColor: catColor,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, gap: 4 }}>
          {job.urgent && (
            <View style={[styles.urgentBadge, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="time-outline" size={10} color="#DC2626" />
              <Text style={[styles.urgentText, { color: "#DC2626" }]}>URGENT</Text>
            </View>
          )}
          <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={2}>
            {job.title}
          </Text>
          <Text style={[styles.company, { color: catColor }]}>{job.company}</Text>
        </View>
        <View style={[styles.contractBadge, { backgroundColor: contractColor + "18" }]}>
          <Text style={[styles.contractText, { color: contractColor }]}>
            {CONTRACT_LABELS[job.contractType]}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{job.city}</Text>
        </View>
        {job.salary !== undefined && job.salaryType !== "negotiable" && (
          <View style={styles.infoChip}>
            <Ionicons name="cash-outline" size={12} color="#16A34A" />
            <Text style={[styles.salaryText, { color: "#16A34A" }]}>
              {formatPrice(job.salary)}
              {job.salaryType === "per_month" ? "/mois" : "/jour"}
            </Text>
          </View>
        )}
        {(!job.salary || job.salaryType === "negotiable") && (
          <View style={styles.infoChip}>
            <Ionicons name="cash-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>Salaire négociable</Text>
          </View>
        )}
      </View>

      {job.requirements.length > 0 && (
        <View style={styles.requirementsRow}>
          {job.requirements.slice(0, 2).map((req) => (
            <View key={req} style={[styles.reqChip, { backgroundColor: colors.muted }]}>
              <Ionicons name="checkmark" size={10} color={catColor} />
              <Text style={[styles.reqText, { color: colors.mutedForeground }]} numberOfLines={1}>
                {req}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={[styles.postedAt, { color: colors.mutedForeground }]}>
          Publié le {new Date(job.postedAt).toLocaleDateString("fr-GN", { day: "numeric", month: "short" })}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.applyBtn,
            { backgroundColor: catColor, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="call-outline" size={13} color="#FFFFFF" />
          <Text style={styles.applyText}>Postuler</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function JobsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch =
      search.length === 0 ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || j.category === category;
    return matchSearch && matchCat;
  });

  const featured = MOCK_JOBS.filter((j) => j.featured);
  const urgent = MOCK_JOBS.filter((j) => j.urgent);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#0891B2" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Emplois</Text>
          <Text style={styles.headerSub}>Offres d'emploi en Guinée</Text>
        </View>
        <Ionicons name="briefcase" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="briefcase" size={22} color="#0891B2" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{MOCK_JOBS.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Offres</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time" size={22} color="#DC2626" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{urgent.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Urgents</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location" size={22} color="#0891B2" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {[...new Set(MOCK_JOBS.map((j) => j.city))].length}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Villes</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Poste, entreprise, ville..."
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
                category === f.id ? { backgroundColor: "#0891B2" } : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons name={f.icon} size={14} color={category === f.id ? "#FFFFFF" : colors.mutedForeground} />
              <Text style={[styles.filterLabel, { color: category === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured jobs */}
        {category === "all" && search.length === 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🔥 Offres en vedette</Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {featured.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </View>
          </View>
        )}

        {/* All results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {category === "all" ? "Toutes les offres" : CATEGORY_FILTERS.find((f) => f.id === category)?.label}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} offre{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {filtered.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="briefcase-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucune offre trouvée
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
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  statCard: { flex: 1, alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 12, paddingVertical: 14 },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular" },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
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
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  urgentText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  jobTitle: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 20 },
  company: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  contractBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  contractText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  description: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  infoRow: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  infoChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  salaryText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  requirementsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  reqChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 180,
  },
  reqText: { fontSize: 11, fontFamily: "Inter_400Regular", flexShrink: 1 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  postedAt: { fontSize: 11, fontFamily: "Inter_400Regular" },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
