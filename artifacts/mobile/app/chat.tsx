import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatInput, MessageBubble } from "@/components/common/MessageBubble";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

type Msg = {
  id: string;
  text: string;
  isOwn: boolean;
  senderName: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
};

function buildInitialMessages(recipientName: string, context: string): Msg[] {
  const base = [
    {
      id: "1",
      text: `Bonjour ! Je suis ${recipientName}. Comment puis-je vous aider ?`,
      isOwn: false,
      senderName: recipientName,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: "read" as const,
    },
  ];

  if (context) {
    return [
      ...base,
      {
        id: "2",
        text: `Je vous contacte au sujet de : ${context}. Est-ce encore disponible ?`,
        isOwn: true,
        senderName: "Moi",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        status: "read" as const,
      },
      {
        id: "3",
        text: `Oui, c'est toujours disponible ! Quelle quantité vous intéresse ?`,
        isOwn: false,
        senderName: recipientName,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "read" as const,
      },
    ];
  }

  return base;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const params = useLocalSearchParams<{ name?: string; context?: string; id?: string }>();

  const recipientName = params.name ?? "Support NAFA";
  const context = params.context ?? "";

  const [messages, setMessages] = useState<Msg[]>(() =>
    buildInitialMessages(recipientName, context),
  );
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: Msg = {
      id: String(Date.now()),
      text: trimmed,
      isOwn: true,
      senderName: "Moi",
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate a reply after 1.5s
    setTimeout(() => {
      const replies = [
        "D'accord, je comprends. Pouvez-vous me donner plus de détails ?",
        "Très bien ! Je vais vérifier et vous reviens rapidement.",
        "Merci pour votre message. Je vous contacterai dès que possible.",
        "Oui, c'est possible ! Quel est le meilleur moment pour vous ?",
      ];
      const reply: Msg = {
        id: String(Date.now() + 1),
        text: replies[Math.floor(Math.random() * replies.length)],
        isOwn: false,
        senderName: recipientName,
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, reply]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.navyHeader,
            borderBottomColor: colors.navyHeader,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.avatarText}>
              {recipientName
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recipientName} numberOfLines={1}>
              {recipientName}
            </Text>
            {context ? (
              <Text style={styles.contextLabel} numberOfLines={1}>
                {context}
              </Text>
            ) : (
              <Text style={styles.onlineStatus}>En ligne</Text>
            )}
          </View>
        </View>

        <Pressable
          hitSlop={8}
          style={({ pressed }) => [styles.menuBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>

      {/* Context banner */}
      {context ? (
        <View style={[styles.contextBanner, { backgroundColor: colors.muted, borderBottomColor: colors.border }]}>
          <Ionicons name="cube-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.contextBannerText, { color: colors.mutedForeground }]}>
            Sujet : <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium" }}>{context}</Text>
          </Text>
        </View>
      ) : null}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <MessageBubble
            id={item.id}
            text={item.text}
            isOwn={item.isOwn}
            senderName={item.senderName}
            timestamp={item.timestamp}
            status={item.status}
            lang={language}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: 8 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Input */}
      <ChatInput
        value={text}
        onChangeText={setText}
        onSend={send}
        placeholder={`Message à ${recipientName}…`}
      />

      {Platform.OS !== "web" && insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: colors.card }} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  recipientName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  onlineStatus: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#86EFAC",
  },
  contextLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  contextBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  contextBannerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  listContent: { paddingTop: 12 },
});
