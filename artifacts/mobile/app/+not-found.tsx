import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: "Page introuvable", headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
          <Ionicons name="compass-outline" size={52} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Page introuvable</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Cette page n'existe pas ou a été déplacée.
        </Text>
        <Link href="/(tabs)" style={[styles.btn, { backgroundColor: colors.primary }]}>
          <Text style={styles.btnText}>Retourner à l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  btn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
