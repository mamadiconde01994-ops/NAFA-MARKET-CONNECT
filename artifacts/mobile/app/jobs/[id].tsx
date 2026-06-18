import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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
  transport: "#F59E0B",
  tech: "#6366F1",
  health: "#DC2626",
  education: "#0891B2",
  trade: "#7C3AED",
  security: "#64748B",
  domestic: "#EC4899",
};

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  full_time: "CDI",
  part_time: "CDD/Temps partiel",
  temporary: "Temporaire",
  freelance: "Freelance",
};

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expanded, setExpanded] = useState(false);

  const job = MOCK_JOBS.find((j) => j.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleApply = () => {
    if (!job) return;
    const phone = job.contactPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleShare = () => {
    if (!job) return;
    // In a real app, this would use react-native-share
    alert(`Partager: ${job.title}`);
  };

  if (!job) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text style={{ color: colors.foreground }}>Offre d'emploi non trouvée</Text>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[job.category] || "#64748B";
  const salaryLabel = job.salary
    ? `${formatPrice(job.salary)} ${job.salaryType === "per_month" ? "/ mois" : job.salaryType === "per_day" ? "/ jour" : ""}`
    : "Salaire à négocier";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Header */}
        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: categoryColor,
              paddingTop: topPad,
            },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtnHeader}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={[styles.jobTitle, { color: "#FFFFFF" }]}>
              {job.title}
            </Text>
            <Text style={[styles.company, { color: "rgba(255,255,255,0.9)" }]}>
              {job.company}
            </Text>
          </View>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        {/* Info cards */}
        <View style={styles.cardsContainer}>
          {/* Salary */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="cash-outline" size={20} color={categoryColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Salaire
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {salaryLabel}
              </Text>
            </View>
          </View>

          {/* Contract type */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="document-text-outline" size={20} color={categoryColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Type de contrat
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {CONTRACT_TYPE_LABELS[job.contractType]}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="location-outline" size={20} color={categoryColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Localisation
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {job.city}
              </Text>
            </View>
          </View>

          {/* Posted date */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color={categoryColor} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Publiée
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {new Date(job.postedAt).toLocaleDateString("fr-FR")}
              </Text>
            </View>
          </View>
        </View>

        {/* Job description */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Description du poste
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {job.description}
          </Text>
        </View>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Compétences requises
            </Text>
            <View style={styles.requirementsList}>
              {job.requirements.map((req, idx) => (
                <View key={idx} style={styles.requirementItem}>
                  <View
                    style={[styles.requirementBullet, { backgroundColor: categoryColor }]}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      { color: colors.foreground },
                    ]}
                  >
                    {req}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact info */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Contact
          </Text>
          <View style={styles.contactBox}>
            <View
              style={[
                styles.contactAvatar,
                { backgroundColor: categoryColor },
              ]}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: colors.foreground }]}>
                {job.contactName}
              </Text>
              <Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>
                {job.contactPhone}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View
        style={[
          styles.actionContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={handleShare}
          style={[
            styles.actionBtn,
            styles.secondaryBtn,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>
            Partager
          </Text>
        </Pressable>
        <Pressable
          onPress={handleApply}
          style={[
            styles.actionBtn,
            styles.primaryBtn,
            { backgroundColor: categoryColor },
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
            Postuler
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 8,
  },
  backBtnHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  headerContent: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    fontWeight: "500",
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(220, 38, 38, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cardsContainer: {
    paddingHorizontal: 12,
    gap: 8,
    marginVertical: 12,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  requirementText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contactName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryBtn: {
    borderWidth: 1,
  },
  primaryBtn: {},
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
