import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useColors } from "@/hooks/useColors";

export interface TabItem {
  label: string;
  value: string;
  badge?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    tabsScroll: {
      flexDirection: "row",
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    tabLabelActive: {
      color: colors.primary,
    },
    tabLabelInactive: {
      color: colors.mutedForeground,
    },
    badge: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
    },
    badgeText: {
      color: colors.card,
      fontSize: 11,
      fontWeight: "600",
    },
  });

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tab,
                activeTab === tab.value && styles.tabActive,
              ]}
              onPress={() => onTabChange(tab.value)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.value
                    ? styles.tabLabelActive
                    : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
              {tab.badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View>{children}</View>
    </>
  );
}
