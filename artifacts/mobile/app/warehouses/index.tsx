import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_WAREHOUSES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { Warehouse } from "@/types";

const BRAND = "#DC2626";

const SIZE_FILTERS = [
  { id: "all", label: "Toutes tailles" },
  { id: "small", label: "< 300 m²" },
  { id: "medium", label: "300–800 m²" },
  { id: "large", label: "> 800 m²" },
];

const GUINEA_CITIES = ["Toutes", "Conakry", "Kindia", "Kankan", "Labé", "Mamou", "N'Zérékoré"];

function WarehouseCard({
  warehouse,
  onPress,
  onContact,
}: {
  warehouse: Warehouse;
  onPress: () => void;
  onContact: () => void;
}) {
  const colors = useColors();

  const handleWhatsApp = () => {
    const phone = warehouse.ownerPhone.replace(/[\s+]/g, "");
    const msg = encodeURIComponent(
      `Bonjour ${warehouse.ownerName}, je vous contacte via NAFA Warehouses pour l'entrepôt "${warehouse.name}". Je suis intéressé(e) par la location de cet espace.`
    );
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${msg}`).catch(() =>
      Linking.openURL(`https://wa.me/${phone}?text=${msg}`)
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: warehouse.images[0] }}
          style={[styles.cardImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        <View
          style={[
            styles.availabilityBadge,
            { backgroundColor: warehouse.available ? "#DCFCE7" : "#FEE2E2" },
          ]}
        >
          <View
            style={[
              styles.availabilityDot,
              { backgroundColor: warehouse.available ? "#16A34A" : "#DC2626" },
            ]}
          />
          <Text
            style={[
              styles.availabilityText,
              { color: warehouse.available ? "#16A34A" : "#DC2626" },
            ]}
          >
            {warehouse.available ? "Disponible" : "Occupé"}
          </Text>
        </View>
        <View style={styles.surfaceBadge}>
          <Ionicons name="scan-outline" size={11} color="#FFFFFF" />
          <Text style={styles.surfaceBadgeText}>{warehouse.surfaceM2} m²</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.cardTitleRow}>
          <Text style={[styles.warehouseName, { color: colors.foreground }]} numberOfLines={1}>
            {warehouse.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
              {warehouse.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {warehouse.address}, {warehouse.city}
          </Text>
        </View>

        <Text style={[styles.price, { color: BRAND }]}>
          {formatPrice(warehouse.pricePerMonth)}
          <Text style={[styles.perMonth, { color: colors.mutedForeground }]}> / mois</Text>
        </Text>

        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {warehouse.description}
        </Text>

        <View style={styles.featuresRow}>
          {warehouse.features.slice(0, 3).map((f) => (
            <View key={f} style={[styles.featureChip, { backgroundColor: colors.muted }]}>
              <Ionicons name="checkmark" size={10} color={BRAND} />
              <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
            </View>
          ))}
          {warehouse.features.length > 3 && (
            <View style={[styles.featureChip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.featureText, { color: colors.mutedForeground }]}>
                +{warehouse.features.length - 3}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ownerRow}>
          <View style={[styles.ownerAvatar, { backgroundColor: BRAND }]}>
            <Ionicons name="person" size={14} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ownerName, { color: colors.foreground }]}>{warehouse.ownerName}</Text>
            <Text style={[styles.ownerPhone, { color: colors.mutedForeground }]}>{warehouse.ownerPhone}</Text>
          </View>
          <View style={styles.ctaRow}>
            <Pressable
              onPress={handleWhatsApp}
              style={({ pressed }) => [styles.waBtn, { opacity: pressed ? 0.8 : 1 }]}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
              <Text style={styles.waBtnText}>WA</Text>
            </Pressable>
            <Pressable
              onPress={onContact}
              style={({ pressed }) => [styles.callCardBtn, { backgroundColor: BRAND, opacity: pressed ? 0.8 : 1 }]}
            >
              <Ionicons name="call-outline" size={13} color="#FFFFFF" />
              <Text style={styles.callCardBtnText}>Appeler</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function WarehousesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Toutes");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showCityFilter, setShowCityFilter] = useState(false);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = useMemo(() => MOCK_WAREHOUSES.filter((w) => {
    const matchSearch =
      search.length === 0 ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "Toutes" || w.city === city;
    const matchSize =
      sizeFilter === "all" ||
      (sizeFilter === "small" && w.surfaceM2 < 300) ||
      (sizeFilter === "medium" && w.surfaceM2 >= 300 && w.surfaceM2 <= 800) ||
      (sizeFilter === "large" && w.surfaceM2 > 800);
    const matchAvail = !availableOnly || w.available;
    return matchSearch && matchCity && matchSize && matchAvail;
  }), [search, city, sizeFilter, availableOnly]);

  const available = MOCK_WAREHOUSES.filter((w) => w.available);
  const cities = [...new Set(MOCK_WAREHOUSES.map((w) => w.city))];
  const totalSurface = MOCK_WAREHOUSES.reduce((acc, w) => acc + w.surfaceM2, 0);
  const isFiltered = search.length > 0 || city !== "Toutes" || sizeFilter !== "all" || availableOnly;

  const handleContact = (warehouse: Warehouse) => {
    const phone = warehouse.ownerPhone.replace(/\s/g, "");
    Alert.alert(
      `Contacter ${warehouse.ownerName}`,
      `Entrepôt : ${warehouse.name}\nLocalisation : ${warehouse.address}, ${warehouse.city}\nTarif : ${formatPrice(warehouse.pricePerMonth)}/mois`,
      [
        { text: "📞 Appeler", onPress: () => Linking.openURL(`tel:${phone}`) },
        {
          text: "💬 WhatsApp",
          onPress: () => {
            const msg = encodeURIComponent(`Bonjour ${warehouse.ownerName}, je vous contacte via NAFA Warehouses pour l'entrepôt "${warehouse.name}".`);
            Linking.openURL(`whatsapp://send?phone=${phone.replace("+", "")}&text=${msg}`);
          },
        },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  const handleProposeWarehouse = () => {
    Alert.alert(
      "Proposer mon entrepôt",
      "Vous avez un espace de stockage à louer ? Rejoignez NAFA Warehouses et trouvez des locataires fiables rapidement.",
      [
        { text: "Appeler NAFA", onPress: () => Linking.openURL("tel:+224621000001") },
        {
          text: "WhatsApp",
          onPress: () =>
            Linking.openURL("whatsapp://send?phone=224621000001&text=Bonjour, je souhaite proposer mon entrepôt sur NAFA Warehouses."),
        },
        { text: "Fermer", style: "cancel" },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: BRAND }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Warehouses</Text>
          <Text style={styles.headerSub}>Entrepôts & espaces de stockage</Text>
        </View>
        <Ionicons name="cube" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="cube" size={20} color={BRAND} />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{MOCK_WAREHOUSES.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Entrepôts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{available.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Disponibles</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location" size={20} color="#2563EB" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{cities.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Villes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="scan" size={20} color="#F59E0B" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {(totalSurface / 1000).toFixed(1)}k
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>m² total</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Nom, ville, type..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setShowCityFilter(!showCityFilter)}
            style={[
              styles.cityFilterBtn,
              {
                backgroundColor: city !== "Toutes" ? BRAND : colors.muted,
                borderColor: city !== "Toutes" ? BRAND : colors.border,
              },
            ]}
          >
            <Ionicons name="location-outline" size={15} color={city !== "Toutes" ? "#FFFFFF" : colors.mutedForeground} />
            <Text style={[styles.cityFilterText, { color: city !== "Toutes" ? "#FFFFFF" : colors.mutedForeground }]}>
              {city === "Toutes" ? "Ville" : city}
            </Text>
          </Pressable>
        </View>

        {/* City dropdown */}
        {showCityFilter && (
          <View style={[styles.cityDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, padding: 10 }}>
              {GUINEA_CITIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => { setCity(c); setShowCityFilter(false); }}
                  style={[
                    styles.cityChip,
                    city === c ? { backgroundColor: BRAND } : { backgroundColor: colors.muted },
                  ]}
                >
                  <Text style={[styles.cityChipText, { color: city === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Filters row */}
        <View style={styles.filtersRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
            {SIZE_FILTERS.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setSizeFilter(f.id)}
                style={[
                  styles.filterChip,
                  sizeFilter === f.id ? { backgroundColor: BRAND } : { backgroundColor: colors.muted },
                ]}
              >
                <Text style={[styles.filterLabel, { color: sizeFilter === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setAvailableOnly(!availableOnly)}
              style={[
                styles.filterChip,
                availableOnly ? { backgroundColor: "#16A34A" } : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons name="checkmark-circle-outline" size={13} color={availableOnly ? "#FFFFFF" : colors.mutedForeground} />
              <Text style={[styles.filterLabel, { color: availableOnly ? "#FFFFFF" : colors.mutedForeground }]}>
                Disponibles
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* "Proposer un entrepôt" banner */}
        {!isFiltered && (
          <Pressable
            onPress={handleProposeWarehouse}
            style={[styles.proposeBanner, { backgroundColor: BRAND + "10", borderColor: BRAND + "35" }]}
          >
            <View style={[styles.proposeIcon, { backgroundColor: BRAND }]}>
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.proposeTitle, { color: BRAND }]}>Vous avez un entrepôt ?</Text>
              <Text style={[styles.proposeSub, { color: colors.mutedForeground }]}>
                Listez votre espace et trouvez des locataires fiables
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BRAND} />
          </Pressable>
        )}

        {/* Available section */}
        {!isFiltered && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.availDot, { backgroundColor: "#16A34A" }]} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Disponibles maintenant</Text>
              </View>
              <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
                {available.length}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 14 }}>
              {available.map((w) => (
                <WarehouseCard
                  key={w.id}
                  warehouse={w}
                  onPress={() => router.push(`/warehouses/${w.id}` as any)}
                  onContact={() => handleContact(w)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Filtered / All results */}
        {isFiltered && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Résultats</Text>
              <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
                {filtered.length} entrepôt{filtered.length > 1 ? "s" : ""}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 14 }}>
              {filtered.map((w) => (
                <WarehouseCard
                  key={w.id}
                  warehouse={w}
                  onPress={() => router.push(`/warehouses/${w.id}` as any)}
                  onContact={() => handleContact(w)}
                />
              ))}
              {filtered.length === 0 && (
                <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="cube-outline" size={44} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun entrepôt trouvé</Text>
                  <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                    Modifiez vos critères de recherche
                  </Text>
                  <Pressable
                    onPress={() => { setSearch(""); setCity("Toutes"); setSizeFilter("all"); setAvailableOnly(false); }}
                    style={[styles.resetBtn, { backgroundColor: BRAND }]}
                  >
                    <Text style={styles.resetBtnText}>Réinitialiser</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Soon available */}
        {!isFiltered && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.availDot, { backgroundColor: "#F59E0B" }]} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Bientôt disponibles</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 16, gap: 14 }}>
              {MOCK_WAREHOUSES.filter((w) => !w.available).map((w) => (
                <WarehouseCard
                  key={w.id}
                  warehouse={w}
                  onPress={() => router.push(`/warehouses/${w.id}` as any)}
                  onContact={() => handleContact(w)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  statCard: { flex: 1, alignItems: "center", gap: 3, borderWidth: 1, borderRadius: 12, paddingVertical: 12 },
  statNum: { fontSize: 17, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", gap: 10 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  cityFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cityFilterText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cityDropdown: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cityChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  cityChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  filtersRow: { paddingLeft: 16, marginBottom: 12 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  proposeBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  proposeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  proposeTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  proposeSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderWidth: 1, overflow: "hidden" },
  cardImage: { width: "100%", height: 185 },
  availabilityBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  availabilityDot: { width: 7, height: 7, borderRadius: 4 },
  availabilityText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  surfaceBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  surfaceBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  cardInfo: { padding: 14, gap: 9 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  warehouseName: { fontSize: 16, fontFamily: "Inter_700Bold", flex: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  price: { fontSize: 18, fontFamily: "Inter_700Bold" },
  perMonth: { fontSize: 13, fontFamily: "Inter_400Regular" },
  description: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  featuresRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featureText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ownerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  ownerAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ownerName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  ownerPhone: { fontSize: 11, fontFamily: "Inter_400Regular" },
  ctaRow: { flexDirection: "row", gap: 8 },
  waBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#25D366",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
  },
  waBtnText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  callCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  callCardBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  resetBtn: { marginTop: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  resetBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});
