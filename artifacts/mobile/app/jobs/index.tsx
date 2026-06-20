import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Alert,
  Linking,
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

const BRAND = "#0891B2";

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
  { id: "health", label: "Santé", icon: "medkit-outline" },
  { id: "education", label: "Éducation", icon: "school-outline" },
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
  health: "#DC2626",
  education: "#0891B2",
};

const GUINEA_CITIES = ["Toutes", "Conakry", "Kindia", "Kankan", "Labé", "Mamou", "N'Zérékoré", "Guéckédou", "Siguiri"];

function JobCard({ job, onPress }: { job: Job; onPress: () => void }) {
  const colors = useColors();
  const catColor = CATEGORY_COLORS[job.category] ?? BRAND;
  const contractColor = CONTRACT_COLORS[job.contractType];

  const handleWhatsApp = () => {
    const phone = job.contactPhone.replace(/[\s+]/g, "");
    const msg = encodeURIComponent(`Bonjour ${job.contactName}, je vous contacte via NAFA Emploi pour l'offre : "${job.title}". Je suis intéressé(e) par ce poste.`);
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`).catch(() =>
      Linking.openURL(`https://wa.me/${phone}?text=${msg}`)
    );
  };

  const handleCall = () => {
    const phone = job.contactPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          borderLeftWidth: 4,
          borderLeftColor: catColor,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, gap: 4 }}>
          {job.urgent && (
            <View style={[styles.urgentBadge, { backgroundColor: "#DC262618" }]}>
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
          {job.requirements.length > 2 && (
            <View style={[styles.reqChip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.reqText, { color: colors.mutedForeground }]}>+{job.requirements.length - 2}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={[styles.postedAt, { color: colors.mutedForeground }]}>
          {new Date(job.postedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
        </Text>
        <View style={styles.actionBtns}>
          <Pressable
            onPress={handleWhatsApp}
            style={({ pressed }) => [
              styles.whatsappBtn,
              { backgroundColor: "#25D366", opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="logo-whatsapp" size={13} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>WhatsApp</Text>
          </Pressable>
          <Pressable
            onPress={handleCall}
            style={({ pressed }) => [
              styles.callBtn,
              { backgroundColor: catColor, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="call-outline" size={13} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Appeler</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function JobsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");
  const [city, setCity] = useState("Toutes");
  const [showCityFilter, setShowCityFilter] = useState(false);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = useMemo(() => MOCK_JOBS.filter((j) => {
    const matchSearch =
      search.length === 0 ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || j.category === category;
    const matchCity = city === "Toutes" || j.city === city;
    return matchSearch && matchCat && matchCity;
  }), [search, category, city]);

  const featured = MOCK_JOBS.filter((j) => j.featured);
  const urgent = MOCK_JOBS.filter((j) => j.urgent);
  const cities = [...new Set(MOCK_JOBS.map((j) => j.city))];
  const isFiltered = search.length > 0 || category !== "all" || city !== "Toutes";

  const handlePostJob = () => {
    Alert.alert(
      "Publier une offre d'emploi",
      "Vous souhaitez recruter ? Contactez notre équipe NAFA Emploi pour publier votre annonce et toucher des milliers de candidats en Guinée.",
      [
        { text: "Appeler NAFA", onPress: () => Linking.openURL("tel:+224621000001") },
        { text: "WhatsApp", onPress: () => Linking.openURL("whatsapp://send?phone=224621000001&text=Bonjour, je souhaite publier une offre d'emploi sur NAFA.") },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: BRAND }]}>
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
            <Ionicons name="briefcase" size={20} color={BRAND} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{MOCK_JOBS.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Offres</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time" size={20} color="#DC2626" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{urgent.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Urgents</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location" size={20} color={BRAND} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{cities.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Villes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="business" size={20} color="#F59E0B" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {[...new Set(MOCK_JOBS.map((j) => j.company))].length}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Entreprises</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
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
          <Pressable
            onPress={() => setShowCityFilter(!showCityFilter)}
            style={[
              styles.cityFilterBtn,
              {
                backgroundColor: city !== "Toutes" ? BRAND : colors.muted,
                borderColor: city !== "Toutes" ? BRAND : colors.border,
              },
            ]}
          >
            <Ionicons name="location-outline" size={16} color={city !== "Toutes" ? "#FFFFFF" : colors.mutedForeground} />
            <Text style={[styles.cityFilterText, { color: city !== "Toutes" ? "#FFFFFF" : colors.mutedForeground }]}>
              {city === "Toutes" ? "Ville" : city}
            </Text>
            <Ionicons name={showCityFilter ? "chevron-up" : "chevron-down"} size={14} color={city !== "Toutes" ? "#FFFFFF" : colors.mutedForeground} />
          </Pressable>
        </View>

        {/* City filter dropdown */}
        {showCityFilter && (
          <View style={[styles.cityDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, padding: 10 }}>
              {GUINEA_CITIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => { setCity(c); setShowCityFilter(false); }}
                  style={[
                    styles.cityChip,
                    city === c ? { backgroundColor: BRAND } : { backgroundColor: colors.muted },
                  ]}
                >
                  <Text style={[styles.cityChipText, { color: city === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {CATEGORY_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setCategory(f.id)}
              style={[
                styles.filterChip,
                category === f.id ? { backgroundColor: BRAND } : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons name={f.icon} size={13} color={category === f.id ? "#FFFFFF" : colors.mutedForeground} />
              <Text style={[styles.filterLabel, { color: category === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* "Je recrute" banner */}
        {!isFiltered && (
          <Pressable
            onPress={handlePostJob}
            style={[styles.recruitBanner, { backgroundColor: BRAND + "12", borderColor: BRAND + "40" }]}
          >
            <View style={[styles.recruitIconWrap, { backgroundColor: BRAND }]}>
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.recruitTitle, { color: BRAND }]}>Vous recrutez ?</Text>
              <Text style={[styles.recruitSub, { color: colors.mutedForeground }]}>
                Publiez votre offre et touchez des milliers de candidats
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BRAND} />
          </Pressable>
        )}

        {/* Offres urgentes */}
        {!isFiltered && urgent.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionBadge, { backgroundColor: "#DC262618" }]}>
                  <Ionicons name="time" size={13} color="#DC2626" />
                  <Text style={[styles.sectionBadgeText, { color: "#DC2626" }]}>URGENT</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>À pourvoir immédiatement</Text>
              </View>
              <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>{urgent.length}</Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {urgent.slice(0, 3).map((j) => (
                <JobCard key={j.id} job={j} onPress={() => router.push(`/jobs/${j.id}` as any)} />
              ))}
            </View>
          </View>
        )}

        {/* Featured */}
        {!isFiltered && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>🔥 Offres en vedette</Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {featured.slice(0, 4).map((j) => (
                <JobCard key={j.id} job={j} onPress={() => router.push(`/jobs/${j.id}` as any)} />
              ))}
            </View>
          </View>
        )}

        {/* All / filtered results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {isFiltered
                ? `Résultats${city !== "Toutes" ? ` · ${city}` : ""}`
                : "Toutes les offres"}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} offre{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {filtered.map((j) => (
              <JobCard key={j.id} job={j} onPress={() => router.push(`/jobs/${j.id}` as any)} />
            ))}
            {filtered.length === 0 && (
              <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="briefcase-outline" size={44} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucune offre trouvée</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Modifiez vos filtres ou revenez plus tard
                </Text>
                <Pressable
                  onPress={() => { setSearch(""); setCategory("all"); setCity("Toutes"); }}
                  style={[styles.resetBtn, { backgroundColor: BRAND }]}
                >
                  <Text style={styles.resetBtnText}>Réinitialiser les filtres</Text>
                </Pressable>
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
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  statCard: { flex: 1, alignItems: "center", gap: 3, borderWidth: 1, borderRadius: 12, paddingVertical: 12 },
  statNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", gap: 10 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  cityFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cityFilterText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cityDropdown: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  cityChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  filterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  recruitBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  recruitIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  recruitTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  recruitSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderWidth: 1, padding: 14, gap: 10 },
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
  description: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
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
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  postedAt: { fontSize: 11, fontFamily: "Inter_400Regular" },
  actionBtns: { flexDirection: "row", gap: 8 },
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  resetBtn: {
    marginTop: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});
