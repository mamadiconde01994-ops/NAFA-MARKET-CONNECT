import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
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

import { MOCK_FASHION } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { FashionCategory, FashionItem } from "@/types";

const BRAND_COLOR = "#EC4899";

const CAT_FILTERS: { id: FashionCategory | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all",         label: "Tout",        icon: "grid-outline" },
  { id: "women",       label: "Femmes",      icon: "woman-outline" },
  { id: "men",         label: "Hommes",      icon: "man-outline" },
  { id: "traditional", label: "Traditionnel", icon: "star-outline" },
  { id: "children",   label: "Enfants",      icon: "happy-outline" },
  { id: "shoes",       label: "Chaussures",  icon: "footsteps-outline" },
  { id: "accessories", label: "Accessoires", icon: "bag-handle-outline" },
];

const COND_LABELS: Record<string, string> = { new: "Neuf", used: "Occasion" };
const COND_COLORS: Record<string, string> = { new: "#16A34A", used: "#F59E0B" };

function FashionCard({ item, onPress }: { item: FashionItem; onPress: () => void }) {
  const colors = useColors();
  const cColor = COND_COLORS[item.condition] ?? "#64748B";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.images[0] }}
          style={[styles.cardImg, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        <View style={[styles.condBadge, { backgroundColor: cColor + "22", borderColor: cColor + "55" }]}>
          <Text style={[styles.condText, { color: cColor }]}>{COND_LABELS[item.condition]}</Text>
        </View>
        {item.featured && (
          <View style={[styles.featBadge, { backgroundColor: BRAND_COLOR }]}>
            <Text style={styles.featText}>⭐ Vedette</Text>
          </View>
        )}
        {item.size && (
          <View style={[styles.sizeBadge, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
            <Text style={styles.sizeText}>{item.size}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        {item.brand && <Text style={[styles.cardBrand, { color: BRAND_COLOR }]}>{item.brand}</Text>}
        <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
        {item.color && (
          <View style={styles.colorRow}>
            <View style={[styles.colorDot, { backgroundColor: BRAND_COLOR + "40" }]} />
            <Text style={[styles.colorText, { color: colors.mutedForeground }]}>{item.color}</Text>
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: BRAND_COLOR }]}>{formatPrice(item.price)}</Text>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.locText, { color: colors.mutedForeground }]}>{item.city}</Text>
          </View>
        </View>
        <View style={styles.sellerRow}>
          <View style={[styles.sellerAvatar, { backgroundColor: BRAND_COLOR }]}>
            <Ionicons name="person" size={12} color="#FFF" />
          </View>
          <Text style={[styles.sellerName, { color: colors.foreground }]} numberOfLines={1}>{item.sellerName}</Text>
          <Pressable
            onPress={() => {
              const p = item.sellerPhone.replace(/\s/g, "");
              Alert.alert("Contacter", `${item.sellerName}\n${item.sellerPhone}`, [
                { text: "Appeler", onPress: () => Linking.openURL(`tel:${p}`) },
                { text: "Fermer", style: "cancel" },
              ]);
            }}
            style={[styles.callBtn, { backgroundColor: BRAND_COLOR + "18", borderColor: BRAND_COLOR + "40" }]}
          >
            <Ionicons name="call-outline" size={12} color={BRAND_COLOR} />
            <Text style={[styles.callText, { color: BRAND_COLOR }]}>Appeler</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function FashionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<FashionCategory | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_FASHION.filter((i) => {
    const q = search.toLowerCase();
    const matchQ = !q || i.title.toLowerCase().includes(q) || (i.brand ?? "").toLowerCase().includes(q) || i.city.toLowerCase().includes(q);
    const matchC = cat === "all" || i.category === cat;
    return matchQ && matchC;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: BRAND_COLOR }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>NAFA Mode</Text>
          <Text style={styles.headerSub}>{MOCK_FASHION.length} annonces · Vêtements, chaussures, accessoires</Text>
        </View>
        <Ionicons name="shirt" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        <View style={styles.statsRow}>
          {[
            { icon: "star" as const, val: MOCK_FASHION.filter((f) => f.featured).length, lbl: "Vedettes" },
            { icon: "pricetag" as const, val: MOCK_FASHION.filter((f) => f.condition === "new").length, lbl: "Neufs" },
            { icon: "location" as const, val: [...new Set(MOCK_FASHION.map((f) => f.city))].length, lbl: "Villes" },
          ].map((s) => (
            <View key={s.lbl} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={20} color={BRAND_COLOR} />
              <Text style={[styles.statNum, { color: colors.foreground }]}>{s.val}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchWrap}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Marque, article, ville..."
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CAT_FILTERS.map((f) => {
            const active = cat === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setCat(f.id)}
                style={[styles.filterChip, { backgroundColor: active ? BRAND_COLOR : colors.muted, borderColor: active ? BRAND_COLOR : colors.border }]}
              >
                <Ionicons name={f.icon} size={14} color={active ? "#FFF" : colors.mutedForeground} />
                <Text style={[styles.filterLabel, { color: active ? "#FFF" : colors.mutedForeground }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.results}>
          <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </Text>
          {filtered.map((item) => (
            <FashionCard key={item.id} item={item} onPress={() => router.push(`/fashion/${item.id}` as any)} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucun résultat</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 1 },
  statsRow: { flexDirection: "row", padding: 16, gap: 10 },
  statCard: { flex: 1, alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1, gap: 4 },
  statNum: { fontSize: 18, fontWeight: "700" },
  statLbl: { fontSize: 11 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  filterScroll: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterLabel: { fontSize: 13, fontWeight: "500" },
  results: { paddingHorizontal: 16, gap: 12 },
  resultsCount: { fontSize: 12, fontWeight: "500", marginBottom: 4 },
  card: { borderWidth: 1, overflow: "hidden" },
  cardImg: { width: "100%", height: 220 },
  condBadge: { position: "absolute", top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  condText: { fontSize: 11, fontWeight: "600" },
  featBadge: { position: "absolute", top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  featText: { fontSize: 11, fontWeight: "600", color: "#FFF" },
  sizeBadge: { position: "absolute", bottom: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  sizeText: { fontSize: 11, fontWeight: "600", color: "#FFF" },
  cardBody: { padding: 14, gap: 6 },
  cardBrand: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  cardTitle: { fontSize: 15, fontWeight: "600", lineHeight: 20 },
  colorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  colorText: { fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 16, fontWeight: "700" },
  locRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locText: { fontSize: 12 },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  sellerAvatar: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sellerName: { flex: 1, fontSize: 12, fontWeight: "500" },
  callBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  callText: { fontSize: 12, fontWeight: "600" },
  empty: { alignItems: "center", gap: 12, paddingVertical: 60 },
  emptyText: { fontSize: 15 },
});
