import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { useLanguage } from "@/context/LanguageContext";
import { MessageBubble } from "@/components/common/MessageBubble";

type Msg = { id: string; text: string; fromMe?: boolean };

export default function ChatScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", text: t("chatWelcome") || "Welcome to NAFA chat!", fromMe: false },
  ]);

  const send = () => {
    if (!text.trim()) return;
    const m: Msg = { id: String(Date.now()), text: text.trim(), fromMe: true };
    setMessages((s) => [m, ...s]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>{t("back") || "Back"}</Text>
        </Pressable>
        <Text style={styles.title}>{t("chatTitle") || "Messages"}</Text>
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <MessageBubble
            id={item.id}
            text={item.text}
            isOwn={!!item.fromMe}
            senderName={""}
            timestamp={new Date()}
          />
        )}
        contentContainerStyle={{ padding: 12 }}
      />

      <View style={styles.composer}>
        <TextInput
          placeholder={t("chatPlaceholder") || "Write a message..."}
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Pressable onPress={send} style={styles.sendBtn}>
          <Text style={styles.sendText}>{t("send") || "Send"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 56, alignItems: "center", flexDirection: "row", gap: 12, paddingHorizontal: 12 },
  back: { color: "#007AFF" },
  title: { fontSize: 18, fontWeight: "600", flex: 1, textAlign: "center" },
  composer: { flexDirection: "row", padding: 8, borderTopWidth: 1, borderColor: "#eee" },
  input: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: "#f5f5f5" },
  sendBtn: { marginLeft: 8, justifyContent: "center", paddingHorizontal: 12 },
  sendText: { color: "#007AFF", fontWeight: "600" },
});
