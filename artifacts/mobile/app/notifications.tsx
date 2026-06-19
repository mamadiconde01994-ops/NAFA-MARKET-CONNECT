import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationsContext";
import type { Notification, NotificationType } from "@/context/NotificationsContext";
import { formatRelativeTime } from "@/lib/localization";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

/* ── Category config ── */
const CATEGORIES: { type: NotificationType | "all"; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: "all", label: "Tout", icon: "apps-outline" },
  { type: "order", label: "Commandes", icon: "cube-outline" },
  { type: "price_drop", label: "Prix", icon: "trending-down-outline" },
  { type: "new_listing", label: "Annonces", icon: "pricetag-outline" },
  { type: "message", label: "Messages", icon: "chatbubble-outline" },
  { type: "system", label: "Système", icon: "information-circle-outline" },
];

const TYPE_COLOR: Record<NotificationType, string> = {
  order: "#3B82F6",
  price_drop: "#F59E0B",
  new_listing: "#10B981",
  message: "#8B5CF6",
  system: "#6B7280",
};

const TYPE_ICON: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  order: "cube-outline",
  price_drop: "trending-down-outline",
  new_listing: "pricetag-outline",
  message: "chatbubble-outline",
  system: "information-circle-outline",
};

/* ── Date grouping ── */
function getGroup(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (86400 * 1000));
  if (diffDays < 1) return "Aujourd'hui";
  if (diffDays < 2) return "Hier";
  if (diffDays < 7) return "Cette semaine";
  return "Plus ancien";
}

const GROUP_ORDER = ["Aujourd'hui", "Hier", "Cette semaine", "Plus ancien"];

