import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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

const STAR_LABELS = ["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent !"];

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
  const { getConversation, sendMessage, markAsRead, rateConversation } = useMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Rating modal state
  const [showRating, setShowRating] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingDone, setRatingDone] = useState(false);

  const conv = getConversation(id);

  useEffect(() => {
    if (id) markAsRead(id);
  }, [id, markAsRead]);

  useEffect(() => {
    if (conv?.messages.length) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [conv?.messages.length]);

  // Sync ratingDone with existing rating
  useEffect(() => {
    if (conv?.rating) {
      setRatingDone(true);
      setSelectedStars(conv.rating.stars);
    }
  }, [conv?.rating]);

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

  const handleSubmitRating = () => {
    if (!id || selectedStars === 0) return;
    rateConversation(id, selectedStars, ratingComment.trim());
    setRatingDone(true);
    setShowRating(false);
  };

  const openRatingModal = () => {
    if (conv?.rating) {
      setSelectedStars(conv.rating.stars);
      setRatingComment(conv.rating.comment);
    } else {
      setSelectedStars(0);
      setRatingComment("");
    }
    setShowRating(true);
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
  const hasMessages = conv.messages.length > 0;

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
            style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1 }]}
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
            <Text style={styles.headerName} numberOfLines={1}>{conv.participantName}</Text>
            <Text style={styles.headerRole}>
              {ROLE_LABELS[conv.participantRole] ?? conv.participantRole}
              {conv.participantVerified ? " · Vérifié ✓" : ""}
            </Text>
          </View>

          {/* Rate button */}
          <Pressable
            onPress={openRatingModal}
            hitSlop={8}
            style={({ pressed }) => [
              styles.headerBtn,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: ratingDone ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.15)",
              },
            ]}
          >
            <Ionicons
              name={ratingDone ? "star" : "star-outline"}
              size={18}
              color={ratingDone ? "#F59E0B" : "#fff"}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/messages" as any)}
            hitSlop={8}
            style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Subject chip + existing rating preview */}
        <View style={styles.headerBottom}>
          <View style={[styles.subjectChip, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Ionicons name={catIcon} size={13} color={catColor} />
            <Text style={styles.subjectText} numberOfLines={1}>{conv.subject}</Text>
          </View>
          {ratingDone && conv.rating && (
            <View style={styles.ratingPreview}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < conv.rating!.stars ? "star" : "star-outline"}
                  size={11}
                  color="#F59E0B"
                />
              ))}
            </View>
          )}
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
                      <Text style={[styles.bubbleTime, { color: isMe ? "rgba(255,255,255,0.6)" : colors.mutedForeground }]}>
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

        {/* Rate CTA — shows after first exchange */}
        {hasMessages && !ratingDone && (
          <Pressable
            onPress={openRatingModal}
            style={({ pressed }) => [
              styles.rateCta,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.rateCtaRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name="star-outline" size={18} color="#F59E0B" />
              ))}
            </View>
            <Text style={[styles.rateCtaText, { color: colors.foreground }]}>
              Évaluez {conv.participantName.split(" ")[0]}
            </Text>
            <Text style={[styles.rateCtaSub, { color: colors.mutedForeground }]}>
              Aidez la communauté NAFA en laissant une note
            </Text>
          </Pressable>
        )}

        {/* Existing rating display */}
        {ratingDone && conv.rating && (
          <Pressable
            onPress={openRatingModal}
            style={({ pressed }) => [
              styles.ratingCard,
              { backgroundColor: "#FEF3C7", borderColor: "#F59E0B33", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={styles.ratingCardRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < conv.rating!.stars ? "star" : "star-outline"}
                  size={18}
                  color="#F59E0B"
                />
              ))}
              <Text style={styles.ratingCardStars}>{STAR_LABELS[conv.rating.stars]}</Text>
            </View>
            {conv.rating.comment ? (
              <Text style={styles.ratingCardComment}>"{conv.rating.comment}"</Text>
            ) : null}
            <Text style={styles.ratingCardEdit}>Modifier l'évaluation</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Input bar */}
      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 8 },
        ]}
      >
        <View style={[styles.inputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
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
            { backgroundColor: input.trim() ? BRAND_MID : colors.border, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="send" size={18} color={input.trim() ? "#fff" : colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRating}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRating(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowRating(false)}>
          <Pressable
            style={[styles.modalSheet, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={[styles.modalAvatar, { backgroundColor: catColor + "22" }]}>
                <Text style={[styles.modalAvatarText, { color: catColor }]}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  Évaluer {conv.participantName.split(" ")[0]}
                </Text>
                <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                  {conv.subject}
                </Text>
              </View>
              <Pressable onPress={() => setShowRating(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {/* Stars */}
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => {
                const star = i + 1;
                return (
                  <Pressable
                    key={star}
                    onPress={() => setSelectedStars(star)}
                    style={({ pressed }) => [styles.starBtn, { opacity: pressed ? 0.7 : 1 }]}
                    hitSlop={4}
                  >
                    <Ionicons
                      name={star <= selectedStars ? "star" : "star-outline"}
                      size={40}
                      color={star <= selectedStars ? "#F59E0B" : colors.mutedForeground}
                    />
                  </Pressable>
                );
              })}
            </View>

            {/* Star label */}
            <Text style={[styles.starLabel, { color: selectedStars > 0 ? "#F59E0B" : colors.mutedForeground }]}>
              {selectedStars > 0 ? STAR_LABELS[selectedStars] : "Touchez une étoile pour noter"}
            </Text>

            {/* Comment */}
            <View style={[styles.commentWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                value={ratingComment}
                onChangeText={setRatingComment}
                placeholder="Laissez un commentaire (facultatif)..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.commentInput, { color: colors.foreground }]}
                multiline
                maxLength={200}
              />
            </View>
            <Text style={[styles.commentCount, { color: colors.mutedForeground }]}>
              {ratingComment.length}/200
            </Text>

            {/* Buttons */}
            <View style={styles.modalBtns}>
              <Pressable
                onPress={() => setShowRating(false)}
                style={[styles.modalBtnSecondary, { borderColor: colors.border }]}
              >
                <Text style={[styles.modalBtnSecondaryText, { color: colors.mutedForeground }]}>Annuler</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmitRating}
                disabled={selectedStars === 0}
                style={[
                  styles.modalBtnPrimary,
                  { backgroundColor: selectedStars > 0 ? "#F59E0B" : colors.border },
                ]}
              >
                <Ionicons name="star" size={16} color={selectedStars > 0 ? "#fff" : colors.mutedForeground} />
                <Text style={[styles.modalBtnPrimaryText, { color: selectedStars > 0 ? "#fff" : colors.mutedForeground }]}>
                  {conv.rating ? "Modifier" : "Envoyer"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { paddingHorizontal: 16, paddingBottom: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  headerBtn: {
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
  headerBottom: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  subjectChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  subjectText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },
  ratingPreview: { flexDirection: "row", gap: 2 },

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

  // Rate CTA card
  rateCta: {
    marginTop: 20, marginHorizontal: 8, padding: 16,
    borderRadius: 14, borderWidth: 1,
    alignItems: "center", gap: 6,
  },
  rateCtaRow: { flexDirection: "row", gap: 4 },
  rateCtaText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rateCtaSub: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },

  // Existing rating card
  ratingCard: {
    marginTop: 20, marginHorizontal: 8, padding: 16,
    borderRadius: 14, borderWidth: 1,
    gap: 6,
  },
  ratingCardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingCardStars: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#D97706", marginLeft: 4 },
  ratingCardComment: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#92400E", fontStyle: "italic", lineHeight: 19 },
  ratingCardEdit: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#D97706", marginTop: 2 },

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
  },

  errorText: { fontSize: 16, fontFamily: "Inter_400Regular", marginTop: 12 },
  backLink: { marginTop: 16 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
    gap: 0,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24,
  },
  modalAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  modalAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  modalSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  starsRow: {
    flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 10,
  },
  starBtn: { padding: 4 },
  starLabel: {
    textAlign: "center", fontSize: 14, fontFamily: "Inter_600SemiBold",
    marginBottom: 20, minHeight: 20,
  },

  commentWrap: {
    borderWidth: 1, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10, minHeight: 90,
    marginBottom: 4,
  },
  commentInput: {
    fontSize: 14, fontFamily: "Inter_400Regular",
    textAlignVertical: "top", minHeight: 70,
  },
  commentCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 20 },

  modalBtns: { flexDirection: "row", gap: 12 },
  modalBtnSecondary: {
    flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  modalBtnSecondaryText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  modalBtnPrimary: {
    flex: 2, paddingVertical: 14, borderRadius: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  modalBtnPrimaryText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
