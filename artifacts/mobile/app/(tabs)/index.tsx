import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "@/components/common/SearchBar";

import { CategoryChip } from "@/components/products/CategoryChip";
import { ProductCard } from "@/components/products/ProductCard";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { PropertyCard } from "@/components/real-estate/PropertyCard";
import { UserAvatar } from "@/components/profile/UserAvatar";
import {
  CATEGORIES,
  MAIN_CATEGORIES,
  MARKET_PRICES,
  MOCK_PRODUCTS,
  MOCK_RESTAURANTS,
  MOCK_PROPERTIES,
} from "@/constants/mockData";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { ProductCategory } from "@/types";

const CITIES = ["Conakry", "Kindia", "Labé", "Kankan", "Mamou", "Boké", "Faranah", "N'Zérékoré"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

function SectionHeader({
  title,
  onSeeAll,
  colors,
}: {
  title: string;
  onSeeAll?: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
        </Pressable>
      )}
    </View>
  );
}

function navigateToCategory(id: string) {
  switch (id) {
    case "restaurants": router.push("/restaurants/index" as any); break;
    case "real-estate": router.push("/real-estate/index" as any); break;
    case "services": router.push("/services/index" as any); break;
    case "logistics": router.push("/warehouses/index" as any); break;
    case "vehicles": router.push("/vehicles/index" as any); break;
    case "jobs": router.push("/jobs/index" as any); break;
    default: break;
  }
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedCity, setSelectedCity] = useState("Conakry");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured);
  const filteredProducts = selectedCategory
    ? MOCK_PRODUCTS.filter((p) => p.category === selectedCategory)
    : MOCK_PRODUCTS;
  const featuredRestaurants = MOCK_RESTAURANTS.filter((r) => r.featured);
  const featuredProperties = MOCK_PROPERTIES.filter((p) => p.featured);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* City picker overlay */}
      {showCityPicker && (
        <Pressable
          style={styles.cityOverlay}
          onPress={() => setShowCityPicker(false)}
        >
          <View
            style={[
              styles.cityPicker,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                top: topPad + 56,
              },
            ]}
          >
            {CITIES.map((city) => (
              <Pressable
                key={city}
                onPress={() => {
                  setSelectedCity(city);
                  setShowCityPicker(false);
                }}
                style={({ pressed }) => [
                  styles.cityOption,
                  {
                    backgroundColor:
                      city === selectedCity
                        ? colors.muted
                        : pressed
                          ? colors.muted
                          : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cityOptionText,
                    {
                      color:
                        city === selectedCity
                          ? colors.primary
                          : colors.foreground,
                      fontFamily:
                        city === selectedCity
                          ? "Inter_600SemiBold"
                          : "Inter_400Regular",
                    },
                  ]}
                >
                  {city}
                </Text>
                {city === selectedCity && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* ── HEADER ── */}
        <View
          style={[
            styles.header,
            {
              paddingTop: topPad,
              backgroundColor: colors.navyHeader,
            },
          ]}
        >
          {/* City selector */}
          <Pressable
            onPress={() => setShowCityPicker(!showCityPicker)}
            style={styles.citySelector}
            hitSlop={8}
          >
            <Ionicons name="location" size={14} color={colors.goldAccent} />
            <Text style={styles.cityName}>{selectedCity}</Text>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.6)" />
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable style={[styles.iconBtn]} hitSlop={8}>
              <Ionicons name="notifications-outline" size={21} color="rgba(255,255,255,0.85)" />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <UserAvatar name={user?.name ?? "Visiteur"} size={38} />
            </Pressable>
          </View>
        </View>

        {/* ── GREETING + SEARCH ── */}
        <View
          style={[
            styles.greetingBlock,
            { backgroundColor: colors.navyHeader },
          ]}
        >
          <Text style={styles.greetingText}>
            {getGreeting()},{" "}
            <Text style={styles.greetingName}>
              {user?.name?.split(" ")[0] ?? "Visiteur"}
            </Text>
          </Text>
          <Text style={styles.greetingSub}>
            Que cherchez-vous aujourd'hui ?
          </Text>
          <SearchBar
            value=""
            onChangeText={() => undefined}
            placeholder="Produits, restaurants, immobilier..."
            editable={false}
            onPress={() => router.push("/search")}
            style={[
              styles.searchBlock,
              { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" },
            ]}
          />
        </View>
        {/* ── PARTNER PROGRAM BANNER ── */}
        <Pressable
          onPress={() => router.push("/partners" as any)}
          style={({ pressed }) => [
            styles.partnerBanner,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.partnerBannerIcon}>
            <Ionicons name="cash-outline" size={24} color="#10B981" />
          </View>
          <View style={styles.partnerBannerText}>
            <Text style={[styles.partnerBannerTitle, { color: colors.foreground }]}>Gagnez de l'argent avec NAFA</Text>
            <Text style={[styles.partnerBannerSubtitle, { color: colors.mutedForeground }]}>Rejoignez le programme partenaire et transformez vos réseaux en revenu.</Text>
          </View>
          <View style={[styles.ctaBadge, { backgroundColor: colors.primary }]}> 
            <Text style={[styles.ctaBadgeText, { color: colors.primaryForeground }]}>Rejoindre</Text>
          </View>
        </Pressable>
        {/* ── MAIN CATEGORIES ── */}
        <View style={[styles.categoriesGrid, { backgroundColor: colors.background }]}>
          <SectionHeader title="Explorer NAFA" colors={colors} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mainCatList}
          >
            {MAIN_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => navigateToCategory(cat.id)}
                style={({ pressed }) => [
                  styles.mainCatItem,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View
                  style={[
                    styles.mainCatIcon,
                    {
                      backgroundColor: cat.color + "18",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: cat.color + "30",
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={cat.color}
                  />
                  {cat.comingSoon && (
                    <View style={[styles.soonDot, { backgroundColor: colors.secondary }]} />
                  )}
                </View>
                <Text
                  style={[styles.mainCatName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
                {cat.comingSoon && (
                  <Text style={[styles.soonLabel, { color: colors.mutedForeground }]}>
                    Bientôt
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── MARKET PRICES ── */}
        <View style={styles.section}>
          <SectionHeader title="📊 Prix du marché aujourd'hui" colors={colors} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {MARKET_PRICES.map((mp) => (
              <View
                key={mp.id}
                style={[
                  styles.priceCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Text style={[styles.priceProd, { color: colors.foreground }]}>
                  {mp.product}
                </Text>
                <Text style={[styles.priceVal, { color: colors.secondary }]}>
                  {formatPrice(mp.price)}
                  <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>
                    {" "}/{mp.unit}
                  </Text>
                </Text>
                <View style={styles.trendRow}>
                  <Ionicons
                    name={
                      mp.trend === "up"
                        ? "trending-up"
                        : mp.trend === "down"
                          ? "trending-down"
                          : "remove"
                    }
                    size={13}
                    color={
                      mp.trend === "up"
                        ? "#DC2626"
                        : mp.trend === "down"
                          ? "#16A34A"
                          : colors.mutedForeground
                    }
                  />
                  <Text
                    style={[
                      styles.trendText,
                      {
                        color:
                          mp.trend === "up"
                            ? "#DC2626"
                            : mp.trend === "down"
                              ? "#16A34A"
                              : colors.mutedForeground,
                      },
                    ]}
                  >
                    {mp.trend === "stable" ? "Stable" : `${mp.trendPercent}%`}
                  </Text>
                </View>
                <Text style={[styles.priceMarket, { color: colors.mutedForeground }]}>
                  {mp.market}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── AGRICULTURE ── */}
        <View style={[styles.agriSection, { backgroundColor: colors.background }]}>
          <SectionHeader
            title="🌿 Agriculture"
            onSeeAll={() => router.push("/search")}
            colors={colors}
          />
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}> 
            {selectedCategory === null
              ? "Produits agricoles populaires et offres locales."
              : `Produits filtrés par ${CATEGORIES.find((cat) => cat.id === selectedCategory)?.name ?? "cette catégorie"}.`} 
          </Text>

          {/* Ag sub-categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}
          >
            <CategoryChip
              label="Tout"
              icon="grid-outline"
              color={colors.primary}
              selected={selectedCategory === null}
              onPress={() => setSelectedCategory(null)}
            />
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.name}
                icon={cat.icon}
                color={cat.color}
                selected={selectedCategory === cat.id}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
              />
            ))}
          </ScrollView>

          {/* Featured ag products */}
          {selectedCategory === null ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginBottom: 12 }}
            >
              {featuredProducts.map((p) => (
                <View key={p.id} style={{ width: 260 }}>
                  <ProductCard product={p} horizontal />
                </View>
              ))}
            </ScrollView>
          ) : filteredProducts.length > 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              {(() => {
                const rows: typeof filteredProducts[] = [];
                for (let i = 0; i < filteredProducts.length; i += 2) {
                  rows.push(filteredProducts.slice(i, i + 2));
                }
                return rows.map((row, idx) => (
                  <View key={idx} style={styles.gridRow}>
                    {row.map((p) => (
                      <View key={p.id} style={styles.gridItem}>
                        <ProductCard product={p} />
                      </View>
                    ))}
                    {row.length === 1 && <View style={styles.gridItem} />}
                  </View>
                ));
              })()}
            </View>
          ) : (
            <View style={styles.emptyCategory}>
              <Text style={[styles.emptyCategoryText, { color: colors.mutedForeground }]}>Aucun produit trouvé pour cette catégorie.</Text>
            </View>
          )}
        </View>

        {/* ── RESTAURANTS ── */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <View style={styles.agriTitleRow}>
              <View style={[styles.agriDot, { backgroundColor: "#EA580C" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                🍽️ Restaurants populaires
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/restaurants/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: "#EA580C" }]}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {featuredRestaurants.map((r) => (
              <View key={r.id} style={{ width: 240 }}>
                <RestaurantCard restaurant={r} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── IMMOBILIER ── */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <View style={styles.agriTitleRow}>
              <View style={[styles.agriDot, { backgroundColor: "#2563EB" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                🏠 Biens immobiliers
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/real-estate/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: "#2563EB" }]}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {featuredProperties.map((p) => (
              <View key={p.id} style={{ width: 240 }}>
                <PropertyCard property={p} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── SERVICES ── */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <View style={styles.agriTitleRow}>
              <View style={[styles.agriDot, { backgroundColor: "#7C3AED" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                🔧 Services à proximité
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/services/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: "#7C3AED" }]}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {(
              [
                { icon: "car-outline", label: "Mécanique", color: "#7C3AED" },
                { icon: "flash-outline", label: "Électricien", color: "#7C3AED" },
                { icon: "water-outline", label: "Plomberie", color: "#7C3AED" },
                { icon: "phone-portrait-outline", label: "Technicien", color: "#7C3AED" },
                { icon: "brush-outline", label: "Nettoyage", color: "#7C3AED" },
                { icon: "hammer-outline", label: "Construction", color: "#7C3AED" },
                { icon: "flame-outline", label: "Soudure", color: "#7C3AED" },
              ] as const
            ).map((svc) => (
              <Pressable
                key={svc.label}
                onPress={() => router.push("/services/index" as any)}
                style={({ pressed }) => [
                  styles.svcChip,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={[styles.svcIconWrap, { backgroundColor: "#7C3AED" + "18", borderRadius: 12 }]}>
                  <Ionicons name={svc.icon} size={20} color="#7C3AED" />
                </View>
                <Text style={[styles.svcLabel, { color: colors.foreground }]}>
                  {svc.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── VÉHICULES ── */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <View style={styles.agriTitleRow}>
              <View style={[styles.agriDot, { backgroundColor: "#475569" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                🚗 Véhicules
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/vehicles/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: "#475569" }]}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {(
              [
                { icon: "car-outline", label: "Voitures" },
                { icon: "bicycle-outline", label: "Motos" },
                { icon: "car-sport-outline", label: "4x4" },
                { icon: "bus-outline", label: "Minibus" },
                { icon: "construct-outline", label: "Pièces" },
              ] as const
            ).map((item) => (
              <Pressable
                key={item.label}
                onPress={() => router.push("/vehicles/index" as any)}
                style={({ pressed }) => [
                  styles.svcChip,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={[styles.svcIconWrap, { backgroundColor: "#475569" + "18", borderRadius: 12 }]}>
                  <Ionicons name={item.icon} size={20} color="#475569" />
                </View>
                <Text style={[styles.svcLabel, { color: colors.foreground }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── EMPLOIS BANNER ── */}
        <Pressable
          onPress={() => router.push("/jobs/index" as any)}
          style={({ pressed }) => [
            styles.jobsBanner,
            {
              marginHorizontal: 16,
              backgroundColor: "#0891B2",
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
              marginBottom: 12,
            },
          ]}
        >
          <Ionicons name="briefcase-outline" size={32} color="rgba(255,255,255,0.85)" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>NAFA Emplois</Text>
            <Text style={styles.bannerSub}>
              {`10+ offres d'emploi en Guinée — Agriculture, BTP, Restauration…`}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>

        {/* ── ENTREPÔTS ── */}
        <Pressable
          onPress={() => router.push("/warehouses/index" as any)}
          style={({ pressed }) => [
            styles.warehouseBanner,
            {
              marginHorizontal: 16,
              backgroundColor: "#DC2626",
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="cube-outline" size={32} color="rgba(255,255,255,0.85)" />
          <View style={{ flex: 1 }}>
            <Text style={styles.warehouseBannerTitle}>NAFA Warehouses</Text>
            <Text style={styles.warehouseBannerSub}>
              Louez ou gérez vos entrepôts agricoles en Guinée
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerWrapper: { flex: 1 },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Greeting block */
  greetingBlock: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
  },
  greetingName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  greetingSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  searchBlock: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
  },
  searchBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },

  /* City picker */
  cityOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  cityPicker: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 101,
    elevation: 6,
    ...Platform.select({
      web: { boxShadow: "0px 4px 8px rgba(0,0,0,0.12)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
    }),
  },
  cityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cityOptionText: { fontSize: 15 },

  /* Categories grid */
  categoriesGrid: {
    paddingVertical: 16,
  },
  mainCatList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  mainCatItem: {
    alignItems: "center",
    gap: 6,
    width: 72,
  },
  mainCatIcon: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  soonDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mainCatName: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  soonLabel: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
  },

  /* Section header */
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  sectionDescription: { fontSize: 13, fontFamily: "Inter_400Regular", marginHorizontal: 16, marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  /* Market prices */
  priceCard: {
    borderWidth: 1,
    padding: 12,
    width: 150,
    gap: 4,
  },
  priceProd: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  priceVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  priceUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  trendText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  priceMarket: { fontSize: 11, fontFamily: "Inter_400Regular" },

  /* Agriculture */
  agriSection: { marginBottom: 20 },
  agriHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agriTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  agriDot: { width: 8, height: 8, borderRadius: 4 },
  catList: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  gridRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  gridItem: { flex: 1 },

  /* Service chips */
  svcChip: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    width: 90,
  },
  svcIconWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  svcLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  emptyCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCategoryText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },

  /* Banners */
  jobsBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  bannerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  bannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 },
  warehouseBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  warehouseBannerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  warehouseBannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 },
  partnerBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  partnerBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  partnerBannerText: { flex: 1, gap: 4 },
  partnerBannerTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  partnerBannerSubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
