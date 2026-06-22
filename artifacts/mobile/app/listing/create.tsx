import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const GUINEA_CITIES = [
  "Conakry", "Kindia", "Labé", "Kankan", "N'Zérékoré",
  "Mamou", "Boké", "Faranah", "Siguiri", "Guéckédou",
  "Kissidougou", "Coyah", "Télimélé", "Pita", "Dabola",
];

const CAT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  "real-estate": "home-outline",
  service: "construct-outline",
  vehicle: "car-outline",
  warehouse: "cube-outline",
  job: "briefcase-outline",
  restaurant: "restaurant-outline",
  electronics: "phone-portrait-outline",
  fashion: "shirt-outline",
  furniture: "bed-outline",
  construction: "hammer-outline",
};

const CAT_COLOR: Record<string, string> = {
  "real-estate": "#2563EB",
  service: "#7C3AED",
  vehicle: "#475569",
  warehouse: "#DC2626",
  job: "#0891B2",
  restaurant: "#EA580C",
  electronics: "#6366F1",
  fashion: "#EC4899",
  furniture: "#0D9488",
  construction: "#92400E",
};

const CATEGORY_FIELDS: Record<string, string[]> = {
  "real-estate": ["title", "price", "location", "city", "description", "phone", "image"],
  service: ["title", "description", "location", "city", "phone", "image"],
  vehicle: ["title", "price", "description", "city", "phone", "image"],
  warehouse: ["title", "price", "description", "location", "city", "phone", "image"],
  job: ["title", "description", "city", "phone"],
  restaurant: ["title", "description", "location", "city", "phone", "image"],
  electronics: ["title", "price", "description", "city", "phone", "image"],
  fashion: ["title", "price", "description", "city", "phone", "image"],
  furniture: ["title", "price", "description", "city", "phone", "image"],
  construction: ["title", "price", "description", "city", "phone", "image"],
};

const FIELD_PLACEHOLDERS: Record<string, Record<string, string>> = {
  "real-estate": {
    title: "Ex: Villa 4 pièces à Kipé, Conakry",
    price: "Ex: 2 500 000 GNF / mois",
    description: "Décrivez le bien : superficie, état, commodités…",
    location: "Ex: Kipé, Ratoma",
    phone: "+224 6XX XX XX XX",
  },
  service: {
    title: "Ex: Électricien agréé — installations & dépannage",
    description: "Décrivez vos services, expérience, tarifs…",
    location: "Ex: Kaloum, Conakry",
    phone: "+224 6XX XX XX XX",
  },
  vehicle: {
    title: "Ex: Toyota Corolla 2019 — très bon état",
    price: "Ex: 45 000 000 GNF",
    description: "Kilométrage, couleur, transmission, options…",
    phone: "+224 6XX XX XX XX",
  },
  warehouse: {
    title: "Ex: Entrepôt 200m² — zone industrielle Matoto",
    price: "Ex: 800 000 GNF / mois",
    description: "Superficie, accès, sécurité, équipements…",
    location: "Ex: Zone industrielle Matoto",
    phone: "+224 6XX XX XX XX",
  },
  job: {
    title: "Ex: Comptable expérimenté — CDI",
    description: "Décrivez le poste, les requis, le salaire proposé…",
    phone: "+224 6XX XX XX XX",
  },
  restaurant: {
    title: "Ex: Maquis Chez Binta — cuisine locale",
    description: "Spécialités, horaires, capacité, livraison…",
    location: "Ex: Matam, Conakry",
    phone: "+224 6XX XX XX XX",
  },
  electronics: {
    title: "Ex: iPhone 14 Pro — 256 Go, état neuf",
    price: "Ex: 12 000 000 GNF",
    description: "État, accessoires inclus, garantie…",
    phone: "+224 6XX XX XX XX",
  },
  fashion: {
    title: "Ex: Lot de boubous brodés hommes — taille XL",
    price: "Ex: 350 000 GNF",
    description: "Matière, tailles disponibles, couleurs…",
    phone: "+224 6XX XX XX XX",
  },
  furniture: {
    title: "Ex: Canapé d'angle en cuir — 3 places",
    price: "Ex: 2 200 000 GNF",
    description: "Dimensions, couleur, état, livraison…",
    phone: "+224 6XX XX XX XX",
  },
  construction: {
    title: "Ex: 50 sacs ciment Portland — disponible immédiatement",
    price: "Ex: 180 000 GNF / sac",
    description: "Quantité, qualité, conditions de vente…",
    phone: "+224 6XX XX XX XX",
  },
};

interface FieldRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}

