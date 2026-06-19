import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type FavCategory = "product" | "restaurant" | "property" | "service" | "warehouse";

export interface FavoriteItem {
  id: string;
  category: FavCategory;
  savedAt: string;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  addFavorite: (id: string, category: FavCategory) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string, category: FavCategory) => void;
  isFavorite: (id: string) => boolean;
  clearCategory: (category: FavCategory) => void;
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/* ── Pre-seeded mock favorites ── */
function ts(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 86400 * 1000).toISOString();
}

const INITIAL: FavoriteItem[] = [
  { id: "p1",    category: "product",    savedAt: ts(0) },
  { id: "p2",    category: "product",    savedAt: ts(1) },
  { id: "p8",    category: "product",    savedAt: ts(3) },
  { id: "r1",    category: "restaurant", savedAt: ts(0) },
  { id: "r7",    category: "restaurant", savedAt: ts(2) },
  { id: "prop1", category: "property",   savedAt: ts(1) },
  { id: "prop6", category: "property",   savedAt: ts(4) },
  { id: "svc2",  category: "service",    savedAt: ts(0) },
  { id: "svc5",  category: "service",    savedAt: ts(5) },
  { id: "wh1",   category: "warehouse",  savedAt: ts(2) },
];

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(INITIAL);

  const addFavorite = useCallback((id: string, category: FavCategory) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === id)
        ? prev
        : [{ id, category, savedAt: new Date().toISOString() }, ...prev],
    );
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string, category: FavCategory) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === id)) return prev.filter((f) => f.id !== id);
      return [{ id, category, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const clearCategory = useCallback((category: FavCategory) => {
    setFavorites((prev) => prev.filter((f) => f.category !== category));
  }, []);

  const clearAll = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearCategory, clearAll }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearCategory, clearAll],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
