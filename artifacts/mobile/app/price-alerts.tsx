import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePriceAlerts, type PriceAlert } from "@/context/PriceAlertsContext";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / (24 * 3600 * 1000));
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return "Hier";
  return `Il y a ${d} jours`;
}

function AlertCard({
  alert,
  colors,
  onSimulate,
  onToggle,
  onDelete,
}: {
  alert: PriceAlert;
  colors: ReturnType<typeof useColors>;
  onSimulate: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const drop = Math.round(((alert.priceAtAlert - alert.targetPrice) / alert.priceAtAlert) * 100);

  return (
    <View
      style={[
        styles.alertCard,
        {
          backgroundColor: colors.card,
          borderColor: alert.triggered
            ? "#16A34A"
            : alert.active
            ? colors.border
            : colors.border,
          borderRadius: colors.radius,
          opacity: alert.active ? 1 : 0.6,
        },
      ]}
    >
      {/* Status bar */}
      {alert.triggered && (
        <View style={[styles.triggeredBar, { backgroundColor: "#16A34A", borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}>
          <Ionicons name="checkmark-circle" size={13} color="#fff" />
          <Text style={styles.triggeredText}>Prix atteint — alerte déclenchée</Text>
        </View>
      )}

      <View style={styles.cardInner}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={[styles.productIcon, { backgroundColor: BRAND_LIGHT + "20" }]}>
            <Ionicons name="leaf" size={18} color={BRAND_ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
              {alert.productName}
            </Text>
            <Text style={[styles.marketLabel, { color: colors.mutedForeground }]}>
              {alert.market} · {relativeDate(alert.createdAt)}
            </Text>
          </View>
          <Switch
            value={alert.active}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: BRAND_ACCENT }}
            thumbColor="#fff"
          />
        </View>

        {/* Price comparison */}
        <View style={[styles.priceRow, { backgroundColor: colors.background, borderRadius: 10 }]}>
          <View style={styles.priceBox}>
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Prix actuel</Text>
            <Text style={[styles.priceValue, { color: colors.foreground }]}>
              {formatPrice(alert.priceAtAlert)}
            </Text>
            <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>GNF/{alert.unit}</Text>
          </View>

          <View style={styles.arrowWrap}>
            <Ionicons name="arrow-forward" size={16} color={BRAND_ACCENT} />
            <Text style={[styles.dropBadge, { color: "#16A34A" }]}>−{drop}%</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Ma cible</Text>
            <Text style={[styles.priceValue, { color: BRAND_ACCENT, fontFamily: "Inter_700Bold" }]}>
              {formatPrice(alert.targetPrice)}
            </Text>
            <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>GNF/{alert.unit}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          {!alert.triggered && alert.active && (
            <Pressable
              onPress={onSimulate}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: BRAND_LIGHT + "18", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="flash" size={13} color={BRAND_ACCENT} />
              <Text style={[styles.actionBtnText, { color: BRAND_ACCENT }]}>Simuler baisse</Text>
            </Pressable>
          )}
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: "#DC262618", marginLeft: "auto", opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="trash-outline" size={13} color="#DC2626" />
            <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>Supprimer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function PriceAlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { alerts, removeAlert, toggleAlert, simulateDrop } = usePriceAlerts();
  const [filter, setFilter] = useState<"all" | "active" | "triggered" | "paused">("all");

  const topPad = Platform.OS === "web" ? 67 + 12 : insets.top + 12;

  const filtered = alerts.filter((a) => {
    if (filter === "active") return a.active && !a.triggered;
    if (filter === "triggered") return a.triggered;
    if (filter === "paused") return !a.active;
    return true;
  });

  const activeCount = alerts.filter((a) => a.active && !a.triggered).length;
  const triggeredCount = alerts.filter((a) => a.triggered).length;
  const pausedCount = alerts.filter((a) => !a.active).length;

  const handleDelete = (id: string) => {
    Alert.alert(
      "Supprimer l'alerte",
      "Cette alerte sera définitivement supprimée.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => removeAlert(id) },
      ]
    );
  };

  const FILTERS: { id: typeof filter; label: string; count: number }[] = [
    { id: "all", label: "Toutes", count: alerts.length },
    { id: "active", label: "Actives", count: activeCount },
    { id: "triggered", label: "Déclenchées", count: triggeredCount },
    { id: "paused", label: "En pause", count: pausedCount },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.header, { paddingTop: topPad }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Alertes de prix</Text>
            <Text style={styles.headerSub}>
              {activeCount} active{activeCount !== 1 ? "s" : ""} · Notifié dès que le prix baisse
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/index" as any)}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View
        style={[styles.statsRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: BRAND_ACCENT }]}>{activeCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Actives</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#16A34A" }]}>{triggeredCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Déclenchées</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.mutedForeground }]}>{pausedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>En pause</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? BRAND_MID : colors.card,
                  borderColor: active ? BRAND_ACCENT : colors.border,
                  borderRadius: 20,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: active ? "#fff" : colors.foreground },
                ]}
              >
                {f.label}
              </Text>
              {f.count > 0 && (
                <View
                  style={[
                    styles.filterBadge,
                    { backgroundColor: active ? BRAND_ACCENT + "44" : colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      { color: active ? "#fff" : colors.mutedForeground },
                    ]}
                  >
                    {f.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: (Platform.OS === "web" ? 34 + 84 : insets.bottom + 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: BRAND_LIGHT + "18" }]}>
              <Ionicons name="notifications-off-outline" size={40} color={BRAND_ACCENT} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Aucune alerte{filter !== "all" ? " dans cette catégorie" : ""}
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Appuyez sur 🔔 dans les cartes de prix de marché pour créer votre première alerte.
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.emptyBtn,
                { backgroundColor: BRAND_MID, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.emptyBtnText}>Voir les prix du marché</Text>
            </Pressable>
          </View>
        ) : (
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              colors={colors}
              onSimulate={() => simulateDrop(alert.id)}
              onToggle={() => toggleAlert(alert.id)}
              onDelete={() => handleDelete(alert.id)}
            />
          ))
        )}

        {/* Info banner */}
        {alerts.length > 0 && (
          <View
            style={[
              styles.infoBanner,
              { backgroundColor: BRAND_LIGHT + "14", borderColor: BRAND_ACCENT + "44", borderRadius: colors.radius },
            ]}
          >
            <Ionicons name="information-circle-outline" size={18} color={BRAND_ACCENT} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Le bouton "Simuler baisse" déclenche une vraie notification pour tester le système.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 2 },

  statsRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 36 },

  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: "row" },
  filterChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  filterBadge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  filterBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  listContent: { padding: 16, gap: 12 },

  alertCard: { borderWidth: 1, overflow: "hidden" },
  triggeredBar: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  triggeredText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },
  cardInner: { padding: 14, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  productIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  productName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  marketLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  priceRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, paddingHorizontal: 10,
  },
  priceBox: { flex: 1, alignItems: "center" },
  priceLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 3 },
  priceValue: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  priceUnit: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  arrowWrap: { alignItems: "center", gap: 4, paddingHorizontal: 8 },
  dropBadge: { fontSize: 12, fontFamily: "Inter_700Bold" },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8,
  },
  actionBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  emptyState: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 24 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 10, lineHeight: 21 },
  emptyBtn: {
    marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },

  infoBanner: {
    flexDirection: "row", gap: 10, alignItems: "flex-start",
    padding: 14, borderWidth: 1, marginTop: 4,
  },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
});
