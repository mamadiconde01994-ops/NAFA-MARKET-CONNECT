import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FavoriteItem } from "@/types";

const FAVORITES_KEY = "nafa_favorites";

export async function loadFavorites(): Promise<FavoriteItem[] | null> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is FavoriteItem =>
          item && typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.category === "string" &&
          typeof item.savedAt === "string",
      )
      .map((item) => ({
        id: item.id,
        category: item.category as FavoriteItem["category"],
        savedAt: item.savedAt,
      }));
  } catch {
    return null;
  }
}

export async function saveFavorites(items: FavoriteItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}
