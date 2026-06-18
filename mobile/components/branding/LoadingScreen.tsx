import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import { NAFA_COLORS, NAFA_SPACING } from '@/constants/branding';

const { width } = useWindowDimensions();

interface LoadingScreenProps {
  message?: string;
  isDark?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Chargement...',
  isDark: isDarkProp,
}) => {
  const colorScheme = useColorScheme();
  const isDark = isDarkProp ?? colorScheme === 'dark';

  const rotation = React.useRef(new Animated.Value(0)).current;
  const dotOpacities = React.useRef([
    new Animated.Value(0.4),
    new Animated.Value(0.4),
    new Animated.Value(0.4),
  ]).current;

  React.useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spin.start();

    // Start pulsing dots animations
    const dotAnims = dotOpacities.map((op, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 120),
          Animated.timing(op, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(op, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        ])
      )
    );
    dotAnims.forEach((a) => a.start());

    return () => {
      spin.stop();
      dotAnims.forEach((a) => a.stop && a.stop());
    };
  }, [rotation]);

  const spinInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundColor = isDark
    ? NAFA_COLORS.dark.bg
    : NAFA_COLORS.neutral.white;
  const textColor = isDark ? NAFA_COLORS.dark.text : NAFA_COLORS.neutral.dark;

  const logoSize = Math.min(width * 0.2, 80);
  const dotSize = Math.max(6, Math.round(width * 0.02));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.loadingLogo,
          {
            transform: [{ rotate: spinInterpolate }],
            width: logoSize,
            height: logoSize,
          },
        ]}
      >
        <Svg
          width={logoSize}
          height={logoSize}
          viewBox="0 0 120 120"
          fill="none"
        >
          {/* Animated spinner with brand colors */}
          <Circle
            cx="60"
            cy="60"
            r="50"
            stroke={NAFA_COLORS.primary.main}
            strokeWidth="3"
            fill="none"
            opacity="0.2"
          />
          <Circle
            cx="60"
            cy="60"
            r="50"
            stroke={NAFA_COLORS.accent.gold}
            strokeWidth="4"
            fill="none"
            strokeDasharray="31.4 94.2"
            strokeLinecap="round"
          />

          {/* Central hub */}
          <Circle
            cx="60"
            cy="60"
            r="15"
            fill={NAFA_COLORS.primary.main}
            opacity="0.9"
          />
        </Svg>
      </Animated.View>

      <Text
        style={[
          styles.message,
          {
            color: textColor,
            fontSize: width < 375 ? 14 : 16,
          },
        ]}
      >
        {message}
      </Text>

      {/* Pulsing dots indicator (responsive + performant) */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: NAFA_COLORS.primary.main,
                opacity: dotOpacities[i],
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                marginHorizontal: NAFA_SPACING.sm / 2,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export const Text: React.FC<any> = ({ style, children, ...props }) => (
  <Animated.Text style={style} {...props}>
    {children}
  </Animated.Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: NAFA_SPACING.base,
  },
  loadingLogo: {
    marginBottom: NAFA_SPACING.xl,
  },
  message: {
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: NAFA_SPACING.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: NAFA_SPACING.lg,
  },
  dot: {
    borderRadius: 4,
  },
});
