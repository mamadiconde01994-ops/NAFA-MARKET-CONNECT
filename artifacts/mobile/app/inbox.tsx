import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMessages, type Conversation } from "@/context/MessagesContext";
import { useColors } from "@/hooks/useColors";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  agriculture: "leaf-outline",
  "real-estate": "home-outline",
  services: "construct-outline",
  logistics: "cube-outline",
  restaurants: "restaurant-outline",
  default: "chatbubble-outline",
};

const CATEGORY_COLORS: Record<string, string> = {
  agriculture: "#16A34A",
  "real-estate": "#2563EB",
  services: "#7C3AED",
  logistics: "#EA580C",
  restaurants: "#F59E0B",
  default: BRAND_ACCENT,
};

const ROLE_LABELS: Record<string, string> = {
  farmer: "Agriculteur",
  trader: "Commerçant",
  warehouse: "Entrepôt",
  restaurant: "Restaurant",
  customer: "Client",
  partner: "Partenaire",
  "business-ambassador": "Ambassadeur",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const H = 3600 * 1000;
  const D = 24 * H;
  if (diff < H) return `${Math.max(1, Math.floor(diff / 60000))} min`;
  if (diff < D) return `${Math.floor(diff / H)}h`;
  if (diff < 7 * D) return `${Math.floor(diff / D)}j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function ConvCard({
  conv,
  colors,
}: {
  conv: Conversation;
  colors: ReturnType<typeof useColors>;
}) {
  const last = conv.messages[conv.messages.length - 1];
  const unread = conv.messages.filter((m) => m.senderId !== "me" && !m.read).length;
  const catColor = CATEGORY_COLORS[conv.subjectCategory] ?? CATEGORY_COLORS.default;
  const catIcon = CATEGORY_ICONS[conv.subjectCategory] ?? CATEGORY_ICONS.default;
  const initials = conv.participantName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable
      onPress={() => router.push(`/chat/${conv.id}` as any)}
      style={({ pressed }) => [
        styles.convCard,
        {
          backgroundColor: colors.card,
          borderColor: unread > 0 ? catColor + "55" : colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: catColor + "22" }]}>
        <Text style={[styles.avatarText, { color: catColor }]}>{initials}</Text>
        {conv.participantVerified && (
          <View style={[styles.verifiedDot, { backgroundColor: BRAND_ACCENT }]}>
            <Ionicons name="checkmark" size={8} color="#fff" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.convContent}>
        <View style={styles.convRow}>
          <Text style={[styles.convName, { color: colors.foreground }]} numberOfLines={1}>
            {conv.participantName}
          </Text>
          <Text style={[styles.convTime, { color: colors.mutedForeground }]}>
            {last ? formatTime(last.createdAt) : formatTime(conv.createdAt)}
          </Text>
        </View>

        {/* Subject chip */}
        <View style={styles.subjectRow}>
          <Ionicons name={catIcon} size={11} color={catColor} />
          <Text style={[styles.subjectText, { color: catColor }]} numberOfLines={1}>
            {conv.subject}
          </Text>
        </View>

        {/* Last message + unread */}
        <View style={styles.lastRow}>
          <Text
            style={[
              styles.lastMsg,
              {
                color: unread > 0 ? colors.foreground : colors.mutedForeground,
                fontFamily: unread > 0 ? "Inter_500Medium" : "Inter_400Regular",
                flex: 1,
              },
            ]}
            numberOfLines={1}
          >
            {last
              ? `${last.senderId === "me" ? "Vous : " : ""}${last.text}`
              : "Démarrez la conversation"}
          </Text>
          {unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: catColor }]}>
              <Text style={styles.unreadText}>{unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function InboxScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conversations, totalUnread } = useMessages();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const topPad = Platform.OS === "web" ? 67 + 12 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const filtered =
    filter === "unread"
      ? conversations.filter((c) => c.messages.some((m) => m.senderId !== "me" && !m.read))
      : conversations;

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
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSub}>
              {totalUnread > 0
                ? `${totalUnread} non lu${totalUnread > 1 ? "s" : ""}`
                : "Toutes vos conversations"}
            </Text>
          </View>
          {totalUnread > 0 && (
            <View style={[styles.headerBadge, { backgroundColor: BRAND_ACCENT }]}>
              <Text style={styles.headerBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Filter chips */}
      <View style={[styles.filterBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["all", "unread"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? BRAND_MID : "transparent",
                borderColor: filter === f ? BRAND_ACCENT : colors.border,
                borderRadius: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filter === f ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f === "all" ? `Tous (${conversations.length})` : `Non lus (${totalUnread})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: BRAND_LIGHT + "18" }]}>
              <Ionicons name="chatbubbles-outline" size={44} color={BRAND_ACCENT} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {filter === "unread" ? "Aucun message non lu" : "Aucune conversation"}
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Appuyez sur "Contacter" depuis une fiche produit, propriété ou annonce pour démarrer.
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/index" as any)}
              style={({ pressed }) => [
                styles.emptyBtn,
                { backgroundColor: BRAND_MID, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.emptyBtnText}>Explorer le marché</Text>
            </Pressable>
          </View>
        ) : (
          filtered.map((cv) => <ConvCard key={cv.id} conv={cv} colors={colors} />)
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
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 2 },
  headerBadge: {
    minWidth: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 6,
  },
  headerBadgeText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },

  filterBar: {
    flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  list: { padding: 12, gap: 8 },

  convCard: {
    flexDirection: "row", gap: 12, padding: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  verifiedDot: {
    position: "absolute", bottom: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "#fff",
  },
  convContent: { flex: 1, gap: 3 },
  convRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  convName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  convTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  subjectRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  subjectText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lastRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  lastMsg: { fontSize: 13 },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 5,
  },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },

  empty: { alignItems: "center", paddingVertical: 64, paddingHorizontal: 28 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptySub: {
    fontSize: 14, fontFamily: "Inter_400Regular",
    textAlign: "center", marginTop: 10, lineHeight: 21,
  },
  emptyBtn: {
    marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
