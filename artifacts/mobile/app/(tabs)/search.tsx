import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useColors } from "@/hooks/useColors";

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
type ResultCategory = "product" | "restaurant" | "property" | "service" | "warehouse";
type FilterTab = "all" | ResultCategory;

interface SearchResult {
  id: string;
  category: ResultCategory;
  title: string;
  subtitle: string;
  meta: string;
  image?: string;
  rating?: number;
  location?: string;
  route: string;
  available?: boolean;
}

/* ──────────────────────────────────────────────
   Config
────────────────────────────────────────────── */
const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_ACCENT = "#52B788";

const CAT_CONFIG: Record<ResultCategory, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; emoji: string }> = {
  product:    { label: "Marché",      icon: "leaf-outline",       color: "#16A34A", emoji: "🌿" },
  restaurant: { label: "Restaurants", icon: "restaurant-outline",  color: "#EA580C", emoji: "🍽️" },
  property:   { label: "Immobilier",  icon: "home-outline",        color: "#2563EB", emoji: "🏠" },
  service:    { label: "Services",    icon: "construct-outline",   color: "#7C3AED", emoji: "🔧" },
  warehouse:  { label: "Entrepôts",   icon: "cube-outline",        color: "#DC2626", emoji: "🏭" },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all",        label: "Tout" },
  { key: "product",    label: "Marché" },
  { key: "restaurant", label: "Restaurants" },
  { key: "property",   label: "Immobilier" },
  { key: "service",    label: "Services" },
  { key: "warehouse",  label: "Entrepôts" },
];

const POPULAR_SEARCHES = [
  "Tomates fraîches", "Mangues Kent", "Riz local",
  "Electricien", "Villa Conakry", "Entrepôt",
  "Restaurant guinéen", "Mécanique auto",
];

const SECTION_ORDER: ResultCategory[] = ["product", "restaurant", "property", "service", "warehouse"];

/* ──────────────────────────────────────────────
   Data normalisation
────────────────────────────────────────────── */
function buildAllResults(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const p of MOCK_PRODUCTS) {
    results.push({
      id: p.id, category: "product",
      title: p.name, subtitle: `${p.sellerName} · ${p.location}`,
      meta: `${(p.price / 1000).toFixed(0)}k GNF / ${p.unit}`,
      image: p.images?.[0], rating: p.rating, location: p.location,
      route: `/product/${p.id}`,
    });
  }

  for (const r of MOCK_RESTAURANTS) {
    results.push({
      id: r.id, category: "restaurant",
      title: r.name, subtitle: `${r.city} · ${r.deliveryTime} min`,
      meta: `⭐ ${r.rating} · ${r.reviewCount} avis`,
      image: r.images?.[0], rating: r.rating, location: r.city,
      available: r.isOpen,
      route: `/restaurants/${r.id}`,
    });
  }

  for (const p of MOCK_PROPERTIES) {
    const priceLabel = p.priceType === "rent"
      ? `${(p.pricePerMonth ?? p.price / 1000).toFixed(0)}k GNF/mois`
      : `${(p.price / 1000000).toFixed(0)}M GNF`;
    results.push({
      id: p.id, category: "property",
      title: p.title, subtitle: `${p.city} · ${p.surface} m²`,
      meta: priceLabel,
      image: p.images?.[0], rating: p.rating, location: p.city,
      route: `/real-estate/${p.id}`,
    });
  }

  for (const s of MOCK_SERVICES) {
    const priceLabel = s.priceType === "negotiable"
      ? "Négociable"
      : `${(s.price / 1000).toFixed(0)}k GNF`;
    results.push({
      id: s.id, category: "service",
      title: s.name, subtitle: `${s.city} · ${s.skills?.slice(0, 2).join(", ")}`,
      meta: priceLabel,
      image: s.image, rating: s.rating, location: s.city,
      available: s.available,
      route: `/services/${s.id}`,
    });
  }

  for (const w of MOCK_WAREHOUSES) {
    results.push({
      id: w.id, category: "warehouse",
      title: w.name, subtitle: `${w.city} · ${w.surfaceM2} m²`,
      meta: `${(w.pricePerMonth / 1000000).toFixed(1)}M GNF/mois`,
      image: w.images?.[0], rating: w.rating, location: w.city,
      available: w.available,
      route: `/warehouses/${w.id}`,
    });
  }

  return results;
}

