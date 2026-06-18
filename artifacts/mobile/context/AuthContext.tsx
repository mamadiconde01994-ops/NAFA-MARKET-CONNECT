import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { MOCK_CURRENT_USER, MOCK_USERS } from "@/constants/mockData";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
} from "@/lib/storage";
import {
  generateTokens,
  validateToken,
  refreshAccessToken,
  decodeToken,
  isTokenExpired,
} from "@/lib/auth";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const json = await getStoredUser();
      const tokens = await getStoredTokens();

      if (json && tokens) {
        try {
          const parsedUser = JSON.parse(json) as User;
          
          // Validate token before restoring
          if (validateToken(tokens.accessToken)) {
            setUser(parsedUser);
            setAccessToken(tokens.accessToken);
          } else if (tokens.refreshToken && !isTokenExpired(tokens.refreshToken)) {
            // Try to refresh
            const newToken = refreshAccessToken(tokens.refreshToken);
            if (newToken) {
              setAccessToken(newToken);
              setUser(parsedUser);
              await setStoredTokens({
                ...tokens,
                accessToken: newToken,
              });
            } else {
              // Refresh failed, clear auth
              await clearStoredUser();
              await clearStoredTokens();
            }
          } else {
            // Both tokens invalid/expired
            await clearStoredUser();
            await clearStoredTokens();
          }
        } catch {
          await clearStoredUser();
          await clearStoredTokens();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    const authedUser: User = found ?? { ...MOCK_CURRENT_USER, email };
    
    // Generate tokens
    const tokens = generateTokens(authedUser.id, authedUser.email, authedUser.role);
    
    await setStoredUser(JSON.stringify(authedUser));
    await setStoredTokens(tokens);
    
    setUser(authedUser);
    setAccessToken(tokens.accessToken);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      role: UserRole,
      _password: string,
    ) => {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role,
        location: "Conakry, Guinée",
        verified: false,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
        stats: { listings: 0, sales: 0, orders: 0, rating: 0 },
      };
      
      // Generate tokens
      const tokens = generateTokens(newUser.id, newUser.email, newUser.role);
      
      await setStoredUser(JSON.stringify(newUser));
      await setStoredTokens(tokens);
      
      setUser(newUser);
      setAccessToken(tokens.accessToken);
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearStoredUser();
    await clearStoredTokens();
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const tokens = await getStoredTokens();
    if (!tokens?.refreshToken) return false;

    const newAccessToken = refreshAccessToken(tokens.refreshToken);
    if (!newAccessToken) {
      await clearStoredUser();
      await clearStoredTokens();
      setUser(null);
      setAccessToken(null);
      return false;
    }

    setAccessToken(newAccessToken);
    await setStoredTokens({
      ...tokens,
      accessToken: newAccessToken,
    });
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        accessToken,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
