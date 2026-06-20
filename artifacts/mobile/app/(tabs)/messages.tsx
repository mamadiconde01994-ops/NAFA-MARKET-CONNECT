import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type ConvCategory = "agriculture" | "restaurant" | "real-estate" | "service" | "vehicle" | "job" | "support";

interface Conversation {
  id: string;
  name: string;
  role: string;
  context: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  category: ConvCategory;
}

const CAT_COLOR: Record<ConvCategory, string> = {
  agriculture: "#16A34A",
  restaurant: "#EA580C",
  "real-estate": "#2563EB",
  service: "#7C3AED",
  vehicle: "#475569",
  job: "#0891B2",
  support: "#6B7280",
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    name: "Mamadou Diallo",
    role: "Agriculteur · Kindia",
    context: "Tomates fraîches",
    lastMessage: "Oui, j'ai encore 50 kg disponibles. Quand voulez-vous recevoir ?",
    time: "il y a 8min",
    unread: 2,
    online: true,
    category: "agriculture",
  },
  {
    id: "conv2",
    name: "Fatoumata Bah",
    role: "Commerçante · Conakry",
    context: "Mangues Kent",
    lastMessage: "Je peux vous faire un prix pour 30 kg. C'est pour quand ?",
    time: "il y a 45min",
    unread: 1,
    online: true,
    category: "agriculture",
  },
  {
    id: "conv3",
    name: "Mamadou Kouyaté",
    role: "Agent immobilier",
    context: "Villa moderne à Kipé",
    lastMessage: "La visite est possible samedi matin. Je vous envoie l'adresse exacte.",
    time: "il y a 2h",
    unread: 0,
    online: false,
    category: "real-estate",
  },
  {
    id: "conv4",
    name: "Diallo Poisson Grillé",
    role: "Restaurant · Boulbinet",
    context: "Réservation table",
    lastMessage: "Votre table est réservée pour vendredi 19h. À bientôt !",
    time: "il y a 3h",
    unread: 0,
    online: true,
    category: "restaurant",
  },
  {
    id: "conv5",
    name: "ElectroPro Guinée",
    role: "Électricien · Conakry",
    context: "Installation électrique",
    lastMessage: "Je suis disponible lundi et mercredi. Le devis est de 150 000 GNF.",
    time: "il y a 1j",
    unread: 3,
    online: false,
    category: "service",
  },
  {
    id: "conv6",
    name: "Alpha Barry",
    role: "Agriculteur · Mamou",
    context: "Fonio blanc 50kg",
    lastMessage: "Merci pour votre commande ! L'expédition se fait lundi prochain.",
    time: "il y a 2j",
    unread: 0,
    online: false,
    category: "agriculture",
  },
  {
    id: "conv7",
    name: "Mariama Sow",
    role: "Agent immobilier",
    context: "Studio meublé Dixinn",
    lastMessage: "Bonjour ! Oui le studio est toujours disponible. Voulez-vous visiter ?",
    time: "il y a 3j",
    unread: 0,
    online: true,
    category: "real-estate",
  },
  {
    id: "conv8",
    name: "Support NAFA",
    role: "Service client",
    context: "Aide & Assistance",
    lastMessage: "Votre problème a été résolu. N'hésitez pas à nous recontacter.",
    time: "il y a 5j",
    unread: 0,
    online: true,
    category: "support",
  },
];

function ConvItem({ conv, colors }: { conv: Conversation; colors: ReturnType<typeof useColors> }) {
  const catColor = CAT_COLOR[conv.category];
  const initials = conv.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Pressable
      onPress={() =>
        router.push(`/chat?name=${encodeURIComponent(conv.name)}&context=${encodeURIComponent(conv.context)}&id=${conv.id}` as any)
      }
      style={({ pressed }) => [
        styles.convItem,
        {
          backgroundColor: conv.unread > 0 ? catColor + "08" : colors.background,
          borderBottomColor: colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatarWrap]}>
        <View style={[styles.avatar, { backgroundColor: catColor + "22" }]}>
          <Text style={[styles.avatarText, { color: catColor }]}>{initials}</Text>
        </View>
        {conv.online && (
          <View style={[styles.onlineDot, { borderColor: colors.background }]} />
        )}
      </View>

      {/* Content */}
      <View style={styles.convContent}>
        <View style={styles.convTop}>
          <Text
            style={[
              styles.convName,
              {
                color: colors.foreground,
                fontFamily: conv.unread > 0 ? "Inter_700Bold" : "Inter_600SemiBold",
              },
            ]}
            numberOfLines={1}
          >
            {conv.name}
          </Text>
          <Text style={[styles.convTime, { color: colors.mutedForeground }]}>
            {conv.time}
          </Text>
        </View>

        <Text
          style={[styles.convContext, { color: catColor }]}
          numberOfLines={1}
        >
          {conv.context}
        </Text>

        <View style={styles.convBottom}>
          <Text
            style={[
              styles.convLast,
              {
                color: conv.unread > 0 ? colors.foreground : colors.mutedForeground,
                fontFamily: conv.unread > 0 ? "Inter_500Medium" : "Inter_400Regular",
                flex: 1,
              },
            ]}
            numberOfLines={1}
          >
            {conv.lastMessage}
          </Text>
          {conv.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: catColor }]}>
              <Text style={styles.unreadText}>{conv.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  const filtered = query.trim()
    ? MOCK_CONVERSATIONS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.context.toLowerCase().includes(query.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(query.toLowerCase()),
      )
    : MOCK_CONVERSATIONS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Messages
            </Text>
            {totalUnread > 0 && (
              <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
                <Text style={styles.badgeText}>{totalUnread}</Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={() => router.push("/chat" as any)}
            hitSlop={8}
            style={({ pressed }) => [styles.newBtn, { backgroundColor: colors.primary + "14", opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une conversation…"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Conversations */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Aucune conversation
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Commencez à contacter des vendeurs depuis les fiches produits, restaurants ou annonces immobilières.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConvItem conv={item} colors={colors} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  newBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  convItem: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  avatarWrap: { position: "relative", flexShrink: 0 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2 },
  convContent: { flex: 1, gap: 2 },
  convTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  convName: { fontSize: 15, flex: 1 },
  convTime: { fontSize: 11, fontFamily: "Inter_400Regular", flexShrink: 0 },
  convContext: { fontSize: 12, fontFamily: "Inter_500Medium" },
  convBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  convLast: { fontSize: 13, lineHeight: 18 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 5, flexShrink: 0 },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptySubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21 },
});
