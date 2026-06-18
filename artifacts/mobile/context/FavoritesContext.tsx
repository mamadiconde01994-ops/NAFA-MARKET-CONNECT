import React, { createContext, useContext, useMemo, useState } from "react";

interface FavoritesContextValue {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite: (id: string) =>
        setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id])),
      removeFavorite: (id: string) =>
        setFavorites((prev) => prev.filter((item) => item !== id)),
      isFavorite: (id: string) => favorites.includes(id),
    }),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
