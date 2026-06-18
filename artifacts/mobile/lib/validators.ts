/**
 * Email validation using regex pattern
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone validation for Guinea numbers (+224 or 621-622-623)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+224|00224)?[0-9\s\-\.]{7,}$|^(62[0-9]|65[0-9])[0-9\s\-\.]{6,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Password strength validation
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  feedback: string[];
} => {
  const feedback: string[] = [];

  if (password.length < 8) {
    feedback.push("Au moins 8 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push("Au moins une majuscule");
  }
  if (!/[a-z]/.test(password)) {
    feedback.push("Au moins une minuscule");
  }
  if (!/[0-9]/.test(password)) {
    feedback.push("Au moins un chiffre");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    feedback.push("Au moins un caractère spécial (!@#$%^&*)");
  }

  return {
    isValid: feedback.length === 0,
    feedback,
  };
};

/**
 * Full name validation (at least 2 words)
 */
export const validateFullName = (name: string): boolean => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

/**
 * Username validation (alphanumeric, 3-20 chars)
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Get password strength level
 */
export const getPasswordStrength = (
  password: string
): "weak" | "medium" | "strong" => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  if (strength <= 1) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
};

/**
 * Check if password is commonly used (simple check)
 */
const COMMON_PASSWORDS = [
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "nafa123",
  "guinee",
];

export const isCommonPassword = (password: string): boolean => {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
};

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return `+224 ${digits.slice(-9, -6)} ${digits.slice(-6, -3)} ${digits.slice(-3)}`;
};

/**
 * Validate entire login form
 */
export const validateLoginForm = (
  email: string,
  password: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email est requis";
  } else if (!validateEmail(email)) {
    errors.email = "Email invalide";
  }

  if (!password) {
    errors.password = "Mot de passe est requis";
  } else if (password.length < 6) {
    errors.password = "Mot de passe trop court";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate entire registration form
 */
export const validateRegistrationForm = (
  fullName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!fullName.trim()) {
    errors.fullName = "Nom complet est requis";
  } else if (!validateFullName(fullName)) {
    errors.fullName = "Entrez au moins prénom et nom";
  }

  if (!email.trim()) {
    errors.email = "Email est requis";
  } else if (!validateEmail(email)) {
    errors.email = "Email invalide";
  }

  if (!phone.trim()) {
    errors.phone = "Téléphone est requis";
  } else if (!validatePhone(phone)) {
    errors.phone = "Numéro de téléphone invalide";
  }

  if (!password) {
    errors.password = "Mot de passe est requis";
  } else if (password.length < 8) {
    errors.password = "Au moins 8 caractères requis";
  } else if (isCommonPassword(password)) {
    errors.password = "Ce mot de passe est trop commun";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
