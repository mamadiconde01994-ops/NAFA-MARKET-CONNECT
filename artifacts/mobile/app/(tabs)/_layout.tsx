import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { useNotifications } from "@/context/NotificationsContext";

const PRIMARY = "#1a472a";

function useUnreadCounts() {
  const { notifications } = useNotifications();
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  return { unreadNotifs };
}

function PublishButton() {
  const colors = useColors();

  const handlePublish = () => {
    Alert.alert(
      "Publier une annonce",
      "Que souhaitez-vous proposer ?",
      [
        {
          text: "🌿  Produit agricole",
          onPress: () => router.push("/product/create" as any),
        },
        {
          text: "🏭  Espace / Entrepôt",
          onPress: () => router.push("/warehouses/index" as any),
        },
        {
          text: "💼  Offre d'emploi",
          onPress: () => router.push("/jobs/index" as any),
        },
        {
          text: "🔧  Service professionnel",
          onPress: () => router.push("/services/index" as any),
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  return (
    <Pressable
      onPress={handlePublish}
      style={({ pressed }) => [
        styles.publishWrapper,
        { opacity: pressed ? 0.82 : 1 },
      ]}
      accessibilityLabel="Publier une annonce"
      accessibilityRole="button"
    >
      <View style={styles.publishCircle}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </View>
      <Text style={[styles.publishLabel, { color: colors.mutedForeground }]}>
        Publier
      </Text>
    </Pressable>
  );
}

function MessageIcon({ color, unread }: { color?: string; unread: number }) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name="chatbubble-outline" size={24} color={color} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? "9+" : unread}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const { unreadNotifs } = useUnreadCounts();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 62,
          paddingBottom: isWeb ? 20 : 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginTop: -2,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ),
      }}
    >
      {/* ── 1 : Accueil ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* ── 2 : Explorer ── */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Explorer",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />

      {/* ── 3 : Publier (centre élevé) ── */}
      <Tabs.Screen
        name="publish"
        options={{
          title: "",
          tabBarButton: () => <PublishButton />,
        }}
      />

      {/* ── 4 : Messages ── */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }: { color: string }) => (
            <MessageIcon color={color} unread={unreadNotifs} />
          ),
        }}
      />

      {/* ── 5 : Profil ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      {/* ── Cachés — accessibles via router.push, invisibles dans la nav ── */}
      <Tabs.Screen name="orders" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="favorites" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="notifications" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  publishWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  publishCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    ...Platform.select({
      web: {
        boxShadow: `0px 4px 16px rgba(26, 71, 42, 0.45)`,
      },
      default: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  publishLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    lineHeight: 14,
  },
});
