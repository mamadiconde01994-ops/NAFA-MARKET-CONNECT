import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

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
  { key: "light", label: "Premium", icon: "sunny-outline", description: "Vert & Doré" },
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* ── Gradient Hero ── */}
        <LinearGradient
          colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.guestHero, { paddingTop: topPad + 32 }]}
        >
          <View style={styles.guestHeroBlob} />
          <View style={styles.guestHeroBlobBottom} />
          <View style={styles.guestLogoRing}>
            <LinearGradient
              colors={[BRAND_ACCENT, BRAND_LIGHT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.guestLogoInner}
            >
              <Text style={styles.guestLogoLetter}>N</Text>
            </LinearGradient>
            <View style={styles.guestLogoDot} />
          </View>
          <Text style={styles.guestAppName}>NAFA Marché</Text>
          <Text style={styles.guestTagline}>Guinée · Marché digital</Text>
        </LinearGradient>

        {/* ── Content ── */}
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.background, marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" }}
          contentContainerStyle={[styles.guestContent, { paddingBottom: bottomPad + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestHeadingRow}>
            <View style={[styles.guestAccentBar, { backgroundColor: BRAND_MID }]} />
            <Text style={[styles.guestHeadingTag, { color: BRAND_MID }]}>Bienvenue</Text>
          </View>
          <Text style={[styles.guestHeading, { color: colors.foreground }]}>
            {t("guestTitle")}
          </Text>
          <Text style={[styles.guestSubtitle, { color: colors.mutedForeground }]}>
            {t("guestSubtitle")}
          </Text>

          {/* Benefits */}
          <View style={[styles.guestBenefits, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {([
              { icon: "storefront-outline", text: "Accédez à des milliers d'annonces en Guinée" },
              { icon: "chatbubble-ellipses-outline", text: "Messagerie directe avec les vendeurs" },
              { icon: "notifications-outline", text: "Alertes sur vos produits et recherches favoris" },
            ] as const).map((b, i) => (
              <View
                key={i}
                style={[
                  styles.guestBenefitRow,
                  i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.guestBenefitIcon, { backgroundColor: BRAND_MID + "18" }]}>
                  <Ionicons name={b.icon} size={18} color={BRAND_MID} />
                </View>
                <Text style={[styles.guestBenefitText, { color: colors.foreground }]}>{b.text}</Text>
              </View>
            ))}
          </View>

          {/* CTAs */}
          <View style={styles.guestActions}>
            <Pressable
              onPress={() => router.push("/(auth)/login" as any)}
              style={({ pressed }) => [styles.guestCtaWrap, { opacity: pressed ? 0.85 : 1 }]}
            >
              <LinearGradient
                colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.guestCta}
              >
                <Text style={styles.guestCtaText}>{t("loginButton")} →</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/register" as any)}
              style={({ pressed }) => [
                styles.guestOutlineBtn,
                { borderColor: BRAND_MID, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.guestOutlineText, { color: BRAND_MID }]}>{t("registerButton")}</Text>
            </Pressable>

            <Pressable onPress={() => router.replace("/(tabs)" as any)} style={styles.guestGhostBtn}>
              <Ionicons name="person-outline" size={15} color={colors.mutedForeground} />
              <Text style={[styles.guestGhostText, { color: colors.mutedForeground }]}>
                {t("continueAsGuest")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Premium Profile Header ── */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.profileCard, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.profileHeaderBlob} />
        <View style={styles.profileHeaderBlobBR} />

        {/* Top row: settings shortcut */}
        <View style={styles.profileHeaderTopRow}>
          <View style={styles.profileBrandPill}>
            <View style={[styles.profileBrandDot, { backgroundColor: BRAND_ACCENT }]} />
            <Text style={styles.profileBrandPillText}>NAFA Marché</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(auth)/edit-profile" as any)}
            style={({ pressed }) => [styles.profileSettingsBtn, { opacity: pressed ? 0.7 : 1 }]}
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={18} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Avatar + Identity */}
        <View style={styles.profileIdentity}>
          <View style={styles.profileAvatarRing}>
            <UserAvatar name={user.name} size={82} variant="accent" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <View style={styles.profileMeta}>
              <View style={[styles.profileRolePill, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={styles.profileRolePillText}>{formatRole(user.role)}</Text>
              </View>
              {user.verified && (
                <View style={styles.profileVerifiedPill}>
                  <Ionicons name="shield-checkmark" size={12} color={BRAND_ACCENT} />
                  <Text style={styles.profileVerifiedText}>Vérifié</Text>
                </View>
              )}
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.6)" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

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
          <MenuItem icon="person-outline" label={t("profileEditProfile")} onPress={() => router.push("/(auth)/edit-profile" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="bag-handle-outline" label="Mes commandes" onPress={() => router.push("/(tabs)/orders" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="heart-outline" label={t("profileFavorites")} onPress={() => router.push("/(tabs)/favorites" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="chatbubbles-outline" label="Messages" onPress={() => router.push("/inbox" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="storefront-outline" label={t("profileMyListings")} onPress={() => router.push("/my-listings" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="notifications-outline" label="Alertes de prix" onPress={() => router.push("/price-alerts" as any)} />
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
          <MenuItem icon="notifications-outline" label={t("profileNotifications")} onPress={() => router.push("/notifications" as any)} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="language-outline" label={t("profileLanguage")} onPress={() => router.push("/language")} />
          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield-checkmark-outline" label={t("profileSecurity")} onPress={() => router.push("/(auth)/change-password" as any)} />
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
          <MenuItem icon="help-circle-outline" label={t("profileHelpCenter")} onPress={() => Alert.alert("Aide & Support", "Contactez-nous sur\nnafa.support@nafa.gn\nou WhatsApp : +224 620 00 00 00", [{ text: "Fermer" }])} />
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    gap: 14,
    overflow: "hidden",
  },
  profileHeaderBlob: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#52B788",
    opacity: 0.12,
  },
  profileHeaderBlobBR: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#52B788",
    opacity: 0.08,
  },
  profileHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  profileBrandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  profileBrandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileBrandPillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
  },
  profileSettingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileAvatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileRolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileRolePillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.3,
  },
  profileVerifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(82,183,136,0.2)",
    borderWidth: 1,
    borderColor: "rgba(82,183,136,0.4)",
  },
  profileVerifiedText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#52B788",
    letterSpacing: 0.3,
  },
  guestHero: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 44,
    minHeight: 260,
    overflow: "hidden",
  },
  guestHeroBlob: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#52B788",
    opacity: 0.12,
  },
  guestHeroBlobBottom: {
    position: "absolute",
    bottom: -30,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#52B788",
    opacity: 0.1,
  },
  guestLogoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  guestLogoInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  guestLogoLetter: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  guestLogoDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FCD34D",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  guestAppName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  guestTagline: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 3,
  },
  guestContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  guestHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestAccentBar: {
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  guestHeadingTag: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  guestHeading: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
    lineHeight: 34,
    marginTop: -8,
  },
  guestSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    marginTop: -8,
  },
  guestBenefits: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  guestBenefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  guestBenefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  guestBenefitText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  guestActions: {
    gap: 12,
  },
  guestCtaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      web: { boxShadow: "0px 8px 20px rgba(27,67,50,0.35)" },
      default: {
        shadowColor: BRAND_MID,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  guestCta: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  guestCtaText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  guestOutlineBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  guestOutlineText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  guestGhostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
  },
  guestGhostText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  profileMetaText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  profileInfo: { flex: 1, gap: 7 },
  profileName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  profileMeta: { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" },
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
