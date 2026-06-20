import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_JOBS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { JobCategory, ContractType } from "@/types";

const CATEGORY_COLORS: Record<JobCategory, string> = {
  agriculture: "#16A34A",
  restaurant: "#EA580C",
  construction: "#92400E",
  transport: "#DC2626",
  tech: "#6366F1",
  health: "#DC2626",
  education: "#0891B2",
  trade: "#7C3AED",
  security: "#64748B",
  domestic: "#EC4899",
};

const CATEGORY_LABELS: Record<JobCategory, string> = {
  agriculture: "Agriculture",
  restaurant: "Restauration",
  construction: "Construction",
  transport: "Transport",
  tech: "Technologie",
  health: "Santé",
  education: "Éducation",
  trade: "Commerce",
  security: "Sécurité",
  domestic: "Domestique",
};

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  full_time: "Temps plein (CDI)",
  part_time: "Temps partiel (CDD)",
  temporary: "Contrat temporaire",
  freelance: "Freelance / Indépendant",
};

const CONTRACT_COLORS: Record<ContractType, string> = {
  full_time: "#16A34A",
  part_time: "#2563EB",
  temporary: "#F59E0B",
  freelance: "#7C3AED",
};

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const job = MOCK_JOBS.find((j) => j.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCall = () => {
    if (!job) return;
    const phone = job.contactPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    if (!job) return;
    const phone = job.contactPhone.replace(/[\s+]/g, "");
    const msg = encodeURIComponent(
      `Bonjour ${job.contactName}, je vous contacte via NAFA Emploi concernant votre offre d'emploi : "${job.title}". Je suis intéressé(e) par ce poste et souhaite postuler.`
    );
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`).catch(() =>
      Linking.openURL(`https://wa.me/${phone}?text=${msg}`)
    );
  };

  const handleEmail = () => {
    if (!job) return;
    Linking.openURL(
      `mailto:emploi@nafa.gn?subject=Candidature - ${job.title} (${job.company})`
    );
  };

  const handleShare = () => {
    if (!job) return;
    Alert.alert(
      "Partager cette offre",
      `${job.title}\n${job.company} · ${job.city}\n\nPartagez cette opportunité via WhatsApp.`,
      [
        {
          text: "WhatsApp",
          onPress: () => {
            const msg = encodeURIComponent(`Offre d'emploi sur NAFA Emploi :\n\n📋 *${job.title}*\n🏢 ${job.company}\n📍 ${job.city}\n📞 ${job.contactPhone}`);
            Linking.openURL(`whatsapp://send?text=${msg}`);
          },
        },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Ionicons name="briefcase-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Offre d'emploi non trouvée</Text>
        <Pressable onPress={() => router.back()} style={[styles.backLink, { backgroundColor: "#0891B2" }]}>
          <Text style={{ color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Retour aux offres</Text>
        </Pressable>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[job.category] ?? "#0891B2";
  const contractColor = CONTRACT_COLORS[job.contractType];

  const salaryLabel = job.salary && job.salaryType !== "negotiable"
    ? `${formatPrice(job.salary)}${job.salaryType === "per_month" ? " / mois" : " / jour"}`
    : "À négocier";

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>

        {/* Colored header */}
        <View style={[styles.headerContainer, { backgroundColor: categoryColor, paddingTop: topPad + 8 }]}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={handleShare} style={styles.shareBtn} hitSlop={8}>
              <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.headerBadges}>
              {job.urgent && (
                <View style={[styles.urgentBadge, { backgroundColor: "rgba(220,38,38,0.85)" }]}>
                  <Ionicons name="alert-circle" size={12} color="#FFFFFF" />
                  <Text style={styles.urgentText}>RECRUTEMENT URGENT</Text>
                </View>
              )}
              <View style={[styles.categoryBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[job.category]}</Text>
              </View>
            </View>

            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>

            <View style={styles.headerMeta}>
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{job.city}, Guinée</Text>
              </View>
              <Text style={styles.metaDot}>·</Text>
              <View style={styles.metaChip}>
                <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>
                  {daysAgo === 0 ? "Aujourd'hui" : daysAgo === 1 ? "Hier" : `Il y a ${daysAgo} jours`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Key info cards */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: "#16A34A18" }]}>
              <Ionicons name="cash-outline" size={18} color="#16A34A" />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Rémunération</Text>
            <Text style={[styles.infoValue, { color: job.salary && job.salaryType !== "negotiable" ? "#16A34A" : colors.foreground }]}>
              {salaryLabel}
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: contractColor + "18" }]}>
              <Ionicons name="document-text-outline" size={18} color={contractColor} />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Contrat</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {CONTRACT_TYPE_LABELS[job.contractType]}
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: categoryColor + "18" }]}>
              <Ionicons name="location-outline" size={18} color={categoryColor} />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Localisation</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>{job.city}</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.infoIconWrap, { backgroundColor: "#0891B218" }]}>
              <Ionicons name="people-outline" size={18} color="#0891B2" />
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Secteur</Text>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>{CATEGORY_LABELS[job.category]}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color={categoryColor} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description du poste</Text>
          </View>
          <Text style={[styles.descriptionText, { color: colors.mutedForeground }]}>
            {job.description}
          </Text>
        </View>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={18} color={categoryColor} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Profil recherché</Text>
            </View>
            <View style={styles.requirementsList}>
              {job.requirements.map((req, idx) => (
                <View key={idx} style={styles.requirementItem}>
                  <View style={[styles.requirementBullet, { backgroundColor: categoryColor }]} />
                  <Text style={[styles.requirementText, { color: colors.foreground }]}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* How to apply */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="send" size={18} color={categoryColor} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Comment postuler</Text>
          </View>
          <View style={styles.howToApplyList}>
            <View style={styles.howToApplyItem}>
              <View style={[styles.stepNum, { backgroundColor: categoryColor }]}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <Text style={[styles.howToApplyText, { color: colors.mutedForeground }]}>
                Appelez ou envoyez un message WhatsApp au recruteur
              </Text>
            </View>
            <View style={styles.howToApplyItem}>
              <View style={[styles.stepNum, { backgroundColor: categoryColor }]}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <Text style={[styles.howToApplyText, { color: colors.mutedForeground }]}>
                Présentez-vous et mentionnez l'offre NAFA Emploi
              </Text>
            </View>
            <View style={styles.howToApplyItem}>
              <View style={[styles.stepNum, { backgroundColor: categoryColor }]}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <Text style={[styles.howToApplyText, { color: colors.mutedForeground }]}>
                Préparez votre CV ou justificatifs si demandés
              </Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={18} color={categoryColor} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contact recruteur</Text>
          </View>
          <View style={styles.contactBox}>
            <View style={[styles.contactAvatar, { backgroundColor: categoryColor }]}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: colors.foreground }]}>{job.contactName}</Text>
              <Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>{job.contactPhone}</Text>
            </View>
          </View>

          <View style={styles.contactActions}>
            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [
                styles.contactActionBtn,
                { backgroundColor: "#0891B218", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="call" size={18} color="#0891B2" />
              <Text style={[styles.contactActionText, { color: "#0891B2" }]}>Appeler</Text>
            </Pressable>
            <Pressable
              onPress={handleWhatsApp}
              style={({ pressed }) => [
                styles.contactActionBtn,
                { backgroundColor: "#25D36618", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={[styles.contactActionText, { color: "#25D366" }]}>WhatsApp</Text>
            </Pressable>
            <Pressable
              onPress={handleEmail}
              style={({ pressed }) => [
                styles.contactActionBtn,
                { backgroundColor: colors.muted, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <Text style={[styles.contactActionText, { color: colors.mutedForeground }]}>Email</Text>
            </Pressable>
          </View>
        </View>

        {/* NAFA Emploi info */}
        <View style={[styles.nafahInfo, { backgroundColor: "#0891B210", borderColor: "#0891B230" }]}>
          <Ionicons name="shield-checkmark" size={16} color="#0891B2" />
          <Text style={[styles.nafaInfoText, { color: colors.mutedForeground }]}>
            Offre publiée sur <Text style={{ color: "#0891B2", fontFamily: "Inter_600SemiBold" }}>NAFA Emplois</Text>. Vérifiez toujours l'identité du recruteur avant de vous déplacer.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.actionBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleWhatsApp}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: "#25D366", opacity: pressed ? 0.85 : 1, flex: 1 },
          ]}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>WhatsApp</Text>
        </Pressable>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: categoryColor, opacity: pressed ? 0.85 : 1, flex: 2 },
          ]}
        >
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Postuler maintenant</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 12, marginBottom: 20 },
  backLink: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  headerContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center" },
  shareBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center" },
  headerContent: { gap: 8 },
  headerBadges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  urgentText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  categoryBadgeText: { color: "rgba(255,255,255,0.95)", fontSize: 12, fontFamily: "Inter_500Medium" },
  jobTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF", lineHeight: 28 },
  company: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.9)" },
  headerMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  metaDot: { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 14 },
  infoBox: {
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    alignItems: "flex-start",
  },
  infoIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  infoLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 13, fontFamily: "Inter_700Bold", lineHeight: 18 },
  section: { marginHorizontal: 14, marginBottom: 12, borderRadius: 14, borderWidth: 1, padding: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  descriptionText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  requirementsList: { gap: 10 },
  requirementItem: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  requirementBullet: { width: 7, height: 7, borderRadius: 3.5, marginTop: 7, flexShrink: 0 },
  requirementText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  howToApplyList: { gap: 12 },
  howToApplyItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold" },
  howToApplyText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, paddingTop: 2 },
  contactBox: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  contactName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2 },
  contactPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
  contactActions: { flexDirection: "row", gap: 10 },
  contactActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  contactActionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  nafahInfo: {
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  nafaInfoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  actionBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
});
