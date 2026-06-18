// Localization helpers for numbers, currency, dates, and regional data

import type { Language } from "@/context/LanguageContext";

// Currency data per country/region
const CURRENCY_MAP: Record<
  string,
  {
    code: string;
    symbol: string;
    nameEn: string;
    nameFr: string;
    nameAr: string;
    decimals: number;
  }
> = {
  GN: {
    code: "GNF",
    symbol: "ƒ",
    nameEn: "Guinea Franc",
    nameFr: "Franc Guinéen",
    nameAr: "فرنك غيني",
    decimals: 0,
  },
  US: {
    code: "USD",
    symbol: "$",
    nameEn: "US Dollar",
    nameFr: "Dollar Américain",
    nameAr: "دولار أمريكي",
    decimals: 2,
  },
  EU: {
    code: "EUR",
    symbol: "€",
    nameEn: "Euro",
    nameFr: "Euro",
    nameAr: "اليورو",
    decimals: 2,
  },
  SN: {
    code: "XOF",
    symbol: "₣",
    nameEn: "West African CFA Franc",
    nameFr: "Franc CFA Ouest Africain",
    nameAr: "فرنك غرب أفريقيا",
    decimals: 0,
  },
};

// Mobile money providers by country
const MOBILE_MONEY_PROVIDERS: Record<
  string,
  {
    name: string;
    icon: string;
    color: string;
    countries: string[];
  }[]
> = {
  GN: [
    {
      name: "Orange Money",
      icon: "📱",
      color: "#FF6600",
      countries: ["GN"],
    },
    {
      name: "MTN Mobile Money",
      icon: "📱",
      color: "#FFCC00",
      countries: ["GN"],
    },
    {
      name: "Moov Money",
      icon: "📱",
      color: "#00AA00",
      countries: ["GN"],
    },
  ],
  SN: [
    {
      name: "Orange Money",
      icon: "📱",
      color: "#FF6600",
      countries: ["SN"],
    },
    {
      name: "Free Money",
      icon: "📱",
      color: "#0000FF",
      countries: ["SN"],
    },
    {
      name: "Wave",
      icon: "📱",
      color: "#FF00FF",
      countries: ["SN"],
    },
  ],
};

/**
 * Format number based on locale
 * en: 1,234.56 | fr: 1 234,56 | ar: ١٬٢٣٤٫٥٦
 */
export function formatNumber(
  value: number,
  lang: Language = "en",
  decimals: number = 0
): string {
  const formatter = new Intl.NumberFormat(
    lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-EG" : "en-US",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }
  );
  return formatter.format(value);
}

/**
 * Format currency with symbol and locale
 * Example: formatCurrency(2500, "GN", "en") → "₣ 2,500"
 */
export function formatCurrency(
  value: number,
  countryCode: string = "GN",
  lang: Language = "en"
): string {
  const currency = CURRENCY_MAP[countryCode];
  if (!currency) return `${value.toLocaleString()} ???`;

  const formatted = formatNumber(value, lang, currency.decimals);
  return `${currency.symbol} ${formatted}`;
}

/**
 * Get currency info for a country
 */
export function getCurrencyInfo(countryCode: string = "GN") {
  return CURRENCY_MAP[countryCode] || CURRENCY_MAP.GN;
}

/**
 * Get mobile money providers for a country
 */
export function getMobileMoneyProviders(countryCode: string = "GN") {
  return MOBILE_MONEY_PROVIDERS[countryCode] || MOBILE_MONEY_PROVIDERS.GN;
}

/**
 * Format date based on locale
 * en: 1/17/2026 | fr: 17/01/2026 | ar: ١٧/١/٢٠٢٦
 */
export function formatDate(
  date: Date | string,
  lang: Language = "en",
  format: "short" | "long" = "short"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat(
    lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: format === "long" ? "long" : "2-digit",
      day: "2-digit",
    }
  );
  return formatter.format(d);
}

/**
 * Format time (12h/24h based on locale)
 */
export function formatTime(
  date: Date | string,
  lang: Language = "en"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat(
    lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-EG" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  return formatter.format(d);
}

/**
 * Format relative time (e.g., "2 hours ago", "il y a 2 heures")
 */
export function formatRelativeTime(
  date: Date | string,
  lang: Language = "en"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return lang === "fr" ? "À l'instant" : lang === "ar" ? "للتو" : "Just now";
  }
  if (diffMins < 60) {
    const m = diffMins;
    return lang === "fr"
      ? `Il y a ${m}m`
      : lang === "ar"
      ? `منذ ${m}د`
      : `${m}m ago`;
  }
  if (diffHours < 24) {
    const h = diffHours;
    return lang === "fr"
      ? `Il y a ${h}h`
      : lang === "ar"
      ? `منذ ${h}س`
      : `${h}h ago`;
  }
  if (diffDays < 7) {
    const d = diffDays;
    return lang === "fr"
      ? `Il y a ${d}j`
      : lang === "ar"
      ? `منذ ${d}ي`
      : `${d}d ago`;
  }

  return formatDate(d, lang, "short");
}

/**
 * Get region-specific default values
 */
export function getRegionalDefaults(countryCode: string = "GN") {
  return {
    currencyCode: CURRENCY_MAP[countryCode]?.code || "GNF",
    currencySymbol: CURRENCY_MAP[countryCode]?.symbol || "ƒ",
    mobileMoneyProviders: getMobileMoneyProviders(countryCode),
    decimals: CURRENCY_MAP[countryCode]?.decimals || 0,
  };
}

/**
 * Convert price between currencies (requires exchange rates)
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>
): number {
  if (fromCode === toCode) return amount;
  
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];
  
  if (!fromRate || !toRate) return amount; // Fallback if rates unavailable
  
  return (amount / fromRate) * toRate;
}
