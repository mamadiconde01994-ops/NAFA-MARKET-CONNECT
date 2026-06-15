import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/products/CategoryChip";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/common/SearchBar";
import { CATEGORIES, MOCK_PRODUCTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory } from "@/types";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const results = MOCK_PRODUCTS.filter((p) => {
    const matchesQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory ? p.category === selectedCategory : true;
    return matchesQuery && matchesCat;
  });

  const rows = chunkArray(results, 2);

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

      {/* Categories */}
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
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 12 }}
        >
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
  resultCount: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 4 },
  gridRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  gridItem: { flex: 1 },
});
