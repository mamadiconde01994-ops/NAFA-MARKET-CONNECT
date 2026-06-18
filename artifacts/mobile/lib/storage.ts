import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ONBOARDING_DONE: "nafa_onboarding_done",
  AUTH_USER: "nafa_auth_user",
  AUTH_TOKENS: "nafa_auth_tokens",
  CART: "nafa_cart",
} as const;

export async function getOnboardingDone(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
    return v === "true";
  } catch {
    return false;
  }
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, "true");
}

export async function getStoredUser(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_USER);
  } catch {
    return null;
  }
}

export async function setStoredUser(json: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.AUTH_USER, json);
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.AUTH_USER);
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function getStoredTokens(): Promise<StoredTokens | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.AUTH_TOKENS);
    if (!json) return null;
    return JSON.parse(json) as StoredTokens;
  } catch {
    return null;
  }
}

export async function setStoredTokens(tokens: StoredTokens): Promise<void> {
  await AsyncStorage.setItem(KEYS.AUTH_TOKENS, JSON.stringify(tokens));
}

export async function clearStoredTokens(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.AUTH_TOKENS);
}

export async function getStoredCart(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.CART);
  } catch {
    return null;
  }
}

export async function setStoredCart(json: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.CART, json);
}
