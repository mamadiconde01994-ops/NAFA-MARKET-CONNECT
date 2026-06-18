import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/products/CategoryChip";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/common/SearchBar";
import { CATEGORIES, MOCK_PRODUCTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory } from "@/types";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"price" | "popular" | "date">("price");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;
  const columns = width > 900 ? 3 : width > 600 ? 2 : 1;
  const itemWidth = Math.max(260, Math.floor((width - 32 - (columns - 1) * 10) / columns));

  const results = MOCK_PRODUCTS.filter((p) => {
    const matchesQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory ? p.category === selectedCategory : true;
    return matchesQuery && matchesCat;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Rechercher
        </Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          autoFocus
          onSubmit={() => {}}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        {([
          { id: "price", label: "Prix" },
          { id: "popular", label: "Popularité" },
          { id: "date", label: "Date" },
        ] as const).map((filter) => (
          <Pressable
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={({ pressed }) => [
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === filter.id ? colors.primary : colors.card,
                borderColor:
                  selectedFilter === filter.id ? colors.primary : colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    selectedFilter === filter.id
                      ? colors.primaryForeground
                      : colors.foreground,
                },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        style={{ flexGrow: 0 }}
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
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
          />
        ))}
      </ScrollView>

      {/* Results count */}
      {query.trim().length > 0 && (
        <Text
          style={[
            styles.resultCount,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          {results.length} résultat{results.length !== 1 ? "s" : ""} pour «{" "}
          {query} »
        </Text>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Aucun produit trouvé"
          subtitle="Essayez un autre terme ou une autre catégorie."
          actionLabel="Réinitialiser"
          onAction={() => {
            setQuery("");
            setSelectedCategory(null);
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 12, paddingHorizontal: 16 }}
        >
          <View style={styles.gridContainer}>
            {results.map((p) => (
              <View key={p.id} style={[styles.gridItem, { width: itemWidth }]}> 
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, gap: 12 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  catList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
    marginTop: 4,
  },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  filterLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  resultCount: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 4 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: { marginBottom: 10 },
});
