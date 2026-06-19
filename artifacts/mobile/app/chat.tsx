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

const INITIAL_MESSAGES: Msg[] = [
  {
    id: "1",
    text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    isOwn: false,
    senderName: "Support NAFA",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "read",
  },
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const params = useLocalSearchParams<{ name?: string }>();
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  const recipientName = params.name ?? "Support NAFA";

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
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.recipientName, { color: colors.foreground }]}>
              {recipientName}
            </Text>
            <Text style={[styles.onlineStatus, { color: "#22C55E" }]}>
              En ligne
            </Text>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          style={({ pressed }) => [styles.menuBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.foreground} />
        </Pressable>
      </View>

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
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 8 },
        ]}
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
        placeholder="Votre message..."
      />

      {/* Bottom safe area */}
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
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  recipientName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  onlineStatus: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingTop: 12,
  },
});
