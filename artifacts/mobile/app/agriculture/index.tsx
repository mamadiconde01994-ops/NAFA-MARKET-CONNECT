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

interface ProductCard {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  sellerName: string;
  image: string;
  rating: number;
  location: string;
  available: number;
}

function ProductCard({ product, onPress }: { product: ProductCard; onPress: () => void }) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.cardImageContainer}>
        <View
          style={[
            styles.cardImage,
            {
              backgroundColor: "#16A34A20",
              borderTopLeftRadius: colors.radius,
              borderTopRightRadius: colors.radius,
            },
          ]}
        >
          <Ionicons name="leaf-outline" size={40} color="#16A34A" />
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {product.location}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.foreground }]}>
            {product.rating.toFixed(1)}
          </Text>
          <Text style={[styles.vendorText, { color: colors.mutedForeground }]}>
            • {product.sellerName}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: "#16A34A" }]}>
            {product.price.toLocaleString()} GNF
          </Text>
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            /{product.unit}
          </Text>
        </View>

        {product.available > 0 && (
          <View style={[styles.availableBadge, { backgroundColor: "#DCFCE722" }]}>
            <Text style={[styles.availableText, { color: "#16A34A" }]}>
              {product.available} disponibles
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function AgricultureScreen() {
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
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  const featured = MOCK_PRODUCTS.filter((p) => p.featured);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#16A34A" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Agriculture</Text>
          <Text style={styles.headerSub}>Produits agricoles frais</Text>
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
              placeholder="Chercher un produit, lieu..."
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
                size={16}
                color={category === f.id ? "#FFFFFF" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: category === f.id ? "#FFFFFF" : colors.mutedForeground,
                  },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured section */}
        {filtered.length > 0 && featured.length > 0 && (
          <>
            <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 24 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="star" size={18} color={colors.secondary} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  En vedette
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featured.map((product) => (
                <View key={product.id} style={styles.featuredCard}>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      unit: product.unit,
                      sellerName: product.sellerName,
                      image: product.images[0],
                      rating: product.rating,
                      location: product.location,
                      available: product.available,
                    }}
                    onPress={() => router.push(`/agriculture/${product.id}` as any)}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Results section */}
        <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </Text>
        </View>

        {filtered.length > 0 ? (
          <View style={[styles.gridContainer, { paddingHorizontal: 16 }]}>
            {filtered.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    unit: product.unit,
                    sellerName: product.sellerName,
                    image: product.images[0],
                    rating: product.rating,
                    location: product.location,
                    available: product.available,
                  }}
                  onPress={() => router.push(`/agriculture/${product.id}` as any)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { paddingVertical: 60 }]}>
            <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucun produit trouvé
            </Text>
            <Pressable
              onPress={() => {
                setSearch("");
                setCategory("all");
              }}
              style={({ pressed }) => [
                styles.resetBtn,
                {
                  backgroundColor: "#16A34A",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.resetBtnText}>Réinitialiser les filtres</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  featuredList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredCard: {
    width: 180,
  },
  gridContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  gridItem: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardImageContainer: {
    height: 160,
  },
  cardImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 12,
    gap: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  vendorText: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
  },
  unit: {
    fontSize: 12,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  availableText: {
    fontSize: 11,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  resetBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
