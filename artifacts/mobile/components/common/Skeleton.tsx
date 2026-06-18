import React from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    skeleton: {
      backgroundColor: colors.background,
      borderRadius,
      overflow: "hidden",
    },
    shimmer: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.border,
    },
  });

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
        },
        style,
      ]}
    >
      <View style={styles.shimmer} />
    </View>
  );
}

export function SkeletonLine({ width = "100%", style }: SkeletonProps) {
  return <Skeleton width={width} height={12} borderRadius={6} style={style} />;
}

export function SkeletonCircle({ size = 40, style }: { size?: number; style?: any }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
}

export interface SkeletonListProps {
  count?: number;
  height?: number;
  spacing?: number;
}

export function SkeletonList({ count = 3, height = 60, spacing = 12 }: SkeletonListProps) {
  const { colors } = useColors();

  return (
    <View style={{ gap: spacing }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <SkeletonCircle size={40} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonLine width="70%" />
            <SkeletonLine width="90%" />
          </View>
        </View>
      ))}
    </View>
  );
}
