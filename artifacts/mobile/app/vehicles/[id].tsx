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
import { useAuth } from "@/context/AuthContext";

import { MOCK_VEHICLES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { VehicleType } from "@/types";

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: "Voiture",
  motorcycle: "Moto",
  truck: "Camion",
  van: "Minibus",
  parts: "Pièces",
};

const CONDITION_COLORS = {
  new: { label: "Neuf", color: "#10B981" },
  used: { label: "Occasion", color: "#F59E0B" },
  refurbished: { label: "Reconditionné", color: "#3B82F6" },
};

const FUEL_TYPES: Record<string, string> = {
  petrol: "Essence",
  diesel: "Diesel",
  electric: "Électrique",
  hybrid: "Hybride",
};

export default function VehicleDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicle = MOCK_VEHICLES.find((v) => v.id === id);
  const similarVehicles = vehicle
    ? MOCK_VEHICLES.filter(
        (v) =>
          v.id !== vehicle.id &&
          (v.type === vehicle.type || v.city === vehicle.city)
      ).slice(0, 4)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleContactSeller = () => {
    if (!vehicle) return;
    const phone = vehicle.sellerPhone.replace(/\s/g, "");
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessage = () => {
    if (!vehicle) return;
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez vous connecter pour envoyer un message au vendeur.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => router.push("/(auth)/login" as any) },
        ],
      );
      return;
    }
    const phone = vehicle.sellerPhone.replace(/\s/g, "");
    Linking.openURL(`sms:${phone}?body=Bonjour, je suis intéressé par ce véhicule.`);
  };

  if (!vehicle) {
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
        <Text style={{ color: colors.foreground }}>Véhicule non trouvé</Text>
      </View>
    );
  }

  const conditionInfo = CONDITION_COLORS[vehicle.condition];
  const priceLabel = vehicle.priceType === "rent"
    ? `${formatPrice(vehicle.price)} / jour`
    : formatPrice(vehicle.price);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: vehicle.images[0] }}
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
              styles.conditionBadge,
              {
                top: topPad + 12,
                backgroundColor: conditionInfo.color,
              },
            ]}
          >
            <Text style={styles.conditionBadgeText}>
              {conditionInfo.label}
            </Text>
          </View>
          {vehicle.featured && (
            <View
              style={[
                styles.featuredBadge,
                { top: topPad + 52, backgroundColor: "#F59E0B" },
              ]}
            >
              <Ionicons name="star" size={14} color="#FFFFFF" />
              <Text style={styles.featuredText}>Vedette</Text>
            </View>
          )}
        </View>

        {/* Main info */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.vehicleTitle, { color: colors.foreground }]}>
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text
                style={[styles.vehicleYear, { color: colors.mutedForeground }]}
              >
                {vehicle.year}
              </Text>
            </View>
          </View>

          <Text style={[styles.price, { color: colors.primary }]}>
            {priceLabel}
          </Text>

          {/* Specs grid */}
          <View style={styles.specsGrid}>
            {vehicle.type && (
              <View
                style={[
                  styles.specBox,
                  { backgroundColor: colors.muted, borderRadius: colors.radius },
                ]}
              >
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                  Type
                </Text>
                <Text style={[styles.specValue, { color: colors.foreground }]}>
                  {VEHICLE_TYPE_LABELS[vehicle.type]}
                </Text>
              </View>
            )}
            {vehicle.mileage != null && (
              <View
                style={[
                  styles.specBox,
                  { backgroundColor: colors.muted, borderRadius: colors.radius },
                ]}
              >
                <Ionicons name="speedometer-outline" size={18} color={colors.primary} />
                <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                  Kilométrage
                </Text>
                <Text style={[styles.specValue, { color: colors.foreground }]}>
                  {vehicle.mileage.toLocaleString()} km
                </Text>
              </View>
            )}
            {vehicle.fuel && (
              <View
                style={[
                  styles.specBox,
                  { backgroundColor: colors.muted, borderRadius: colors.radius },
                ]}
              >
                <Ionicons
                  name="flame-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                  Carburant
                </Text>
                <Text style={[styles.specValue, { color: colors.foreground }]}>
                  {FUEL_TYPES[vehicle.fuel] || vehicle.fuel}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.specBox,
                { backgroundColor: colors.muted, borderRadius: colors.radius },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
                Localisation
              </Text>
              <Text style={[styles.specValue, { color: colors.foreground }]}>
                {vehicle.city}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
          >
            {vehicle.description}
          </Text>
        </View>

        {/* Seller info */}
        <View
          style={[
            styles.sellerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sellerTitle, { color: colors.mutedForeground }]}>
            VENDEUR
          </Text>
          <View style={styles.sellerRow}>
            <View
              style={[
                styles.sellerAvatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sellerName, { color: colors.foreground }]}>
                {vehicle.sellerName}
              </Text>
              {vehicle.rating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text
                    style={[
                      styles.ratingText,
                      { color: colors.foreground },
                    ]}
                  >
                    {vehicle.rating.toFixed(1)} avis
                  </Text>
                </View>
              )}
              <Text style={[styles.sellerPhone, { color: colors.mutedForeground }]}>
                {vehicle.sellerPhone}
              </Text>
            </View>
          </View>
        </View>

        {/* Similar vehicles */}
        {similarVehicles.length > 0 && (
          <View style={[styles.similarSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.similarTitle, { color: colors.foreground }]}>
              Véhicules similaires
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarList}
            >
              {similarVehicles.map((v) => (
                <Pressable
                  key={v.id}
                  onPress={() => router.push(`/vehicles/${v.id}` as any)}
                  style={[
                    styles.similarCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: v.images[0] }}
                    style={[
                      styles.similarImg,
                      {
                        borderTopLeftRadius: colors.radius,
                        borderTopRightRadius: colors.radius,
                      },
                    ]}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.similarInfo}>
                    <Text
                      style={[
                        styles.similarName,
                        { color: colors.foreground },
                      ]}
                      numberOfLines={2}
                    >
                      {v.brand} {v.model}
                    </Text>
                    <Text style={[styles.similarPrice, { color: colors.primary }]}>
                      {formatPrice(v.price)}
                    </Text>
                    <Text
                      style={[
                        styles.similarCity,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {v.year}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
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
          onPress={handleMessage}
          style={[
            styles.actionBtn,
            styles.secondaryBtn,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>
            Message
          </Text>
        </Pressable>
        <Pressable
          onPress={handleContactSeller}
          style={[
            styles.actionBtn,
            styles.primaryBtn,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
            Contacter
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
  conditionBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredBadge: {
    position: "absolute",
    top: 52,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredText: {
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  vehicleYear: {
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 8,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
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
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  sellerCard: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sellerTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  sellerPhone: {
    fontSize: 12,
    marginTop: 4,
  },
  similarSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  similarList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  similarCard: {
    width: 120,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  similarImg: {
    width: "100%",
    height: 80,
  },
  similarInfo: {
    padding: 8,
  },
  similarName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  similarPrice: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  similarCity: {
    fontSize: 11,
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
