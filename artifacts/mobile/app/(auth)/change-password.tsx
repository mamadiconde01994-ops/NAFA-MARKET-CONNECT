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
import { getPasswordStrength, validatePassword } from "@/lib/validators";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  const levels = { weak: 1, medium: 2, strong: 3 };
  const level = levels[strength];
  const colors = ["#EF4444", "#F59E0B", "#10B981"];
  const labels = ["Faible", "Moyen", "Fort"];
  return (
    <View style={sb.wrap}>
      <View style={sb.bars}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[sb.segment, { backgroundColor: i <= level ? colors[level - 1] : "#E5E7EB" }]}
          />
        ))}
      </View>
      <Text style={[sb.label, { color: colors[level - 1] }]}>{labels[level - 1]}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  bars: { flex: 1, flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 3, borderRadius: 2 },
  label: { fontSize: 11, fontFamily: "Inter_600SemiBold", minWidth: 36 },
});

type FieldKey = "current" | "next" | "confirm";

export default function ChangePasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState<Record<FieldKey, boolean>>({ current: false, next: false, confirm: false });
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleShow = (field: FieldKey) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};

    if (!current) errs.current = "Le mot de passe actuel est requis";

    if (!next) {
      errs.next = "Le nouveau mot de passe est requis";
    } else {
      const { isValid, feedback } = validatePassword(next);
      if (!isValid) errs.next = feedback[0];
    }

    if (!confirm) {
      errs.confirm = "Veuillez confirmer le nouveau mot de passe";
    } else if (next && confirm !== next) {
      errs.confirm = "Les mots de passe ne correspondent pas";
    }

    if (current && next && current === next) {
      errs.next = "Le nouveau mot de passe doit être différent de l'actuel";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <LinearGradient
          colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + 16 }]}
        >
          <View style={styles.blobTopRight} />
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.iconWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.brandTag}>NAFA Marché</Text>
                <Text style={styles.headerTitle}>Mot de passe</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={[styles.card, { backgroundColor: colors.background, flex: 1, justifyContent: "center" }]}>
          <View style={[styles.successBox, { borderColor: BRAND_ACCENT + "40" }]}>
            <LinearGradient
              colors={[BRAND_ACCENT + "30", BRAND_ACCENT + "10"]}
              style={styles.successIconWrap}
            >
              <Ionicons name="checkmark-circle" size={40} color={BRAND_ACCENT} />
            </LinearGradient>
            <Text style={[styles.successTitle, { color: colors.foreground }]}>
              Mot de passe mis à jour !
            </Text>
            <Text style={[styles.successText, { color: colors.mutedForeground }]}>
              Votre mot de passe a été modifié avec succès. Vous pouvez maintenant l'utiliser pour vous connecter.
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.ctaWrap, { width: "100%", opacity: pressed ? 0.8 : 1 }]}
            >
              <LinearGradient
                colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>Retour au profil</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

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
              <View style={styles.backBtn}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <View style={styles.iconWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.brandTag}>NAFA Marché</Text>
                <Text style={styles.headerTitle}>Changer le mot de passe</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          {/* Security tip */}
          <View style={[styles.tipBox, { backgroundColor: BRAND_ACCENT + "14", borderColor: BRAND_ACCENT + "30" }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={BRAND_ACCENT} />
            <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
              Utilisez un mot de passe unique avec majuscules, chiffres et caractères spéciaux.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Current password */}
            <PasswordField
              label="Mot de passe actuel"
              value={current}
              onChangeText={(v) => { setCurrent(v); if (errors.current) setErrors((e) => ({ ...e, current: "" })); }}
              show={show.current}
              onToggleShow={() => toggleShow("current")}
              focused={focused === "current"}
              onFocus={() => setFocused("current")}
              onBlur={() => setFocused(null)}
              error={errors.current}
              colors={colors}
            />

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* New password */}
            <PasswordField
              label="Nouveau mot de passe"
              value={next}
              onChangeText={(v) => { setNext(v); if (errors.next) setErrors((e) => ({ ...e, next: "" })); }}
              show={show.next}
              onToggleShow={() => toggleShow("next")}
              focused={focused === "next"}
              onFocus={() => setFocused("next")}
              onBlur={() => setFocused(null)}
              error={errors.next}
              colors={colors}
              showStrength
            />

            {/* Confirm */}
            <PasswordField
              label="Confirmer le nouveau mot de passe"
              value={confirm}
              onChangeText={(v) => { setConfirm(v); if (errors.confirm) setErrors((e) => ({ ...e, confirm: "" })); }}
              show={show.confirm}
              onToggleShow={() => toggleShow("confirm")}
              focused={focused === "confirm"}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
              error={errors.confirm}
              matchValue={next}
              colors={colors}
            />

            {/* Rules */}
            <View style={[styles.rulesBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.rulesTitle, { color: colors.mutedForeground }]}>
                Le mot de passe doit contenir :
              </Text>
              {[
                { rule: "Au moins 8 caractères", ok: next.length >= 8 },
                { rule: "Une lettre majuscule (A–Z)", ok: /[A-Z]/.test(next) },
                { rule: "Une lettre minuscule (a–z)", ok: /[a-z]/.test(next) },
                { rule: "Un chiffre (0–9)", ok: /[0-9]/.test(next) },
                { rule: "Un caractère spécial (!@#$%^&*)", ok: /[!@#$%^&*]/.test(next) },
              ].map(({ rule, ok }) => (
                <View key={rule} style={styles.ruleRow}>
                  <Ionicons
                    name={ok && next ? "checkmark-circle" : "ellipse-outline"}
                    size={14}
                    color={ok && next ? BRAND_ACCENT : colors.mutedForeground}
                  />
                  <Text style={[styles.ruleText, { color: ok && next ? colors.foreground : colors.mutedForeground }]}>
                    {rule}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTA */}
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
                  {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.cancelBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Reusable password field ── */
interface PFProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  colors: Record<string, string>;
  showStrength?: boolean;
  matchValue?: string;
}

function PasswordField({
  label,
  value,
  onChangeText,
  show,
  onToggleShow,
  focused,
  onFocus,
  onBlur,
  error,
  colors,
  showStrength,
  matchValue,
}: PFProps) {
  const matched = matchValue !== undefined && value.length > 0 && value === matchValue;
  return (
    <View>
      <Text style={[pf.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View
        style={[
          pf.inputWrap,
          {
            backgroundColor: focused ? colors.background : colors.card,
            borderColor: error
              ? colors.destructive
              : matched
              ? BRAND_ACCENT
              : focused
              ? BRAND_MID
              : colors.border,
          },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={18}
          color={error ? colors.destructive : focused ? BRAND_MID : colors.mutedForeground}
        />
        <TextInput
          style={[pf.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="••••••••"
          placeholderTextColor={colors.mutedForeground}
        />
        {matchValue !== undefined && matched && (
          <Ionicons name="checkmark-circle" size={18} color={BRAND_ACCENT} />
        )}
        <Pressable onPress={onToggleShow} hitSlop={8}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.mutedForeground}
          />
        </Pressable>
      </View>
      {error ? (
        <View style={pf.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.destructive} />
          <Text style={[pf.errorText, { color: colors.destructive }]}>{error}</Text>
        </View>
      ) : null}
      {showStrength && <StrengthBar password={value} />}
    </View>
  );
}

const pf = StyleSheet.create({
  label: {
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
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
    marginLeft: 2,
  },
  errorText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 28,
    overflow: "hidden",
    minHeight: 120,
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
  backBtn: {
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTag: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  form: { gap: 18 },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  rulesBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  rulesTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
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
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
});
