import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fr" | "en" | "ar";

export type LanguageOption = {
  code: Language;
  label: string;
  nativeLabel: string;
  englishLabel: string;
};

export const LANGUAGE_STORAGE_KEY = "@nafa_language";

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "fr", label: "Français", nativeLabel: "Français", englishLabel: "French" },
  { code: "en", label: "English", nativeLabel: "English", englishLabel: "English" },
  { code: "ar", label: "العربية", nativeLabel: "العربية", englishLabel: "Arabic" },
] as const;

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    languagePageTitle: "Langue",
    languagePageSubtitle: "Choisissez votre langue préférée",
    languageOptionFr: "Français",
    languageOptionEn: "English",
    languageOptionAr: "العربية",

    loginSubtitle: "Connectez-vous pour accéder à toutes les fonctionnalités",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "votre@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Votre mot de passe",
    passwordForgot: "Mot de passe oublié ?",
    loginErrorInvalid: "E-mail ou mot de passe incorrect",
    loginSubmit: "Se connecter",
    orText: "ou",
    loginGuest: "Continuer sans compte",
    loginRegisterPrompt: "Pas encore inscrit ?",
    loginCreateAccount: "Créer un compte",
    loginPolicyTerms: "conditions d'utilisation",
    loginPolicyAnd: "et la",
    loginPolicyPrivacy: "politique de confidentialité",

    registerTitle: "Créer un compte",
    registerNameLabel: "Nom complet",
    registerNamePlaceholder: "Votre nom et prénom",
    registerEmailLabel: "Adresse e-mail",
    registerPhoneLabel: "Numéro de téléphone",
    registerPhonePlaceholder: "+224 6XX XX XX XX",
    registerPasswordLabel: "Mot de passe",
    registerPasswordPlaceholder: "Choisissez un mot de passe",
    registerConfirmPasswordLabel: "Confirmer le mot de passe",
    registerConfirmPasswordPlaceholder: "Répétez votre mot de passe",
    registerTermsNotice: "J'accepte les",
    registerTermsError: "Veuillez accepter les conditions d'utilisation",
    registerErrorGeneral: "Une erreur est survenue. Veuillez réessayer.",
    registerSubmit: "Créer mon compte",

    forgotTitle: "Mot de passe oublié",
    forgotSubtitle: "Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation",
    forgotEmailRequired: "L'adresse e-mail est requise",
    forgotEmailInvalid: "Adresse e-mail invalide",
    forgotSendError: "Erreur lors de l'envoi. Veuillez réessayer.",
    forgotSubmit: "Envoyer le lien",
    forgotSubmitted: "Lien envoyé !",
    forgotSentTitle: "E-mail envoyé !",
    forgotSentText: "Vérifiez votre boîte mail et suivez les instructions pour réinitialiser votre mot de passe.",

    guestTitle: "Rejoignez NAFA Marché",
    guestSubtitle: "Achetez, vendez et connectez-vous avec toute la Guinée depuis votre téléphone.",
    loginButton: "Se connecter",
    registerButton: "Créer un compte",
    continueAsGuest: "Continuer sans compte",

    comingSoonTitle: "Bientôt disponible",
    comingSoonMessage: "Cette fonctionnalité sera disponible très prochainement.",

    profileSectionAccount: "Mon compte",
    profileSectionAppearance: "Apparence",
    profileSectionHelp: "Aide & Support",
    profileSectionPreferences: "Préférences",
    profileEditProfile: "Modifier mon profil",
    profileMyListings: "Mes annonces",
    profileFavorites: "Mes favoris",
    profilePublishProduct: "Publier un produit",
    profileNotifications: "Notifications",
    profileLanguage: "Langue",
    profileSecurity: "Sécurité",
    profileTerms: "Conditions d'utilisation",
    profilePrivacy: "Confidentialité",
    profileHelpCenter: "Centre d'aide",
    profileAbout: "À propos de NAFA",
    profilePartnerTitle: "Programme Partenaire",
    profilePartnerSubtitle: "Rejoignez notre réseau et gagnez des commissions",
    profilePartnerStatusVerified: "Vérifié",
    profilePartnerStatusPending: "En attente",
    profilePartnerDashboardButton: "Mon tableau de bord",

    notificationsTitle: "Notifications",
    notificationsNoNew: "Aucune nouvelle notification",

    privacyTitle: "Politique de confidentialité",
    privacyIntro: "Chez NAFA Marché, nous respectons votre vie privée et nous engageons à protéger vos données personnelles.",
    privacyDataTitle: "Données personnelles",
    privacyDataText: "Vos données personnelles sont stockées de manière sécurisée et ne sont jamais vendues à des tiers.",
    privacyUseTitle: "Utilisation des données",
    privacyUseText: "Nous utilisons vos données pour améliorer votre expérience et vous proposer des offres pertinentes.",
    privacyShareTitle: "Partage des données",
    privacyShareText: "Nous partageons uniquement les données nécessaires avec nos partenaires de confiance.",
    privacyRightsTitle: "Vos droits",
    privacyRightsText: "Vous avez le droit d'accéder, de modifier ou de supprimer vos données à tout moment.",
  },
  en: {
    languagePageTitle: "Language",
    languagePageSubtitle: "Choose your preferred language",
    languageOptionFr: "Français",
    languageOptionEn: "English",
    languageOptionAr: "العربية",

    loginSubtitle: "Sign in to access all features",
    emailLabel: "Email address",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your password",
    passwordForgot: "Forgot password?",
    loginErrorInvalid: "Invalid email or password",
    loginSubmit: "Sign in",
    orText: "or",
    loginGuest: "Continue without account",
    loginRegisterPrompt: "Not registered yet?",
    loginCreateAccount: "Create account",
    loginPolicyTerms: "terms of service",
    loginPolicyAnd: "and",
    loginPolicyPrivacy: "privacy policy",

    registerTitle: "Create account",
    registerNameLabel: "Full name",
    registerNamePlaceholder: "Your first and last name",
    registerEmailLabel: "Email address",
    registerPhoneLabel: "Phone number",
    registerPhonePlaceholder: "+224 6XX XX XX XX",
    registerPasswordLabel: "Password",
    registerPasswordPlaceholder: "Choose a password",
    registerConfirmPasswordLabel: "Confirm password",
    registerConfirmPasswordPlaceholder: "Repeat your password",
    registerTermsNotice: "I agree to the",
    registerTermsError: "Please accept the terms of service",
    registerErrorGeneral: "An error occurred. Please try again.",
    registerSubmit: "Create my account",

    forgotTitle: "Forgot password",
    forgotSubtitle: "Enter your email address to receive a reset link",
    forgotEmailRequired: "Email address is required",
    forgotEmailInvalid: "Invalid email address",
    forgotSendError: "Error sending. Please try again.",
    forgotSubmit: "Send link",
    forgotSubmitted: "Link sent!",
    forgotSentTitle: "Email sent!",
    forgotSentText: "Check your inbox and follow the instructions to reset your password.",

    guestTitle: "Join NAFA Marché",
    guestSubtitle: "Buy, sell and connect with all of Guinea from your phone.",
    loginButton: "Sign in",
    registerButton: "Create account",
    continueAsGuest: "Continue without account",

    comingSoonTitle: "Coming soon",
    comingSoonMessage: "This feature will be available very soon.",

    profileSectionAccount: "My account",
    profileSectionAppearance: "Appearance",
    profileSectionHelp: "Help & Support",
    profileSectionPreferences: "Preferences",
    profileEditProfile: "Edit profile",
    profileMyListings: "My listings",
    profileFavorites: "My favorites",
    profilePublishProduct: "Publish product",
    profileNotifications: "Notifications",
    profileLanguage: "Language",
    profileSecurity: "Security",
    profileTerms: "Terms of service",
    profilePrivacy: "Privacy policy",
    profileHelpCenter: "Help center",
    profileAbout: "About NAFA",
    profilePartnerTitle: "Partner Program",
    profilePartnerSubtitle: "Join our network and earn commissions",
    profilePartnerStatusVerified: "Verified",
    profilePartnerStatusPending: "Pending",
    profilePartnerDashboardButton: "My dashboard",

    notificationsTitle: "Notifications",
    notificationsNoNew: "No new notifications",

    privacyTitle: "Privacy Policy",
    privacyIntro: "At NAFA Marché, we respect your privacy and are committed to protecting your personal data.",
    privacyDataTitle: "Personal data",
    privacyDataText: "Your personal data is stored securely and is never sold to third parties.",
    privacyUseTitle: "Data use",
    privacyUseText: "We use your data to improve your experience and offer you relevant deals.",
    privacyShareTitle: "Data sharing",
    privacyShareText: "We only share necessary data with our trusted partners.",
    privacyRightsTitle: "Your rights",
    privacyRightsText: "You have the right to access, modify or delete your data at any time.",
  },
  ar: {},
};

type TranslationKey = string;

interface LanguageContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  languageLabel: string;
  supportedLanguages: readonly LanguageOption[];
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "fr",
  direction: "ltr",
  languageLabel: "Français",
  supportedLanguages: LANGUAGE_OPTIONS,
  setLanguage: async () => {},
  t: (key: TranslationKey) => TRANSLATIONS.fr[key] ?? key,
});

function getTranslation(lang: Language, key: TranslationKey): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.fr[key] ?? key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (stored === "fr" || stored === "en" || stored === "ar") {
        setLanguageState(stored as Language);
      }
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const direction: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({
      language,
      direction,
      languageLabel: LANGUAGE_OPTIONS.find((item) => item.code === language)?.label ?? "Français",
      supportedLanguages: LANGUAGE_OPTIONS,
      setLanguage,
      t: (key: TranslationKey) => getTranslation(language, key),
    }),
    [direction, language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
