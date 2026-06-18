import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const IMAGE_CACHE_KEY = "nafa_image_cache";
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

export interface CachedImage {
  uri: string;
  timestamp: number;
  size: number;
}

export class ImageCache {
  static async preloadImage(uri: string): Promise<void> {
    try {
      await Image.prefetch(uri);
      await this.recordImage(uri);
    } catch {
      // Silently fail
    }
  }

  static async preloadImages(uris: string[]): Promise<void> {
    await Promise.all(uris.map((uri) => this.preloadImage(uri)));
  }

  private static async recordImage(uri: string): Promise<void> {
    try {
      const cache = await this.getCache();
      const existing = cache.find((c) => c.uri === uri);

      if (!existing) {
        cache.push({
          uri,
          timestamp: Date.now(),
          size: 0, // Estimate
        });
        await this.setCache(cache);
      }
    } catch {
      // Silently fail
    }
  }

  private static async getCache(): Promise<CachedImage[]> {
    try {
      const json = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  private static async setCache(cache: CachedImage[]): Promise<void> {
    await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  }

  static async clearOldCache(): Promise<void> {
    try {
      const cache = await this.getCache();
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Remove images older than 7 days
      const filtered = cache.filter((c) => now - c.timestamp < 7 * oneDayMs);
      await this.setCache(filtered);
    } catch {
      // Silently fail
    }
  }

  static async getCacheStats(): Promise<{ count: number; oldestDate: number }> {
    const cache = await this.getCache();
    return {
      count: cache.length,
      oldestDate: cache.length > 0 ? Math.min(...cache.map((c) => c.timestamp)) : 0,
    };
  }
}
