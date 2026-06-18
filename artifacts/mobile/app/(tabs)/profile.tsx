import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { PARTNER_STATS } from "@/constants/mockData";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
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
  const { width } = useWindowDimensions();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;
  const isLarge = width >= 720;
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const showComingSoon = () => {
    Alert.alert(t("comingSoonTitle"), t("comingSoonMessage"));
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.background }}
          contentContainerStyle={[styles.guestContent, { paddingTop: topPad, paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.guestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>            
            <Text style={[styles.guestTitle, { color: colors.foreground }]}>{t("guestTitle")}</Text>
            <Text style={[styles.guestSubtitle, { color: colors.mutedForeground }]}>{t("guestSubtitle")}</Text>
            <View style={styles.guestActions}>
              <Button label={t("loginButton")} onPress={() => router.push("/(auth)/login" as any)} fullWidth />
              <Button label={t("registerButton")} onPress={() => router.push("/(auth)/register" as any)} variant="outline" fullWidth />
              <Pressable onPress={() => router.replace("/(tabs)")} style={styles.guestContinueBtn}>
                <Text style={[styles.guestContinueText, { color: colors.primary }]}>{t("continueAsGuest")}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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

      {/* Partenaire NAFA */}
      <View
        style={[
          styles.partnerCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.partnerHeader}>
          <View>
            <Text style={[styles.partnerTitle, { color: colors.foreground }]}>{t("profilePartnerTitle")}</Text>
            <Text style={[styles.partnerSubtitle, { color: colors.mutedForeground }]}>{t("profilePartnerSubtitle")}</Text>
          </View>
          <Badge
            label={user.role === "partner" || user.role === "business-ambassador" ? "Partenaire" : "Invitation"}
            variant={user.role === "partner" || user.role === "business-ambassador" ? "primary" : "outline"}
          />
        </View>
        <View style={styles.partnerStatsRow}>
          <View style={styles.partnerStatItem}>
            <Text style={[styles.partnerStatValue, { color: colors.secondary }]}>{PARTNER_STATS.totalSales}</Text>
            <Text style={[styles.partnerStatLabel, { color: colors.mutedForeground }]}>Ventes</Text>
          </View>
          <View style={styles.partnerStatItem}>
            <Text style={[styles.partnerStatValue, { color: colors.foreground }]}>{PARTNER_STATS.totalReferrals}</Text>
            <Text style={[styles.partnerStatLabel, { color: colors.mutedForeground }]}>Références</Text>
          </View>
        </View>
        <View style={styles.partnerStatsRow}>
          <View style={styles.partnerStatItem}>
            <Text style={[styles.partnerStatValue, { color: colors.secondary }]}>{PARTNER_STATS.totalEarnings.toLocaleString("fr-FR")} GNF</Text>
            <Text style={[styles.partnerStatLabel, { color: colors.mutedForeground }]}>Gains</Text>
          </View>
          <View style={styles.partnerStatItem}>
            <Text style={[styles.partnerStatValue, { color: colors.foreground }]}>{PARTNER_STATS.ranking}</Text>
            <Text style={[styles.partnerStatLabel, { color: colors.mutedForeground }]}>Classement</Text>
          </View>
        </View>
        <View style={styles.partnerFooter}>
          <Badge
            label={PARTNER_STATS.verifiedStatus ? t("profilePartnerStatusVerified") : t("profilePartnerStatusPending")}
            variant={PARTNER_STATS.verifiedStatus ? "success" : "warning"}
          />
          <Button
            label={t("profilePartnerDashboardButton")}
            onPress={() => router.push("/partners" as any)}
            variant="outline"
            fullWidth
          />
        </View>
      </View>

      {/* Theme switcher */}
      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          {t("profileSectionAppearance")}
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
          {t("profileSectionAccount")}
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
          <MenuItem icon="person-outline" label={t("profileEditProfile")} onPress={showComingSoon} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="heart-outline" label={t("profileFavorites")} onPress={showComingSoon} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="storefront-outline" label={t("profileMyListings")} onPress={showComingSoon} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem
            icon="add-circle-outline"
            label={t("profilePublishProduct")}
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
          {t("profileSectionPreferences")}
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
          <MenuItem icon="notifications-outline" label={t("profileNotifications")} onPress={showComingSoon} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="language-outline" label={t("profileLanguage")} onPress={() => router.push("/language")} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield-checkmark-outline" label={t("profileSecurity")} onPress={() => router.push("/privacy")} />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text
          style={[
            styles.menuSectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          {t("profileSectionHelp")}
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
          <MenuItem icon="help-circle-outline" label={t("profileHelpCenter")} onPress={showComingSoon} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="document-text-outline" label={t("profileTerms")} onPress={() => router.push("/terms")} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield-outline" label={t("profilePrivacy")} onPress={() => router.push("/privacy")} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="information-circle-outline" label={t("profileAbout")} onPress={() => Alert.alert(t("profileAbout"), "NAFA Marché v2.0.0\nVotre plateforme de commerce mobile.")} />
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

      <Text style={[styles.version, { color: colors.mutedForeground }]}>NAFA Marché v2.0.0</Text>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 12,
  },
  guestContent: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 18,
  },
  guestCard: {
    marginHorizontal: 16,
    padding: 24,
    borderWidth: 1,
    borderRadius: 18,
    gap: 18,
  },
  guestTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  guestSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  guestActions: {
    gap: 12,
    marginTop: 20,
  },
  guestContinueBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  guestContinueText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  profileMetaText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
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

  partnerCard: {
    borderWidth: 1,
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 20,
    gap: 14,
  },
  partnerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  partnerTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  partnerSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  partnerStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  partnerStatItem: {
    flex: 1,
    gap: 6,
  },
  partnerStatValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  partnerStatLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  partnerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

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
