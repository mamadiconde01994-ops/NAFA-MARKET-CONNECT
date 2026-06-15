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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { formatRole } from "@/lib/format";
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
};

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), role, password);
      router.replace("/(tabs)");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
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
          <Text style={[styles.heading, { color: colors.foreground }]}>
            Créer un compte
          </Text>
          <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
            Rejoignez la communauté NAFA Marché
          </Text>
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
          {[
            {
              icon: "person-outline" as const,
              value: name,
              setter: setName,
              placeholder: "Votre nom complet",
              label: "Nom complet",
              type: "default" as const,
            },
            {
              icon: "mail-outline" as const,
              value: email,
              setter: setEmail,
              placeholder: "votre@email.com",
              label: "Email",
              type: "email-address" as const,
            },
            {
              icon: "call-outline" as const,
              value: phone,
              setter: setPhone,
              placeholder: "+224 6XX XX XX XX",
              label: "Téléphone",
              type: "phone-pad" as const,
            },
          ].map((field) => (
            <View key={field.label}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                {field.label}
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Ionicons
                  name={field.icon}
                  size={18}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType={field.type}
                  autoCapitalize={field.type === "email-address" ? "none" : "words"}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          {/* Password */}
          <View>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Mot de passe
            </Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.mutedForeground}
              />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 8 caractères"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error.length > 0 && (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error}
            </Text>
          )}

          <Button
            label="S'inscrire"
            onPress={handleRegister}
            loading={loading}
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
});
