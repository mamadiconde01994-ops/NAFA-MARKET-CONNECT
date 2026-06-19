import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { validatePhone, validateFullName } from "@/lib/validators";
import { formatRole } from "@/lib/format";
import type { UserRole } from "@/types";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const GUINEA_CITIES = [
  "Conakry", "Kindia", "Labé", "Kankan", "N'Zérékoré",
  "Mamou", "Boké", "Faranah", "Siguiri", "Guéckédou",
  "Kissidougou", "Koundara", "Télimélé", "Pita", "Dabola",
];

const ROLES: UserRole[] = ["customer", "farmer", "trader", "restaurant", "warehouse", "delivery"];
const ROLE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  customer: "person-outline",
  farmer: "leaf-outline",
  trader: "storefront-outline",
  restaurant: "restaurant-outline",
  warehouse: "business-outline",
  delivery: "bicycle-outline",
};
const ROLE_EMOJIS: Record<string, string> = {
  customer: "👤", farmer: "🌿", trader: "🏪",
  restaurant: "🍽️", warehouse: "🏢", delivery: "🚚",
};

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [role, setRole] = useState<UserRole>((user?.role as UserRole) ?? "customer");
  const [showCities, setShowCities] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [focusName, setFocusName] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setLocation(user.location);
      setRole(user.role as UserRole);
    }
  }, [user]);

  const hasChanges =
    name !== user?.name ||
    phone !== user?.phone ||
    location !== user?.location ||
    role !== user?.role;

  const handleSave = async () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = "Le nom est requis";
    } else if (!validateFullName(name)) {
      errs.name = "Entrez au moins prénom et nom";
    }

    if (phone.trim() && !validatePhone(phone)) {
      errs.phone = "Numéro invalide (ex: +224 621 XX XX XX)";
    }

    if (!location.trim()) {
      errs.location = "La ville est requise";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      role,
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

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
          <View style={styles.blobTR} />

          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View style={styles.backBtn}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <View style={styles.iconWrap}>
                <Ionicons name="create-outline" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.brandTag}>NAFA Marché</Text>
                <Text style={styles.headerTitle}>Modifier le profil</Text>
              </View>
            </View>
            {hasChanges && (
              <Pressable
                onPress={handleSave}
                disabled={loading}
                hitSlop={8}
                style={({ pressed }) => [styles.saveBtn, { opacity: pressed || loading ? 0.7 : 1 }]}
              >
                <Text style={styles.saveBtnText}>{loading ? "..." : "Sauv."}</Text>
              </Pressable>
            )}
          </View>

          {/* Avatar preview */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarRing}>
              <View style={[styles.avatarInner, { backgroundColor: BRAND_LIGHT }]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </View>
            <Text style={styles.avatarHint}>Photo de profil bientôt disponible</Text>
          </View>
        </LinearGradient>

        {/* ── FORM CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.background }]}>

          {/* Toast saved */}
          {saved && (
            <View style={[styles.toastBox, { backgroundColor: BRAND_ACCENT + "18", borderColor: BRAND_ACCENT + "40" }]}>
              <Ionicons name="checkmark-circle" size={16} color={BRAND_ACCENT} />
              <Text style={[styles.toastText, { color: BRAND_ACCENT }]}>
                Profil mis à jour avec succès !
              </Text>
            </View>
          )}

          {/* ── SECTION: Identité ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: BRAND_MID }]} />
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                IDENTITÉ
              </Text>
            </View>

            {/* Nom */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Nom complet</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: focusName ? colors.background : colors.card,
                    borderColor: errors.name ? colors.destructive : focusName ? BRAND_MID : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={errors.name ? colors.destructive : focusName ? BRAND_MID : colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={name}
                  onChangeText={(v) => { setName(v); if (errors.name) setErrors((e) => ({ ...e, name: "" })); }}
                  placeholder="Votre nom et prénom"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="words"
                  onFocus={() => setFocusName(true)}
                  onBlur={() => setFocusName(false)}
                />
              </View>
              {errors.name ? <FieldError msg={errors.name} color={colors.destructive} /> : null}
            </View>

            {/* Téléphone */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Numéro de téléphone</Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: focusPhone ? colors.background : colors.card,
                    borderColor: errors.phone ? colors.destructive : focusPhone ? BRAND_MID : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={errors.phone ? colors.destructive : focusPhone ? BRAND_MID : colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={phone}
                  onChangeText={(v) => { setPhone(v); if (errors.phone) setErrors((e) => ({ ...e, phone: "" })); }}
                  placeholder="+224 6XX XX XX XX"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusPhone(true)}
                  onBlur={() => setFocusPhone(false)}
                />
              </View>
              {errors.phone ? <FieldError msg={errors.phone} color={colors.destructive} /> : null}
            </View>
          </View>

          {/* ── SECTION: Localisation ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: BRAND_MID }]} />
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                LOCALISATION
              </Text>
            </View>

            <Pressable
              onPress={() => setShowCities(!showCities)}
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.location ? colors.destructive : showCities ? BRAND_MID : colors.border,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color={showCities ? BRAND_MID : colors.mutedForeground} />
              <Text
                style={[
                  styles.input,
                  { color: location ? colors.foreground : colors.mutedForeground, flex: 1 },
                ]}
              >
                {location || "Sélectionnez une ville"}
              </Text>
              <Ionicons
                name={showCities ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
            {errors.location ? <FieldError msg={errors.location} color={colors.destructive} /> : null}

            {showCities && (
              <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                  {GUINEA_CITIES.map((city) => (
                    <Pressable
                      key={city}
                      onPress={() => { setLocation(city); setShowCities(false); if (errors.location) setErrors((e) => ({ ...e, location: "" })); }}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        {
                          backgroundColor:
                            city === location
                              ? BRAND_MID + "18"
                              : pressed
                              ? colors.background
                              : "transparent",
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={city === location ? "location" : "location-outline"}
                        size={15}
                        color={city === location ? BRAND_MID : colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: city === location ? BRAND_MID : colors.foreground },
                          city === location && { fontFamily: "Inter_700Bold" },
                        ]}
                      >
                        {city}, Guinée
                      </Text>
                      {city === location && (
                        <Ionicons name="checkmark" size={16} color={BRAND_MID} style={{ marginLeft: "auto" }} />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* ── SECTION: Rôle ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: BRAND_MID }]} />
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                MON RÔLE
              </Text>
            </View>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => {
                const active = role === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setRole(r)}
                    style={({ pressed }) => [
                      styles.roleCard,
                      {
                        backgroundColor: active ? BRAND_MID : colors.card,
                        borderColor: active ? BRAND_MID : colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.roleEmoji}>{ROLE_EMOJIS[r] ?? "👤"}</Text>
                    <Text
                      style={[
                        styles.roleLabel,
                        { color: active ? "#fff" : colors.foreground },
                      ]}
                    >
                      {formatRole(r)}
                    </Text>
                    {active && (
                      <View style={styles.roleCheck}>
                        <Ionicons name="checkmark" size={10} color={BRAND_MID} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── READ-ONLY: Email ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: colors.mutedForeground }]} />
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                INFORMATIONS DE COMPTE
              </Text>
            </View>
            <View
              style={[
                styles.inputWrap,
                styles.readonlyWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: colors.mutedForeground, flex: 1 }]}>
                {user?.email ?? "—"}
              </Text>
              <View style={[styles.readonlyBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.readonlyText, { color: colors.mutedForeground }]}>
                  Non modifiable
                </Text>
              </View>
            </View>
          </View>

          {/* ── CTA ── */}
          <Pressable
            onPress={handleSave}
            disabled={loading || !hasChanges}
            style={({ pressed }) => [
              styles.ctaWrap,
              { opacity: loading || !hasChanges ? 0.45 : pressed ? 0.8 : 1 },
            ]}
          >
            <LinearGradient
              colors={[BRAND_LIGHT, BRAND_MID, BRAND_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.ctaText}>
                {loading ? "Sauvegarde..." : "Enregistrer les modifications"}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldError({ msg, color }: { msg: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5, marginLeft: 2 }}>
      <Ionicons name="alert-circle-outline" size={13} color={color} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color }}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: "hidden",
    paddingBottom: 0,
    minHeight: 200,
  },
  blobTR: {
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
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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
  saveBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BRAND_ACCENT,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.2,
  },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
    gap: 24,
  },
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  toastText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  sectionDot: {
    width: 14,
    height: 3,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
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
  readonlyWrap: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
    margin: 0,
  },
  readonlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  readonlyText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  dropdown: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
    marginTop: -4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  roleEmoji: { fontSize: 15 },
  roleLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  roleCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    gap: 10,
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
});
