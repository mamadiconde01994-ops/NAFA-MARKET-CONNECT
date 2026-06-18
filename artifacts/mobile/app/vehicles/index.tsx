import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
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

import { MOCK_VEHICLES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";
import type { Vehicle, VehicleType } from "@/types";

const TYPE_FILTERS: { id: VehicleType | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Tout", icon: "grid-outline" },
  { id: "car", label: "Voitures", icon: "car-outline" },
  { id: "motorcycle", label: "Motos", icon: "bicycle-outline" },
  { id: "truck", label: "Camions", icon: "car-sport-outline" },
  { id: "van", label: "Minibus", icon: "bus-outline" },
  { id: "parts", label: "Pièces", icon: "construct-outline" },
];

const CONDITION_COLORS: Record<string, string> = {
  new: "#16A34A",
  used: "#F59E0B",
  refurbished: "#2563EB",
};
const CONDITION_LABELS: Record<string, string> = {
  new: "Neuf",
  used: "Occasion",
  refurbished: "Reconditionné",
};

function VehicleCard({ vehicle, onPress }: { vehicle: Vehicle; onPress?: () => void }) {
  const colors = useColors();
  const condColor = CONDITION_COLORS[vehicle.condition] ?? "#64748B";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: vehicle.images[0] }}
          style={[styles.cardImg, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
          contentFit="cover"
          transition={300}
        />
        <View style={[styles.condBadge, { backgroundColor: condColor + "22", borderColor: condColor + "55" }]}>
          <Text style={[styles.condText, { color: condColor }]}>
            {CONDITION_LABELS[vehicle.condition]}
          </Text>
        </View>
        {vehicle.featured && (
          <View style={[styles.featBadge, { backgroundColor: "#475569" }]}>
            <Text style={styles.featText}>⭐ Vedette</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.vehicleTitle, { color: colors.foreground }]} numberOfLines={2}>
          {vehicle.title}
        </Text>
        <View style={styles.metaRow}>
          {vehicle.mileage !== undefined && (
            <View style={styles.metaChip}>
              <Ionicons name="speedometer-outline" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {vehicle.mileage.toLocaleString()} km
              </Text>
            </View>
          )}
          {vehicle.fuel && (
            <View style={styles.metaChip}>
              <Ionicons name="flame-outline" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {vehicle.fuel === "diesel" ? "Diesel" : vehicle.fuel === "petrol" ? "Essence" : vehicle.fuel === "electric" ? "Électrique" : "Hybride"}
              </Text>
            </View>
          )}
          <View style={styles.metaChip}>
            <Ionicons name="calendar-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{vehicle.year}</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: "#475569" }]}>
            {formatPrice(vehicle.price)}
            {vehicle.priceType === "rent" && (
              <Text style={[styles.priceType, { color: colors.mutedForeground }]}> /jour</Text>
            )}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.locationText, { color: colors.mutedForeground }]}>{vehicle.city}</Text>
          </View>
        </View>
        <View style={styles.sellerRow}>
          <View style={[styles.sellerAvatar, { backgroundColor: "#475569" }]}>
            <Ionicons name="person" size={13} color="#FFFFFF" />
          </View>
          <Text style={[styles.sellerName, { color: colors.foreground }]}>{vehicle.sellerName}</Text>
          <Pressable onPress={onPress} hitSlop={8} style={[styles.contactBtn, { backgroundColor: "#475569" + "18", borderColor: "#475569" + "40" }]}>
            <Ionicons name="call-outline" size={13} color="#475569" />
            <Text style={[styles.contactText, { color: "#475569" }]}>Appeler</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function VehiclesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<VehicleType | "all">("all");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleContact = (vehicle: Vehicle) => {
    const phone = vehicle.sellerPhone.replace(/\s/g, "");
    Alert.alert(
      "Contacter le vendeur",
      `Appelez ${vehicle.sellerName} au ${vehicle.sellerPhone} pour en savoir plus sur ce véhicule.`,
      [
        {
          text: "Appeler",
          onPress: () => Linking.openURL(`tel:${phone}`),
        },
        {
          text: "Fermer",
          style: "cancel",
        },
      ]
    );
  };

  const filtered = MOCK_VEHICLES.filter((v) => {
    const matchSearch =
      search.length === 0 ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || v.type === type;
    return matchSearch && matchType;
  });

  const featured = MOCK_VEHICLES.filter((v) => v.featured);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: "#475569" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>NAFA Véhicules</Text>
          <Text style={styles.headerSub}>Voitures, motos, camions</Text>
        </View>
        <Ionicons name="car" size={24} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad }}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="car" size={22} color="#475569" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>{MOCK_VEHICLES.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Annonces</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="bicycle" size={22} color="#475569" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {MOCK_VEHICLES.filter((v) => v.type === "motorcycle").length}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Motos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location" size={22} color="#475569" />
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {[...new Set(MOCK_VEHICLES.map((v) => v.city))].length}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Villes</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Marque, modèle, ville..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Type filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {TYPE_FILTERS.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setType(f.id)}
              style={[
                styles.filterChip,
                type === f.id ? { backgroundColor: "#475569" } : { backgroundColor: colors.muted },
              ]}
            >
              <Ionicons name={f.icon} size={14} color={type === f.id ? "#FFFFFF" : colors.mutedForeground} />
              <Text style={[styles.filterLabel, { color: type === f.id ? "#FFFFFF" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured */}
        {type === "all" && search.length === 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>⭐ Véhicules vedettes</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {featured.map((v) => (
                <View key={v.id} style={{ width: 280 }}>
                  <VehicleCard vehicle={v} onPress={() => handleContact(v)} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All results */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {type === "all" ? "Toutes les annonces" : TYPE_FILTERS.find((f) => f.id === type)?.label}
            </Text>
            <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onPress={() => handleContact(v)} />
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="car-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Aucun véhicule trouvé
                </Text>
              </View>
            )}
          </View>
        </View>
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
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  statCard: { flex: 1, alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 12, paddingVertical: 14 },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular" },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  filterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 4, marginBottom: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderWidth: 1, overflow: "hidden" },
  cardImg: { width: "100%", height: 180 },
  condBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  condText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  featBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  cardBody: { padding: 14, gap: 8 },
  vehicleTitle: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 20 },
  metaRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 18, fontFamily: "Inter_700Bold" },
  priceType: { fontSize: 13, fontFamily: "Inter_400Regular" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  sellerAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sellerName: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  contactText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
