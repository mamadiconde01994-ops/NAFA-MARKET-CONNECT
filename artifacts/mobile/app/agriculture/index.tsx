import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import { MOCK_PRODUCTS, MARKET_PRICES, PARTNER_OPPORTUNITIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory } from "@/types";
import { getUserLocation, getDistanceToCity, getCityCoordinates } from "@/lib/location";
import { useFavorites } from "@/context/FavoritesContext";
import { LocationMap } from "@/components/common/LocationMap";

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
  distance?: number | null;
}

function ProductCard({ product, onPress, isFavorite, onToggleFavorite }: { product: ProductCard; onPress: () => void; isFavorite?: boolean; onToggleFavorite?: (id: string) => void }) {
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
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.cardImage}
            contentFit="cover"
          />
        ) : (
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
        )}
      </View>

      <Pressable onPress={() => onToggleFavorite && onToggleFavorite(product.id)} style={styles.favoriteBtn} hitSlop={8}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color={isFavorite ? "#EF4444" : colors.mutedForeground} />
      </Pressable>

      <View style={styles.cardContent}>
        <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {product.location}
          </Text>
          {product.distance != null && (
            <Text style={[styles.metaText, { color: colors.mutedForeground, marginLeft: 8 }]}>• {product.distance.toFixed(1)} km</Text>
          )}
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
  const [city, setCity] = useState("Toutes");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "rating" | "distance">("relevance");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const cities = useMemo(
    () => ["Toutes", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.location)))],
    [],
  );

  const partnerOpportunities = useMemo(
    () => PARTNER_OPPORTUNITIES.filter((opp) => opp.sector === "Agriculture").slice(0, 3),
    [],
  );

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      search.length === 0 ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const matchCity = city === "Toutes" || p.location === city;
    return matchSearch && matchCategory && matchCity;
  });

  const featured = MOCK_PRODUCTS.filter((p) => p.featured);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const location = await getUserLocation();
      if (!mounted || !location) return;
      setUserLocation(location);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const annotated = filtered.map((p) => {
    const distance = getDistanceToCity(userLocation, p.location);
    return { ...p, distance } as any;
  });

  if (nearMe && userLocation) {
    annotated.sort((a: any, b: any) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }

  // apply price filter
  const priceFiltered = annotated.filter((p: any) => {
    if (minPrice != null && p.price < minPrice) return false;
    if (maxPrice != null && p.price > maxPrice) return false;
    return true;
  });

  // apply sort
  const sorted = [...priceFiltered];
  if (sortBy === "price-asc") sorted.sort((a: any, b: any) => a.price - b.price);
  else if (sortBy === "price-desc") sorted.sort((a: any, b: any) => b.price - a.price);
  else if (sortBy === "rating") sorted.sort((a: any, b: any) => b.rating - a.rating);
  else if (sortBy === "distance" && userLocation) sorted.sort((a: any, b: any) => (a.distance ?? 9999) - (b.distance ?? 9999));

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

          <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.heroTitle, { color: colors.foreground }]}>Agri Premium</Text>
            <Text style={[styles.heroText, { color: colors.mutedForeground }]}>Explorez les meilleures offres locales, suivez les tendances du marché et découvrez des opportunités de partenariat pour booster votre agriculture.</Text>
            <View style={styles.heroActions}>
              <View style={[styles.heroBadge, { backgroundColor: "#DCFCE722" }]}> 
                <Text style={[styles.heroBadgeText, { color: "#16A34A" }]}>{sorted.length} annonces</Text>
              </View>
              <View style={[styles.heroBadge, { backgroundColor: "#FEF3C7" }]}> 
                <Text style={[styles.heroBadgeText, { color: "#B45309" }]}>{partnerOpportunities.length} partenaires</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category filter */}
        <View style={[styles.controlsRow, { paddingHorizontal: 16 }] }>
          <View style={styles.sortGroup}>
            <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>Trier</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <Pressable onPress={() => setSortBy("relevance")} style={[styles.sortChip, sortBy === "relevance" ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted }]}>
                <Text style={{ color: sortBy === "relevance" ? "#FFF" : colors.mutedForeground }}>Pertinence</Text>
              </Pressable>
              <Pressable onPress={() => setSortBy("price-asc")} style={[styles.sortChip, sortBy === "price-asc" ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted }]}>
                <Text style={{ color: sortBy === "price-asc" ? "#FFF" : colors.mutedForeground }}>Prix ↑</Text>
              </Pressable>
              <Pressable onPress={() => setSortBy("price-desc")} style={[styles.sortChip, sortBy === "price-desc" ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted }]}>
                <Text style={{ color: sortBy === "price-desc" ? "#FFF" : colors.mutedForeground }}>Prix ↓</Text>
              </Pressable>
              <Pressable onPress={() => setSortBy("rating")} style={[styles.sortChip, sortBy === "rating" ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted }]}>
                <Text style={{ color: sortBy === "rating" ? "#FFF" : colors.mutedForeground }}>Note</Text>
              </Pressable>
              <Pressable onPress={() => setSortBy("distance")} style={[styles.sortChip, sortBy === "distance" ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted }]}>
                <Text style={{ color: sortBy === "distance" ? "#FFF" : colors.mutedForeground }}>Distance</Text>
              </Pressable>
            </ScrollView>
          </View>

          <View style={styles.priceFilterGroup}>
            <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>Prix</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput keyboardType="numeric" placeholder="Min" placeholderTextColor={colors.mutedForeground} style={[styles.priceInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]} onChangeText={(t) => setMinPrice(t ? Number(t) : null)} />
              <TextInput keyboardType="numeric" placeholder="Max" placeholderTextColor={colors.mutedForeground} style={[styles.priceInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]} onChangeText={(t) => setMaxPrice(t ? Number(t) : null)} />
            </View>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          <Pressable
            onPress={() => setNearMe((v) => !v)}
            style={({ pressed }) => [
              styles.filterChip,
              nearMe ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted },
              { borderWidth: 1, borderColor: nearMe ? "#14532D" : "transparent", opacity: !userLocation ? 0.5 : 1 },
              !userLocation && { opacity: 0.5 },
            ]}
            disabled={!userLocation}
          >
            <Ionicons name="locate" size={16} color={nearMe ? "#FFFFFF" : colors.mutedForeground} />
            <Text style={[styles.filterText, { color: nearMe ? "#FFFFFF" : colors.mutedForeground }]}>Près de moi</Text>
          </Pressable>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {cities.map((cityOption) => (
            <Pressable
              key={cityOption}
              onPress={() => setCity(cityOption)}
              style={[
                styles.filterChip,
                city === cityOption
                  ? { backgroundColor: "#16A34A" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: city === cityOption ? "#FFFFFF" : colors.mutedForeground,
                  },
                ]}
              >
                {cityOption}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {nearMe && !userLocation ? (
          <Text style={[styles.helpText, { color: colors.mutedForeground }]}>Localisation requise pour trier par proximité.</Text>
        ) : null}

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

        {/* Map preview */}
        {sorted.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 24 }]}> 
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Carte des produits</Text>
            <LocationMap
              style={{ height: 220, marginTop: 12 }}
              userLocation={userLocation}
              markers={sorted
                .map((product: any) => {
                  const coords = getCityCoordinates(product.location);
                  return coords
                    ? {
                        id: product.id,
                        title: product.name,
                        description: product.location,
                        coordinate: coords,
                        pinColor: "#16A34A",
                      }
                    : null;
                })
                .filter(Boolean) as any[]}
              onMarkerPress={(id) => router.push(`/agriculture/${id}` as any)}
            />
          </View>
        )}

        {/* Results section */}
        <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </Text>
        </View>

