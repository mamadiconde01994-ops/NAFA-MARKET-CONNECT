import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { validateEmail, validatePhone } from "@/lib/validators";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

type LoginMode = "email" | "phone";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<LoginMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [focusId, setFocusId] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setIdentifier("");
    setErrors({});
    setGeneralError("");
  };

  const handleLogin = async () => {
    const errs: Record<string, string> = {};
    if (!identifier.trim()) {
      errs.identifier = mode === "email" ? "L'adresse e-mail est requise" : "Le numéro de téléphone est requis";
    } else if (mode === "email" && !validateEmail(identifier)) {
      errs.identifier = "Adresse e-mail invalide";
    } else if (mode === "phone" && !validatePhone(identifier)) {
      errs.identifier = "Numéro de téléphone invalide (ex: +224 621 XX XX XX)";
    }
    if (!password) {
      errs.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      errs.password = "Mot de passe trop court";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setGeneralError("");
    setLoading(true);
    try {
      await login(identifier.trim(), password, mode);
      router.replace("/(tabs)");
    } catch {
      setGeneralError(t("loginErrorInvalid"));
    } finally {
      setLoading(false);
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
        {/* ── HERO ── */}
        <LinearGradient
          colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + 32 }]}
        >
          <View style={styles.blobTopRight} />
          <View style={styles.blobBottomLeft} />
          <View style={styles.logoRing}>
            <LinearGradient
              colors={[BRAND_ACCENT, BRAND_LIGHT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoInner}
            >
              <Text style={styles.logoLetter}>N</Text>
            </LinearGradient>
            <View style={styles.logoGoldDot} />
          </View>
          <Text style={styles.appName}>NAFA Marché</Text>
          <Text style={styles.tagline}>Guinée · Marché digital</Text>
        </LinearGradient>

        {/* ── FORM CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.headingRow}>
            <View style={[styles.accentBar, { backgroundColor: BRAND_MID }]} />
            <Text style={[styles.headingLabel, { color: BRAND_MID }]}>Bienvenue</Text>
          </View>
          <Text style={[styles.heading, { color: colors.foreground }]}>Connexion</Text>
          <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
            Accédez à votre compte avec votre numéro ou e-mail
          </Text>

          {/* ── MODE SWITCHER ── */}
          <View style={[styles.modeSwitcher, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              onPress={() => switchMode("phone")}
              style={[
                styles.modeTab,
                mode === "phone" && styles.modeTabActive,
              ]}
            >
              {mode === "phone" && (
                <LinearGradient
                  colors={[BRAND_LIGHT, BRAND_MID]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons
                name="call-outline"
                size={15}
                color={mode === "phone" ? "#fff" : colors.mutedForeground}
              />
              <Text style={[styles.modeTabText, { color: mode === "phone" ? "#fff" : colors.mutedForeground }]}>
                Téléphone
              </Text>
            </Pressable>
            <Pressable
              onPress={() => switchMode("email")}
              style={[
                styles.modeTab,
                mode === "email" && styles.modeTabActive,
              ]}
            >
              {mode === "email" && (
                <LinearGradient
                  colors={[BRAND_LIGHT, BRAND_MID]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons
                name="mail-outline"
                size={15}
                color={mode === "email" ? "#fff" : colors.mutedForeground}
              />
              <Text style={[styles.modeTabText, { color: mode === "email" ? "#fff" : colors.mutedForeground }]}>
                E-mail
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {/* Identifier field */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                {mode === "phone" ? "Numéro de téléphone" : "Adresse e-mail"}
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: focusId ? colors.background : colors.card,
                    borderColor: errors.identifier
                      ? colors.destructive
                      : focusId
                      ? BRAND_MID
                      : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={mode === "phone" ? "call-outline" : "mail-outline"}
                  size={18}
                  color={focusId ? BRAND_MID : colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder={mode === "phone" ? "+224 6XX XX XX XX" : "votre@email.com"}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType={mode === "phone" ? "phone-pad" : "email-address"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusId(true)}
                  onBlur={() => setFocusId(false)}
                />
              </View>
              {errors.identifier ? (
                <Text style={[styles.fieldError, { color: colors.destructive }]}>
                  {errors.identifier}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                {t("passwordLabel")}
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: focusPass ? colors.background : colors.card,
                    borderColor: errors.password
                      ? colors.destructive
                      : focusPass
                      ? BRAND_MID
                      : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={focusPass ? BRAND_MID : colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("passwordPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => setFocusPass(true)}
                  onBlur={() => setFocusPass(false)}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={[styles.fieldError, { color: colors.destructive }]}>
                  {errors.password}
                </Text>
              ) : null}
              <Pressable
                onPress={() => router.push("/(auth)/forgot-password")}
                style={styles.forgotBtn}
                hitSlop={8}
              >
                <Text style={[styles.forgotText, { color: BRAND_MID }]}>
                  {t("passwordForgot")}
                </Text>
              </Pressable>
            </View>

            {/* General error */}
            {generalError ? (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.destructive + "14",
                    borderColor: colors.destructive + "35",
                  },
                ]}
              >
                <Ionicons name="alert-circle-outline" size={15} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {generalError}
                </Text>
              </View>
            ) : null}

            {/* CTA */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [styles.ctaWrap, { opacity: pressed || loading ? 0.8 : 1 }]}
            >
              <LinearGradient
                colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.ctaText}>{t("loginSubmit")}</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.mutedForeground }]}>{t("orText")}</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          {/* Guest */}
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={({ pressed }) => [
              styles.ghostBtn,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="person-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.ghostText, { color: colors.mutedForeground }]}>
              {t("loginGuest")}
            </Text>
          </Pressable>

          {/* Register */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerLabel, { color: colors.mutedForeground }]}>
              {t("loginRegisterPrompt")}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")} hitSlop={8}>
              <Text style={[styles.registerLink, { color: BRAND_MID }]}>
                {t("loginCreateAccount")}
              </Text>
            </Pressable>
          </View>

          {/* Legal */}
          <View style={styles.legalRow}>
            <Text style={[styles.legalText, { color: colors.mutedForeground }]}>
              En continuant, vous acceptez les{" "}
            </Text>
            <Pressable onPress={() => router.push("/terms")} hitSlop={4}>
              <Text style={[styles.legalLink, { color: BRAND_MID }]}>conditions</Text>
            </Pressable>
            <Text style={[styles.legalText, { color: colors.mutedForeground }]}> et la </Text>
            <Pressable onPress={() => router.push("/privacy")} hitSlop={4}>
              <Text style={[styles.legalLink, { color: BRAND_MID }]}>confidentialité</Text>
            </Pressable>
            <Text style={[styles.legalText, { color: colors.mutedForeground }]}>.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 44,
    minHeight: 260,
    overflow: "hidden",
  },
  blobTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#52B788",
    opacity: 0.12,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -30,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#52B788",
    opacity: 0.1,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  logoGoldDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FCD34D",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 4,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  accentBar: {
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  headingLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 22,
  },
  modeSwitcher: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 24,
    gap: 4,
    overflow: "hidden",
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    borderRadius: 10,
    overflow: "hidden",
  },
  modeTabActive: {},
  modeTabText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  form: { gap: 20 },
  fieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
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
  fieldError: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 5,
    marginLeft: 2,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  ctaWrap: {
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  line: { flex: 1, height: 1 },
  orText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  ghostText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },
  registerLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  registerLink: { fontSize: 14, fontFamily: "Inter_700Bold" },
  legalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legalText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  legalLink: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
