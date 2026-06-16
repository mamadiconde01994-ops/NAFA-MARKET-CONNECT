import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

export function useColors() {
  const { resolvedTheme } = useTheme();
  const palette =
    resolvedTheme === "dark"
      ? colors.dark
      : resolvedTheme === "green"
        ? colors.green
        : colors.light;
  return { ...palette, radius: colors.radius };
}
