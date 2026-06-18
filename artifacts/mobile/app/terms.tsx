import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad + 24, paddingBottom: bottomPad + 32, paddingHorizontal: 24, gap: 12 }}
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Pressable>

      <View>
        <Text style={[styles.heading, { color: colors.foreground }]}>{t("termsTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsIntro")}</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("termsAccessTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsAccessText")}</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("termsAccountsTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsAccountsText")}</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("termsUsageTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsUsageText")}</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("termsIPTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsIPText")}</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("termsLiabilityTitle")}</Text>
        <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{t("termsLiabilityText")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 8 },
  heading: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 12 },
  paragraph: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
