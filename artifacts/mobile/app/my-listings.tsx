import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

type ListingStatus = "active" | "pending" | "expired" | "draft";

interface MyListing {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  price?: string;
  city: string;
  status: ListingStatus;
  views: number;
  contacts: number;
  createdAt: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  phone: string;
  location?: string;
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  active:  { label: "Active",      color: "#16A34A", bg: "#16A34A18" },
  pending: { label: "En attente",  color: "#D97706", bg: "#D9770618" },
  expired: { label: "Expirée",     color: "#EF4444", bg: "#EF444418" },
  draft:   { label: "Brouillon",   color: "#6B7280", bg: "#6B728018" },
};

const CAT_COLOR: Record<string, string> = {
  agriculture: "#16A34A",
  "real-estate": "#2563EB",
  service: "#7C3AED",
  vehicle: "#475569",
  warehouse: "#DC2626",
  job: "#0891B2",
  restaurant: "#EA580C",
  electronics: "#6366F1",
  fashion: "#EC4899",
  furniture: "#0D9488",
  construction: "#92400E",
};

const MOCK_MY_LISTINGS: MyListing[] = [
  {
    id: "ml1",
    title: "Tomates fraîches — 50kg disponibles, Kindia",
    category: "agriculture",
    categoryLabel: "Produit agricole",
    price: "5 000 GNF/kg",
    city: "Kindia",
    status: "active",
    views: 142,
    contacts: 12,
    createdAt: "2026-06-15",
    icon: "leaf-outline",
    color: "#16A34A",
    description: "Tomates locales de qualité, cultivées sans pesticides à Kindia.",
    phone: "+224 621 00 00 03",
  },
  {
    id: "ml2",
    title: "Appartement F3 meublé — Kipé, Conakry",
    category: "real-estate",
    categoryLabel: "Bien immobilier",
    price: "3 500 000 GNF/mois",
    city: "Conakry",
    status: "active",
    views: 89,
    contacts: 7,
    createdAt: "2026-06-10",
    icon: "home-outline",
    color: "#2563EB",
    description: "F3 entièrement meublé, sécurisé 24h/24, parking inclus.",
    phone: "+224 621 00 00 03",
    location: "Kipé, Ratoma",
  },
  {
    id: "ml3",
    title: "Réparation électronique — téléphones & ordis",
    category: "service",
    categoryLabel: "Service professionnel",
    city: "Conakry",
    status: "pending",
    views: 0,
    contacts: 0,
    createdAt: "2026-06-20",
    icon: "construct-outline",
    color: "#7C3AED",
    description: "Réparation de téléphones, ordinateurs et équipements électroniques.",
    phone: "+224 621 00 00 03",
    location: "Kaloum",
  },
  {
    id: "ml4",
    title: "Toyota Land Cruiser 2018 — 4x4, très bon état",
    category: "vehicle",
    categoryLabel: "Véhicule",
    price: "95 000 000 GNF",
    city: "Conakry",
    status: "expired",
    views: 203,
    contacts: 18,
    createdAt: "2026-05-01",
    icon: "car-outline",
    color: "#475569",
    description: "4x4 essence, transmission automatique, 120 000 km.",
    phone: "+224 621 00 00 03",
  },
];

