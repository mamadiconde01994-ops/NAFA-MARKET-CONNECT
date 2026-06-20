import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { CATEGORIES, MOCK_PRODUCTS } from "@/constants/mockData";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { formatDate, formatPrice, formatRole, formatUnit } from "@/lib/format";

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const cat = product ? CATEGORIES.find((c) => c.id === product.category) : null;
  const similarProducts = product
    ? MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5)
    : [];

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!product) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Produit introuvable
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_500Medium" }}>
            Retour
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleContact = () => {
    router.push(
      `/chat?name=${encodeURIComponent(product?.sellerName ?? "Vendeur")}&context=${encodeURIComponent(product?.name ?? "")}` as any,
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez vous connecter pour commander ce produit.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se connecter",
            onPress: () => router.push("/(auth)/login" as any),
          },
        ],
      );
      return;
    }

    addItem(product, qty);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      >
        {/* Image */}
        <View>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                top: Platform.OS === "web" ? 67 + 16 : insets.top + 16,
                backgroundColor: colors.background + "E0",
                borderRadius: 22,
              },
            ]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </Pressable>

          {/* Featured badge */}
          {product.featured && (
            <View
              style={[
                styles.featuredBadge,
                {
                  top: Platform.OS === "web" ? 67 + 16 : insets.top + 16,
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                },
              ]}
            >
              <Text style={styles.featuredText}>Vedette</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Category + rating */}
          <View style={styles.topRow}>
            {cat && (
              <Badge label={cat.name} variant="outline" />
            )}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>
                {product.rating.toFixed(1)}
              </Text>
              <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                ({product.reviewCount} avis)
              </Text>
            </View>
          </View>

          {/* Name & price */}
          <Text style={[styles.name, { color: colors.foreground }]}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.secondary }]}>
              {formatPrice(product.price)}
            </Text>
            <Text style={[styles.unit, { color: colors.mutedForeground }]}>
              {formatUnit(product.unit)}
            </Text>
          </View>

          {/* Availability */}
          <View style={styles.availRow}>
            <Ionicons
              name="checkmark-circle"
              size={15}
              color={colors.success}
            />
            <Text style={[styles.availText, { color: colors.mutedForeground }]}>
              {product.available} {product.unit} disponibles
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Seller */}
          <View style={styles.sellerSection}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Vendeur
            </Text>
            <View
              style={[
                styles.sellerCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <UserAvatar name={product.sellerName} size={44} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.sellerName, { color: colors.foreground }]}>
                  {product.sellerName}
                </Text>
                <View style={styles.sellerMeta}>
                  <Badge
                    label={formatRole(product.sellerRole)}
                    variant="outline"
                    small
                  />
                  <View style={styles.locRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={colors.mutedForeground}
                    />
                    <Text
                      style={[styles.locText, { color: colors.mutedForeground }]}
                    >
                      {product.location}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Description */}
          <View style={{ gap: 8 }}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.foreground }]}>
              {product.description}
            </Text>
          </View>

          {/* Date */}
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            Publié le {formatDate(product.createdAt)}
          </Text>

          {/* Similar products */}
          {similarProducts.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={{ gap: 10 }}>
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                  PRODUITS SIMILAIRES
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingRight: 4 }}
                >
                  {similarProducts.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => router.push(`/product/${p.id}` as any)}
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
                        source={{ uri: p.images[0] }}
                        style={styles.similarImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.similarInfo}>
                        <Text
                          style={[styles.similarName, { color: colors.foreground }]}
                          numberOfLines={2}
                        >
                          {p.name}
                        </Text>
                        <Text style={[styles.similarPrice, { color: colors.secondary }]}>
                          {formatPrice(p.price)}
                        </Text>
                        <Text style={[styles.similarUnit, { color: colors.mutedForeground }]}>
                          {formatUnit(p.unit)}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 12,
          },
        ]}
      >
        {/* Qty selector */}
        <View
          style={[
            styles.qtySelector,
            {
              backgroundColor: colors.muted,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Pressable
            onPress={() => setQty(Math.max(1, qty - 1))}
            style={styles.qtyBtn}
            hitSlop={8}
          >
            <Ionicons name="remove" size={18} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.qtyText, { color: colors.foreground }]}>
            {qty}
          </Text>
          <Pressable
            onPress={() => setQty(Math.min(product.available, qty + 1))}
            style={styles.qtyBtn}
            hitSlop={8}
          >
            <Ionicons name="add" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Contact seller button */}
        <Pressable
          onPress={handleContact}
          style={({ pressed }) => [
            styles.contactBtn,
            { backgroundColor: colors.muted, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Button
            label={
              added
                ? "Ajouté au panier !"
                : `Commander · ${formatPrice(product.price * qty)}`
            }
            onPress={handleAddToCart}
            variant={added ? "outline" : "primary"}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  image: { width: "100%", height: 360 },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredBadge: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featuredText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  content: { padding: 20, gap: 14 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontSize: 24, fontFamily: "Inter_700Bold" },
  unit: { fontSize: 14, fontFamily: "Inter_400Regular" },
  availRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  availText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  divider: { height: 1 },
  sellerSection: { gap: 10 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  sellerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sellerMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  date: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  qtySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  qtyBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  contactBtn: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  qtyText: { fontSize: 17, fontFamily: "Inter_700Bold", width: 28, textAlign: "center" },
  similarCard: { width: 130, borderWidth: 1, overflow: "hidden" },
  similarImage: { width: 130, height: 100 },
  similarInfo: { padding: 8, gap: 3 },
  similarName: { fontSize: 12, fontFamily: "Inter_600SemiBold", lineHeight: 17 },
  similarPrice: { fontSize: 13, fontFamily: "Inter_700Bold" },
  similarUnit: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
