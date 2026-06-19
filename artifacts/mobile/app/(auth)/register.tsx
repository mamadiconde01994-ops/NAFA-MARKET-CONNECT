import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Input } from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { formatRole } from "@/lib/format";
import { validateRegistrationForm, getPasswordStrength } from "@/lib/validators";
import type { UserRole } from "@/types";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const ROLES: UserRole[] = ["customer", "farmer", "trader", "restaurant", "warehouse", "delivery"];

const ROLE_ICONS: Record<UserRole, keyof typeof Ionicons.glyphMap> = {
  customer: "person-outline",
  farmer: "leaf-outline",
  trader: "storefront-outline",
  restaurant: "restaurant-outline",
  warehouse: "business-outline",
  delivery: "bicycle-outline",
  partner: "people-outline",
  "business-ambassador": "megaphone-outline",
};

const ROLE_EMOJIS: Record<string, string> = {
  customer: "👤",
  farmer: "🌿",
  trader: "🏪",
  restaurant: "🍽️",
  warehouse: "🏢",
  delivery: "🚚",
};

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const levels = { weak: 1, medium: 2, strong: 3 };
  const level = password ? (levels[strength] ?? 0) : 0;
  const colors = ["#EF4444", "#F59E0B", "#10B981"];
  const labels = ["Faible", "Moyen", "Fort"];

  if (!password) return null;
  return (
    <View style={strengthStyles.wrap}>
      <View style={strengthStyles.barRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              strengthStyles.segment,
              { backgroundColor: i <= level ? colors[level - 1] : "#E5E7EB" },
            ]}
          />
        ))}
      </View>
      <Text style={[strengthStyles.label, { color: colors[level - 1] }]}>
        {labels[level - 1]}
      </Text>
    </View>
  );
}

