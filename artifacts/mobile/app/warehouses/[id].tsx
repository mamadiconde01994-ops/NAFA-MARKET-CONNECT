import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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

import { MOCK_WAREHOUSES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function WarehouseDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const warehouse = MOCK_WAREHOUSES.find((w) => w.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCall = () => {
    if (!warehouse) return;
    const phone = warehouse.ownerPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    if (!warehouse) return;
    Linking.openURL(
      `mailto:info@nafa.gn?subject=Demande d'information - ${warehouse.name}`
    );
  };

  if (!warehouse) {
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
        <Text style={{ color: colors.foreground }}>Entrepôt non trouvé</Text>
      </View>
    );
  }

  const availabilityColor = warehouse.available ? "#10B981" : "#EF4444";
  const availabilityLabel = warehouse.available ? "Disponible" : "Occupé";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: warehouse.images[0] }}
            style={[styles.heroImage, { marginTop: topPad }]}
            contentFit="cover"
            transition={300}
          />
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { top: topPad + 12, backgroundColor: "rgba(0,0,0,0.4)" },
            ]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View
            style={[
              styles.availabilityBadge,
              {
                top: topPad + 12,
                backgroundColor: availabilityColor,
              },
            ]}
          >
            <Text style={styles.availabilityBadgeText}>
              {availabilityLabel}
            </Text>
          </View>
        </View>

        {/* Main info */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.warehouseName, { color: colors.foreground }]}>
            {warehouse.name}
          </Text>

          {/* Rating */}
          {warehouse.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={[styles.rating, { color: colors.foreground }]}>
                {warehouse.rating.toFixed(1)}
              </Text>
              <Text style={[styles.ratingLabel, { color: colors.mutedForeground }]}>
                ({warehouse.rating.toFixed(1)}/5.0)
              </Text>
            </View>
          )}

          {/* Price */}
          <View
            style={[
              styles.priceBox,
              { backgroundColor: colors.muted, borderRadius: 8 },
            ]}
          >
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
              Tarif mensuel
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatPrice(warehouse.pricePerMonth)}
            </Text>
            <Text style={[styles.pricePeriod, { color: colors.mutedForeground }]}>
              / mois
            </Text>
          </View>

          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
          >
            {warehouse.description}
          </Text>

          {/* Specs */}
          <View style={styles.specsGrid}>
            <View
              style={[
                styles.specBox,
                { backgroundColor: colors.muted, borderRadius: 8 },
              ]}
            >
              <Ionicons
                name="scan-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                Surface
              </Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>
                {warehouse.surfaceM2} m²
              </Text>
            </View>

            <View
              style={[
                styles.specBox,
                { backgroundColor: colors.muted, borderRadius: 8 },
              ]}
            >
              <Ionicons name="cube-outline" size={18} color={colors.primary} />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                Type
              </Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>
                Stockage
              </Text>
            </View>

            <View
              style={[
                styles.specBox,
                { backgroundColor: colors.muted, borderRadius: 8 },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                Ville
              </Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>
                {warehouse.city}
              </Text>
            </View>

            <View
              style={[
                styles.specBox,
                { backgroundColor: colors.muted, borderRadius: 8 },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                Sécurité
              </Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>
                Oui
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        {warehouse.features.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Caractéristiques
            </Text>
            <View style={styles.featuresList}>
              {warehouse.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#10B981"
                  />
                  <Text
                    style={[
                      styles.featureText,
                      { color: colors.foreground },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Address */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Adresse
          </Text>
          <View style={styles.addressBox}>
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressText, { color: colors.foreground }]}>
                {warehouse.address}
              </Text>
              <Text
                style={[
                  styles.addressCity,
                  { color: colors.mutedForeground },
                ]}
              >
                {warehouse.city}, Guinée
              </Text>
            </View>
          </View>
        </View>

        {/* Manager info */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Gestionnaire
          </Text>
          <View style={styles.managerBox}>
            <View
              style={[
                styles.managerAvatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.managerName, { color: colors.foreground }]}>
                {warehouse.ownerName}
              </Text>
              <Text
                style={[
                  styles.managerPhone,
                  { color: colors.mutedForeground },
                ]}
              >
                {warehouse.ownerPhone}
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
          onPress={handleEmail}
          style={[
            styles.actionBtn,
            styles.secondaryBtn,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Ionicons name="mail-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>
            Email
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCall}
          style={[
            styles.actionBtn,
            styles.primaryBtn,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
            Appeler
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
  heroImage: {
    width: "100%",
    height: 300,
  },
  backBtn: {
    position: "absolute",
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  availabilityBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  warehouseName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  ratingLabel: {
    fontSize: 12,
  },
  priceBox: {
    padding: 12,
    marginVertical: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 4,
  },
  pricePeriod: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 12,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specBox: {
    flex: 1,
    minWidth: "48%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  specLabel: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
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
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addressCity: {
    fontSize: 12,
    marginTop: 4,
  },
  managerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  managerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  managerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  managerPhone: {
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
