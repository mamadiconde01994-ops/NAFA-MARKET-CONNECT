import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs([
  "Animated: `useNativeDriver` is not supported",
  "props.pointerEvents is deprecated",
  "Warning: Each child in a list",
  "Non-serializable values were found in the navigation state",
  "Require cycle:",
]);
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/lib/error-handler";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { ToastProvider } from "@/context/ToastContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { SplashScreenWrapper } from "@/components/branding/SplashScreenWrapper";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/index" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="product/create" options={{ headerShown: false }} />
      <Stack.Screen name="agriculture/index" options={{ headerShown: false }} />
      <Stack.Screen name="agriculture/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="restaurants/index" options={{ headerShown: false }} />
      <Stack.Screen name="restaurants/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="real-estate/index" options={{ headerShown: false }} />
      <Stack.Screen name="real-estate/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="services/index" options={{ headerShown: false }} />
      <Stack.Screen name="services/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="warehouses/index" options={{ headerShown: false }} />
      <Stack.Screen name="warehouses/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="vehicles/index" options={{ headerShown: false }} />
      <Stack.Screen name="vehicles/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="jobs/index" options={{ headerShown: false }} />
      <Stack.Screen name="jobs/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="electronics/index" options={{ headerShown: false }} />
      <Stack.Screen name="electronics/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="fashion/index" options={{ headerShown: false }} />
      <Stack.Screen name="fashion/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="home-furniture/index" options={{ headerShown: false }} />
      <Stack.Screen name="home-furniture/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="construction/index" options={{ headerShown: false }} />
      <Stack.Screen name="construction/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="partners/index" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
      <Stack.Screen name="partners/opportunities" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="partners/referrals" options={{ headerShown: false }} />
      <Stack.Screen name="partners/sales" options={{ headerShown: false }} />
      <Stack.Screen name="partners/earnings" options={{ headerShown: false }} />
      <Stack.Screen name="partners/leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="partners/statistics" options={{ headerShown: false }} />
      <Stack.Screen name="listing/create" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SplashScreenWrapper onReady={() => setSplashDone(true)} minDuration={2500}>
      <SafeAreaProvider>
        <NetworkProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <LanguageProvider>
                    <CartProvider>
                      <FavoritesProvider>
                        <NotificationsProvider>
                          <ToastProvider>
                          <GestureHandlerRootView style={{ flex: 1 }}>
                            <KeyboardProvider>
                              <RootLayoutNav />
                            </KeyboardProvider>
                          </GestureHandlerRootView>
                        </ToastProvider>
                      </NotificationsProvider>
                    </FavoritesProvider>
                  </CartProvider>
                </LanguageProvider>
                </AuthProvider>
              </QueryClientProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </SplashScreenWrapper>
  );
}
