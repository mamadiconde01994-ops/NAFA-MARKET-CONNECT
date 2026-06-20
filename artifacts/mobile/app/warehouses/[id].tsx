import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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

import { MOCK_WAREHOUSES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const BRAND = "#DC2626";

export default function WarehouseDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [imgError, setImgError] = useState(false);

  const warehouse = MOCK_WAREHOUSES.find((w) => w.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCall = () => {
    if (!warehouse) return;
    const phone = warehouse.ownerPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    if (!warehouse) return;
    const phone = warehouse.ownerPhone.replace(/[\s+]/g, "");
    const msg = encodeURIComponent(
      `Bonjour ${warehouse.ownerName}, je vous contacte via NAFA Warehouses pour l'entrepôt "${warehouse.name}" situé à ${warehouse.address}, ${warehouse.city}. Je suis intéressé(e) par la location de cet espace. Pouvez-vous me donner plus d'informations ?`
    );
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`).catch(() =>
      Linking.openURL(`https://wa.me/${phone}?text=${msg}`)
    );
  };

  const handleEmail = () => {
    if (!warehouse) return;
    Linking.openURL(
      `mailto:entrepots@nafa.gn?subject=Demande de location - ${warehouse.name}&body=Bonjour, je souhaite obtenir des informations sur l'entrepôt "${warehouse.name}" situé à ${warehouse.city}.`
    );
  };

  const handleReservation = () => {
    if (!warehouse) return;
    Alert.alert(
      "Demander une visite",
      `Souhaitez-vous organiser une visite de "${warehouse.name}" à ${warehouse.city} ?`,
      [
        {
          text: "📞 Appeler",
          onPress: handleCall,
        },
        {
          text: "💬 WhatsApp",
          onPress: handleWhatsApp,
        },
        {
          text: "✉️ Email",
          onPress: handleEmail,
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const handleShare = () => {
    if (!warehouse) return;
    Alert.alert(
      "Partager cet entrepôt",
      `${warehouse.name}\n${warehouse.city} · ${warehouse.surfaceM2} m²\n${formatPrice(warehouse.pricePerMonth)}/mois`,
      [
        {
          text: "WhatsApp",
          onPress: () => {
            const msg = encodeURIComponent(
              `Entrepôt disponible sur NAFA Warehouses :\n\n🏭 *${warehouse.name}*\n📍 ${warehouse.city}\n📐 ${warehouse.surfaceM2} m²\n💰 ${formatPrice(warehouse.pricePerMonth)}/mois\n📞 ${warehouse.ownerPhone}`
            );
            Linking.openURL(`whatsapp://send?text=${msg}`);
          },
        },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  if (!warehouse) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons name="cube-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Entrepôt non trouvé</Text>
        <Pressable onPress={() => router.back()} style={[styles.backLink, { backgroundColor: BRAND }]}>
          <Text style={{ color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
            Retour aux entrepôts
          </Text>
        </Pressable>
      </View>
    );
  }

  const availabilityColor = warehouse.available ? "#16A34A" : "#F59E0B";
  const availabilityLabel = warehouse.available ? "Disponible maintenant" : "Bientôt disponible";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: imgError ? "https://picsum.photos/seed/warehouse/600/400" : warehouse.images[0] }}
            style={[styles.heroImage, { marginTop: topPad }]}
            contentFit="cover"
            transition={300}
            onError={() => setImgError(true)}
          />

          {/* Overlay gradient buttons */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.overlayBtn, { top: topPad + 12, left: 14, backgroundColor: "rgba(0,0,0,0.45)" }]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={[styles.overlayBtn, { top: topPad + 12, right: 14, backgroundColor: "rgba(0,0,0,0.45)" }]}
            hitSlop={8}
          >
            <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Availability badge */}
          <View
            style={[
              styles.availBadge,
              { bottom: 14, left: 14, backgroundColor: availabilityColor },
            ]}
          >
            <View style={styles.availDot} />
            <Text style={styles.availText}>{availabilityLabel}</Text>
          </View>

          {/* Surface badge */}
          <View style={[styles.surfaceBadge, { bottom: 14, right: 14 }]}>
            <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
            <Text style={styles.surfaceText}>{warehouse.surfaceM2} m²</Text>
          </View>
        </View>

        {/* Main info card */}
        <View
          style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.warehouseName, { color: colors.foreground }]}>{warehouse.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={[styles.ratingValue, { color: colors.foreground }]}>
                {warehouse.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={BRAND} />
            <Text style={[styles.locationText, { color: colors.mutedForeground }]}>
              {warehouse.address}, {warehouse.city}, Guinée
            </Text>
          </View>

          {/* Price box */}
          <View style={[styles.priceBox, { backgroundColor: BRAND + "0F", borderColor: BRAND + "30" }]}>
            <View>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Tarif mensuel</Text>
              <Text style={[styles.priceValue, { color: BRAND }]}>{formatPrice(warehouse.pricePerMonth)}</Text>
              <Text style={[styles.pricePeriod, { color: colors.mutedForeground }]}>par mois, hors charges</Text>
            </View>
            <Pressable
              onPress={handleReservation}
              style={({ pressed }) => [
                styles.visitBtn,
                { backgroundColor: BRAND, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="calendar-outline" size={15} color="#FFFFFF" />
              <Text style={styles.visitBtnText}>Visiter</Text>
            </Pressable>
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {warehouse.description}
          </Text>
        </View>

        {/* Specs grid */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={18} color={BRAND} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Caractéristiques</Text>
          </View>
          <View style={styles.specsGrid}>
            <View style={[styles.specBox, { backgroundColor: colors.muted }]}>
              <Ionicons name="scan-outline" size={20} color={BRAND} />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Surface</Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>{warehouse.surfaceM2} m²</Text>
            </View>
            <View style={[styles.specBox, { backgroundColor: colors.muted }]}>
              <Ionicons name="location-outline" size={20} color={BRAND} />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Ville</Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>{warehouse.city}</Text>
            </View>
            <View style={[styles.specBox, { backgroundColor: colors.muted }]}>
              <Ionicons name="cube-outline" size={20} color={BRAND} />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Type</Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>Stockage</Text>
            </View>
            <View style={[styles.specBox, { backgroundColor: colors.muted }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={BRAND} />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Statut</Text>
              <Text style={[styles.specValue, { color: availabilityColor }]}>
                {warehouse.available ? "Libre" : "Occupé"}
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        {warehouse.features.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={18} color={BRAND} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Équipements & services</Text>
            </View>
            <View style={styles.featuresList}>
              {warehouse.features.map((feature, idx) => (
                <View key={idx} style={[styles.featureItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.featureIconWrap, { backgroundColor: "#16A34A18" }]}>
                    <Ionicons name="checkmark" size={14} color="#16A34A" />
                  </View>
                  <Text style={[styles.featureText, { color: colors.foreground }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Address */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map" size={18} color={BRAND} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Adresse</Text>
          </View>
          <View style={[styles.addressBox, { backgroundColor: colors.muted }]}>
            <View style={[styles.addressIconWrap, { backgroundColor: BRAND }]}>
              <Ionicons name="location" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressText, { color: colors.foreground }]}>{warehouse.address}</Text>
              <Text style={[styles.addressCity, { color: colors.mutedForeground }]}>
                {warehouse.city}, République de Guinée
              </Text>
            </View>
          </View>
        </View>

        {/* Owner / Contact */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={18} color={BRAND} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Propriétaire / Gestionnaire</Text>
          </View>
          <View style={styles.ownerBox}>
            <View style={[styles.ownerAvatar, { backgroundColor: BRAND }]}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ownerName, { color: colors.foreground }]}>{warehouse.ownerName}</Text>
              <Text style={[styles.ownerPhone, { color: colors.mutedForeground }]}>{warehouse.ownerPhone}</Text>
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
              <Ionicons name="call" size={16} color="#0891B2" />
              <Text style={[styles.contactActionText, { color: "#0891B2" }]}>Appeler</Text>
            </Pressable>
            <Pressable
              onPress={handleWhatsApp}
              style={({ pressed }) => [
                styles.contactActionBtn,
                { backgroundColor: "#25D36618", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
              <Text style={[styles.contactActionText, { color: "#25D366" }]}>WhatsApp</Text>
            </Pressable>
            <Pressable
              onPress={handleEmail}
              style={({ pressed }) => [
                styles.contactActionBtn,
                { backgroundColor: colors.muted, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="mail-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.contactActionText, { color: colors.mutedForeground }]}>Email</Text>
            </Pressable>
          </View>
        </View>

        {/* Safety note */}
        <View style={[styles.safetyNote, { backgroundColor: "#F59E0B10", borderColor: "#F59E0B30" }]}>
          <Ionicons name="shield-checkmark" size={16} color="#F59E0B" />
          <Text style={[styles.safetyText, { color: colors.mutedForeground }]}>
            Annonce vérifiée par <Text style={{ color: BRAND, fontFamily: "Inter_600SemiBold" }}>NAFA Warehouses</Text>. Visitez toujours l'entrepôt avant de signer un contrat.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View
        style={[
          styles.actionBar,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
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
          onPress={handleReservation}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: BRAND, opacity: pressed ? 0.85 : 1, flex: 2 },
          ]}
        >
          <Ionicons name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Demander une visite</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 12, marginBottom: 20 },
  backLink: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  heroImage: { width: "100%", height: 290 },
  overlayBtn: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  availBadge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  availDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.9)" },
  availText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  surfaceBadge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  surfaceText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  infoCard: {
    margin: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  warehouseName: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1, lineHeight: 26 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 3 },
  ratingValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  locationRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  locationText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 19 },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  priceLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 3 },
  priceValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  pricePeriod: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  visitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  visitBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  section: { marginHorizontal: 14, marginBottom: 12, borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  specsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  specBox: {
    flex: 1,
    minWidth: "47%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  specLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  specValue: { fontSize: 14, fontFamily: "Inter_700Bold", textAlign: "center" },
  featuresList: { gap: 0 },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  featureIconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  featureText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  addressIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  addressText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  addressCity: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  ownerBox: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  ownerAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  ownerName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2 },
  ownerPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
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
  safetyNote: {
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  safetyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
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
