import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import { MOCK_CONSTRUCTION } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const BRAND_COLOR = "#92400E";
const CAT_LABELS: Record<string, string> = {
  cement: "Ciment / Blocs", wood: "Bois", metal: "Ferraille / Métal",
  electrical: "Électricité", plumbing: "Plomberie", tools: "Outillage",
  paint: "Peinture", tiles: "Carrelage",
};

export default function ConstructionDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = MOCK_CONSTRUCTION.find((c) => c.id === id);
  const similar = item
    ? MOCK_CONSTRUCTION.filter((c) => c.id !== id && (c.category === item.category || c.city === item.city)).slice(0, 3)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCall = () => {
    if (!item) return;
    Linking.openURL(`tel:${item.sellerPhone.replace(/\s/g, "")}`);
  };

  const handleWhatsapp = () => {
    if (!item) return;
    const p = item.sellerPhone.replace(/[\s+]/g, "");
    Linking.openURL(`https://wa.me/${p}?text=Bonjour, je suis intéressé par votre annonce: ${item.title}`);
  };

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Annonce introuvable</Text>
        <Pressable onPress={() => router.back()} style={[styles.backFallback, { backgroundColor: BRAND_COLOR }]}>
          <Text style={styles.backFallbackText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const stockColor = item.stockAvailable ? "#16A34A" : "#EF4444";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: item.images[0] }} style={styles.heroImg} contentFit="cover" transition={300} />
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { marginTop: topPad + 12 }]}>
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </Pressable>
          {/* Stock badge */}
          <View style={[styles.stockBadge, { backgroundColor: stockColor + "CC" }]}>
            <View style={[styles.stockDot, { backgroundColor: "#FFF" }]} />
            <Text style={styles.stockText}>{item.stockAvailable ? "En stock" : "Épuisé"}</Text>
          </View>
          {item.featured && (
            <View style={[styles.featBadge, { backgroundColor: BRAND_COLOR + "CC" }]}>
              <Text style={styles.featText}>⭐ Vedette</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Price + unit */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
            <View style={styles.priceBlock}>
              <Text style={[styles.price, { color: BRAND_COLOR }]}>{formatPrice(item.price)}</Text>
              <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>/{item.unit}</Text>
            </View>

            <View style={[styles.specGrid, { borderTopColor: colors.border }]}>
              {[
                { icon: "grid-outline" as const, label: "Catégorie", val: CAT_LABELS[item.category] ?? item.category },
                { icon: "pricetag-outline" as const, label: "Unité", val: item.unit },
                item.quantity != null ? { icon: "layers-outline" as const, label: "Quantité dispo", val: `${item.quantity} ${item.unit}` } : null,
                { icon: "checkmark-circle-outline" as const, label: "Stock", val: item.stockAvailable ? "Disponible" : "Épuisé" },
                { icon: "location-outline" as const, label: "Ville", val: item.city },
                { icon: "calendar-outline" as const, label: "Publié", val: new Date(item.createdAt).toLocaleDateString("fr-FR") },
              ].filter(Boolean).map((s) => (
                <View key={s!.label} style={styles.specItem}>
                  <Ionicons name={s!.icon} size={14} color={BRAND_COLOR} />
                  <View>
                    <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>{s!.label}</Text>
                    <Text style={[styles.specVal, { color: colors.foreground }]}>{s!.val}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>{item.description}</Text>
          </View>

          {/* Seller */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Fournisseur</Text>
            <View style={styles.sellerRow}>
              <View style={[styles.sellerAvatar, { backgroundColor: BRAND_COLOR }]}>
                <Ionicons name="storefront" size={22} color="#FFF" />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.foreground }]}>{item.sellerName}</Text>
                <Text style={[styles.sellerPhone, { color: colors.mutedForeground }]}>{item.sellerPhone}</Text>
              </View>
              {item.rating != null && (
                <View style={styles.ratingChip}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={[styles.ratingText, { color: colors.foreground }]}>{item.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            {/* Delivery info strip */}
            <View style={[styles.infoStrip, { backgroundColor: BRAND_COLOR + "12", borderColor: BRAND_COLOR + "30" }]}>
              <Ionicons name="cube-outline" size={14} color={BRAND_COLOR} />
              <Text style={[styles.infoStripText, { color: colors.foreground }]}>
                Livraison disponible sur devis — contactez le fournisseur pour tarif
              </Text>
            </View>
          </View>

          {similar.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 10 }]}>Produits similaires</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
                {similar.map((s) => (
                  <Pressable
                    key={s.id}
                    onPress={() => router.push(`/construction/${s.id}` as any)}
                    style={({ pressed }) => [
                      styles.simCard,
                      { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <Image source={{ uri: s.images[0] }} style={[styles.simImg, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]} contentFit="cover" />
                    <View style={styles.simBody}>
                      <Text style={[styles.simTitle, { color: colors.foreground }]} numberOfLines={2}>{s.title}</Text>
                      <Text style={[styles.simPrice, { color: BRAND_COLOR }]}>{formatPrice(s.price)}/{s.unit}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={handleWhatsapp} style={[styles.ctaSecondary, { borderColor: "#25D366" }]}>
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Text style={[styles.ctaSecondaryText, { color: "#25D366" }]}>WhatsApp</Text>
        </Pressable>
        <Pressable onPress={handleCall} style={[styles.ctaPrimary, { backgroundColor: BRAND_COLOR }]}>
          <Ionicons name="call-outline" size={18} color="#FFF" />
          <Text style={styles.ctaPrimaryText}>Appeler le fournisseur</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImg: { width: "100%", height: 260 },
  backBtn: {
    position: "absolute", top: 0, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
  },
  stockBadge: { position: "absolute", bottom: 12, left: 14, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 12, fontWeight: "700", color: "#FFF" },
  featBadge: { position: "absolute", bottom: 12, right: 14, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  featText: { fontSize: 12, fontWeight: "700", color: "#FFF" },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: "700", lineHeight: 24 },
  priceBlock: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  price: { fontSize: 24, fontWeight: "800" },
  priceUnit: { fontSize: 14 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, paddingTop: 14, borderTopWidth: 1, marginTop: 8 },
  specItem: { flexDirection: "row", alignItems: "flex-start", gap: 8, width: "44%" },
  specLabel: { fontSize: 10, fontWeight: "500" },
  specVal: { fontSize: 13, fontWeight: "600" },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 22 },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: "600" },
  sellerPhone: { fontSize: 13, marginTop: 2 },
  ratingChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, fontWeight: "700" },
  infoStrip: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 8, borderWidth: 1, marginTop: 4 },
  infoStripText: { flex: 1, fontSize: 12, lineHeight: 18 },
  simCard: { width: 150, marginHorizontal: 4, borderWidth: 1, overflow: "hidden" },
  simImg: { width: "100%", height: 110 },
  simBody: { padding: 10, gap: 4 },
  simTitle: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  simPrice: { fontSize: 12, fontWeight: "700" },
  cta: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  ctaSecondary: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5 },
  ctaSecondaryText: { fontSize: 15, fontWeight: "600" },
  ctaPrimary: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  ctaPrimaryText: { fontSize: 15, fontWeight: "700", color: "#FFF" },
  notFound: { fontSize: 16, marginTop: 12 },
  backFallback: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  backFallbackText: { color: "#FFF", fontWeight: "600" },
});
