import React from "react";
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Reanimated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  BounceIn,
  ZoomIn,
} from "react-native-reanimated";

/**
 * Fade in animation component
 */
export function FadeInView({
  children,
  duration = 500,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  return (
    <Reanimated.View
      entering={FadeIn.duration(duration)}
      style={style}
    >
      {children}
    </Reanimated.View>
  );
}

/**
 * Slide in from right animation
 */
export function SlideInFromRight({
  children,
  duration = 400,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  return (
    <Reanimated.View
      entering={SlideInRight.duration(duration)}
      style={style}
    >
      {children}
    </Reanimated.View>
  );
}

/**
 * Bounce in animation
 */
export function BounceInView({
  children,
  duration = 600,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  return (
    <Reanimated.View
      entering={BounceIn.duration(duration)}
      style={style}
    >
      {children}
    </Reanimated.View>
  );
}

/**
 * Zoom in animation
 */
export function ZoomInView({
  children,
  duration = 300,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  return (
    <Reanimated.View
      entering={ZoomIn.duration(duration)}
      style={style}
    >
      {children}
    </Reanimated.View>
  );
}

/**
 * Scale animation (press effect)
 */
export function ScalableView({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      style={[
        {
          transform: [{ scale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Pulse animation (attention seeking)
 */
export function PulseView({
  children,
  duration = 2000,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Shake animation (error feedback)
 */
export function ShakeView({
  children,
  triggered = false,
  style,
}: {
  children: React.ReactNode;
  triggered?: boolean;
  style?: ViewStyle;
}) {
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (triggered) {
      Animated.sequence([
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [triggered, translateX]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Slide down animation (expand/collapse)
 */
export function ExpandableView({
  isExpanded,
  children,
  style,
}: {
  isExpanded: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const height = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(height, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, height]);

  return (
    <Animated.View
      style={[
        {
          opacity: height,
          maxHeight: height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000],
          }),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
