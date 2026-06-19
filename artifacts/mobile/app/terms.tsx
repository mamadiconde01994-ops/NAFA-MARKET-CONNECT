import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const SECTIONS = [
  {
    icon: "key-outline" as const,
    title: "Accès à la plateforme",
    text: "L'utilisation de NAFA Marché est ouverte à toute personne résidant en République de Guinée. Vous devez avoir au moins 18 ans ou être accompagné d'un tuteur légal. NAFA se réserve le droit de suspendre tout compte en cas d'utilisation abusive.",
  },
  {
    icon: "person-circle-outline" as const,
    title: "Votre compte",
    text: "Vous êtes responsable de la confidentialité de vos identifiants. Toute activité effectuée depuis votre compte vous est attribuée. Signalez immédiatement toute utilisation non autorisée à notre équipe de support.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Utilisation acceptable",
    text: "Il est interdit de publier des contenus illégaux, trompeurs ou portant atteinte aux droits d'autrui. Les tentatives de fraude, d'hameçonnage ou d'intrusion dans nos systèmes entraîneront une suspension immédiate et définitive.",
  },
  {
    icon: "storefront-outline" as const,
    title: "Annonces et transactions",
    text: "NAFA Marché facilite la mise en relation entre acheteurs et vendeurs. Nous ne sommes pas partie prenante dans les transactions. Vous êtes responsable de l'exactitude des informations de vos annonces.",
  },
  {
    icon: "alert-circle-outline" as const,
    title: "Limitation de responsabilité",
    text: "NAFA Marché ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme, ni des litiges survenus entre utilisateurs lors de transactions.",
  },
  {
    icon: "refresh-outline" as const,
    title: "Modifications des conditions",
    text: "Ces conditions peuvent être mises à jour à tout moment. Les utilisateurs seront informés des changements importants. La poursuite de l'utilisation de la plateforme vaut acceptation des nouvelles conditions.",
  },
];

export default function TermsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* ── HEADER ── */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.blobTopRight} />
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            hitSlop={8}
          >
            <View style={styles.backBtnInner}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Ionicons name="document-text-outline" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.brandTag}>NAFA Marché</Text>
              <Text style={styles.headerTitle}>Conditions d'utilisation</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroMeta}>
          <Text style={styles.heroDate}>Dernière mise à jour : Juin 2025</Text>
        </View>
      </LinearGradient>

      {/* ── CONTENT ── */}
      <View style={[styles.content, { paddingBottom: bottomPad + 32 }]}>
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: BRAND_ACCENT + "30" }]}>
          <View style={[styles.introDot, { backgroundColor: BRAND_ACCENT }]} />
          <Text style={[styles.introText, { color: colors.foreground }]}>
            En utilisant NAFA Marché, vous acceptez les présentes conditions. Lisez-les attentivement — elles définissent vos droits et responsabilités sur notre plateforme.
          </Text>
        </View>

        {/* Sections */}
        <View style={styles.sections}>
          {SECTIONS.map((s, i) => (
            <View
              key={i}
              style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: BRAND_MID + "18" }]}>
                  <Ionicons name={s.icon} size={18} color={BRAND_MID} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{s.title}</Text>
              </View>
              <Text style={[styles.sectionText, { color: colors.mutedForeground }]}>{s.text}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={[styles.contactCard, { backgroundColor: BRAND_MID + "0D", borderColor: BRAND_MID + "30" }]}>
          <Ionicons name="mail-outline" size={18} color={BRAND_MID} />
          <Text style={[styles.contactText, { color: colors.mutedForeground }]}>
            Pour toute question :{" "}
            <Text style={[styles.contactLink, { color: BRAND_MID }]}>support@nafamarche.gn</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 28,
    overflow: "hidden",
    minHeight: 130,
    gap: 16,
  },
  blobTopRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#52B788",
    opacity: 0.12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  brandTag: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  heroMeta: {
    paddingHorizontal: 16,
  },
  heroDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  introDot: {
    width: 4,
    borderRadius: 2,
    alignSelf: "stretch",
    marginTop: 2,
    minHeight: 20,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
  },
  sections: { gap: 10 },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  contactText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  contactLink: {
    fontFamily: "Inter_600SemiBold",
  },
});
