import React, { createContext, useContext, useEffect, useState } from "react";

interface NetworkContextValue {
  isOnline: boolean;
  isConnecting: boolean;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsOnline(true);
    setIsConnecting(false);
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, isConnecting }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
