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
    icon: "server-outline" as const,
    title: "Données collectées",
    text: "Nous collectons uniquement les informations nécessaires : nom, numéro de téléphone, adresse e-mail, localisation approximative et données de navigation sur la plateforme. Aucune donnée sensible (bancaire, biométrique) n'est collectée sans votre consentement explicite.",
  },
  {
    icon: "settings-outline" as const,
    title: "Utilisation de vos données",
    text: "Vos données sont utilisées pour personnaliser votre expérience, vous proposer des annonces pertinentes, assurer la sécurité de votre compte et améliorer nos services. Nous n'utilisons jamais vos données à des fins publicitaires tierces sans votre accord.",
  },
  {
    icon: "lock-closed-outline" as const,
    title: "Sécurité et stockage",
    text: "Vos données sont stockées sur des serveurs sécurisés situés en Afrique de l'Ouest. Nous appliquons des mesures de chiffrement et de contrôle d'accès strictes pour protéger vos informations contre tout accès non autorisé.",
  },
  {
    icon: "people-outline" as const,
    title: "Partage des données",
    text: "Nous ne vendons jamais vos données personnelles. Nous pouvons partager certaines informations avec nos partenaires de confiance (livraison, paiement) uniquement dans le cadre de l'exécution de services que vous avez sollicités.",
  },
  {
    icon: "hand-left-outline" as const,
    title: "Vos droits",
    text: "Vous pouvez à tout moment consulter, modifier ou supprimer vos données depuis les paramètres de votre compte. Vous pouvez également nous contacter pour exercer votre droit à l'oubli ou vous opposer à certains traitements.",
  },
  {
    icon: "phone-portrait-outline" as const,
    title: "Cookies et traceurs",
    text: "Notre application utilise des cookies techniques indispensables au fonctionnement. Aucun cookie publicitaire n'est utilisé sans votre consentement. Vous pouvez gérer vos préférences depuis les paramètres de votre appareil.",
  },
];

export default function PrivacyScreen() {
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
              <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.brandTag}>NAFA Marché</Text>
              <Text style={styles.headerTitle}>Politique de confidentialité</Text>
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
            Chez NAFA Marché, la protection de vos données personnelles est une priorité. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
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
            Délégué à la protection des données :{" "}
            <Text style={[styles.contactLink, { color: BRAND_MID }]}>privacy@nafamarche.gn</Text>
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
