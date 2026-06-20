import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { formatRelativeTime } from "@/lib/localization";
import type { Language } from "@/context/LanguageContext";

interface MessageBubbleProps {
  id: string;
  text: string;
  senderName: string;
  senderImage?: string;
  timestamp: Date | string;
  isOwn: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
  edited?: boolean;
  lang?: Language;
}

export function MessageBubble({
  text,
  senderName,
  timestamp,
  isOwn,
  status = "sent",
  edited,
  lang = "en",
}: MessageBubbleProps) {
  const colors = useColors();

  const statusConfig = {
    sending: { icon: "hourglass" as const, color: colors.mutedForeground },
    sent: { icon: "checkmark" as const, color: colors.mutedForeground },
    delivered: {
      icon: "checkmark-done" as const,
      color: colors.mutedForeground,
    },
    read: { icon: "checkmark-done" as const, color: colors.primary },
  };

  const statusInfo = statusConfig[status];

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: isOwn ? "flex-end" : "flex-start",
          marginHorizontal: 16,
          marginVertical: 4,
        },
      ]}
    >
      <View
        style={[
          styles.bubbleContainer,
          {
            maxWidth: "75%",
            backgroundColor: isOwn
              ? colors.primary
              : colors.card,
            borderRadius: 12,
            overflow: "hidden",
          },
        ]}
      >
        {/* Sender name (if not own) */}
        {!isOwn && (
          <Text
            style={[
              styles.senderName,
              { color: colors.mutedForeground },
            ]}
          >
            {senderName}
          </Text>
        )}

        {/* Message text */}
        <Text
          style={[
            styles.messageText,
            {
              color: isOwn ? colors.primaryForeground : colors.foreground,
            },
          ]}
        >
          {text}
        </Text>

        {/* Timestamp and status */}
        <View
          style={[
            styles.footer,
            {
              justifyContent: isOwn ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Text
            style={[
              styles.timestamp,
              {
                color: isOwn
                  ? colors.primaryForeground + "80"
                  : colors.mutedForeground,
              },
            ]}
          >
            {formatRelativeTime(timestamp, lang)}
          </Text>

          {edited && (
            <Text
              style={[
                styles.edited,
                {
                  color: isOwn
                    ? colors.primaryForeground + "60"
                    : colors.mutedForeground,
                },
              ]}
            >
              (edited)
            </Text>
          )}

          {isOwn && status !== "sending" && (
            <Ionicons
              name={statusInfo.icon}
              size={12}
              color={statusInfo.color}
              style={{ marginLeft: 4 }}
            />
          )}

          {isOwn && status === "sending" && (
            <Ionicons
              name={statusInfo.icon}
              size={12}
              color={statusInfo.color}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

/**
 * Message group component with date separator
 */
interface MessageGroupProps {
  date: Date | string;
  messages: MessageBubbleProps[];
  lang?: Language;
}

export function MessageGroup({ date, messages, lang = "en" }: MessageGroupProps) {
  const colors = useColors();

  const dateStr = new Intl.DateTimeFormat(
    lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-EG" : "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    }
  ).format(typeof date === "string" ? new Date(date) : date);

  return (
    <View style={styles.groupContainer}>
      {/* Date separator */}
      <View style={styles.dateSeparator}>
        <View
          style={[styles.separatorLine, { backgroundColor: colors.border }]}
        />
        <Text
          style={[
            styles.dateLabel,
            { color: colors.mutedForeground },
          ]}
        >
          {dateStr}
        </Text>
        <View
          style={[styles.separatorLine, { backgroundColor: colors.border }]}
        />
      </View>

      {/* Messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} lang={lang} />
      ))}
    </View>
  );
}

/**
 * Chat input component
 */
import { TextInput, Pressable } from "react-native";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  loading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
  loading = false,
  placeholder = "Message...",
}: ChatInputProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      ]}
    >
      {onAttach && (
        <Pressable
          onPress={onAttach}
          disabled={loading}
          style={({ pressed }) => [
            styles.attachButton,
            { opacity: pressed || loading ? 0.6 : 1 },
          ]}
        >
          <Ionicons
            name="attach-outline"
            size={20}
            color={loading ? colors.mutedForeground : colors.primary}
          />
        </Pressable>
      )}

      <TextInput
        style={[
          styles.input,
          {
            color: colors.foreground,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline
        maxLength={500}
        editable={!loading}
      />

      <Pressable
        onPress={onSend}
        disabled={!value.trim() || loading}
        style={({ pressed }) => [
          styles.sendButton,
          {
            backgroundColor:
              !value.trim() || loading
                ? colors.mutedForeground + "40"
                : colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Ionicons
          name="send"
          size={18}
          color={
            !value.trim() || loading
              ? colors.mutedForeground
              : colors.primaryForeground
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  bubbleContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  senderName: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  edited: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  groupContainer: {
    gap: 8,
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  attachButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 110,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
