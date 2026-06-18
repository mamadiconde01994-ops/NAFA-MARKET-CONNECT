import { Ionicons } from "@expo/vector-icons";
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

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { formatRole } from "@/lib/format";
import { validateRegistrationForm, getPasswordStrength } from "@/lib/validators";
import type { UserRole } from "@/types";

const ROLES: UserRole[] = [
  "customer",
  "farmer",
  "trader",
  "restaurant",
  "warehouse",
  "delivery",
];

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
  const passwordStrength = getPasswordStrength(password);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleRegister = async () => {
    // Validate form
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

  const getStrengthColor = () => {
    if (!password) return colors.mutedForeground;
    if (passwordStrength === "weak") return "#EF4444";
    if (passwordStrength === "medium") return "#F59E0B";
    return "#10B981";
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>

        {/* Heading */}
        <View style={styles.headingWrap}>
          <Text style={[styles.heading, { color: colors.foreground }]}>{t("registerTitle")}</Text>
          <Text style={[styles.subheading, { color: colors.mutedForeground }]}>{t("registerSubtitle")}</Text>
        </View>

        {/* Role selector */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Je suis un(e)...
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {ROLES.map((r) => (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: role === r ? colors.primary : colors.card,
                    borderColor: role === r ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Ionicons
                  name={ROLE_ICONS[r]}
                  size={16}
                  color={role === r ? colors.primaryForeground : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color: role === r
                        ? colors.primaryForeground
                        : colors.foreground,
                    },
                  ]}
                >
                  {formatRole(r)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Form fields */}
        <View style={styles.form}>
          {/* General Error */}
          {errors.general && (
            <View style={[styles.errorBox, { backgroundColor: "#FEE2E2", borderColor: "#EF4444" }]}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "500", flex: 1 }}>
                {errors.general}
              </Text>
            </View>
          )}

          {/* Name */}
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
            errorColor="#EF4444"
          />

          {/* Email */}
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
            errorColor="#EF4444"
          />

          {/* Phone */}
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
            errorColor="#EF4444"
          />

          {/* Password */}
          <View>
            <Input
              label={t("registerPasswordLabel")}
              required
              value={password}
              onChangeText={setPassword}
              placeholder={t("registerPasswordPlaceholder")}
              icon="lock-closed-outline"
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
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
              errorColor="#EF4444"
            />
            {/* Password strength indicator */}
            {password && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        backgroundColor: getStrengthColor(),
                        width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%",
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    {
                      color: getStrengthColor(),
                    },
                  ]}
                >
                  {passwordStrength === "weak"
                    ? t("passwordStrengthWeak")
                    : passwordStrength === "medium"
                    ? t("passwordStrengthMedium")
                    : t("passwordStrengthStrong")}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <Input
            label={t("registerConfirmPasswordLabel")}
            required
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("registerConfirmPasswordPlaceholder")}
            icon="lock-closed-outline"
            rightIcon={
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
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
            errorColor="#EF4444"
          />

          {/* Terms checkbox */}
          <View style={styles.termsContainer}>
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              style={styles.checkboxWrapper}
              hitSlop={8}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreeToTerms ? colors.primary : colors.card,
                    borderColor: agreeToTerms ? colors.primary : colors.border,
                  },
                ]}
              >
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={12} color={colors.card} />
                )}
              </View>
            </Pressable>
            <Text style={[styles.termsText, { color: colors.text }]}>
              {t("registerTermsNotice")} 
              <Text onPress={() => router.push("/terms")} style={{ color: colors.primary, fontWeight: "600" }}>
                {t("loginPolicyTerms")}
              </Text>
              {" "}{t("loginPolicyAnd")} {" "}
              <Text onPress={() => router.push("/privacy")} style={{ color: colors.primary, fontWeight: "600" }}>
                {t("loginPolicyPrivacy")}
              </Text>
            </Text>
          </View>
          {errors.terms && (
            <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "500" }}>
              {errors.terms}
            </Text>
          )}

          <View style={styles.legalLinksRow}>
            <Pressable onPress={() => router.push("/terms")}> 
              <Text style={[styles.legalLink, { color: colors.primary }]}>{t("loginPolicyTerms")}</Text>
            </Pressable>
            <Text style={[styles.legalLinkSeparator, { color: colors.mutedForeground }]}>•</Text>
            <Pressable onPress={() => router.push("/privacy")}> 
              <Text style={[styles.legalLink, { color: colors.primary }]}>{t("loginPolicyPrivacy")}</Text>
            </Pressable>
          </View>

          {/* Submit Button */}
          <Button
            label={t("registerSubmit")}
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginLabel, { color: colors.mutedForeground }]}>
            Déjà inscrit ?
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Se connecter
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 24 },
  backBtn: { marginBottom: 8 },
  headingWrap: { gap: 6 },
  heading: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subheading: { fontSize: 15, fontFamily: "Inter_400Regular" },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  strengthContainer: {
    marginTop: 8,
    gap: 6,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxWrapper: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 13,
    fontWeight: "400",
    flex: 1,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  roleLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  form: { gap: 14 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
    margin: 0,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loginLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  loginLink: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  legalLinksRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  legalLink: { fontSize: 12, fontFamily: "Inter_500Medium" },
  legalLinkSeparator: { fontSize: 12 },
});
