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

function useUnreadCount() {
  const { notifications } = useNotifications();
  return notifications.filter((n) => !n.read).length;
}

function PublishButton() {
  const handlePublish = () => {
    Alert.alert("Publier", "Que souhaitez-vous proposer ?", [
      { text: "🌿  Produit agricole", onPress: () => router.push("/product/create" as any) },
      { text: "🏭  Entrepôt / Espace", onPress: () => router.push("/warehouses/index" as any) },
      { text: "💼  Offre d'emploi", onPress: () => router.push("/jobs/index" as any) },
      { text: "🔧  Service professionnel", onPress: () => router.push("/services/index" as any) },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return (
    <Pressable
      onPress={handlePublish}
      style={({ pressed }) => [styles.publishBtn, { opacity: pressed ? 0.75 : 1 }]}
      accessibilityLabel="Publier une annonce"
      accessibilityRole="button"
    >
      <View style={styles.publishCircle}>
        <Ionicons name="add" size={30} color="#FFF" />
      </View>
      <Text style={styles.publishLabel}>Publier</Text>
    </Pressable>
  );
}

function BadgeIcon({
  name,
  color,
  count,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color?: string;
  count: number;
}) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons name={name} size={24} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
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
  const unread = useUnreadCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          backgroundColor: isIOS ? "transparent" : colors.background,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginTop: -2,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Explorer",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="publish"
        options={{
          title: "",
          tabBarButton: () => <PublishButton />,
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }: { color: string }) => (
            <BadgeIcon name="chatbubble-outline" color={color} count={unread} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Écrans cachés */}
      <Tabs.Screen name="orders" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="favorites" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="notifications" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  publishBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  publishCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: { boxShadow: "0 3px 12px rgba(26,71,42,0.35)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      },
    }),
  },
  publishLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "#6B7280",
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -5,
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
});
