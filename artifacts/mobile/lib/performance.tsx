import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  FlatListProps,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useColors } from "@/hooks/useColors";

export interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, "data"> {
  data: T[];
  loading?: boolean;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
}

/**
 * Virtualized list component with automatic optimization
 */
export function VirtualizedList<T>({
  data,
  loading = false,
  onEndReachedThreshold = 0.5,
  onEndReached,
  ...props
}: VirtualizedListProps<T>) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    loadingContainer: {
      paddingVertical: 16,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <FlatList
      {...props}
      data={data}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      removeClippedSubviews={true}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={onEndReached}
      ListFooterComponent={
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
}

/**
 * Memoization hook for expensive computations
 */
export function useMemoComputed<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Debounced callback for search/filter operations
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttled callback for scroll/resize operations
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastCallRef = React.useRef<number>(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    }) as T,
    [callback, delay]
  );
}
