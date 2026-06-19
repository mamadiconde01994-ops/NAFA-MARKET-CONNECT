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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { validateEmail, validatePhone } from "@/lib/validators";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

type ResetMode = "phone" | "email";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<ResetMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const switchMode = (m: ResetMode) => {
    setMode(m);
    setIdentifier("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!identifier.trim()) {
      setError(mode === "phone" ? "Le numéro de téléphone est requis" : "L'adresse e-mail est requise");
      return;
    }
    if (mode === "email" && !validateEmail(identifier)) {
      setError("Adresse e-mail invalide");
      return;
    }
    if (mode === "phone" && !validatePhone(identifier)) {
      setError("Numéro de téléphone invalide (ex: +224 621 XX XX XX)");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
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
        {/* ── HEADER ── */}
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
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
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
                <Text style={styles.headerTitle}>Mot de passe oublié</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── FORM CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          {submitted ? (
            <View style={[styles.successBox, { borderColor: BRAND_ACCENT + "40" }]}>
              <LinearGradient
                colors={[BRAND_ACCENT + "30", BRAND_ACCENT + "10"]}
                style={styles.successIconWrap}
              >
                <Ionicons name="checkmark-circle" size={36} color={BRAND_ACCENT} />
              </LinearGradient>
              <Text style={[styles.successTitle, { color: colors.foreground }]}>
                {mode === "phone" ? "SMS envoyé !" : "E-mail envoyé !"}
              </Text>
              <Text style={[styles.successText, { color: colors.mutedForeground }]}>
                {mode === "phone"
                  ? "Nous avons envoyé un code de vérification au numéro indiqué. Suivez les instructions pour réinitialiser votre mot de passe."
                  : "Vérifiez votre boîte mail et suivez les instructions pour réinitialiser votre mot de passe."}
              </Text>
              <Pressable
                onPress={() => router.replace("/(auth)/login")}
                style={({ pressed }) => [styles.backToLoginBtn, { opacity: pressed ? 0.7 : 1 }]}
              >
                <LinearGradient
                  colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cta}
                >
                  <Text style={styles.ctaText}>Retour à la connexion</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
                Choisissez comment retrouver l'accès à votre compte
              </Text>

              {/* ── MODE SWITCHER ── */}
              <View style={[styles.modeSwitcher, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Pressable
                  onPress={() => switchMode("phone")}
                  style={[styles.modeTab, mode === "phone" && styles.modeTabActive]}
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
                  style={[styles.modeTab, mode === "email" && styles.modeTabActive]}
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
                <View>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                    {mode === "phone" ? "Numéro de téléphone" : "Adresse e-mail"}
                  </Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: focused ? colors.background : colors.card,
                        borderColor: error ? colors.destructive : focused ? BRAND_MID : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={mode === "phone" ? "call-outline" : "mail-outline"}
                      size={18}
                      color={error ? colors.destructive : focused ? BRAND_MID : colors.mutedForeground}
                    />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder={mode === "phone" ? "+224 6XX XX XX XX" : "votre@email.com"}
                      placeholderTextColor={colors.mutedForeground}
                      keyboardType={mode === "phone" ? "phone-pad" : "email-address"}
                      value={identifier}
                      onChangeText={(v) => {
                        setIdentifier(v);
                        if (error) setError("");
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {error ? (
                    <View style={styles.errorRow}>
                      <Ionicons name="alert-circle-outline" size={13} color={colors.destructive} />
                      <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                    </View>
                  ) : null}
                </View>

                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  style={({ pressed }) => [styles.ctaWrap, { opacity: pressed || loading ? 0.8 : 1 }]}
                >
                  <LinearGradient
                    colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cta}
                  >
                    <Text style={styles.ctaText}>
                      {loading
                        ? "Envoi en cours..."
                        : mode === "phone"
                        ? "Envoyer le code SMS"
                        : "Envoyer le lien"}
                    </Text>
                  </LinearGradient>
                </Pressable>

                <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="information-circle-outline" size={16} color={BRAND_ACCENT} />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                    {mode === "phone"
                      ? "Utilisez le numéro enregistré lors de la création de votre compte."
                      : "Vérifiez aussi votre dossier de courrier indésirable."}
                  </Text>
                </View>
              </View>

              <View style={styles.loginRow}>
                <Text style={[styles.loginLabel, { color: colors.mutedForeground }]}>
                  Vous vous souvenez de votre mot de passe ?
                </Text>
                <Pressable onPress={() => router.replace("/(auth)/login")} hitSlop={8}>
                  <Text style={[styles.loginLink, { color: BRAND_MID }]}>Se connecter</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 34,
    overflow: "hidden",
    minHeight: 130,
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
  tagDot: { width: 6, height: 6, borderRadius: 3 },
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
    paddingTop: 28,
    paddingBottom: 40,
    gap: 20,
  },
  subheading: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 23,
    marginBottom: 4,
  },
  modeSwitcher: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
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
  form: { gap: 16 },
  fieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
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
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  errorText: { fontSize: 12, fontFamily: "Inter_500Medium" },
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
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  successBox: {
    alignItems: "center",
    gap: 14,
    padding: 28,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: "rgba(82,183,136,0.05)",
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
  },
  backToLoginBtn: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },
  loginRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loginLabel: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  loginLink: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
