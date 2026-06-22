import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

import { useMessages } from "@/context/MessagesContext";
import { useColors } from "@/hooks/useColors";

const BRAND_DARK = "#0A2318";
const BRAND_MID = "#1B4332";
const BRAND_LIGHT = "#2D6A4F";
const BRAND_ACCENT = "#52B788";

const ROLE_LABELS: Record<string, string> = {
  farmer: "Agriculteur",
  trader: "Commerçant",
  warehouse: "Entrepôt",
  restaurant: "Restaurant",
  customer: "Client",
  partner: "Partenaire",
  "business-ambassador": "Ambassadeur",
};

const CATEGORY_COLORS: Record<string, string> = {
  agriculture: "#16A34A",
  "real-estate": "#2563EB",
  services: "#7C3AED",
  logistics: "#EA580C",
  restaurants: "#F59E0B",
  default: BRAND_ACCENT,
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  agriculture: "leaf-outline",
  "real-estate": "home-outline",
  services: "construct-outline",
  logistics: "cube-outline",
  restaurants: "restaurant-outline",
  default: "chatbubble-outline",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const DAY = 24 * 3600 * 1000;
  if (diff < DAY && d.getDate() === now.getDate()) return "Aujourd'hui";
  if (diff < 2 * DAY) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDate(messages: { createdAt: string }[]) {
  const groups: { date: string; indices: number[] }[] = [];
  messages.forEach((m, i) => {
    const label = formatDate(m.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.date === label) last.indices.push(i);
    else groups.push({ date: label, indices: [i] });
  });
  return groups;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getConversation, sendMessage, markAsRead } = useMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const [isTyping, setIsTyping] = useState(false);

  const conv = getConversation(id);

  useEffect(() => {
    if (id) markAsRead(id);
  }, [id, markAsRead]);

  useEffect(() => {
    if (conv?.messages.length) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [conv?.messages.length]);

  const topPad = Platform.OS === "web" ? 67 + 12 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSend = () => {
    const text = input.trim();
    if (!text || !id) return;
    setInput("");
    setIsTyping(false);
    sendMessage(id, text);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2500);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!conv) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="chatbubble-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Conversation introuvable</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: BRAND_ACCENT, fontFamily: "Inter_600SemiBold" }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[conv.subjectCategory] ?? CATEGORY_COLORS.default;
  const catIcon = CATEGORY_ICONS[conv.subjectCategory] ?? CATEGORY_ICONS.default;
  const initials = conv.participantName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const groups = groupByDate(conv.messages);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient
        colors={[BRAND_DARK, BRAND_MID, BRAND_LIGHT]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.header, { paddingTop: topPad }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>

          {/* Avatar */}
          <View style={[styles.headerAvatar, { backgroundColor: catColor + "30" }]}>
            <Text style={[styles.headerAvatarText, { color: catColor === "#16A34A" ? "#fff" : catColor }]}>
              {initials}
            </Text>
            {conv.participantVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: BRAND_ACCENT }]}>
                <Ionicons name="checkmark" size={8} color="#fff" />
              </View>
            )}
          </View>

          {/* Name + status */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={styles.headerName} numberOfLines={1}>{conv.participantName}</Text>
            </View>
            <Text style={styles.headerRole}>
              {ROLE_LABELS[conv.participantRole] ?? conv.participantRole}
              {conv.participantVerified ? " · Vérifié ✓" : ""}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/inbox" as any)}
            hitSlop={8}
            style={({ pressed }) => [styles.inboxBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Subject chip */}
        <View style={[styles.subjectChip, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
          <Ionicons name={catIcon} size={13} color={catColor} />
          <Text style={styles.subjectText} numberOfLines={1}>{conv.subject}</Text>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.messages, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {groups.map((group) => (
          <View key={group.date}>
            {/* Date separator */}
            <View style={styles.dateSep}>
              <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dateLabel, { color: colors.mutedForeground, backgroundColor: colors.background }]}>
                {group.date}
              </Text>
              <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
            </View>

            {group.indices.map((i) => {
              const msg = conv.messages[i];
              const isMe = msg.senderId === "me";
              return (
                <View
                  key={msg.id}
                  style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}
                >
                  <View
                    style={[
                      styles.bubbleInner,
                      isMe
                        ? { backgroundColor: BRAND_MID, borderBottomRightRadius: 4 }
                        : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
                    ]}
                  >
                    <Text style={[styles.bubbleText, { color: isMe ? "#fff" : colors.foreground }]}>
                      {msg.text}
                    </Text>
                    <View style={styles.bubbleMeta}>
                      <Text
                        style={[
                          styles.bubbleTime,
                          { color: isMe ? "rgba(255,255,255,0.6)" : colors.mutedForeground },
                        ]}
                      >
                        {formatTime(msg.createdAt)}
                      </Text>
                      {isMe && (
                        <Ionicons
                          name={msg.read ? "checkmark-done" : "checkmark"}
                          size={13}
                          color={msg.read ? BRAND_ACCENT : "rgba(255,255,255,0.5)"}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <View style={[styles.bubble, styles.bubbleLeft]}>
            <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
              <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground, opacity: 0.6 }]} />
              <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground, opacity: 0.3 }]} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 8,
          },
        ]}
      >
        <View
          style={[
            styles.inputWrap,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écrivez un message..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
        </View>
        <Pressable
          onPress={handleSend}
          disabled={!input.trim()}
          style={({ pressed }) => [
            styles.sendBtn,
            {
              backgroundColor: input.trim() ? BRAND_MID : colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="send" size={18} color={input.trim() ? "#fff" : colors.mutedForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  inboxBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  headerAvatarText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  verifiedBadge: {
    position: "absolute", bottom: -1, right: -1,
    width: 14, height: 14, borderRadius: 7,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: BRAND_MID,
  },
  headerName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff", flex: 1 },
  headerRole: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 1 },
  subjectChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, marginTop: 8,
  },
  subjectText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },

  messages: { paddingHorizontal: 12, paddingTop: 16 },
  dateSep: { flexDirection: "row", alignItems: "center", marginVertical: 16, gap: 10 },
  dateLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dateLabel: { fontSize: 12, fontFamily: "Inter_400Regular", paddingHorizontal: 8 },

  bubble: { marginBottom: 4 },
  bubbleLeft: { alignItems: "flex-start" },
  bubbleRight: { alignItems: "flex-end" },
  bubbleInner: {
    maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, gap: 4,
  },
  bubbleText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 21 },
  bubbleMeta: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end" },
  bubbleTime: { fontSize: 11, fontFamily: "Inter_400Regular" },

  typingBubble: {
    flexDirection: "row", gap: 4, paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 18, borderWidth: 1,
  },
  typingDot: { width: 6, height: 6, borderRadius: 3 },

  inputBar: {
    flexDirection: "row", gap: 10, alignItems: "flex-end",
    paddingHorizontal: 12, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    flex: 1, borderWidth: 1, borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 4, minHeight: 44,
    justifyContent: "center",
  },
  input: {
    fontSize: 15, fontFamily: "Inter_400Regular",
    maxHeight: 110, paddingVertical: 6,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    marginBottom: 0,
  },
  errorText: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 12 },
  backLink: { marginTop: 16 },
});
