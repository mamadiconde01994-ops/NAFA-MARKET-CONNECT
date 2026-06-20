import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MOCK_PRODUCTS,
  MOCK_RESTAURANTS,
  MOCK_PROPERTIES,
  MOCK_SERVICES,
  MOCK_WAREHOUSES,
} from "@/constants/mockData";
import { useFavorites } from "@/context/FavoritesContext";
import type { FavCategory } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

/* ── Category config ── */
type TabKey = "all" | FavCategory;

const CAT: Record<FavCategory, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; emoji: string; route: string }> = {
  product:    { label: "Marché",      icon: "leaf-outline",       color: "#16A34A", emoji: "🌿", route: "/" },
  restaurant: { label: "Restaurants", icon: "restaurant-outline",  color: "#EA580C", emoji: "🍽️", route: "/restaurants" },
  property:   { label: "Immobilier",  icon: "home-outline",        color: "#2563EB", emoji: "🏠", route: "/real-estate" },
  service:    { label: "Services",    icon: "construct-outline",   color: "#7C3AED", emoji: "🔧", route: "/services" },
  warehouse:  { label: "Entrepôts",   icon: "cube-outline",        color: "#DC2626", emoji: "🏭", route: "/warehouses" },
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",        label: "Tout" },
  { key: "product",    label: "Marché" },
  { key: "restaurant", label: "Restaurants" },
  { key: "property",   label: "Immobilier" },
  { key: "service",    label: "Services" },
  { key: "warehouse",  label: "Entrepôts" },
];

const CAT_ORDER: FavCategory[] = ["product", "restaurant", "property", "service", "warehouse"];

/* ── Normalised item ── */
interface FavItem {
  id: string;
  category: FavCategory;
  title: string;
  subtitle: string;
  meta: string;
  image?: string;
  rating?: number;
  isOpen?: boolean;
  available?: boolean;
  route: string;
}

function resolveItem(id: string, category: FavCategory): FavItem | null {
  if (category === "product") {
    const p = MOCK_PRODUCTS.find((x) => x.id === id);
    if (!p) return null;
    return { id, category, title: p.name, subtitle: `${p.sellerName} · ${p.location}`,
      meta: `${formatPrice(p.price)} / ${p.unit}`, image: p.images?.[0], rating: p.rating,
      route: `/product/${id}` };
  }
  if (category === "restaurant") {
    const r = MOCK_RESTAURANTS.find((x) => x.id === id);
    if (!r) return null;
    return { id, category, title: r.name, subtitle: `${r.city} · ${r.deliveryTime} min`,
      meta: `⭐ ${r.rating.toFixed(1)} · ${r.reviewCount} avis`, image: r.images?.[0],
      rating: r.rating, isOpen: r.isOpen, route: `/restaurants/${id}` };
  }
  if (category === "property") {
    const p = MOCK_PROPERTIES.find((x) => x.id === id);
    if (!p) return null;
    const priceLabel = p.priceType === "rent"
      ? `${formatPrice(p.price)} /mois` : formatPrice(p.price);
    return { id, category, title: p.title, subtitle: `${p.city} · ${p.surface} m²`,
      meta: priceLabel, image: p.images?.[0], rating: p.rating, route: `/real-estate/${id}` };
  }
  if (category === "service") {
    const s = MOCK_SERVICES.find((x) => x.id === id);
    if (!s) return null;
    const priceLabel = s.priceType === "negotiable" ? "Négociable" : `${formatPrice(s.price)} / mission`;
    return { id, category, title: s.name, subtitle: `${s.city} · ${s.skills?.slice(0, 2).join(", ")}`,
      meta: priceLabel, image: s.image, rating: s.rating, available: s.available, route: `/services/${id}` };
  }
  if (category === "warehouse") {
    const w = MOCK_WAREHOUSES.find((x) => x.id === id);
    if (!w) return null;
    return { id, category, title: w.name, subtitle: `${w.city} · ${w.surfaceM2} m²`,
      meta: `${(w.pricePerMonth / 1000000).toFixed(1)}M GNF/mois`, image: w.images?.[0],
      rating: w.rating, available: w.available, route: `/warehouses/${id}` };
  }
  return null;
}

