import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import { MOCK_PRODUCTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { ProductCategory } from "@/types";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vegetables: "Légumes",
  fruits: "Fruits",
  grains: "Céréales",
  livestock: "Bétail",
  fish: "Poissons",
  dairy: "Produits laitiers",
  processed: "Produits transformés",
};

const CATEGORY_ICONS: Record<ProductCategory, keyof typeof Ionicons.glyphMap> = {
  vegetables: "leaf-outline",
  fruits: "nutrition-outline",
  grains: "cube-outline",
  livestock: "paw-outline",
  fish: "water-outline",
  dairy: "flask-outline",
  processed: "cog-outline",
};

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

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const similarProducts = product
    ? MOCK_PRODUCTS.filter(
        (p) => p.id !== product.id && p.category === product.category
      ).slice(0, 4)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleCallSeller = () => {
    if (!product) return;
    // In real app, fetch seller phone from API
    Linking.openURL("tel:+224620000000");
  };

  const handleMessage = () => {
    if (!product) return;
    router.push(
      `/chat?name=${encodeURIComponent(product.sellerName)}&context=${encodeURIComponent(product.name)}` as any
    );
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert(`${quantity} ${product?.unit}(s) de ${product?.name} ajouté(s) au panier`);
  };

  if (!product) {
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
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground, marginTop: 12 }]}>
          Produit non trouvé
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero section */}
        <View style={{ position: "relative" }}>
          <View
            style={[
              styles.heroImage,
              {
                marginTop: topPad,
                backgroundColor: "#16A34A20",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons
              name={CATEGORY_ICONS[product.category]}
              size={80}
              color="#16A34A"
            />
          </View>

          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                top: topPad + 12,
                backgroundColor: "rgba(0,0,0,0.4)",
              },
            ]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <View
            style={[
              styles.categoryBadge,
              {
                top: topPad + 12,
                backgroundColor: "#16A34A",
              },
            ]}
          >
            <Ionicons
              name={CATEGORY_ICONS[product.category]}
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.categoryBadgeText}>
              {CATEGORY_LABELS[product.category]}
            </Text>
          </View>

          {product.featured && (
            <View
              style={[
                styles.featuredBadge,
                {
                  top: topPad + 12,
                  right: 64,
                  backgroundColor: "#F59E0B",
                },
              ]}
            >
              <Text style={styles.featuredBadgeText}>⭐ Vedette</Text>
            </View>
          )}
        </View>

        {/* Product info */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.productTitle,
                { color: colors.foreground },
              ]}
              numberOfLines={2}
            >
              {product.name}
            </Text>
            {product.featured && (
              <Ionicons name="star" size={20} color="#F59E0B" />
            )}
          </View>

          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
          >
            {product.description}
          </Text>

          {/* Rating and reviews */}
          <View style={styles.ratingSection}>
            <StarRow rating={product.rating} size={16} />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {product.rating.toFixed(1)} ({product.reviewCount} avis)
            </Text>
          </View>

          {/* Price and availability */}
          <View
            style={[
              styles.priceSection,
              { backgroundColor: colors.muted, borderRadius: colors.radius - 2 },
            ]}
          >
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                Prix:
              </Text>
              <Text style={[styles.price, { color: "#16A34A" }]}>
                {formatPrice(product.price)} GNF
              </Text>
              <Text style={[styles.unit, { color: colors.mutedForeground }]}>
                /{product.unit}
              </Text>
            </View>

            <View style={styles.availabilityRow}>
              <Ionicons
                name={product.available > 0 ? "checkmark-circle" : "close-circle"}
                size={16}
                color={product.available > 0 ? "#16A34A" : "#EF4444"}
              />
              <Text
                style={[
                  styles.availabilityText,
                  {
                    color: product.available > 0 ? "#16A34A" : "#EF4444",
                  },
                ]}
              >
                {product.available > 0
                  ? `${product.available} ${product.unit}(s) disponible(s)`
                  : "Rupture de stock"}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#16A34A" />
            <Text style={[styles.locationText, { color: colors.foreground }]}>
              {product.location}
            </Text>
          </View>
        </View>

        {/* Seller info */}
        <View
          style={[
            styles.sellerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.sectionTitle, { color: colors.foreground }]}
          >
            Vendeur
          </Text>

          <View style={styles.sellerInfo}>
            <View
              style={[
                styles.sellerAvatar,
                { backgroundColor: "#16A34A20" },
              ]}
            >
              <Ionicons name="person-outline" size={24} color="#16A34A" />
            </View>

            <View style={styles.sellerDetails}>
              <Text
                style={[styles.sellerName, { color: colors.foreground }]}
              >
                {product.sellerName}
              </Text>
              <Text
                style={[
                  styles.sellerRole,
                  { color: colors.mutedForeground },
                ]}
              >
                {product.sellerRole === "farmer"
                  ? "Agriculteur"
                  : product.sellerRole === "trader"
                  ? "Commerçant"
                  : "Fournisseur"}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleCallSeller}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: "#16A34A",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="call-outline" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Appeler</Text>
            </Pressable>

            <Pressable
              onPress={handleMessage}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: colors.muted,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.foreground}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  { color: colors.foreground },
                ]}
              >
                Message
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quantity selector */}
        {product.available > 0 && (
          <View
            style={[
              styles.quantityCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: colors.foreground }]}
            >
              Quantité
            </Text>

            <View style={styles.quantitySelector}>
              <Pressable
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={({ pressed }) => [
                  styles.quantityBtn,
                  { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="remove" size={18} color={colors.foreground} />
              </Pressable>

              <Text
                style={[
                  styles.quantityValue,
                  { color: colors.foreground },
                ]}
              >
                {quantity} {product.unit}
              </Text>

              <Pressable
                onPress={() =>
                  setQuantity(Math.min(product.available, quantity + 1))
                }
                style={({ pressed }) => [
                  styles.quantityBtn,
                  { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="add" size={18} color={colors.foreground} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Add to cart button */}
        {product.available > 0 && (
          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.addToCartBtn,
              {
                backgroundColor: "#16A34A",
                opacity: pressed ? 0.8 : 1,
                marginHorizontal: 16,
                marginVertical: 16,
              },
            ]}
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <Text style={styles.addToCartBtnText}>
              Ajouter au panier ({quantity})
            </Text>
          </Pressable>
        )}

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <View
            style={[
              styles.similarSection,
              { backgroundColor: colors.muted },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.foreground, marginBottom: 12 },
              ]}
            >
              Produits similaires
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarList}
            >
              {similarProducts.map((sim) => (
                <Pressable
                  key={sim.id}
                  onPress={() =>
                    router.push(`/agriculture/${sim.id}` as any)
                  }
                  style={({ pressed }) => [
                    styles.similarCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.similarImage,
                      { backgroundColor: "#16A34A20" },
                    ]}
                  >
                    <Ionicons
                      name={
                        CATEGORY_ICONS[sim.category]
                      }
                      size={32}
                      color="#16A34A"
                    />
                  </View>

                  <Text
                    style={[
                      styles.similarName,
                      { color: colors.foreground },
                    ]}
                    numberOfLines={2}
                  >
                    {sim.name}
                  </Text>

                  <Text
                    style={[
                      styles.similarPrice,
                      { color: "#16A34A" },
                    ]}
                  >
                    {formatPrice(sim.price)} GNF
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: "600",
  },
  heroImage: {
    height: 280,
    backgroundColor: "#F0F0F0",
  },
  backBtn: {
    position: "absolute",
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredBadge: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "500",
  },
  priceSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
  },
  unit: {
    fontSize: 12,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "500",
  },
  sellerCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  sellerRole: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  quantityCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "center",
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addToCartBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  similarSection: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  similarList: {
    gap: 12,
  },
  similarCard: {
    width: 140,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  similarImage: {
    height: 80,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  similarName: {
    fontSize: 12,
    fontWeight: "600",
  },
  similarPrice: {
    fontSize: 13,
    fontWeight: "700",
  },
});