function FieldRow({ label, required, children, colors }: FieldRowProps) {
  return (
    <View style={fr.wrap}>
      <Text style={[fr.label, { color: colors.foreground }]}>
        {label}
        {required && <Text style={{ color: "#EF4444" }}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

const fr = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

export default function ListingCreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ category?: string; label?: string }>();

  const category = params.category ?? "real-estate";
  const categoryLabel = params.label ?? "Annonce";
  const catColor = CAT_COLOR[category] ?? BRAND_MID;
  const catIcon = CAT_ICON[category] ?? "pricetag-outline";
  const fields = CATEGORY_FIELDS[category] ?? ["title", "price", "description", "city", "phone"];
  const placeholders = FIELD_PLACEHOLDERS[category] ?? {};

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 32;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("Conakry");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [image, setImage] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasField = (f: string) => fields.includes(f);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [4, 3],
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Champ manquant", "Veuillez renseigner le titre de l'annonce.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Champ manquant", "Veuillez renseigner une description.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    Alert.alert(
      "Annonce soumise ! ✓",
      "Votre annonce a été envoyée pour vérification.\nDélai de validation : 24h ouvrées.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Ionicons name="lock-closed-outline" size={48} color={BRAND_MID} />
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground, marginTop: 16, textAlign: "center" }}>
          Connexion requise
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.mutedForeground, marginTop: 8, textAlign: "center", lineHeight: 21 }}>
          Vous devez être connecté pour publier une annonce.
        </Text>
        <Pressable
          onPress={() => router.push("/(auth)/login" as any)}
          style={({ pressed }) => [{ marginTop: 24, opacity: pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={[BRAND_LIGHT, BRAND_MID]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12 }}
          >
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" }}>Se connecter</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={[styles.catIconWrap, { backgroundColor: catColor + "28" }]}>
              <Ionicons name={catIcon} size={18} color={catColor === "#fff" ? BRAND_MID : catColor} />
            </View>
            <View>
              <Text style={styles.headerTitle}>{categoryLabel}</Text>
              <Text style={styles.headerSub}>Nouvelle annonce · Gratuit</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipStrip}>
          <Ionicons name="shield-checkmark" size={13} color={BRAND_ACCENT} />
          <Text style={styles.tipText}>Vérifiée sous 24h · Visible dans toute la Guinée</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.form, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo */}
        {hasField("image") && (
          <FieldRow label="Photo de l'annonce" colors={colors}>
            <Pressable
              onPress={pickImage}
              style={({ pressed }) => [
                styles.imagePicker,
                {
                  backgroundColor: image ? "transparent" : colors.muted,
                  borderColor: image ? catColor + "50" : colors.border,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} contentFit="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <View style={[styles.imageIconBg, { backgroundColor: catColor + "18" }]}>
                    <Ionicons name="camera-outline" size={28} color={catColor} />
                  </View>
                  <Text style={[styles.imagePickerText, { color: colors.mutedForeground }]}>
                    Ajouter une photo
                  </Text>
                  <Text style={[styles.imagePickerSub, { color: colors.mutedForeground }]}>
                    JPG, PNG — max 5 Mo
                  </Text>
                </View>
              )}
            </Pressable>
            {image && (
              <Pressable
                onPress={() => setImage(null)}
                style={[styles.removeImageBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
              >
                <Ionicons name="trash-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.removeImageText, { color: colors.mutedForeground }]}>Retirer la photo</Text>
              </Pressable>
            )}
          </FieldRow>
        )}

        {/* Title */}
        {hasField("title") && (
          <FieldRow label="Titre de l'annonce" required colors={colors}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={placeholders.title ?? "Titre de votre annonce"}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              maxLength={120}
            />
          </FieldRow>
        )}

        {/* Price */}
        {hasField("price") && (
          <FieldRow label="Prix" colors={colors}>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder={placeholders.price ?? "Ex: 500 000 GNF"}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              keyboardType="default"
            />
          </FieldRow>
        )}

        {/* Description */}
        {hasField("description") && (
          <FieldRow label="Description" required colors={colors}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={placeholders.description ?? "Décrivez votre annonce en détail…"}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
              {description.length}/1000
            </Text>
          </FieldRow>
        )}

        {/* Adresse */}
        {hasField("location") && (
          <FieldRow label="Adresse ou quartier" colors={colors}>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder={placeholders.location ?? "Ex: Kipé, Ratoma"}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            />
          </FieldRow>
        )}

        {/* City picker */}
        {hasField("city") && (
          <FieldRow label="Ville" colors={colors}>
            <Pressable
              onPress={() => setShowCityPicker((v) => !v)}
              style={[styles.input, styles.cityRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name="location-outline" size={16} color={catColor} />
              <Text style={[styles.cityText, { color: colors.foreground }]}>{city}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
            </Pressable>
            {showCityPicker && (
              <View style={[styles.cityDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {GUINEA_CITIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => { setCity(c); setShowCityPicker(false); }}
                    style={({ pressed }) => [
                      styles.cityOption,
                      { backgroundColor: c === city ? catColor + "14" : pressed ? colors.muted : "transparent" },
                    ]}
                  >
                    <Text style={[styles.cityOptionText, { color: c === city ? catColor : colors.foreground, fontFamily: c === city ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                      {c}
                    </Text>
                    {c === city && <Ionicons name="checkmark" size={15} color={catColor} />}
                  </Pressable>
                ))}
              </View>
            )}
          </FieldRow>
        )}

        {/* Phone */}
        {hasField("phone") && (
          <FieldRow label="Téléphone de contact" required colors={colors}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={placeholders.phone ?? "+224 6XX XX XX XX"}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              keyboardType="phone-pad"
            />
          </FieldRow>
        )}

        {/* Submit */}
        <View style={styles.submitWrap}>
          <Button
            label={loading ? "Publication en cours…" : "Publier l'annonce"}
            onPress={handleSubmit}
            fullWidth
            disabled={loading}
          />
          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            En publiant, vous acceptez les{" "}
            <Text style={{ color: BRAND_MID, fontFamily: "Inter_600SemiBold" }}>
              Conditions d'utilisation
            </Text>{" "}
            de NAFA Marché.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    marginTop: 1,
  },
  tipStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 11.5,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
    flex: 1,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  textarea: {
    height: 110,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
    marginTop: 4,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  cityText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  cityDropdown: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  cityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  cityOptionText: {
    fontSize: 14,
  },
  imagePicker: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    minHeight: 140,
    overflow: "hidden",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 28,
  },
  imageIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreview: {
    width: "100%",
    height: 180,
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  imagePickerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  removeImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  removeImageText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  submitWrap: {
    gap: 12,
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
