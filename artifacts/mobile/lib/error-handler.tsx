import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error);
    }
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export interface ErrorFallbackProps {
  error: Error | null;
  retry?: () => void;
}

export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const { colors } = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      gap: 16,
      alignItems: "center",
    },
    icon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#FEE2E2",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    errorDetails: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      width: "100%",
      maxHeight: 150,
    },
    errorText: {
      fontSize: 11,
      color: "#7F1D1D",
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: colors.card,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.icon}>
          <Ionicons name="alert-circle" size={32} color="#DC2626" />
        </View>

        <Text style={styles.title}>Une erreur est survenue</Text>
        <Text style={styles.message}>
          Nous nous excusons pour ce désagrément. Veuillez réessayer.
        </Text>

        {error && (
          <ScrollView style={styles.errorDetails}>
            <Text style={styles.errorText}>{error.toString()}</Text>
          </ScrollView>
        )}

        {retry && (
          <TouchableOpacity style={styles.button} onPress={retry}>
            <Text style={styles.buttonText}>Réessayer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/**
 * Error handling utilities
 */
export class ErrorHandler {
  static isNetworkError(error: any): boolean {
    return (
      error?.message?.includes("Network") ||
      error?.message?.includes("timeout") ||
      error?.code === "NETWORK_ERROR"
    );
  }

  static isValidationError(error: any): boolean {
    return error?.code === "VALIDATION_ERROR" || error?.status === 400;
  }

  static isAuthError(error: any): boolean {
    return error?.code === "AUTH_ERROR" || error?.status === 401;
  }

  static isServerError(error: any): boolean {
    return error?.status && error.status >= 500;
  }

  static getUserMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return "Veuillez vérifier votre connexion Internet";
    }
    if (this.isAuthError(error)) {
      return "Veuillez vous reconnecter";
    }
    if (this.isValidationError(error)) {
      return error.message || "Données invalides";
    }
    if (this.isServerError(error)) {
      return "Erreur serveur. Veuillez réessayer plus tard";
    }
    return "Une erreur est survenue. Veuillez réessayer";
  }

  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries exceeded");
  }
}
