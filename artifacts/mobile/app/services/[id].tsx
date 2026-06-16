import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
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

import { MOCK_SERVICES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { ServiceCategoryId } from "@/types";

const CATEGORY_LABELS: Record<ServiceCategoryId, string> = {
  mechanics: "Mécanique",
  electrician: "Électricien",
  plumber: "Plomberie",
  technician: "Technicien",
  freelancer: "Freelance",
  cleaning: "Nettoyage",
  security: "Sécurité",
  transport: "Transport",
  construction: "Construction",
  welder: "Soudure",
};

const CATEGORY_ICONS: Record<ServiceCategoryId, keyof typeof Ionicons.glyphMap> = {
  mechanics: "car-outline",
  electrician: "flash-outline",
  plumber: "water-outline",
  technician: "phone-portrait-outline",
  freelancer: "laptop-outline",
  cleaning: "brush-outline",
  security: "shield-outline",
  transport: "cube-outline",
  construction: "hammer-outline",
  welder: "flame-outline",
};

const PRICE_TYPE_LABELS = {
  per_hour: "/ heure",
  per_job: "/ mission",
  negotiable: "Prix négociable",
};

const MOCK_REVIEWS = [
  { id: "r1", author: "Mamadou D.", rating: 5, text: "Excellent travail, très professionnel. Je recommande vivement.", date: "Il y a 2 jours" },
  { id: "r2", author: "Fatoumata B.", rating: 5, text: "Intervention rapide et efficace. Tarif honnête.", date: "Il y a 1 semaine" },
  { id: "r3", author: "Ibrahima S.", rating: 4, text: "Bon service dans l'ensemble. Travail soigné.", date: "Il y a 2 semaines" },
];

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messageSent, setMessageSent] = useState(false);

  const provider = MOCK_SERVICES.find((s) => s.id === id);
  const similar = MOCK_SERVICES.filter((s) => s.id !== id && s.category === provider?.category).slice(0, 3);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 80 : insets.bottom + 80;

  if (!provider) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="construct-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Prestataire introuvable
        </Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn2, { backgroundColor: colors.primary }]}>
          <Text style={styles.backBtn2Text}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${provider.phone}`);
  };

  const handleWhatsApp = () => {
    const phone = provider.phone.replace(/\s/g, "");
    Linking.openURL(`https://wa.me/${phone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: provider.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={styles.heroGradient}
          />
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: topPad + 8 }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          {/* Availability badge */}
          <View
            style={[
              styles.availBadge,
              { backgroundColor: provider.available ? "#DCFCE7" : "#FEE2E2", top: topPad + 8 },
            ]}
          >
            <View style={[styles.availDot, { backgroundColor: provider.available ? "#16A34A" : "#DC2626" }]} />
            <Text style={[styles.availText, { color: provider.available ? "#16A34A" : "#DC2626" }]}>
              {provider.available ? "Disponible" : "Occupé"}
            </Text>
          </View>

          {/* Hero text */}
          <View style={styles.heroBottom}>
            <View style={[styles.catBadge, { backgroundColor: "#7C3AED" }]}>
              <Ionicons name={CATEGORY_ICONS[provider.category]} size={12} color="#FFFFFF" />
              <Text style={styles.catBadgeText}>{CATEGORY_LABELS[provider.category]}</Text>
            </View>
            <Text style={styles.heroName}>{provider.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroMetaText}>{provider.city}</Text>
            </View>
          </View>
        </View>

        {/* Rating + stats strip */}
        <View style={[styles.statsStrip, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{provider.rating.toFixed(1)}</Text>
            <StarRow rating={provider.rating} size={11} />
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{provider.reviewCount} avis</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            {provider.verified ? (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                <Text style={[styles.statLabel, { color: "#16A34A" }]}>Vérifié NAFA</Text>
              </>
            ) : (
              <>
                <Ionicons name="time-outline" size={22} color={colors.mutedForeground} />
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>En vérification</Text>
              </>
            )}
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#7C3AED" }]}>
              {provider.price > 0 ? formatPrice(provider.price) : "Devis"}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              {provider.price > 0 ? PRICE_TYPE_LABELS[provider.priceType] : "gratuit"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>À propos</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {provider.description}
          </Text>
        </View>

        {/* Skills */}
        <View style={[styles.section, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Compétences</Text>
          <View style={styles.skillsGrid}>
            {provider.skills.map((skill) => (
              <View key={skill} style={[styles.skillChip, { backgroundColor: "#7C3AED" + "12", borderColor: "#7C3AED" + "30", borderWidth: 1 }]}>
                <Ionicons name="checkmark-circle" size={13} color="#7C3AED" />
                <Text style={[styles.skillText, { color: "#7C3AED" }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service info */}
        <View style={[styles.section, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informations</Text>
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: "#7C3AED" + "15" }]}>
                <Ionicons name="cash-outline" size={16} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Tarif</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {provider.price > 0
                    ? `${formatPrice(provider.price)} ${PRICE_TYPE_LABELS[provider.priceType]}`
                    : "Sur devis — contactez pour un tarif personnalisé"}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: "#16A34A" + "15" }]}>
                <Ionicons name="time-outline" size={16} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Disponibilité</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {provider.available ? "Disponible maintenant · 7j/7" : "Actuellement occupé"}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: "#2563EB" + "15" }]}>
                <Ionicons name="location-outline" size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Zone d'intervention</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>{provider.city} et environs</Text>
              </View>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.infoIconWrap, { backgroundColor: "#EA580C" + "15" }]}>
                <Ionicons name="call-outline" size={16} color="#EA580C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Téléphone</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>{provider.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Avis clients</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={[styles.ratingPillText, { color: colors.foreground }]}>
                {provider.rating.toFixed(1)} / 5
              </Text>
            </View>
          </View>
          {MOCK_REVIEWS.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.reviewHeader}>
                <View style={[styles.reviewAvatar, { backgroundColor: "#7C3AED" }]}>
                  <Text style={styles.reviewAvatarText}>{review.author[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>{review.author}</Text>
                  <StarRow rating={review.rating} size={12} />
                </View>
                <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{review.date}</Text>
              </View>
              <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>{review.text}</Text>
            </View>
          ))}
        </View>

        {/* Similar services */}
        {similar.length > 0 && (
          <View style={[styles.section, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Prestataires similaires</Text>
            {similar.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => router.push(`/services/${s.id}` as any)}
                style={({ pressed }) => [
                  styles.simCard,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Image
                  source={{ uri: s.image }}
                  style={[styles.simAvatar, { borderRadius: 30 }]}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.simName, { color: colors.foreground }]} numberOfLines={1}>{s.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[styles.simMeta, { color: colors.mutedForeground }]}>
                      {s.rating.toFixed(1)} · {s.city}
                    </Text>
                  </View>
                </View>
                <View style={styles.simPrice}>
                  <Text style={[styles.simPriceText, { color: "#7C3AED" }]}>
                    {s.price > 0 ? formatPrice(s.price) : "Sur devis"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Fixed CTA */}
      <View
        style={[
          styles.ctaBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 16 : insets.bottom + 12,
          },
        ]}
      >
        <Pressable
          onPress={handleWhatsApp}
          style={[styles.ctaSecondary, { borderColor: "#16A34A" }]}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#16A34A" />
          <Text style={[styles.ctaSecondaryText, { color: "#16A34A" }]}>WhatsApp</Text>
        </Pressable>
        <Pressable onPress={handleCall} style={styles.ctaPrimary}>
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.ctaPrimaryText}>Appeler maintenant</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backBtn2: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backBtn2Text: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },

  /* Hero */
  heroWrap: { position: "relative", height: 260 },
  heroImage: { width: "100%", height: "100%" },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  availBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  heroBottom: { position: "absolute", bottom: 16, left: 16, right: 16, gap: 4 },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  catBadgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  heroName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.3 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  heroMetaText: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular" },

  /* Stats strip */
  statsStrip: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statDivider: { width: 1, marginVertical: 4 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },

  /* Sections */
  section: { paddingHorizontal: 16, paddingVertical: 20, gap: 12 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  description: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23, marginTop: 4 },

  /* Skills */
  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  /* Info rows */
  infoRows: { gap: 0 },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 2 },
  infoValue: { fontSize: 14, fontFamily: "Inter_500Medium" },

  /* Reviews */
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingPillText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 10,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
  reviewAuthor: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  reviewDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  reviewText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  /* Similar */
  simCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  simAvatar: { width: 48, height: 48 },
  simName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  simMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  simPrice: {},
  simPriceText: { fontSize: 13, fontFamily: "Inter_700Bold" },

  /* CTA */
  ctaBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ctaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  ctaSecondaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  ctaPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaPrimaryText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_700Bold" },
});
