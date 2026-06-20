import { Dimensions, PixelRatio } from "react-native";

const { width: W } = Dimensions.get("window");

// Base reference width (iPhone 14 / standard 390px)
const BASE = 390;

// Scale factor clamped between 0.88 and 1.22 to avoid extreme rescaling
const factor = Math.min(1.22, Math.max(0.88, W / BASE));

/**
 * Scale a layout size (padding, margin, icon size, height) proportionally to screen width.
 * Returns an integer.
 */
export function rs(size: number): number {
  return Math.round(size * factor);
}

/**
 * Scale a font size with a softer curve (±10% max difference vs full scale),
 * ensuring readable text on all screen sizes.
 * Returns an integer.
 */
export function rf(size: number): number {
  const softFactor = Math.min(1.12, Math.max(0.92, factor));
  return Math.round(size * softFactor);
}

/**
 * Minimum accessible touch target size (44pt Apple HIG / 48dp Android).
 */
export const MIN_TOUCH = 48;

/**
 * Current screen width.
 */
export const SCREEN_W = W;

/**
 * Whether this is a small phone (< 360px, e.g. iPhone SE).
 */
export const IS_SMALL = W < 360;
