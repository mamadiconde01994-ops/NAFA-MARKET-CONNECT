import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { formatRole } from "@/lib/format";
import type { ThemeKey } from "@/constants/colors";

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

function MenuItem({ icon, label, onPress, danger = false, rightElement }: MenuItemProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: danger ? colors.destructive + "18" : colors.muted,
            borderRadius: 10,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.destructive : colors.foreground}
        />
      </View>
      <Text
        style={[
          styles.menuLabel,
          { color: danger ? colors.destructive : colors.foreground },
        ]}
      >
        {label}
      </Text>
      {rightElement
        ? rightElement
        : !danger && (
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        )}
    </Pressable>
  );
}

const THEME_OPTIONS: { key: ThemeKey; label: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
  { key: "light", label: "Premium", icon: "sunny-outline", description: "Blanc & Marine" },
  { key: "dark", label: "Sombre", icon: "moon-outline", description: "Mode nuit" },
  { key: "green", label: "Agriculture", icon: "leaf-outline", description: "Vert nature" },
];

function ThemeSwitcher() {
  const colors = useColors();
  const { themeMode, setThemeMode } = useTheme();

  return (
    <View
      style={[
        styles.themeSwitcher,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      {THEME_OPTIONS.map((opt) => {
        const isActive = themeMode === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => setThemeMode(opt.key)}
            style={({ pressed }) => [
              styles.themeOption,
              {
                backgroundColor: isActive ? colors.primary : "transparent",
                borderRadius: colors.radius - 4,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name={opt.icon}
              size={18}
              color={isActive ? colors.primaryForeground : colors.mutedForeground}
            />
            <View>
              <Text
                style={[
                  styles.themeLabel,
                  { color: isActive ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {opt.label}
              </Text>
              <Text
                style={[
                  styles.themeDesc,
                  {
                    color: isActive
                      ? colors.primaryForeground + "BB"
                      : colors.mutedForeground,
                  },
                ]}
              >
                {opt.description}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (!user) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile card */}
      <View
        style={[
          styles.profileCard,
          {
            paddingTop: topPad,
            backgroundColor: colors.navyHeader,
          },
        ]}
      >
        <UserAvatar name={user.name} size={80} variant="accent" />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.profileMeta}>
            <Badge label={formatRole(user.role)} variant="secondary" />
            {user.verified && (
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color="#4ADE80" />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            )}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.locationText}>{user.location}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {[
          { label: "Annonces", value: user.stats.listings },
          { label: "Ventes", value: user.stats.sales },
          { label: "Commandes", value: user.stats.orders },
          { label: "Note", value: user.stats.rating > 0 ? user.stats.rating.toFixed(1) : "—" },
        ].map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && (
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            )}
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {stat.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Theme switcher */}
      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          APPARENCE
        </Text>
        <View style={{ paddingHorizontal: 16 }}>
          <ThemeSwitcher />
        </View>
      </View>

      {/* Account */}
      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          COMPTE
        </Text>
        <View
          style={[
            styles.menuGroup,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              marginHorizontal: 16,
            },
          ]}
        >
          <MenuItem icon="person-outline" label="Modifier mon profil" onPress={() => {}} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="storefront-outline" label="Mes annonces" onPress={() => {}} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem
            icon="add-circle-outline"
            label="Publier un produit"
            onPress={() => router.push("/product/create" as any)}
          />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          PRÉFÉRENCES
        </Text>
        <View
          style={[
            styles.menuGroup,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              marginHorizontal: 16,
            },
          ]}
        >
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="language-outline" label="Langue" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          AIDE
        </Text>
        <View
          style={[
            styles.menuGroup,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              marginHorizontal: 16,
            },
          ]}
        >
          <MenuItem icon="help-circle-outline" label="Centre d'aide" onPress={() => {}} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield-outline" label="Confidentialité" onPress={() => {}} />
        </View>
      </View>

      {/* Logout */}
      <View style={[styles.menuSection, { marginHorizontal: 16 }]}>
        <View
          style={[
            styles.menuGroup,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <MenuItem icon="log-out-outline" label="Se déconnecter" onPress={handleLogout} danger />
        </View>
      </View>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>
        NAFA Marché v2.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 12,
  },
  profileInfo: { alignItems: "center", gap: 8 },
  profileName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  profileMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  verifiedText: { fontSize: 12, color: "#4ADE80", fontFamily: "Inter_500Medium" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: -1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: 30 },

  /* Theme switcher */
  themeSwitcher: {
    flexDirection: "row",
    padding: 6,
    gap: 4,
    borderWidth: 1,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  themeLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  themeDesc: { fontSize: 10, fontFamily: "Inter_400Regular" },

  menuSection: { marginTop: 24, gap: 10 },
  menuSectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  menuGroup: { borderWidth: 1, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIcon: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  menuDivider: { height: 1, marginLeft: 64 },
  version: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 24,
    marginBottom: 8,
  },
});
