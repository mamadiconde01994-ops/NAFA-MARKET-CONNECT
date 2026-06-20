import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_RESTAURANTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const CUISINE_LABELS: Record<string, string> = {
  guinean: "Guinéen",
  senegalese: "Sénégalais",
  lebanese: "Libanais",
  french: "Français",
  chinese: "Chinois",
  fastfood: "Fast Food",
  mixed: "International",
};

export default function RestaurantDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id);
  const similarRestaurants = restaurant
    ? MOCK_RESTAURANTS.filter((r) => r.id !== restaurant.id && r.cuisine === restaurant.cuisine).slice(0, 4)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCall = () => {
    if (!restaurant) return;
    const phone = restaurant.phone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessage = () => {
    if (!restaurant) return;
    router.push(
      `/chat?name=${encodeURIComponent(restaurant.name)}&context=${encodeURIComponent("Réservation / Question")}` as any,
    );
  };

  if (!restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.foreground }}>Restaurant non trouvé</Text>
      </View>
    );
  }

  const menuCategories = [...new Set(restaurant.menu.map((item) => item.category))];
  const filteredMenu = activeCategory
    ? restaurant.menu.filter((item) => item.category === activeCategory)
    : restaurant.menu;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Hero image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: restaurant.images[0] }}
            style={[styles.heroImage, { marginTop: topPad }]}
            contentFit="cover"
            transition={300}
          />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: topPad + 12, backgroundColor: "rgba(0,0,0,0.4)" }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Restaurant info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: restaurant.isOpen ? "#16A34A" : "#DC2626" }]} />
            <Text style={[styles.statusText, { color: restaurant.isOpen ? "#16A34A" : "#DC2626" }]}>
              {restaurant.isOpen ? "Ouvert" : "Fermé"}
            </Text>
            <Text style={[styles.cuisine, { color: "#EA580C" }]}>
              · {CUISINE_LABELS[restaurant.cuisine] ?? restaurant.cuisine}
            </Text>
          </View>
          <Text style={[styles.restaurantName, { color: colors.foreground }]}>
            {restaurant.name}
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {restaurant.description}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {restaurant.rating.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                ({restaurant.reviewCount} avis)
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {restaurant.deliveryTime} min
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Ionicons name="bicycle-outline" size={14} color={colors.mutedForeground} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {formatPrice(restaurant.deliveryFee)}
              </Text>
            </View>
          </View>

          {/* Address & phone */}
          <View style={[styles.contactCard, { backgroundColor: colors.muted, borderRadius: colors.radius - 4 }]}>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.contactText, { color: colors.foreground }]}>
                {restaurant.address}, {restaurant.city}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.contactText, { color: colors.foreground }]}>
                {restaurant.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.foreground }]}>Menu</Text>

          {/* Category tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}
          >
            <Pressable
              onPress={() => setActiveCategory(null)}
              style={[
                styles.catChip,
                activeCategory === null
                  ? { backgroundColor: "#EA580C" }
                  : { backgroundColor: colors.muted },
              ]}
            >
              <Text style={[styles.catLabel, { color: activeCategory === null ? "#FFFFFF" : colors.mutedForeground }]}>
                Tout
              </Text>
            </Pressable>
            {menuCategories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.catChip,
                  activeCategory === cat
                    ? { backgroundColor: "#EA580C" }
                    : { backgroundColor: colors.muted },
                ]}
              >
                <Text style={[styles.catLabel, { color: activeCategory === cat ? "#FFFFFF" : colors.mutedForeground }]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Menu items */}
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {filteredMenu.map((item) => (
              <View
                key={item.id}
                style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[styles.menuItemImage, { borderRadius: colors.radius - 2 }]}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.menuItemInfo}>
                  <View style={styles.row}>
                    <Text style={[styles.menuItemName, { color: colors.foreground }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.popular && (
                      <View style={[styles.popularBadge, { backgroundColor: "#FEF3C7" }]}>
                        <Text style={styles.popularText}>⭐ Populaire</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.menuItemDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={[styles.menuItemPrice, { color: "#EA580C" }]}>
                    {formatPrice(item.price)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Similar restaurants */}
        {similarRestaurants.length > 0 && (
          <View style={[styles.similarSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.similarTitle, { color: colors.foreground }]}>Restaurants similaires</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarList}
            >
              {similarRestaurants.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push(`/restaurants/${r.id}` as any)}
                  style={[
                    styles.similarCard,
                    { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
                  ]}
                >
                  <Image
                    source={{ uri: r.images[0] }}
                    style={[styles.similarImg, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.similarInfo}>
                    <Text style={[styles.similarName, { color: colors.foreground }]} numberOfLines={1}>{r.name}</Text>
                    <View style={styles.similarMeta}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={[styles.similarRating, { color: colors.mutedForeground }]}>{r.rating.toFixed(1)} · {r.city}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }]}>
        <View style={styles.ctaRow}>
          <Pressable
            onPress={handleMessage}
            style={({ pressed }) => [
              styles.ctaBtnOutline,
              { borderColor: "#EA580C", opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#EA580C" />
            <Text style={[styles.ctaBtnText, { color: "#EA580C" }]}>Message</Text>
          </Pressable>
          <Pressable
            onPress={handleCall}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: "#EA580C", flex: 1, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Ionicons name="call-outline" size={18} color="#FFFFFF" />
            <Text style={styles.ctaBtnText}>Appeler</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: "100%", height: 300 },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  cuisine: { fontSize: 13, fontFamily: "Inter_400Regular" },
  restaurantName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  statValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: 20 },
  contactCard: { padding: 12, gap: 8, marginTop: 4 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  contactText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  menuSection: { marginTop: 24, gap: 0 },
  menuTitle: { fontSize: 20, fontFamily: "Inter_700Bold", paddingHorizontal: 16, marginBottom: 12 },
  catList: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  catLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  menuItem: { flexDirection: "row", borderWidth: 1, overflow: "hidden", gap: 0 },
  menuItemImage: { width: 90, height: 90 },
  menuItemInfo: { flex: 1, padding: 10, gap: 4 },
  menuItemName: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  menuItemDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  menuItemPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  popularBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  popularText: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#92400E" },
  ctaRow: { flexDirection: "row", gap: 10 },
  ctaBtnOutline: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5,
  },
  ctaBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  similarSection: { marginTop: 24, paddingTop: 20, borderTopWidth: 1 },
  similarTitle: { fontSize: 18, fontFamily: "Inter_700Bold", paddingHorizontal: 16, marginBottom: 12 },
  similarList: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  similarCard: { width: 150, borderWidth: 1, overflow: "hidden" },
  similarImg: { width: 150, height: 100 },
  similarInfo: { padding: 8, gap: 4 },
  similarName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  similarMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  similarRating: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
