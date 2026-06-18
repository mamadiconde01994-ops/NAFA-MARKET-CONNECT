import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { validateLoginForm } from "@/lib/validators";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setGeneralError("");
    setLoading(true);
    
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      setGeneralError(t("loginErrorInvalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
          {/* Logo */}
          <View style={styles.logoWrap}>
            <LinearGradient
              colors={["#1B4332", "#2D6A4F"]}
              style={[styles.logoGrad, { borderRadius: 22 }]}
            >
              <Text style={styles.logoText}>N</Text>
            </LinearGradient>
            <Text style={[styles.appName, { color: colors.foreground }]}>  
              NAFA Marché
            </Text>
          </View>

          {/* Heading */}
          <View style={styles.headingWrap}>
            <Text style={[styles.heading, { color: colors.foreground }]}>{t("loginWelcome")}</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>{t("loginSubtitle")}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <View>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>{t("emailLabel")}</Text>
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
                  name="mail-outline"
                  size={18}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t("emailPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>{t("passwordLabel")}</Text>
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
                  placeholder={t("passwordPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={() => router.push("/(auth)/forgot-password")}
                style={styles.forgotButton}
                hitSlop={8}
              >
                <Text style={[styles.forgotText, { color: colors.primary }]}>{t("passwordForgot")}</Text>
              </Pressable>
            </View>

{/* Errors */}
            {errors.email && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.destructive + "18",
                    borderRadius: colors.radius,
                    borderColor: colors.destructive + "40",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={15}
                  color={colors.destructive}
                />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errors.email}
                </Text>
              </View>
            )}
            {errors.password && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.destructive + "18",
                    borderRadius: colors.radius,
                    borderColor: colors.destructive + "40",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={15}
                  color={colors.destructive}
                />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errors.password}
                </Text>
              </View>
            )}
            {generalError && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.destructive + "18",
                    borderRadius: colors.radius,
                    borderColor: colors.destructive + "40",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={15}
                  color={colors.destructive}
                />
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {generalError}
                </Text>
              </View>
            )}

            <Button
              label={t("loginSubmit")}
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.mutedForeground }]}>{t("orText")}</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerLabel, { color: colors.mutedForeground }]}>{t("loginRegisterPrompt")}</Text>
            <Pressable onPress={() => router.push("/(auth)/register")}> 
              <Text style={[styles.registerLink, { color: colors.primary }]}>{t("loginCreateAccount")}</Text>
            </Pressable>
          </View>

          {/* Guest */}
          <Pressable
            onPress={() => {
              router.replace("/(tabs)");
            }}
            style={styles.guestBtn}
          >
            <Text style={[styles.guestText, { color: colors.mutedForeground }]}>{t("loginGuest")}</Text>
          </Pressable>

          <View style={styles.legalNoticeRow}>
            <Text style={[styles.legalNotice, { color: colors.mutedForeground }]}>En vous connectant, vous acceptez les </Text>
            <Pressable onPress={() => router.push("/terms")}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>conditions</Text>
            </Pressable>
            <Text style={[styles.legalNotice, { color: colors.mutedForeground }]}> et la </Text>
            <Pressable onPress={() => router.push("/privacy")}> 
              <Text style={[styles.legalLink, { color: colors.primary }]}>politique de confidentialité</Text>
            </Pressable>
            <Text style={[styles.legalNotice, { color: colors.mutedForeground }]}>.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 28 },
  logoWrap: { alignItems: "center", gap: 12 },
  logoGrad: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  appName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headingWrap: { gap: 6 },
  heading: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subheading: { fontSize: 15, fontFamily: "Inter_400Regular" },
  form: { gap: 16 },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
  },
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
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  line: { flex: 1, height: 1 },
  orText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  registerLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  registerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  guestBtn: { alignItems: "center", paddingVertical: 4 },
  guestText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  forgotButton: { alignSelf: "flex-end", marginTop: 6 },
  forgotText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  legalNoticeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 18,
    paddingHorizontal: 12,
  },
  legalNotice: { fontSize: 12, fontFamily: "Inter_400Regular" },
  legalLink: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