export default function MyListingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [listings, setListings] = useState<MyListing[]>(MOCK_MY_LISTINGS);
  const [filter, setFilter] = useState<ListingStatus | "all">("all");

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 24;

  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  const activeCount  = listings.filter((l) => l.status === "active").length;
  const pendingCount = listings.filter((l) => l.status === "pending").length;

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Supprimer l'annonce",
      `Voulez-vous vraiment supprimer "${title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setListings((prev) => prev.filter((l) => l.id !== id)),
        },
      ],
    );
  };

  const handleEdit = (listing: MyListing) => {
    router.push({
      pathname: "/listing/create" as any,
      params: {
        id: listing.id,
        category: listing.category,
        label: listing.categoryLabel,
        prefillTitle: listing.title,
        prefillPrice: listing.price ?? "",
        prefillDescription: listing.description,
        prefillCity: listing.city,
        prefillPhone: listing.phone,
        prefillLocation: listing.location ?? "",
        isEdit: "true",
      },
    });
  };

  const handleRenew = (id: string) => {
    setListings((prev) =>
      prev.map((l) => l.id === id ? { ...l, status: "pending" } : l),
    );
    Alert.alert("Renouvellement envoyé", "Votre annonce sera réactivée sous 24h ouvrées.");
  };

  const renderItem = ({ item }: { item: MyListing }) => {
    const st = STATUS_CONFIG[item.status];
    return (
      <View
        style={[
          card.wrap,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      >
        {/* Status accent */}
        <View style={[card.accent, { backgroundColor: st.color }]} />

        {/* Top row */}
        <View style={card.top}>
          <View style={[card.iconCircle, { backgroundColor: item.color + "18" }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={card.titleArea}>
            <Text style={[card.title, { color: colors.foreground }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={card.metaRow}>
              <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
              <Text style={[card.metaText, { color: colors.mutedForeground }]}>{item.city}</Text>
              <Text style={[card.dot, { color: colors.border }]}>·</Text>
              <Text style={[card.metaText, { color: colors.mutedForeground }]}>
                {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </Text>
            </View>
          </View>
          <View style={[card.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[card.statusText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>

        {/* Price */}
        {item.price ? (
          <Text style={[card.price, { color: colors.secondary }]}>{item.price}</Text>
        ) : null}

        {/* Stats */}
        {item.status !== "draft" && (
          <View style={card.stats}>
            <View style={card.stat}>
              <Ionicons name="eye-outline" size={13} color={colors.mutedForeground} />
              <Text style={[card.statText, { color: colors.mutedForeground }]}>{item.views} vues</Text>
            </View>
            <View style={card.stat}>
              <Ionicons name="chatbubble-outline" size={13} color={colors.mutedForeground} />
              <Text style={[card.statText, { color: colors.mutedForeground }]}>{item.contacts} contacts</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={[card.actions, { borderTopColor: colors.border }]}>
          <Pressable
            onPress={() => handleEdit(item)}
            style={({ pressed }) => [
              card.actionBtn,
              { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="create-outline" size={15} color={colors.foreground} />
            <Text style={[card.actionText, { color: colors.foreground }]}>Modifier</Text>
          </Pressable>

          {item.status === "expired" && (
            <Pressable
              onPress={() => handleRenew(item.id)}
              style={({ pressed }) => [
                card.actionBtn,
                { backgroundColor: BRAND_MID + "18", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="refresh-outline" size={15} color={BRAND_MID} />
              <Text style={[card.actionText, { color: BRAND_MID }]}>Renouveler</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => handleDelete(item.id, item.title)}
            style={({ pressed }) => [
              card.actionBtn,
              { backgroundColor: "#EF444418", opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="trash-outline" size={15} color="#EF4444" />
            <Text style={[card.actionText, { color: "#EF4444" }]}>Supprimer</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Summary chips */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryChip, { backgroundColor: "#16A34A18" }]}>
          <Text style={[styles.summaryNum, { color: "#16A34A" }]}>{activeCount}</Text>
          <Text style={[styles.summaryLabel, { color: "#16A34A" }]}>Actives</Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: "#D9770618" }]}>
          <Text style={[styles.summaryNum, { color: "#D97706" }]}>{pendingCount}</Text>
          <Text style={[styles.summaryLabel, { color: "#D97706" }]}>En attente</Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: colors.muted }]}>
          <Text style={[styles.summaryNum, { color: colors.foreground }]}>{listings.length}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["all", "active", "pending", "expired"] as const).map((f) => {
          const isActive = filter === f;
          const label = f === "all" ? "Toutes" : STATUS_CONFIG[f].label;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const Empty = () => (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: BRAND_MID + "14" }]}>
        <Ionicons name="storefront-outline" size={36} color={BRAND_MID} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
        {filter === "all" ? "Aucune annonce" : `Aucune annonce ${STATUS_CONFIG[filter as ListingStatus]?.label.toLowerCase()}`}
      </Text>
      <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
        {filter === "all"
          ? "Publiez votre première annonce et touchez des milliers de clients en Guinée."
          : "Aucune annonce ne correspond à ce filtre."}
      </Text>
      {filter === "all" && (
        <Pressable
          onPress={() => router.push("/(tabs)/publish" as any)}
          style={({ pressed }) => [styles.emptyBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={[BRAND_LIGHT, BRAND_MID]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.emptyBtnInner}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.emptyBtnText}>Publier une annonce</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerBlob} />
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mes annonces</Text>
            <Text style={styles.headerSub}>NAFA Marché · {user?.name ?? "Compte"}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/publish" as any)}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.75 : 1 }]}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Nouvelle</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<Empty />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ── Card styles ── */
const card = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    paddingLeft: 18,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  titleArea: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 11 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
  },
  statusText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  price: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});

/* ── Screen styles ── */
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: "hidden",
  },
  headerBlob: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#52B788",
    opacity: 0.1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  list: { paddingTop: 16 },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  summaryChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 2,
  },
  summaryNum: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    lineHeight: 24,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  empty: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
  emptyBtn: { marginTop: 8 },
  emptyBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
