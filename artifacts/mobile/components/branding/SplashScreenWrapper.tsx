import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreenLib from 'expo-splash-screen';
import { SplashScreen } from './SplashScreen';
import { NAFA_COLORS } from '@/constants/branding';

interface SplashScreenWrapperProps {
  onReady: () => void;
  children: React.ReactNode;
  minDuration?: number;
}

export const SplashScreenWrapper: React.FC<SplashScreenWrapperProps> = ({
  onReady,
  children,
  minDuration = 2500,
}) => {
  const [showAppContent, setShowAppContent] = useState(false);

  useEffect(() => {
    const handleSplashFinish = async () => {
      // Hide the native splash screen
      try {
        await SplashScreenLib.hideAsync();
      } catch (e) {
        console.log('Error hiding splash:', e);
      }

      // Show app content
      setShowAppContent(true);
      onReady();
    };

    // Ensure minimum splash duration
    const timer = setTimeout(handleSplashFinish, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onReady]);

  return (
    <View style={styles.container}>
      {!showAppContent ? (
        <SplashScreen onFinish={() => setShowAppContent(true)} duration={minDuration} />
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFA_COLORS.neutral.white,
  },
});
