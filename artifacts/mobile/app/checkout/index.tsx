import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";

type CheckoutStep = 1 | 2 | 3 | 4;

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: "card" | "mobile_money" | "transfer";
  name: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "1", type: "card", name: "Carte Bancaire", description: "Visa, Mastercard" },
  { id: "2", type: "mobile_money", name: "Orange Money", description: "Paiement par mobile" },
  { id: "3", type: "transfer", name: "Virement Bancaire", description: "Compte bancaire guinéen" },
];

export default function CheckoutFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useColors();
  const { items, totalAmount } = useCart();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Maison",
      street: "Route de Kindia, Commune de Ratoma",
      city: "Conakry",
      zipCode: "001",
      isDefault: true,
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState<string>("1");
  const [selectedPayment, setSelectedPayment] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as CheckoutStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CheckoutStep);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Navigate to confirmation
      handleNext();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCart = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    headerTitle: {
      color: colors.card,
      fontSize: 18,
      fontWeight: "600",
    },
    stepIndicator: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    step: {
      alignItems: "center",
      gap: 4,
    },
    stepNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    },
    stepNumberActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    stepNumberInactive: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    stepNumberText: {
      fontWeight: "600",
      fontSize: 14,
    },
    stepLabel: {
      fontSize: 12,
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 12,
    },
    cartItem: {
      flexDirection: "row",
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    itemDetails: {
      flex: 1,
      justifyContent: "center",
    },
    itemName: {
      fontWeight: "500",
      color: colors.text,
      fontSize: 14,
    },
    itemPrice: {
      color: colors.primary,
      fontWeight: "600",
      fontSize: 14,
      marginTop: 4,
    },
    authNotice: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      gap: 14,
    },
    authActions: {
      width: "100%",
      gap: 12,
      marginTop: 20,
    },
    authButton: {
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    authButtonText: {
      fontSize: 15,
      fontWeight: "600",
    },
    noteText: {
      fontSize: 14,
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    guestText: {
      textAlign: "center",
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 6,
    },
    addressOption: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    addressOptionSelected: {
      backgroundColor: colors.background,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    radioButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.card,
    },
    addressText: {
      flex: 1,
    },
    addressName: {
      fontWeight: "500",
      color: colors.text,
      fontSize: 14,
    },
    addressDetail: {
      color: colors.mutedForeground,
      fontSize: 12,
      marginTop: 2,
    },
    paymentOption: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    paymentOptionSelected: {
      backgroundColor: colors.background,
    },
    paymentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    paymentDetails: {
      flex: 1,
    },
    paymentName: {
      fontWeight: "500",
      color: colors.text,
      fontSize: 14,
    },
    paymentDesc: {
      color: colors.mutedForeground,
      fontSize: 12,
      marginTop: 2,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    summaryLabel: {
      color: colors.mutedForeground,
      fontSize: 14,
    },
    summaryValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "500",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 8,
    },
    totalLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    totalValue: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "700",
    },
    confirmationCard: {
      alignItems: "center",
      paddingVertical: 20,
    },
    confirmationIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#10B981",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    confirmationTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    confirmationText: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 16,
    },
    confirmationDetails: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginVertical: 12,
      width: "100%",
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    detailLabel: {
      color: colors.mutedForeground,
      fontSize: 12,
    },
    detailValue: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "500",
    },
    footer: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
    },
    buttonSecondary: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    buttonPrimaryText: {
      color: colors.card,
    },
    buttonSecondaryText: {
      color: colors.text,
    },
  });

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authNotice}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>Connexion requise</Text>
          <Text style={[styles.noteText, { textAlign: "center", marginTop: 8 }]}>Connectez-vous pour finaliser votre commande.</Text>
          <View style={styles.authActions}>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={[styles.authButtonText, { color: colors.primaryForeground }]}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, { borderColor: colors.border, borderWidth: 1, backgroundColor: colors.card }]}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={[styles.authButtonText, { color: colors.foreground }]}>Créer un compte</Text>
            </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/(tabs)")}> 
              <Text style={[styles.guestText, { color: colors.mutedForeground }]}>Continuer sans compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToCart}>
          <Ionicons name="arrow-back" size={24} color={colors.card} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passer la Commande</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.step}>
            <View
              style={[
                styles.stepNumber,
                step <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumberText,
                  { color: step <= currentStep ? colors.card : colors.mutedForeground },
                ]}
              >
                {step}
              </Text>
            </View>
            <Text style={styles.stepLabel}>
              {step === 1 ? "Panier" : step === 2 ? "Adresse" : step === 3 ? "Paiement" : "Confirmation"}
            </Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Review Cart */}
        {currentStep === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vérifier votre panier</Text>
            <View style={styles.card}>
              {items.length > 0 ? (
                items.map((item) => (
                  <View key={item.product.id} style={styles.cartItem}>
                    <View style={styles.itemImage} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>
                        {item.quantity}x {item.product.price.toLocaleString("fr-FR")} FG
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      {(item.product.price * item.quantity).toLocaleString("fr-FR")} FG
                    </Text>
                  </View>
                ))
              ) : (
                <View style={{ paddingHorizontal: 12, paddingVertical: 16 }}>
                  <Text style={{ color: colors.mutedForeground, textAlign: "center" }}>
                    Panier vide
                  </Text>
                </View>
              )}
            </View>

            {/* Summary */}
            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>{totalAmount.toLocaleString("fr-FR")} FG</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais de livraison</Text>
                <Text style={styles.summaryValue}>5,000 FG</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {(totalAmount + 5000).toLocaleString("fr-FR")} FG
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Select Address */}
        {currentStep === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
            <View style={styles.card}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressOption,
                    selectedAddress === address.id && styles.addressOptionSelected,
                  ]}
                  onPress={() => setSelectedAddress(address.id)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedAddress === address.id && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedAddress === address.id && <View style={styles.radioButtonInner} />}
                  </View>
                  <View style={styles.addressText}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressDetail}>{address.street}</Text>
                    <Text style={styles.addressDetail}>{address.city} - {address.zipCode}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Select Payment */}
        {currentStep === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Méthode de paiement</Text>
            <View style={styles.card}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment === method.id && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedPayment === method.id && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
                  </View>
                  <View style={styles.paymentIcon}>
                    <Ionicons
                      name={
                        method.type === "card"
                          ? "card"
                          : method.type === "mobile_money"
                            ? "phone-portrait"
                            : "swap-horizontal"
                      }
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    <Text style={styles.paymentDesc}>{method.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <View style={styles.section}>
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationIcon}>
                <Ionicons name="checkmark" size={40} color="white" />
              </View>
              <Text style={styles.confirmationTitle}>Commande confirmée!</Text>
              <Text style={styles.confirmationText}>
                Numéro de commande: #CMD{Date.now().toString().slice(-6)}
              </Text>

              <View style={styles.confirmationDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Articles:</Text>
                  <Text style={styles.detailValue}>{items.length} article(s)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.detailValue}>
                    {(totalAmount + 5000).toLocaleString("fr-FR")} FG
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Adresse:</Text>
                  <Text style={styles.detailValue}>
                    {addresses.find((a) => a.id === selectedAddress)?.name || ""}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Paiement:</Text>
                  <Text style={styles.detailValue}>
                    {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name || ""}
                  </Text>
                </View>
              </View>

              <Text style={[styles.confirmationText, { marginTop: 12, fontSize: 12 }]}>
                Vous recevrez un SMS de confirmation dans quelques instants.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleBack}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={18} color={colors.text} />
            <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Retour</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={currentStep === 3 ? handlePlaceOrder : handleNext}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, styles.buttonPrimaryText]}>
              {currentStep === 3 ? "Valider" : "Continuer"}
            </Text>
            <Ionicons
              name={currentStep === 3 ? "checkmark" : "arrow-forward"}
              size={18}
              color={colors.card}
            />
          </TouchableOpacity>
        )}

        {currentStep === 4 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleBackToCart}
          >
            <Text style={[styles.buttonText, styles.buttonPrimaryText]}>Continuer le shopping</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.card} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
