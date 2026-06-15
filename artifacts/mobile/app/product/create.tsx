import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
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
import { CATEGORIES } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { ProductCategory, ProductUnit } from "@/types";

const UNITS: { id: ProductUnit; label: string }[] = [
  { id: "kg", label: "kg" },
  { id: "piece", label: "Pièce" },
  { id: "bunch", label: "Botte" },
  { id: "bag", label: "Sac" },
  { id: "liter", label: "Litre" },
  { id: "bottle", label: "Bouteille" },
];

export default function CreateProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ProductCategory>("vegetables");
  const [unit, setUnit] = useState<ProductUnit>("kg");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

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
    if (!name.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert("Succès", "Votre produit a été publié !", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Publier un produit
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Image picker */}
        <Pressable
          onPress={pickImage}
          style={[
            styles.imagePicker,
            {
              backgroundColor: colors.muted,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={[styles.pickedImage, { borderRadius: colors.radius }]}
              contentFit="cover"
            />
          ) : (
            <View style={styles.imagePickerInner}>
              <Ionicons
                name="camera-outline"
                size={32}
                color={colors.mutedForeground}
              />
              <Text
                style={[
                  styles.imagePickerText,
                  { color: colors.mutedForeground },
                ]}
              >
                Ajouter une photo
              </Text>
            </View>
          )}
        </Pressable>

        {/* Name */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Nom du produit *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Tomates fraîches"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Category */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Catégorie *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      category === cat.id ? colors.primary : colors.card,
                    borderColor:
                      category === cat.id ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    {
                      color:
                        category === cat.id
                          ? colors.primaryForeground
                          : colors.foreground,
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Price & Unit */}
        <View style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Prix (GNF) *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="5000"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Unité *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6 }}
            >
              {UNITS.map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => setUnit(u.id)}
                  style={[
                    styles.unitChip,
                    {
                      backgroundColor:
                        unit === u.id ? colors.primary : colors.card,
                      borderColor:
                        unit === u.id ? colors.primary : colors.border,
                      borderRadius: colors.radius - 4,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color:
                        unit === u.id
                          ? colors.primaryForeground
                          : colors.foreground,
                    }}
                  >
                    {u.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Quantity */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Quantité disponible *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 100"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
          />
        </View>

        {/* Location */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Localisation
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Conakry, Kaloum"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Description */}
        <View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre produit..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          label="Publier le produit"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 18 },
  imagePicker: {
    height: 160,
    borderWidth: 1.5,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePickerInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePickerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  pickedImage: { width: "100%", height: "100%" },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 11,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textarea: { minHeight: 100, paddingTop: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  unitChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
