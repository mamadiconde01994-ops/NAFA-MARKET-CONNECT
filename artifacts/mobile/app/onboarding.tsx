import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { useColors } from "@/hooks/useColors";
import { setOnboardingDone } from "@/lib/storage";

const { width: W } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "layers-outline" as const,
    title: "Marketplace multi-services",
    subtitle:
      "Explorez Agriculture, Produits, Restaurants, Immobilier, Services et Commerce local dans une seule application.",
  },
  {
    id: "2",
    icon: "restaurant-outline" as const,
    title: "Produits & Restaurants",
    subtitle:
      "Achetez des produits frais, découvrez des restaurants et soutenez le commerce local proche de vous.",
  },
  {
    id: "3",
    icon: "home-outline" as const,
    title: "Immobilier & Services",
    subtitle:
      "Recherchez logements, offres immobilières, artisans et services professionnels en quelques clics.",
  },
  {
    id: "4",
    icon: "person-outline" as const,
    title: "Sans compte pour commencer",
    subtitle:
      "Parcourez librement. Connectez-vous seulement pour commander, réserver, publier ou envoyer un message.",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0] != null) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  );

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await setOnboardingDone();
      router.replace("/(tabs)");
    }
  };

  const handleSkip = async () => {
    await setOnboardingDone();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({ item }) => (
          <View style={[styles.slide, { paddingTop: topPad + 24 }]}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.muted, borderRadius: 60 },
              ]}
            >
              <Ionicons name={item.icon} size={64} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {item.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex ? colors.primary : colors.border,
                width: i === activeIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View
        style={[
          styles.actions,
          { paddingBottom: bottomPad + 24, paddingHorizontal: 24 },
        ]}
      >
        <Button
          label={activeIndex === SLIDES.length - 1 ? "Commencer" : "Suivant"}
          onPress={handleNext}
          fullWidth
        />
        {activeIndex < SLIDES.length - 1 && (
          <Pressable onPress={handleSkip} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
              Passer
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const scrollEnabled = true;

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width: W,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: { height: 8, borderRadius: 4 },
  actions: { gap: 12 },
  skipBtn: { alignItems: "center", paddingVertical: 10 },
  skipText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
