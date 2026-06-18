import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  useColorScheme,
  ImageBackground,
} from 'react-native';
import Svg, { Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NAFA_COLORS, NAFA_SPACING, NAFA_TYPOGRAPHY } from '@/constants/branding';

// responsive dimensions

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2500,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = useWindowDimensions();

  const logoScale = React.useRef(new Animated.Value(0.6)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const bottomOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Logo appears and scales
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Brand name appears
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Phase 3: Tagline appears
      Animated.timing(bottomOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(800),
    ]).start(() => {
      onFinish?.();
    });

    // Auto finish after duration
    const timer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [logoScale, logoOpacity, textOpacity, bottomOpacity, onFinish, duration]);

  const backgroundColor = isDark
    ? NAFA_COLORS.dark.bg
    : NAFA_COLORS.neutral.white;
  const textColor = isDark ? NAFA_COLORS.dark.text : NAFA_COLORS.neutral.dark;
  const accentColor = isDark ? NAFA_COLORS.accent.gold : NAFA_COLORS.primary.main;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      {/* Animated logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <Defs>
            <LinearGradient id="splashGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={NAFA_COLORS.primary.dark} />
              <Stop offset="100%" stopColor={NAFA_COLORS.primary.main} />
            </LinearGradient>
            <LinearGradient id="splashGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={NAFA_COLORS.accent.gold} />
              <Stop offset="100%" stopColor={NAFA_COLORS.accent.orange} />
            </LinearGradient>
          </Defs>

          <Circle cx="60" cy="60" r="55" fill="url(#splashGrad1)" opacity="0.95" />
          <Circle cx="25" cy="35" r="10" fill="url(#splashGrad1)" />
          <Circle cx="95" cy="35" r="10" fill="url(#splashGrad2)" />
          <Circle cx="95" cy="85" r="10" fill="url(#splashGrad1)" />
          <Circle cx="25" cy="85" r="10" fill="url(#splashGrad2)" />
          <Circle cx="60" cy="60" r="18" fill="#ffffff" opacity="0.8" />
        </Svg>
      </Animated.View>

      {/* Animated brand name */}
      <Animated.Text
        style={[
          styles.brandName,
          {
            color: textColor,
            opacity: textOpacity,
            fontSize: width < 375 ? 32 : 40,
          },
        ]}
      >
        NAFA
      </Animated.Text>

      {/* Animated tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            color: accentColor,
            opacity: textOpacity,
            fontSize: width < 375 ? 14 : 16,
          },
        ]}
      >
        Marché Connect
      </Animated.Text>

      {/* Bottom accent line and slogan */}
      <Animated.View
        style={[
          styles.bottom,
          {
            opacity: bottomOpacity,
          },
        ]}
      >
        <View
          style={[
            styles.line,
            {
              backgroundColor: accentColor,
            },
          ]}
        />
        <Animated.Text
          style={[
            styles.slogan,
            {
              color: textColor,
              fontSize: width < 375 ? 12 : 14,
            },
          ]}
        >
          Connecter les marchés. Créer des opportunités.
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: NAFA_SPACING.base,
  },
  logoContainer: {
    marginBottom: NAFA_SPACING.xl,
  },
  brandName: {
    ...NAFA_TYPOGRAPHY.styles.h1,
    fontWeight: '700',
    marginBottom: NAFA_SPACING.sm,
  },
  tagline: {
    ...NAFA_TYPOGRAPHY.styles.bodySmall,
    fontWeight: '400',
    letterSpacing: 1,
    marginBottom: NAFA_SPACING.xl,
  },
  bottom: {
    position: 'absolute',
    bottom: NAFA_SPACING.lg * 2,
    alignItems: 'center',
    width: '100%',
  },
  line: {
    width: 60,
    height: 2,
    marginBottom: NAFA_SPACING.md,
    borderRadius: 1,
  },
  slogan: {
    ...NAFA_TYPOGRAPHY.styles.caption,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: NAFA_SPACING.base,
    fontStyle: 'italic',
  },
});
