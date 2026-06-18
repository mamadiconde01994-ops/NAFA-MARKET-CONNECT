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
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { validateEmail } from "@/lib/validators";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) {
      setError(t("forgotEmailRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("forgotEmailInvalid"));
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSubmitted(true);
    } catch {
      setError(t("forgotSendError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
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
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>

        <View style={styles.headingWrap}>
          <Text style={[styles.heading, { color: colors.foreground }]}>{t("forgotTitle")}</Text>
          <Text style={[styles.subheading, { color: colors.mutedForeground }]}>{t("forgotSubtitle")}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputLabelWrap}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
          </View>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.card,
                borderColor: error ? colors.destructive : colors.border,
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
              placeholder="votre@email.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) setError("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          ) : null}

          <Button
            label={submitted ? t("forgotSubmitted") : t("forgotSubmit")}
            onPress={handleSubmit}
            loading={loading}
            disabled={submitted}
            fullWidth
            size="lg"
          />

          {submitted ? (
            <View style={styles.successBox}>
              <Text style={[styles.successTitle, { color: colors.foreground }]}>{t("forgotSentTitle")}</Text>
              <Text style={[styles.successText, { color: colors.mutedForeground }]}>{t("forgotSentText")}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 24 },
  backBtn: { marginBottom: 12 },
  headingWrap: { gap: 8 },
  heading: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  subheading: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  form: { gap: 18 },
  inputLabelWrap: { marginBottom: 6 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
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
  errorText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  successBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    backgroundColor: "rgba(16,185,129,0.08)",
    gap: 8,
  },
  successTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  successText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
