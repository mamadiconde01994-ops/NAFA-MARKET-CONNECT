import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/common/EmptyState";
import { useColors } from "@/hooks/useColors";
import { useNotifications } from "@/context/NotificationsContext";

const ICON_MAP: Record<string, string> = {
  order: "cube-outline",
  message: "chatbubble-outline",
  promotion: "gift-outline",
  system: "notifications-outline",
  alert: "alert-circle-outline",
  price_drop: "trending-down-outline",
  new_listing: "pricetag-outline",
};

const COLOR_MAP: Record<string, string> = {
  order: "#3B82F6",
  message: "#8B5CF6",
  promotion: "#F59E0B",
  system: "#6B7280",
  alert: "#EF4444",
  price_drop: "#16A34A",
  new_listing: "#F59E0B",
};

const FILTERS = [
  { id: null as string | null, label: "Tout" },
  { id: "order" as string | null, label: "Commandes" },
  { id: "message" as string | null, label: "Messages" },
  { id: "price_drop" as string | null, label: "Prix" },
  { id: "new_listing" as string | null, label: "Nouveautés" },
  { id: "system" as string | null, label: "Système" },
];

export default function NotificationsTabScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [filter, setFilter] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const filtered = filter
    ? notifications.filter((n: any) => n.type === filter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePress = (n: any) => {
    markAsRead(n.id);
    if (n.action?.target) {
      router.push(n.action.target as any);
    }
  };

  const renderItem = ({ item: n }: { item: any }) => {
    const type = n.type || "system";
    const iconName = (ICON_MAP[type] || "notifications-outline") as keyof typeof Ionicons.glyphMap;
    const iconColor = COLOR_MAP[type] || colors.primary;

    return (
      <Pressable
        onPress={() => handlePress(n)}
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: n.read ? colors.background : colors.primary + "0D",
            borderBottomColor: colors.border,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <View style={[styles.iconBubble, { backgroundColor: iconColor + "18" }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
          {!n.read && (
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: iconColor, borderColor: colors.background },
              ]}
            />
          )}
        </View>

        <View style={styles.itemContent}>
          <Text
            style={[
              styles.itemTitle,
              {
                color: colors.foreground,
                fontFamily: n.read ? "Inter_400Regular" : "Inter_600SemiBold",
              },
            ]}
            numberOfLines={1}
          >
            {n.title}
          </Text>
          <Text
            style={[styles.itemBody, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {n.body ?? n.message ?? ""}
          </Text>
          {n.createdAt && (
            <Text style={[styles.itemTime, { color: colors.mutedForeground }]}>
              {new Date(n.createdAt).toLocaleDateString("fr-GN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        <Pressable onPress={() => deleteNotification(n.id)} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color={colors.mutedForeground} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <Pressable onPress={() => markAllAsRead()} hitSlop={8}>
              <Text style={[styles.markAll, { color: colors.primary }]}>
                Tout lire
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={String(f.id)}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterChip,
                filter === f.id
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color:
                      filter === f.id ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="Aucune notification"
          subtitle="Vous n'avez pas encore de notifications. Revenez bientôt !"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  markAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  filterRow: { flexDirection: "row", gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  iconBubble: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 },
  unreadDot: { position: "absolute", top: 0, right: 0, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  itemContent: { flex: 1, gap: 3 },
  itemTitle: { fontSize: 14, lineHeight: 19 },
  itemBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  itemTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  closeBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});