const strengthStyles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  barRow: { flex: 1, flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 3, borderRadius: 2 },
  label: { fontSize: 11, fontFamily: "Inter_600SemiBold", minWidth: 36 },
});

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const handleRegister = async () => {
    const validation = validateRegistrationForm(name, email, phone, password, confirmPassword);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    if (!agreeToTerms) {
      setErrors({ terms: t("registerTermsError") });
      return;
    }
    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), role, password);
      router.replace("/(tabs)");
    } catch {
      setErrors({ general: t("registerErrorGeneral") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── COMPACT HEADER ── */}
        <LinearGradient
          colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + 16 }]}
        >
          <View style={styles.blobTopRight} />

          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
              hitSlop={8}
            >
              <View style={styles.backBtnInner}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </Pressable>

            <View style={styles.headerTitleWrap}>
              <View style={styles.logoSmallRing}>
                <LinearGradient
                  colors={[BRAND_ACCENT, BRAND_LIGHT]}
                  style={styles.logoSmallInner}
                >
                  <Text style={styles.logoSmallLetter}>N</Text>
                </LinearGradient>
                <View style={styles.logoSmallDot} />
              </View>
              <View>
                <View style={styles.brandTagRow}>
                  <View style={[styles.tagDot, { backgroundColor: BRAND_ACCENT }]} />
                  <Text style={styles.brandTag}>NAFA Marché</Text>
                </View>
                <Text style={styles.headerTitle}>{t("registerTitle")}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── FORM CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          {/* Role Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              Je suis...
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 2 }}
            >
              {ROLES.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: role === r ? BRAND_MID : colors.card,
                      borderColor: role === r ? BRAND_MID : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.roleEmoji}>{ROLE_EMOJIS[r] ?? "👤"}</Text>
                  <Text
                    style={[
                      styles.roleLabel,
                      { color: role === r ? "#fff" : colors.foreground },
                    ]}
                  >
                    {formatRole(r)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {errors.general ? (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.destructive + "18",
                    borderColor: colors.destructive + "40",
                  },
                ]}
              >
                <Ionicons name="alert-circle-outline" size={15} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errors.general}
                </Text>
              </View>
            ) : null}

            <Input
              label={t("registerNameLabel")}
              required
              value={name}
              onChangeText={setName}
              placeholder={t("registerNamePlaceholder")}
              icon="person-outline"
              error={errors.fullName}
              borderColor={colors.border}
              backgroundColor={colors.card}
              textColor={colors.text}
              labelColor={colors.mutedForeground}
              errorColor={colors.destructive}
            />
            <Input
              label={t("registerEmailLabel")}
              required
              value={email}
              onChangeText={setEmail}
              placeholder={t("emailPlaceholder")}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              borderColor={colors.border}
              backgroundColor={colors.card}
              textColor={colors.text}
              labelColor={colors.mutedForeground}
              errorColor={colors.destructive}
            />
            <Input
              label={t("registerPhoneLabel")}
              required
              value={phone}
              onChangeText={setPhone}
              placeholder={t("registerPhonePlaceholder")}
              icon="call-outline"
              keyboardType="phone-pad"
              error={errors.phone}
              borderColor={colors.border}
              backgroundColor={colors.card}
              textColor={colors.text}
              labelColor={colors.mutedForeground}
              errorColor={colors.destructive}
            />

            {/* Password with strength */}
            <View>
              <Input
                label={t("registerPasswordLabel")}
                required
                value={password}
                onChangeText={setPassword}
                placeholder={t("registerPasswordPlaceholder")}
                icon="lock-closed-outline"
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </Pressable>
                }
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                error={errors.password}
                borderColor={colors.border}
                backgroundColor={colors.card}
                textColor={colors.text}
                labelColor={colors.mutedForeground}
                errorColor={colors.destructive}
              />
              <PasswordStrengthBar password={password} />
            </View>

            <Input
              label={t("registerConfirmPasswordLabel")}
              required
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t("registerConfirmPasswordPlaceholder")}
              icon="lock-closed-outline"
              rightIcon={
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={8}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              }
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              error={errors.confirmPassword}
              borderColor={colors.border}
              backgroundColor={colors.card}
              textColor={colors.text}
              labelColor={colors.mutedForeground}
              errorColor={colors.destructive}
            />

            {/* Terms */}
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              style={styles.termsRow}
              hitSlop={8}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreeToTerms ? BRAND_MID : colors.card,
                    borderColor: agreeToTerms ? BRAND_MID : colors.border,
                  },
                ]}
              >
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={13} color="#fff" />
                )}
              </View>
              <Text style={[styles.termsText, { color: colors.foreground }]}>
                {t("registerTermsNotice")}{" "}
                <Text
                  onPress={() => router.push("/terms")}
                  style={{ color: BRAND_MID, fontFamily: "Inter_700Bold" }}
                >
                  {t("loginPolicyTerms")}
                </Text>
                {" "}{t("loginPolicyAnd")}{" "}
                <Text
                  onPress={() => router.push("/privacy")}
                  style={{ color: BRAND_MID, fontFamily: "Inter_700Bold" }}
                >
                  {t("loginPolicyPrivacy")}
                </Text>
              </Text>
            </Pressable>
            {errors.terms ? (
              <Text style={[styles.fieldError, { color: colors.destructive }]}>
                {errors.terms}
              </Text>
            ) : null}

            {/* CTA */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.ctaWrap,
                { opacity: pressed || isLoading ? 0.8 : agreeToTerms ? 1 : 0.55 },
              ]}
            >
              <LinearGradient
                colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>
                  {isLoading ? "Création..." : `${t("registerSubmit")} →`}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={[styles.loginLabel, { color: colors.mutedForeground }]}>
              Déjà inscrit ?
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")} hitSlop={8}>
              <Text style={[styles.loginLink, { color: BRAND_MID }]}>
                Se connecter
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 34,
    overflow: "hidden",
    minHeight: 140,
  },
  blobTopRight: {
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
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtn: {},
  backBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoSmallRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSmallInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  logoSmallLetter: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  logoSmallDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FCD34D",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.9)",
  },
  brandTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 1,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brandTag: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  roleEmoji: { fontSize: 14 },
  roleLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  form: { gap: 18 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  fieldError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    marginLeft: 4,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  termsText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    flex: 1,
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
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
  cta: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 28,
  },
  loginLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  loginLink: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
