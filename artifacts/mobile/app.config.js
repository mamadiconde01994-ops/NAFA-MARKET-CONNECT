const replitDevDomain = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}:3000`
  : "https://replit.com/";

module.exports = {
  expo: {
    name: "NAFA Marché Connect",
    slug: "nafa-market-connect",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/branding/app-icon-v2.svg",
    scheme: "nafa",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/branding/splash-light.svg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.nafa.market.connect",
      buildNumber: "1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/branding/app-icon-v2.svg",
        backgroundColor: "#1a472a",
      },
      package: "com.nafa.market.connect",
    },
    web: {
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: replitDevDomain,
          headOrigin: replitDevDomain,
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
