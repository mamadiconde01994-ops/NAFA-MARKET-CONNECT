import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useNotifications } from "@/context/NotificationsContext";

const PRIMARY = "#1a472a";
const BAR_HEIGHT = 64; // content height, not counting safe area

type TabName = "index" | "search" | "messages" | "profile";

const TAB_META: Record<TabName, { label: string; icon: string; iconActive: string }> = {
  index:    { label: "Accueil",  icon: "home-outline",        iconActive: "home" },
  search:   { label: "Explorer", icon: "search-outline",      iconActive: "search" },
  messages: { label: "Messages", icon: "chatbubble-outline",  iconActive: "chatbubble" },
  profile:  { label: "Profil",   icon: "person-outline",      iconActive: "person" },
};

function useUnreadCount() {
  const { notifications } = useNotifications();
  return notifications.filter((n) => !n.read).length;
}

function PublishFAB() {
  const handlePublish = () => {
    router.push("/(tabs)/publish" as any);
  };

  return (
    <Pressable
      onPress={handlePublish}
      style={({ pressed }) => [styles.fabWrap, { opacity: pressed ? 0.78 : 1 }]}
      accessibilityLabel="Publier une annonce"
      accessibilityRole="button"
    >
      {/* Circle floats 14px above the bar top border */}
      <View style={styles.fabCircle}>
        <Ionicons name="add" size={30} color="#FFF" />
      </View>
      <Text style={styles.fabLabel}>Publier</Text>
    </Pressable>
  );
}

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>>[0];

function CustomTabBar({ state, navigation }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === "ios";
  const isDark = colorScheme === "dark";
  const unread = useUnreadCount();

  const safeBottom = insets.bottom ?? 0;
  const barHeight = BAR_HEIGHT + safeBottom;

  // Visible route names in order
  const VISIBLE: string[] = ["index", "search", "publish", "messages", "profile"];
  const visibleRoutes = VISIBLE.map((name) => state.routes.find((r) => r.name === name)!).filter(Boolean);

  const navigate = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;
    const isFocused = state.routes[state.index]?.name === routeName;
    const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName as never);
    }
  };

  return (
    <View
      style={[
        styles.barOuter,
        {
          height: barHeight,
          paddingBottom: safeBottom,
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {/* iOS blur layer */}
      {isIOS && (
        <BlurView
          intensity={90}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      {visibleRoutes.map((route) => {
        const isFocused = state.routes[state.index]?.name === route.name;
        const color = isFocused ? PRIMARY : colors.mutedForeground;

        // ── Centre: Publier FAB ──
        if (route.name === "publish") {
          return <PublishFAB key="publish" />;
        }

        // ── Regular tab item ──
        const meta = TAB_META[route.name as TabName];
        if (!meta) return null;

        const iconName = isFocused ? meta.iconActive : meta.icon;
        const badgeCount = route.name === "messages" ? unread : 0;

        return (
          <Pressable
            key={route.name}
            onPress={() => navigate(route.name)}
            style={({ pressed }) => [styles.tabItem, { opacity: pressed ? 0.65 : 1 }]}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <View>
              <Ionicons
                name={iconName as React.ComponentProps<typeof Ionicons>["name"]}
                size={24}
                color={color}
              />
              {badgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: "Accueil" }} />
      <Tabs.Screen name="search"   options={{ title: "Explorer" }} />
      <Tabs.Screen name="publish"  options={{ title: "Publier" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages" }} />
      <Tabs.Screen name="profile"  options={{ title: "Profil" }} />
      {/* Écrans cachés */}
      <Tabs.Screen name="orders"        options={{ href: null } as any} />
      <Tabs.Screen name="favorites"     options={{ href: null } as any} />
      <Tabs.Screen name="notifications" options={{ href: null } as any} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barOuter: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    // overflow visible so the FAB circle can float above the border
    overflow: "visible",
    ...Platform.select({
      web: { boxShadow: "0 -1px 8px rgba(0,0,0,0.06)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 8,
      },
    }),
  },

  // Regular tab items — each takes equal flex space, icon + label centered
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },

  // Badge on messages icon
  badge: {
    position: "absolute",
    top: -3,
    right: -7,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    lineHeight: 14,
  },

  // Publish FAB — takes same flex space as regular tabs
  fabWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 6,
  },
  fabCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    // Float above the bar top border
    marginTop: -20,
    marginBottom: 2,
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(26,71,42,0.4)" },
      default: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  fabLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#6B7280",
  },
});
