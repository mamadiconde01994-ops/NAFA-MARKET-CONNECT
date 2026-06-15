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
} from "@/lib/storage";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const json = await getStoredUser();
      if (json) {
        try {
          setUser(JSON.parse(json) as User);
        } catch {
          await clearStoredUser();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    const authed: User = found ?? { ...MOCK_CURRENT_USER, email };
    await setStoredUser(JSON.stringify(authed));
    setUser(authed);
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
      await setStoredUser(JSON.stringify(newUser));
      setUser(newUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearStoredUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
