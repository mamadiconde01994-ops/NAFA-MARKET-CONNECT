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

import { MOCK_PRODUCTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory } from "@/types";

const CATEGORY_FILTERS: { id: ProductCategory | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tous", icon: "grid-outline" },
  { id: "vegetables", label: "Légumes", icon: "leaf-outline" },
  { id: "fruits", label: "Fruits", icon: "nutrition-outline" },
  { id: "grains", label: "Céréales", icon: "cube-outline" },
  { id: "livestock", label: "Bétail", icon: "paw-outline" },
  { id: "fish", label: "Poissons", icon: "water-outline" },
  { id: "dairy", label: "Produits laitiers", icon: "flask-outline" },
  { id: "processed", label: "Transformés", icon: "cog-outline" },
];

export default function ProductsListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      search.length === 0 ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#16A34A" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Produits Frais</Text>
          <Text style={styles.headerSub}>Marché agricole guinéen</Text>
        </View>
        <Ionicons name="leaf" size={24} color="rgba(255,255,255,0.7)" />
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
              placeholder="Chercher un produit, vendeur..."
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

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {CATEGORY_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setCategory(f.id)}
              style={[
                styles.filterChip,
                category === f.id
                  ? { backgroundColor: "#16A34A" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons
                name={f.icon}
                size={14}
                color={category === f.id ? "#FFFFFF" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.filterText,
                  { color: category === f.id ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={[styles.resultCount, { color: colors.foreground }]}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </Text>

          <View style={styles.productsList}>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  style={({ pressed }) => [
                    styles.productItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View style={[styles.productImage, { backgroundColor: "#16A34A20" }]}>
                    <Ionicons name="leaf-outline" size={32} color="#16A34A" />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={[styles.productSeller, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {product.sellerName}
                    </Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={[styles.rating, { color: colors.foreground }]}>
                        {product.rating.toFixed(1)}
                      </Text>
                      <Text style={[styles.location, { color: colors.mutedForeground }]}>
                        • {product.location}
                      </Text>
                    </View>
                    <Text style={[styles.productPrice, { color: "#16A34A" }]}>
                      {product.price.toLocaleString()} GNF /{product.unit}
                    </Text>
                  </View>
                  {product.featured && (
                    <Ionicons name="star" size={18} color="#F59E0B" />
                  )}
                </Pressable>
              ))
            ) : (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucun produit trouvé
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
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  filterText: { fontSize: 12, fontWeight: "500" },
  resultsSection: { paddingHorizontal: 16, paddingVertical: 16 },
  resultCount: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
  productsList: { gap: 8 },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 13, fontWeight: "600" },
  productSeller: { fontSize: 11 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 11, fontWeight: "600" },
  location: { fontSize: 11 },
  productPrice: { fontSize: 13, fontWeight: "700", marginTop: 4 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: { fontSize: 14, marginTop: 12 },
});
