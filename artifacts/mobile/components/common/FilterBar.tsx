import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface FilterOption {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: string | number;
}

interface FilterBarProps {
  filters: {
    [key: string]: FilterOption[];
  };
  activeFilters: Record<string, string>;
  onFilterChange: (category: string, value: string) => void;
  onClearAll?: () => void;
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
}: FilterBarProps) {
  const colors = useColors();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const activeCount = Object.values(activeFilters).filter(
    (v) => v !== null && v !== ""
  ).length;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Active filters display */}
      {activeCount > 0 && (
        <View
          style={[
            styles.activeFiltersRow,
            { paddingHorizontal: 16, paddingVertical: 8 },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {Object.entries(activeFilters).map(([category, value]) =>
              value ? (
                <View
                  key={category}
                  style={[
                    styles.activeFilterBadge,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.activeFilterText,
                      { color: colors.primary },
                    ]}
                  >
                    {value} ✕
                  </Text>
                </View>
              ) : null
            )}
          </ScrollView>
          {onClearAll && (
            <Pressable onPress={onClearAll} style={styles.clearButton}>
              <Text style={[styles.clearText, { color: colors.primary }]}>
                Effacer
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Filter categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {Object.entries(filters).map(([category, options]) => (
          <Pressable
            key={category}
            onPress={() =>
              setExpandedCategory(
                expandedCategory === category ? null : category
              )
            }
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.background,
                borderColor:
                  expandedCategory === category ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    expandedCategory === category
                      ? colors.primary
                      : colors.foreground,
                },
              ]}
            >
              {category}
            </Text>
            <Ionicons
              name={
                expandedCategory === category
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color={
                expandedCategory === category
                  ? colors.primary
                  : colors.mutedForeground
              }
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Expanded filter options */}
      {expandedCategory && (
        <View
          style={[
            styles.expandedOptions,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          {filters[expandedCategory].map((option) => (
            <Pressable
              key={option.id}
              onPress={() => onFilterChange(expandedCategory, option.id)}
              style={[
                styles.option,
                {
                  backgroundColor:
                    activeFilters[expandedCategory] === option.id
                      ? colors.primary + "15"
                      : "transparent",
                },
              ]}
            >
              {option.icon && (
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={
                    activeFilters[expandedCategory] === option.id
                      ? colors.primary
                      : colors.mutedForeground
                  }
                />
              )}
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color:
                      activeFilters[expandedCategory] === option.id
                        ? colors.primary
                        : colors.foreground,
                  },
                ]}
              >
                {option.label}
              </Text>
              {option.badge && (
                <Text
                  style={[
                    styles.optionBadge,
                    { color: colors.mutedForeground },
                  ]}
                >
                  ({option.badge})
                </Text>
              )}
              {activeFilters[expandedCategory] === option.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  activeFiltersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeFilterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  clearButton: {
    paddingHorizontal: 8,
  },
  clearText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  expandedOptions: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  optionBadge: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