type ListItem =
  | { kind: "header"; label: string }
  | { kind: "notification"; data: Notification };

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 40;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadInFilter = notifications.filter(
    (n) => !n.read && (filter === "all" || n.type === filter),
  ).length;

  /* ── Build grouped list ── */
  const listItems = useMemo<ListItem[]>(() => {
    const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
    const grouped: Record<string, Notification[]> = {};
    for (const n of filtered) {
      const g = getGroup(n.createdAt);
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(n);
    }
    const items: ListItem[] = [];
    for (const label of GROUP_ORDER) {
      if (grouped[label]?.length) {
        items.push({ kind: "header", label });
        for (const n of grouped[label]) items.push({ kind: "notification", data: n });
      }
    }
    return items;
  }, [notifications, filter]);

  const handlePress = (n: Notification) => {
    markAsRead(n.id);
    if (n.action?.target) router.push(n.action.target as any);
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === "header") {
      return <SectionHeader label={item.label} colors={colors} />;
    }
    const n = item.data;
    return (
      <NotificationCard
        notification={n}
        onPress={() => handlePress(n)}
        onDelete={() => deleteNotification(n.id)}
        language={language}
        colors={colors}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── GRADIENT HEADER ── */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.blobTR} />
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View style={styles.backBtn}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.headerSub}>NAFA Marché · Mises à jour</Text>
          </View>

          {unreadInFilter > 0 ? (
            <Pressable
              onPress={markAllAsRead}
              hitSlop={8}
              style={({ pressed }) => [styles.markAllBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={styles.markAllText}>Tout lire</Text>
            </Pressable>
          ) : (
            <View style={{ width: 64 }} />
          )}
        </View>

        {/* ── FILTER CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = filter === cat.type;
            const catUnread = cat.type === "all"
              ? unreadCount
              : notifications.filter((n) => !n.read && n.type === cat.type).length;
            return (
              <Pressable
                key={cat.type}
                onPress={() => setFilter(cat.type)}
                style={({ pressed }) => [styles.filterChip, { opacity: pressed ? 0.8 : 1 }]}
              >
                {active && (
                  <LinearGradient
                    colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.14)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                  />
                )}
                {!active && (
                  <View style={[StyleSheet.absoluteFill, { borderRadius: 20, backgroundColor: "rgba(255,255,255,0.08)" }]} />
                )}
                <Ionicons
                  name={cat.icon}
                  size={13}
                  color={active ? "#fff" : "rgba(255,255,255,0.55)"}
                />
                <Text
                  style={[
                    styles.filterLabel,
                    { color: active ? "#fff" : "rgba(255,255,255,0.6)" },
                    active && { fontFamily: "Inter_700Bold" },
                  ]}
                >
                  {cat.label}
                </Text>
                {catUnread > 0 && (
                  <View style={[styles.filterBadge, { backgroundColor: active ? "#fff" : BRAND_ACCENT }]}>
                    <Text style={[styles.filterBadgeText, { color: active ? BRAND_MID : "#fff" }]}>
                      {catUnread}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* ── LIST ── */}
      {listItems.length === 0 ? (
        <EmptyNotifications colors={colors} filter={filter} />
      ) : (
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.kind === "header" ? `hdr-${item.label}` : item.data.id
          }
          contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ── Section header ── */
function SectionHeader({ label, colors }: { label: string; colors: Record<string, string> }) {
  return (
    <View style={sh.wrap}>
      <Text style={[sh.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[sh.line, { backgroundColor: colors.border }]} />
    </View>
  );
}
const sh = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    flexShrink: 0,
  },
  line: { flex: 1, height: 1 },
});

/* ── Notification card ── */
interface CardProps {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
  language: string;
  colors: Record<string, string>;
}

function NotificationCard({ notification: n, onPress, onDelete, language, colors }: CardProps) {
  const typeColor = TYPE_COLOR[n.type];
  const icon = TYPE_ICON[n.type];
  const isUnread = !n.read;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        nc.card,
        {
          backgroundColor: isUnread ? typeColor + "0C" : colors.background,
          borderBottomColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* Unread left accent bar */}
      {isUnread && (
        <View style={[nc.accentBar, { backgroundColor: typeColor }]} />
      )}

      {/* Icon */}
      <View style={[nc.iconWrap, { backgroundColor: typeColor + "1A" }]}>
        <Ionicons name={icon} size={20} color={typeColor} />
        {isUnread && (
          <View style={[nc.iconDot, { backgroundColor: typeColor }]} />
        )}
      </View>

      {/* Content */}
      <View style={nc.content}>
        <View style={nc.titleRow}>
          <Text
            style={[
              nc.title,
              { color: colors.foreground },
              isUnread && { fontFamily: "Inter_700Bold" },
            ]}
            numberOfLines={1}
          >
            {n.title}
          </Text>
          <Text style={[nc.time, { color: colors.mutedForeground }]}>
            {formatRelativeTime(n.createdAt, language as any)}
          </Text>
        </View>

        <Text style={[nc.message, { color: isUnread ? colors.foreground : colors.mutedForeground }]} numberOfLines={2}>
          {n.message}
        </Text>

        {/* Meta row */}
        <View style={nc.metaRow}>
          {n.meta?.amount && (
            <View style={[nc.metaChip, { backgroundColor: typeColor + "18", borderColor: typeColor + "30" }]}>
              <Text style={[nc.metaText, { color: typeColor }]}>
                {(n.meta.amount / 1000).toFixed(0)}k GNF
              </Text>
            </View>
          )}
          {n.meta?.discount && (
            <View style={[nc.metaChip, { backgroundColor: typeColor + "18", borderColor: typeColor + "30" }]}>
              <Ionicons name="trending-down" size={11} color={typeColor} />
              <Text style={[nc.metaText, { color: typeColor }]}>-{n.meta.discount}%</Text>
            </View>
          )}
          {n.meta?.category && (
            <View style={[nc.metaChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[nc.metaText, { color: colors.mutedForeground }]}>{n.meta.category}</Text>
            </View>
          )}
          {n.action?.label && (
            <View style={nc.actionLinkRow}>
              <Text style={[nc.actionLink, { color: BRAND_MID }]}>{n.action.label}</Text>
              <Ionicons name="chevron-forward" size={11} color={BRAND_MID} />
            </View>
          )}
        </View>
      </View>

      {/* Delete */}
      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={({ pressed }) => [nc.deleteBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <Ionicons name="close" size={16} color={colors.mutedForeground} />
      </Pressable>
    </Pressable>
  );
}

const nc = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 0,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    position: "relative",
  },
  iconDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  content: { flex: 1, gap: 4 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    flexShrink: 0,
  },
  message: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  actionLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  actionLink: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  deleteBtn: {
    padding: 4,
    marginTop: 2,
    flexShrink: 0,
  },
});

/* ── Empty state ── */
function EmptyNotifications({ colors, filter }: { colors: Record<string, string>; filter: string }) {
  const label = CATEGORIES.find((c) => c.type === filter)?.label ?? "notifications";
  return (
    <View style={es.wrap}>
      <View style={[es.iconCircle, { backgroundColor: BRAND_MID + "14" }]}>
        <Ionicons name="notifications-off-outline" size={36} color={BRAND_MID} />
      </View>
      <Text style={[es.title, { color: colors.foreground }]}>Aucune notification</Text>
      <Text style={[es.sub, { color: colors.mutedForeground }]}>
        {filter === "all"
          ? "Vous n'avez pas encore de notifications."
          : `Aucune notification dans la catégorie « ${label} ».`}
      </Text>
    </View>
  );
}
const es = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 14 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21, textAlign: "center" },
});

/* ── Main styles ── */
const styles = StyleSheet.create({
  hero: {
    overflow: "hidden",
    paddingBottom: 4,
  },
  blobTR: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#52B788",
    opacity: 0.12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerCenter: { flex: 1, gap: 2 },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.4,
  },
  unreadCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND_ACCENT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCountText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
  },
  markAllBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    flexShrink: 0,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  filtersScroll: { marginBottom: 8 },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  filterBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