{/* Partner opportunities */}
        {partnerOpportunities.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 8 }]}> 
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Opportunités partenaires</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Partenaires agricoles</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 10 }}>
              {partnerOpportunities.map((opp) => (
                <View key={opp.id} style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
                  <Text style={[styles.partnerTitle, { color: colors.foreground }]} numberOfLines={2}>{opp.title}</Text>
                  <Text style={[styles.partnerMeta, { color: colors.mutedForeground }]}>{opp.city} · {opp.campaignType}</Text>
                  <Text style={[styles.partnerValue, { color: "#16A34A" }]}>{opp.estimatedEarnings.toLocaleString()} GNF</Text>
                  <Text style={[styles.partnerBadge, { color: colors.foreground }]}>{opp.badge}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Market prices */}
        <View style={[styles.section, { paddingHorizontal: 16, paddingTop: 8 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prix du marché</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Mises à jour récentes</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 8 }}>
            {MARKET_PRICES.slice(0, 8).map((m) => (
              <View key={m.id} style={[styles.marketCard, { backgroundColor: colors.card, borderColor: colors.border, padding: 12, borderRadius: 8 }] }>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{m.product}</Text>
                <Text style={{ color: "#16A34A", fontWeight: "700", marginTop: 6 }}>{m.price.toLocaleString()} {m.unit}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>{m.market}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {filtered.length > 0 ? (
          <View style={[styles.gridContainer, { paddingHorizontal: 16 }]}>
            {sorted.map((product: any) => (
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
                    distance: product.distance,
                  }}
                  onPress={() => router.push(`/agriculture/${product.id}` as any)}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id, "product")}
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
  marketCard: {
    minWidth: 160,
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
  favoriteBtn: {
    position: "absolute",
    right: 12,
    top: 8,
    zIndex: 5,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sortGroup: {
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  priceFilterGroup: {
    width: 180,
  },
  priceInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 70,
  },
  smallLabel: {
    fontSize: 12,
    marginBottom: 4,
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
  heroCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  heroText: {
    fontSize: 13,
    lineHeight: 20,
  },
  partnerCard: {
    minWidth: 220,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  partnerTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  partnerMeta: {
    fontSize: 12,
    marginBottom: 4,
  },
  partnerValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  partnerBadge: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heroActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  heroBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  helpText: {
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 12,
  },
});
