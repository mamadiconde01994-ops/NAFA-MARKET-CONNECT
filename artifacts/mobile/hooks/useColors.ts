import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

export type ColorTheme = typeof colors.light;

export function useColors(): ColorTheme & { colors: ColorTheme; radius: number } {
  const { resolvedTheme } = useTheme();
  const palette =
    resolvedTheme === "dark"
      ? colors.dark
      : resolvedTheme === "green"
        ? colors.green
        : colors.light;
  return { ...palette, colors: palette, radius: colors.radius };
}
