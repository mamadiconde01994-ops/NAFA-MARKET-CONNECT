import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { StyleSheet, Text } from "react-native";

import { getOnboardingDone } from "@/lib/storage";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const onboardingDone = await getOnboardingDone();
      if (!onboardingDone) {
        router.replace("/onboarding");
        return;
      }
      router.replace("/(tabs)");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#1B4332", "#2D6A4F", "#52B788"]}
      style={styles.container}
    >
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={styles.logoWrap}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          contentFit="cover"
        />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(500).duration(700)} style={styles.textWrap}>
        <Text style={styles.name}>NAFA Marché</Text>
        <Text style={styles.tagline}>La Guinée connectée</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 28,
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%" },
  textWrap: { alignItems: "center", gap: 6 },
  name: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
});
