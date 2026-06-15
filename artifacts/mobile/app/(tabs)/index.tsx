import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/products/CategoryChip";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/common/SearchBar";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { CATEGORIES, MOCK_PRODUCTS } from "@/constants/mockData";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory } from "@/types";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const featured = MOCK_PRODUCTS.filter((p) => p.featured);
  const filtered = selectedCategory
    ? MOCK_PRODUCTS.filter((p) => p.category === selectedCategory)
    : MOCK_PRODUCTS;
  const rows = chunkArray(filtered, 2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: topPad, backgroundColor: colors.background },
          ]}
        >
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {user?.name?.split(" ")[0] ?? "Visiteur"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={[
                styles.notifBtn,
                { backgroundColor: colors.muted, borderRadius: 22 },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.foreground}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/(tabs)/profile" as `/${string}`)}>
              <UserAvatar name={user?.name ?? "Visiteur"} size={44} />
            </Pressable>
          </View>
        </View>

        {/* Search bar */}
        <View style={[styles.searchWrap, { paddingHorizontal: 16 }]}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            editable={false}
            onPress={() => router.push("/(tabs)/search" as `/${string}`)}
          />
        </View>

        {/* Categories */}
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

        {/* Featured */}
        {selectedCategory === null && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Produits vedettes
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            >
              {featured.map((p) => (
                <View key={p.id} style={{ width: 270 }}>
                  <ProductCard product={p} horizontal />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All products */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {selectedCategory
                ? (CATEGORIES.find((c) => c.id === selectedCategory)?.name ??
                  "Produits")
                : "Tous les produits"}
            </Text>
            <Text
              style={[styles.countLabel, { color: colors.mutedForeground }]}
            >
              {filtered.length} produits
            </Text>
          </View>

          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.gridRow}>
              {row.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <ProductCard product={p} />
                </View>
              ))}
              {row.length === 1 && <View style={styles.gridItem} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  userName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  notifBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  searchWrap: { marginBottom: 14 },
  catList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  gridRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  gridItem: { flex: 1 },
});
