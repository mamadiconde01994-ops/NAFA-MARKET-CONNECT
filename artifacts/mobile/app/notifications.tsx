import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/common/EmptyState";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationsContext";
import { formatRelativeTime } from "@/lib/localization";

const NOTIFICATION_ICONS: Record<string, string> = {
  order: "package-outline",
  message: "chatbubble-outline",
  promotion: "gift-outline",
  system: "notification-outline",
  alert: "alert-circle-outline",
};

const NOTIFICATION_COLORS: Record<string, string> = {
  order: "#3b82f6",
  message: "#8b5cf6",
  promotion: "#f59e0b",
  system: "#6b7280",
  alert: "#ef4444",
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [filter, setFilter] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  // no-op focus handling (removed useFocusEffect import to avoid type resolution issues)

  const filteredNotifications = filter
    ? notifications.filter((n) => (n as any).type === filter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationPress = (notification: any) => {
    markAsRead(notification.id);
    if (notification.action?.target) {
      router.push(notification.action.target as any);
    }
  };

  const renderNotification = ({ item: notification }: { item: any }) => {
    const type = notification.type || "system";
    const icon = NOTIFICATION_ICONS[type] || "notification-outline";
    const iconColor = NOTIFICATION_COLORS[type] || colors.primary;

    return (
      <Pressable
        onPress={() => handleNotificationPress(notification)}
        style={({ pressed }) => [
          styles.notificationItem,
          {
            backgroundColor: notification.read
              ? "transparent"
              : colors.primary + "10",
            borderBottomColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconColor + "20",
            },
          ]}
        >
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>

          <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.foreground,
                  fontWeight: notification.read ? "400" : "600",
                },
              ]}
            >
              {notification.title}
            </Text>
            {!notification.read && (
              <View
                style={[
                  styles.unreadBadge,
                  { backgroundColor: colors.primary },
                ]}
              />
            )}
          </View>
          <Text
            style={[
              styles.message,
              {
                color: colors.mutedForeground,
              },
            ]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text
            style={[
              styles.timestamp,
              {
                color: colors.mutedForeground,
              },
            ]}
          >
            {formatRelativeTime(notification.createdAt, language)}
          </Text>
        </View>

        <Pressable
          onPress={() => deleteNotification(notification.id)}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={colors.mutedForeground}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            {t("notificationsTitle")}
          </Text>
          {unreadCount > 0 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.markAllRead, { color: colors.primary }]}>
              Marquer tout comme lu
            </Text>
          </Pressable>
        )}
      </View>

      {/* Filters */}
      {notifications.length > 0 && (
        <View
          style={[
            styles.filterRow,
            { borderBottomColor: colors.border },
          ]}
        >
          {[
            { label: "Tous", value: null },
            { label: "Commandes", value: "order" },
            { label: "Messages", value: "message" },
            { label: "Promotions", value: "promotion" },
          ].map((f) => (
            <Pressable
              key={f.value || "all"}
              onPress={() => setFilter(f.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filter === f.value ? colors.primary : "transparent",
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color:
                      filter === f.value
                        ? colors.primaryForeground
                        : colors.foreground,
                  },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={"bell-outline" as any}
            title={t("notificationsNoNew")}
            subtitle="Vous serez notifié des mises à jour importantes."
          />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: bottomPad,
          }}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  markAllRead: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  /* removed duplicate titleRow to avoid duplicate key */
  title: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  deleteButton: {
    padding: 8,
  },
});
