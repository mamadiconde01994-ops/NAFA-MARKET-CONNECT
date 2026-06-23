import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { usePriceAlerts } from "@/context/PriceAlertsContext";
import { useMessages } from "@/context/MessagesContext";
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
    case "agriculture": router.push("/agriculture/index" as any); break;
    case "restaurants": router.push("/restaurants/index" as any); break;
    case "real-estate": router.push("/real-estate/index" as any); break;
    case "services": router.push("/services/index" as any); break;
    case "logistics": router.push("/warehouses/index" as any); break;
    case "vehicles": router.push("/vehicles/index" as any); break;
    case "jobs": router.push("/jobs/index" as any); break;
    case "electronics": router.push("/electronics/index" as any); break;
    case "fashion": router.push("/fashion/index" as any); break;
    case "home-furniture": router.push("/home-furniture/index" as any); break;
    case "construction": router.push("/construction/index" as any); break;
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

  const { hasAlert, addAlert, removeAlert, getAlert } = usePriceAlerts();
  const { totalUnread: unreadMessages } = useMessages();
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    product: (typeof MARKET_PRICES)[0] | null;
    input: string;
  }>({ visible: false, product: null, input: "" });

  const openAlertModal = (mp: (typeof MARKET_PRICES)[0]) => {
    const existing = getAlert(mp.id);
    setAlertModal({
      visible: true,
      product: mp,
      input: existing ? String(existing.targetPrice) : "",
    });
  };
  const closeAlertModal = () => setAlertModal({ visible: false, product: null, input: "" });
  const saveAlert = () => {
    if (!alertModal.product) return;
    const val = parseInt(alertModal.input.replace(/\s/g, ""), 10);
    if (!val || val <= 0) return;
    addAlert(
      {
        id: alertModal.product.id,
        name: alertModal.product.product,
        unit: alertModal.product.unit,
        market: alertModal.product.market,
        currentPrice: alertModal.product.price,
      },
      val
    );
    closeAlertModal();
  };
  const deleteAlertForProduct = (productId: string) => {
    const a = getAlert(productId);
    if (a) removeAlert(a.id);
    closeAlertModal();
  };

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
            <Pressable
              style={[styles.iconBtn]}
              onPress={() => router.push("/notifications" as any)}
              hitSlop={8}
            >
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
        {/* ── RACCOURCIS RAPIDES ── */}
        <View style={[styles.quickRow, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          {([
            { icon: "bag-handle-outline", label: "Commandes", route: "/(tabs)/orders", color: "#F59E0B" },
            { icon: "heart-outline", label: "Favoris", route: "/(tabs)/favorites", color: "#EF4444" },
            { icon: "chatbubbles-outline", label: "Messages", route: "/(tabs)/messages", color: "#2563EB" },
            { icon: "storefront-outline", label: "Mes annonces", route: "/my-listings", color: "#10B981" },
          ] as const).map((item) => {
            const badge = item.label === "Messages" && unreadMessages > 0 ? unreadMessages : 0;
            return (
              <Pressable
                key={item.label}
                onPress={() => item.route && router.push(item.route as any)}
                style={({ pressed }) => [styles.quickItem, { opacity: pressed ? 0.65 : 1 }]}
              >
                <View style={[styles.quickIconWrap, { backgroundColor: item.color + "18" }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                  {badge > 0 && (
                    <View style={styles.quickBadge}>
                      <Text style={styles.quickBadgeText}>{badge > 9 ? "9+" : badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.quickLabel, { color: colors.foreground }]} numberOfLines={1}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
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
        <View style={[styles.categoriesGrid, { backgroundColor: colors.background, marginTop: 28, marginBottom: 28 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid" size={20} color={colors.secondary} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explorer</Text>
            </View>
          </View>
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
        <View style={[styles.section, { marginTop: 24 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trending-up" size={20} color={colors.secondary} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prix du marché</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {MARKET_PRICES.map((mp) => {
              const alerted = hasAlert(mp.id);
              return (
              <View
                key={mp.id}
                style={[
                  styles.priceCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: alerted ? "#52B788" : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                {/* Product name + bell */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={[styles.priceProd, { color: colors.foreground, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                    {mp.product}
                  </Text>
                  <Pressable
                    onPress={() => openAlertModal(mp)}
                    hitSlop={8}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, marginLeft: 6 })}
                  >
                    <Ionicons
                      name={alerted ? "notifications" : "notifications-outline"}
                      size={15}
                      color={alerted ? "#F59E0B" : colors.mutedForeground}
                    />
                  </Pressable>
                </View>
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
              );
            })}
          </ScrollView>
        </View>

        {/* ── AGRICULTURE ── */}
        <View style={[styles.agriSection, { backgroundColor: colors.background, marginTop: 32 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="leaf" size={20} color="#16A34A" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Agriculture</Text>
            </View>
            <Pressable onPress={() => router.push("/agriculture/index" as any)} hitSlop={8}>
              <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
            </Pressable>
          </View>
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
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="restaurant" size={20} color="#EA580C" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Restaurants</Text>
            </View>
            <Pressable
              onPress={() => router.push("/restaurants/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
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
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="home" size={20} color="#2563EB" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Immobilier</Text>
            </View>
            <Pressable
              onPress={() => router.push("/real-estate/index" as any)}
              hitSlop={8}
            >
              <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
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
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="hammer" size={20} color="#7C3AED" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Services</Text>
            </View>
            <Pressable onPress={() => router.push("/services/index" as any)} hitSlop={8}>
              <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
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
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 16 }]}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="car" size={20} color="#475569" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Véhicules</Text>
            </View>
            <Pressable onPress={() => router.push("/vehicles/index" as any)} hitSlop={8}>
              <Text style={[styles.seeAll, { color: colors.secondary }]}>Voir tout</Text>
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

      {/* ── Price Alert Modal ── */}
      <Modal
        visible={alertModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeAlertModal}
      >
        <Pressable style={alertStyles.overlay} onPress={closeAlertModal}>
          <Pressable style={[alertStyles.sheet, { backgroundColor: colors.card, borderRadius: colors.radius + 4 }]} onPress={() => {}}>
            {/* Handle */}
            <View style={[alertStyles.handle, { backgroundColor: colors.border }]} />

            {alertModal.product && (
              <>
                {/* Header */}
                <View style={alertStyles.modalHeader}>
                  <View style={[alertStyles.modalIcon, { backgroundColor: "#1B4332" + "22" }]}>
                    <Ionicons name="notifications" size={22} color="#52B788" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[alertStyles.modalTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {alertModal.product.product}
                    </Text>
                    <Text style={[alertStyles.modalSub, { color: colors.mutedForeground }]}>
                      {alertModal.product.market}
                    </Text>
                  </View>
                </View>

                {/* Current price */}
                <View style={[alertStyles.currentPriceRow, { backgroundColor: colors.background, borderRadius: 10 }]}>
                  <Text style={[alertStyles.currentLabel, { color: colors.mutedForeground }]}>Prix actuel</Text>
                  <Text style={[alertStyles.currentPrice, { color: colors.foreground }]}>
                    {formatPrice(alertModal.product.price)}{" "}
                    <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
                      GNF/{alertModal.product.unit}
                    </Text>
                  </Text>
                </View>

                {/* Target price input */}
                <View style={{ marginTop: 16 }}>
                  <Text style={[alertStyles.inputLabel, { color: colors.foreground }]}>
                    Me notifier si le prix descend sous :
                  </Text>
                  <View style={[alertStyles.inputRow, { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10 }]}>
                    <TextInput
                      value={alertModal.input}
                      onChangeText={(v) => setAlertModal((p) => ({ ...p, input: v }))}
                      keyboardType="numeric"
                      placeholder={`ex: ${Math.round(alertModal.product.price * 0.8).toLocaleString()}`}
                      placeholderTextColor={colors.mutedForeground}
                      style={[alertStyles.input, { color: colors.foreground }]}
                      autoFocus
                    />
                    <Text style={[alertStyles.inputSuffix, { color: colors.mutedForeground }]}>
                      GNF/{alertModal.product.unit}
                    </Text>
                  </View>
                </View>

                {/* Buttons */}
                <View style={alertStyles.btnRow}>
                  {hasAlert(alertModal.product.id) && (
                    <Pressable
                      onPress={() => deleteAlertForProduct(alertModal.product!.id)}
                      style={({ pressed }) => [
                        alertStyles.btnSecondary,
                        { borderColor: "#DC2626", opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Ionicons name="trash-outline" size={15} color="#DC2626" />
                      <Text style={[alertStyles.btnSecondaryText, { color: "#DC2626" }]}>Supprimer</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={saveAlert}
                    style={({ pressed }) => [
                      alertStyles.btnPrimary,
                      { backgroundColor: "#1B4332", opacity: pressed ? 0.85 : 1, flex: 1 },
                    ]}
                  >
                    <Ionicons name="notifications" size={15} color="#fff" />
                    <Text style={alertStyles.btnPrimaryText}>
                      {hasAlert(alertModal.product.id) ? "Mettre à jour" : "Créer l'alerte"}
                    </Text>
                  </Pressable>
                </View>

                {/* Link to manage */}
                <Pressable
                  onPress={() => { closeAlertModal(); router.push("/price-alerts" as any); }}
                  style={{ alignItems: "center", marginTop: 12 }}
                >
                  <Text style={[alertStyles.manageLink, { color: colors.mutedForeground }]}>
                    Gérer toutes mes alertes →
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    marginHorizontal: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  modalIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  modalTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  modalSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  currentPriceRow: { padding: 14, gap: 4 },
  currentLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  currentPrice: { fontSize: 20, fontFamily: "Inter_700Bold" },
  inputLabel: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, paddingHorizontal: 14, paddingVertical: 0,
  },
  input: { flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold", paddingVertical: 14 },
  inputSuffix: { fontSize: 13, fontFamily: "Inter_400Regular" },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  btnPrimary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 7, paddingVertical: 14, borderRadius: 12,
  },
  btnPrimaryText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  btnSecondary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1,
  },
  btnSecondaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  manageLink: { fontSize: 13, fontFamily: "Inter_400Regular" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerWrapper: { flex: 1 },
  catList: { flexDirection: "row", gap: 8, paddingHorizontal: 16, alignItems: "center", paddingVertical: 4 },

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
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Greeting block */
  greetingBlock: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  greetingName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  greetingSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
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
    gap: 7,
    width: 82,
  },
  mainCatIcon: {
    width: 68,
    height: 68,
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
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  soonLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },

  /* Section header */
  section: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  sectionDescription: { fontSize: 14, fontFamily: "Inter_400Regular", marginHorizontal: 16, marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  /* Market prices */
  priceCard: {
    borderWidth: 1,
    padding: 14,
    width: 165,
    gap: 5,
  },
  priceProd: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  priceVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  priceUnit: { fontSize: 13, fontFamily: "Inter_400Regular" },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  trendText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  priceMarket: { fontSize: 12, fontFamily: "Inter_400Regular" },

  /* Agriculture */
  agriSection: { marginBottom: 20 },
  agriHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agriTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  agriDot: { width: 8, height: 8, borderRadius: 4 },
  gridRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  gridItem: { flex: 1 },

  /* Service chips */
  svcChip: {
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    width: 100,
  },
  svcIconWrap: { width: 50, height: 50, alignItems: "center", justifyContent: "center" },
  svcLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },
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
  bannerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  bannerSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.85)", marginTop: 2 },
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
  partnerBannerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  partnerBannerSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },

  /* Quick access row */
  quickRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  quickItem: {
    flex: 1,
    alignItems: "center",
    gap: 7,
  },
  quickIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  quickBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  quickBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    lineHeight: 14,
  },
});