const ALL_RESULTS = buildAllResults();

function search(query: string, filter: FilterTab): SearchResult[] {
  const q = query.trim().toLowerCase();
  return ALL_RESULTS.filter((r) => {
    const matchesCat = filter === "all" || r.category === filter;
    if (!q) return matchesCat;
    const hay = `${r.title} ${r.subtitle} ${r.meta} ${r.location ?? ""}`.toLowerCase();
    return matchesCat && hay.includes(q);
  });
}

/* ──────────────────────────────────────────────
   Screen
────────────────────────────────────────────── */
export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Tomates fraîches", "Electricien Conakry", "Villa Kipé",
  ]);

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 100;

  const results = useMemo(() => search(query, filter), [query, filter]);

  const hasQuery = query.trim().length > 0;

  const handleSubmit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 8);
      return next;
    });
  }, [query]);

  const applySearch = useCallback((term: string) => {
    setQuery(term);
    setFilter("all");
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((s) => s !== term)].slice(0, 8);
      return next;
    });
    inputRef.current?.blur();
  }, []);

  const clearQuery = () => { setQuery(""); setFilter("all"); };

  /* Count per category */
  const countByCategory = useMemo<Record<ResultCategory, number>>(() => {
    const q = query.trim().toLowerCase();
    const counts = { product: 0, restaurant: 0, property: 0, service: 0, warehouse: 0 } as Record<ResultCategory, number>;
    for (const r of ALL_RESULTS) {
      if (!q) { counts[r.category]++; continue; }
      const hay = `${r.title} ${r.subtitle} ${r.meta} ${r.location ?? ""}`.toLowerCase();
      if (hay.includes(q)) counts[r.category]++;
    }
    return counts;
  }, [query]);

  /* Group results for "all" tab */
  const grouped = useMemo<Record<ResultCategory, SearchResult[]>>(() => {
    const g = { product: [], restaurant: [], property: [], service: [], warehouse: [] } as Record<ResultCategory, SearchResult[]>;
    for (const r of results) g[r.category].push(r);
    return g;
  }, [results]);

  /* Flat list data with section headers */
  type ListItem =
    | { kind: "header"; category: ResultCategory; count: number }
    | { kind: "result"; data: SearchResult };

  const listData = useMemo<ListItem[]>(() => {
    if (filter !== "all") {
      return results.map((r) => ({ kind: "result" as const, data: r }));
    }
    const items: ListItem[] = [];
    for (const cat of SECTION_ORDER) {
      const group = grouped[cat];
      if (group.length === 0) continue;
      items.push({ kind: "header", category: cat, count: group.length });
      items.push(...group.map((r) => ({ kind: "result" as const, data: r })));
    }
    return items;
  }, [filter, results, grouped]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "header") {
      return <ResultSectionHeader category={item.category} count={item.count} colors={colors} />;
    }
    return (
      <ResultCard
        result={item.data}
        query={query}
        colors={colors}
        onPress={() => router.push(item.data.route as any)}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── SEARCH HEADER ── */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.card,
                borderColor: hasQuery ? BRAND_MID : colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={hasQuery ? BRAND_MID : colors.mutedForeground} />
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: colors.foreground }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Produits, restaurants, biens, services…"
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
              autoCorrect={false}
            />
            {hasQuery && (
              <Pressable onPress={clearQuery} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <View style={[styles.clearBtn, { backgroundColor: colors.mutedForeground + "30" }]}>
                  <Ionicons name="close" size={13} color={colors.mutedForeground} />
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Count summary when searching */}
        {hasQuery && (
          <Text style={[styles.countText, { color: colors.mutedForeground }]}>
            {results.length} résultat{results.length !== 1 ? "s" : ""} pour{" "}
            <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>«{query}»</Text>
          </Text>
        )}

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsScroll}
        >
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.key;
            const count = tab.key === "all"
              ? Object.values(countByCategory).reduce((a, b) => a + b, 0)
              : countByCategory[tab.key as ResultCategory] ?? 0;
            const catColor = tab.key !== "all" ? CAT_CONFIG[tab.key as ResultCategory].color : BRAND_MID;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setFilter(tab.key)}
                style={({ pressed }) => [
                  styles.tab,
                  {
                    backgroundColor: active ? catColor : colors.card,
                    borderColor: active ? catColor : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {tab.key !== "all" && (
                  <Ionicons
                    name={CAT_CONFIG[tab.key as ResultCategory].icon}
                    size={13}
                    color={active ? "#fff" : catColor}
                  />
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    { color: active ? "#fff" : colors.foreground },
                    active && { fontFamily: "Inter_700Bold" },
                  ]}
                >
                  {tab.label}
                </Text>
                {hasQuery && count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: active ? "rgba(255,255,255,0.3)" : catColor + "22" }]}>
                    <Text style={[styles.tabBadgeText, { color: active ? "#fff" : catColor }]}>{count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── CONTENT ── */}
      {!hasQuery ? (
        /* Empty state: recent + popular + categories */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recherches récentes</Text>
                <Pressable onPress={() => setRecentSearches([])} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                  <Text style={[styles.clearAllText, { color: colors.mutedForeground }]}>Effacer</Text>
                </Pressable>
              </View>
              <View style={styles.chipsWrap}>
                {recentSearches.map((term) => (
                  <Pressable
                    key={term}
                    onPress={() => applySearch(term)}
                    style={({ pressed }) => [styles.recentChip, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.recentChipText, { color: colors.foreground }]}>{term}</Text>
                    <Pressable
                      onPress={() => setRecentSearches((p) => p.filter((s) => s !== term))}
                      hitSlop={6}
                      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                    >
                      <Ionicons name="close" size={13} color={colors.mutedForeground} />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Popular */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recherches populaires</Text>
            <View style={styles.chipsWrap}>
              {POPULAR_SEARCHES.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => applySearch(term)}
                  style={({ pressed }) => [
                    styles.popularChip,
                    { backgroundColor: BRAND_MID + "12", borderColor: BRAND_MID + "28", opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="trending-up-outline" size={13} color={BRAND_MID} />
                  <Text style={[styles.popularChipText, { color: BRAND_MID }]}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explorer par catégorie</Text>
            <View style={styles.catGrid}>
              {(Object.entries(CAT_CONFIG) as [ResultCategory, (typeof CAT_CONFIG)[ResultCategory]][]).map(([cat, cfg]) => (
                <Pressable
                  key={cat}
                  onPress={() => { setFilter(cat); inputRef.current?.focus(); }}
                  style={({ pressed }) => [
                    styles.catTile,
                    { backgroundColor: cfg.color + "12", borderColor: cfg.color + "30", opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={styles.catTileEmoji}>{cfg.emoji}</Text>
                  <Text style={[styles.catTileLabel, { color: cfg.color }]}>{cfg.label}</Text>
                  <Text style={[styles.catTileCount, { color: cfg.color + "99" }]}>
                    {countByCategory[cat]} annonces
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : results.length === 0 ? (
        /* No results */
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: BRAND_MID + "14" }]}>
            <Ionicons name="search-outline" size={36} color={BRAND_MID} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun résultat</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Aucun résultat pour «{query}».{"\n"}Essayez un autre terme ou catégorie.
          </Text>
          <Pressable
            onPress={clearQuery}
            style={({ pressed }) => [styles.resetBtn, { borderColor: BRAND_MID, opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.resetText, { color: BRAND_MID }]}>Réinitialiser</Text>
          </Pressable>
        </View>
      ) : (
        /* Results list */
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.kind === "header" ? `hdr-${item.category}` : item.data.id}
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

/* ──────────────────────────────────────────────
   Section header
────────────────────────────────────────────── */
function ResultSectionHeader({
  category, count, colors,
}: { category: ResultCategory; count: number; colors: Record<string, string> }) {
  const cfg = CAT_CONFIG[category];
  return (
    <View style={[rsh.wrap, { borderBottomColor: colors.border }]}>
      <View style={[rsh.dot, { backgroundColor: cfg.color }]} />
      <Ionicons name={cfg.icon} size={14} color={cfg.color} />
      <Text style={[rsh.label, { color: cfg.color }]}>{cfg.label.toUpperCase()}</Text>
      <View style={[rsh.badge, { backgroundColor: cfg.color + "18" }]}>
        <Text style={[rsh.badgeText, { color: cfg.color }]}>{count}</Text>
      </View>
      <View style={[rsh.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const rsh = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dot: { width: 3, height: 14, borderRadius: 2 },
  label: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.4 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  line: { flex: 1, height: 1 },
});

/* ──────────────────────────────────────────────
   Result card
────────────────────────────────────────────── */
function ResultCard({
  result: r, query, colors, onPress,
}: { result: SearchResult; query: string; colors: Record<string, string>; onPress: () => void }) {
  const cfg = CAT_CONFIG[r.category];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        rc.card,
        { borderBottomColor: colors.border, backgroundColor: pressed ? colors.card : colors.background },
      ]}
    >
      {/* Thumbnail */}
      <View style={[rc.imgWrap, { backgroundColor: cfg.color + "18" }]}>
        {r.image ? (
          <Image source={{ uri: r.image }} style={rc.img} contentFit="cover" />
        ) : (
          <Text style={rc.imgEmoji}>{cfg.emoji}</Text>
        )}
        {r.available === false && (
          <View style={rc.unavailableBadge}>
            <Text style={rc.unavailableText}>Indispo</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={rc.info}>
        <View style={rc.topRow}>
          <Text style={[rc.title, { color: colors.foreground }]} numberOfLines={1}>
            <HighlightedText text={r.title} query={query} color={cfg.color} baseColor={colors.foreground} />
          </Text>
          <View style={[rc.catBadge, { backgroundColor: cfg.color + "15" }]}>
            <Text style={[rc.catBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <Text style={[rc.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
          {r.subtitle}
        </Text>

        <View style={rc.bottomRow}>
          <Text style={[rc.meta, { color: colors.foreground }]}>{r.meta}</Text>
          {r.rating && (
            <View style={rc.ratingRow}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={[rc.ratingText, { color: colors.mutedForeground }]}>{r.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
    </Pressable>
  );
}

/* Highlight matching query text */
function HighlightedText({ text, query, color, baseColor }: { text: string; query: string; color: string; baseColor: string }) {
  if (!query.trim()) return <Text style={{ color: baseColor }}>{text}</Text>;
  const q = query.trim().toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <Text style={{ color: baseColor }}>{text}</Text>;
  return (
    <>
      <Text style={{ color: baseColor }}>{text.slice(0, idx)}</Text>
      <Text style={{ color, fontFamily: "Inter_700Bold" }}>{text.slice(idx, idx + q.length)}</Text>
      <Text style={{ color: baseColor }}>{text.slice(idx + q.length)}</Text>
    </>
  );
}

const rc = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  imgWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  img: { width: 56, height: 56 },
  imgEmoji: { fontSize: 24 },
  unavailableBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 2,
    alignItems: "center",
  },
  unavailableText: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" },
  info: { flex: 1, gap: 3 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 19 },
  catBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, flexShrink: 0 },
  catBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  meta: { fontSize: 13, fontFamily: "Inter_700Bold", flex: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, fontFamily: "Inter_500Medium" },
});

/* ──────────────────────────────────────────────
   Main styles
────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 13 : 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
    margin: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { fontSize: 12, fontFamily: "Inter_400Regular", paddingLeft: 2 },
  tabsScroll: { flexGrow: 0, marginBottom: 6 },
  tabsContent: { gap: 8, paddingRight: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tabLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  /* Empty state */
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 14 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21, textAlign: "center" },
  resetBtn: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10, marginTop: 4 },
  resetText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  /* Discover */
  section: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  clearAllText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  recentChipText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  popularChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  popularChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catTile: {
    width: "30%",
    flexGrow: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 4,
    alignItems: "center",
  },
  catTileEmoji: { fontSize: 26, marginBottom: 2 },
  catTileLabel: { fontSize: 13, fontFamily: "Inter_700Bold" },
  catTileCount: { fontSize: 10, fontFamily: "Inter_400Regular" },
});
