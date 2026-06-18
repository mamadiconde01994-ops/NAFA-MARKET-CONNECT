/**
 * JWT Token management for secure authentication
 */

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Create a mock JWT token (in production, use server)
 */
export const createMockToken = (
  userId: string,
  email: string,
  role: string,
  expiresIn: number = 3600 // 1 hour
): string => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId,
    email,
    role,
    iat: now,
    exp: now + expiresIn,
  };

  // Mock JWT format: header.payload.signature
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa("mock-signature");

  return `${header}.${body}.${signature}`;
};

/**
 * Decode JWT token (mock implementation)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Check if token expires soon (within 5 minutes)
 */
export const isTokenExpiringSoon = (token: string, bufferSeconds = 300): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now < bufferSeconds;
};

/**
 * Generate tokens for user
 */
export const generateTokens = (
  userId: string,
  email: string,
  role: string
): AuthTokens => {
  const accessToken = createMockToken(userId, email, role, 3600); // 1 hour
  const refreshToken = createMockToken(userId, email, role, 7 * 24 * 3600); // 7 days

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = (refreshToken: string): string | null => {
  if (isTokenExpired(refreshToken)) {
    return null;
  }

  const payload = decodeToken(refreshToken);
  if (!payload) return null;

  return createMockToken(payload.userId, payload.email, payload.role, 3600);
};

/**
 * Validate token structure
 */
export const validateToken = (token: string): boolean => {
  if (!token || typeof token !== "string") return false;
  if (isTokenExpired(token)) return false;

  const payload = decodeToken(token);
  return payload !== null && !!payload.userId && !!payload.email;
};