/* ── List item type ── */
type ListItem =
  | { kind: "section"; category: FavCategory; count: number }
  | { kind: "item"; data: FavItem };

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite, clearCategory, clearAll, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 100;

  /* Resolve all favorite items */
  const resolved = useMemo<FavItem[]>(() => {
    return favorites
      .map((f) => resolveItem(f.id, f.category))
      .filter(Boolean) as FavItem[];
  }, [favorites]);

  /* Count per category */
  const counts = useMemo<Record<FavCategory, number>>(() => {
    const c: Record<FavCategory, number> = { product: 0, restaurant: 0, property: 0, service: 0, warehouse: 0 };
    for (const item of resolved) c[item.category]++;
    return c;
  }, [resolved]);

  const totalCount = resolved.length;

  /* Active tab items */
  const activeItems = useMemo<FavItem[]>(() => {
    if (activeTab === "all") return resolved;
    return resolved.filter((r) => r.category === activeTab);
  }, [resolved, activeTab]);

  /* Grouped list data for "all" tab */
  const listData = useMemo<ListItem[]>(() => {
    if (activeTab !== "all") {
      return activeItems.map((d) => ({ kind: "item" as const, data: d }));
    }
    const items: ListItem[] = [];
    for (const cat of CAT_ORDER) {
      const group = resolved.filter((r) => r.category === cat);
      if (group.length === 0) continue;
      items.push({ kind: "section", category: cat, count: group.length });
      items.push(...group.map((d) => ({ kind: "item" as const, data: d })));
    }
    return items;
  }, [activeTab, activeItems, resolved]);

  const handleClearCurrent = () => {
    const label = activeTab === "all" ? "tous vos favoris" : `vos favoris ${CAT[activeTab as FavCategory]?.label ?? ""}`;
    Alert.alert("Supprimer", `Voulez-vous vraiment supprimer ${label} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => activeTab === "all" ? clearAll() : clearCategory(activeTab as FavCategory),
      },
    ]);
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "section") {
      return <SectionDivider category={item.category} count={item.count} colors={colors} />;
    }
    return (
      <FavCard
        item={item.data}
        onPress={() => router.push(item.data.route as any)}
        onRemove={() => removeFavorite(item.data.id)}
        colors={colors}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── GRADIENT HEADER ── */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.blobTR} />

        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <View style={styles.iconBubble}>
              <Ionicons name="heart" size={20} color={BRAND_ACCENT} />
            </View>
            <View>
              <Text style={styles.brandTag}>NAFA Marché</Text>
              <View style={styles.titleCountRow}>
                <Text style={styles.screenTitle}>Mes favoris</Text>
                {totalCount > 0 && (
                  <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>{totalCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {totalCount > 0 && (
            <Pressable
              onPress={handleClearCurrent}
              hitSlop={8}
              style={({ pressed }) => [styles.clearBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="trash-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.clearBtnText}>
                {activeTab === "all" ? "Tout" : "Vider"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Category stats pills */}
        {totalCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            {CAT_ORDER.filter((cat) => counts[cat] > 0).map((cat) => (
              <View key={cat} style={[styles.statPill, { backgroundColor: CAT[cat].color + "28", borderColor: CAT[cat].color + "40" }]}>
                <Text style={styles.statEmoji}>{CAT[cat].emoji}</Text>
                <Text style={[styles.statCount, { color: CAT[cat].color + "EE" }]}>{counts[cat]}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Tab chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const catColor = tab.key !== "all" ? CAT[tab.key as FavCategory].color : BRAND_ACCENT;
            const count = tab.key === "all" ? totalCount : counts[tab.key as FavCategory];
            if (tab.key !== "all" && count === 0) return null;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={({ pressed }) => [
                  styles.tab,
                  {
                    backgroundColor: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                    borderColor: active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                {tab.key !== "all" && (
                  <Ionicons
                    name={CAT[tab.key as FavCategory].icon}
                    size={12}
                    color={active ? "#fff" : "rgba(255,255,255,0.55)"}
                  />
                )}
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: active ? "rgba(255,255,255,0.3)" : catColor + "50" }]}>
                    <Text style={[styles.tabBadgeText, { color: active ? "#fff" : catColor }]}>{count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* ── CONTENT ── */}
      {listData.length === 0 ? (
        <EmptyCat tab={activeTab} colors={colors} onExplore={() => router.push("/(tabs)/search" as any)} />
      ) : (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.kind === "section" ? `sec-${item.category}` : item.data.id
          }
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ── Section divider (used in "Tout" tab) ── */
function SectionDivider({ category, count, colors }: { category: FavCategory; count: number; colors: ReturnType<typeof useColors> }) {
  const cfg = CAT[category];
  return (
    <View style={[sd.wrap]}>
      <View style={[sd.bar, { backgroundColor: cfg.color }]} />
      <Ionicons name={cfg.icon} size={13} color={cfg.color} />
      <Text style={[sd.label, { color: cfg.color }]}>{cfg.label.toUpperCase()}</Text>
      <View style={[sd.badge, { backgroundColor: cfg.color + "18" }]}>
        <Text style={[sd.badgeText, { color: cfg.color }]}>{count}</Text>
      </View>
      <View style={[sd.line, { backgroundColor: colors.border }]} />
    </View>
  );
}
const sd = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  bar: { width: 3, height: 14, borderRadius: 2 },
  label: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.4 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  line: { flex: 1, height: 1 },
});

/* ── Favorite card ── */
function FavCard({ item, onPress, onRemove, colors }: { item: FavItem; onPress: () => void; onRemove: () => void; colors: ReturnType<typeof useColors> }) {
  const cfg = CAT[item.category];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        fc.card,
        { backgroundColor: pressed ? colors.card : colors.background, borderColor: colors.border },
      ]}
    >
      {/* Thumb */}
      <View style={[fc.imgWrap, { backgroundColor: cfg.color + "14" }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={fc.img} contentFit="cover" />
        ) : (
          <Text style={fc.imgEmoji}>{cfg.emoji}</Text>
        )}
        {/* category dot */}
        <View style={[fc.catDot, { backgroundColor: cfg.color }]} />

        {/* availability badge */}
        {item.isOpen === false && (
          <View style={[fc.statusBadge, { backgroundColor: "rgba(239,68,68,0.85)" }]}>
            <Text style={fc.statusText}>Fermé</Text>
          </View>
        )}
        {item.available === false && (
          <View style={[fc.statusBadge, { backgroundColor: "rgba(107,114,128,0.85)" }]}>
            <Text style={fc.statusText}>Indispo</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={fc.body}>
        <View style={fc.topRow}>
          <Text style={[fc.title, { color: colors.foreground }]} numberOfLines={1}>{item.title}</Text>
          <View style={[fc.catBadge, { backgroundColor: cfg.color + "14" }]}>
            <Text style={[fc.catBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={[fc.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>{item.subtitle}</Text>
        <View style={fc.footerRow}>
          <Text style={[fc.meta, { color: colors.foreground }]} numberOfLines={1}>{item.meta}</Text>
          {item.rating != null && (
            <View style={fc.ratingRow}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={[fc.ratingText, { color: colors.mutedForeground }]}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Remove */}
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        style={({ pressed }) => [fc.removeBtn, { backgroundColor: "#FEF2F2", opacity: pressed ? 0.6 : 1 }]}
      >
        <Ionicons name="heart" size={18} color="#EF4444" />
      </Pressable>
    </Pressable>
  );
}

const fc = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      web: { boxShadow: "0px 1px 4px rgba(0,0,0,0.06)" },
      default: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    }),
  },
  imgWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  },
  img: { width: 88, height: 88 },
  imgEmoji: { fontSize: 28 },
  catDot: { position: "absolute", top: 6, left: 6, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: "#fff" },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: "center",
  },
  statusText: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" },
  body: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 3 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  catBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, flexShrink: 0 },
  catBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  meta: { flex: 1, fontSize: 13, fontFamily: "Inter_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  removeBtn: {
    width: 40,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
});

/* ── Empty state ── */
function EmptyCat({ tab, colors, onExplore }: { tab: TabKey; colors: ReturnType<typeof useColors>; onExplore: () => void }) {
  const label = tab === "all" ? "favoris" : CAT[tab as FavCategory]?.label ?? "favoris";
  const emoji = tab === "all" ? "🤍" : CAT[tab as FavCategory]?.emoji ?? "❤️";
  return (
    <View style={[em.wrap]}>
      <View style={[em.circle, { backgroundColor: BRAND_MID + "14" }]}>
        <Text style={em.emoji}>{emoji}</Text>
      </View>
      <Text style={[em.title, { color: colors.foreground }]}>Aucun favori</Text>
      <Text style={[em.sub, { color: colors.mutedForeground }]}>
        {tab === "all"
          ? "Explorez l'app et appuyez sur ❤️ pour sauvegarder vos coups de cœur."
          : `Parcourez les ${label} et sauvegardez ceux qui vous intéressent.`}
      </Text>
      <Pressable
        onPress={onExplore}
        style={({ pressed }) => [em.btn, { backgroundColor: BRAND_MID, opacity: pressed ? 0.8 : 1 }]}
      >
        <Ionicons name="search-outline" size={16} color="#fff" />
        <Text style={em.btnText}>Explorer</Text>
      </Pressable>
    </View>
  );
}
const em = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 14 },
  circle: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 36 },
  title: { fontSize: 18, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21, textAlign: "center" },
  btn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 4 },
  btnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
});

/* ── Main styles ── */
const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { overflow: "hidden", paddingBottom: 4 },
  blobTR: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "#52B788", opacity: 0.12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
  },
  titleLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  iconBubble: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  brandTag: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.5)", letterSpacing: 0.8 },
  titleCountRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  screenTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.3 },
  totalBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: BRAND_ACCENT,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 6,
  },
  totalBadgeText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
  },
  clearBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.75)" },
  statsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  statPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
  },
  statEmoji: { fontSize: 13 },
  statCount: { fontSize: 12, fontFamily: "Inter_700Bold" },
  tabsScroll: { flexGrow: 0, marginBottom: 8 },
  tabsContent: { paddingHorizontal: 16, gap: 8, paddingRight: 16 },
  tab: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
  },
  tabLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.6)" },
  tabLabelActive: { fontFamily: "Inter_700Bold", color: "#fff" },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
});
