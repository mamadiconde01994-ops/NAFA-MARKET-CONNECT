import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad + 24, paddingBottom: bottomPad + 32, paddingHorizontal: 24, gap: 18 }}
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Pressable>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("languagePageTitle")}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t("languagePageSubtitle")}</Text>
      </View>

      <View style={[styles.options, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        {supportedLanguages.map((option) => {
          const selected = language === option.code;
          return (
            <Pressable
              key={option.code}
              onPress={() => void setLanguage(option.code).then(() => router.back())}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? colors.primary + "15" : colors.card,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View>
                <Text style={[styles.optionLabel, { color: colors.foreground }]}>{option.nativeLabel}</Text>
                <Text style={[styles.optionMeta, { color: colors.mutedForeground }]}>{option.englishLabel}</Text>
              </View>
              {selected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 16 },
  header: { gap: 6 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  options: { borderWidth: 1, borderRadius: 18, overflow: "hidden" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  optionLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  optionMeta: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
});
