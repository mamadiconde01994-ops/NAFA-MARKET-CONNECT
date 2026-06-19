import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { PARTNER_REFERRALS, PARTNER_STATS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { formatPrice } from "@/lib/format";

export default function PartnerReferralsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleNewContact = () => {
    Alert.alert(
      "Bientôt disponible",
      "L'ajout d'un nouveau contact sera disponible prochainement dans NAFA Partners.",
    );
  };

  const totalReward = PARTNER_REFERRALS.reduce((sum, r) => sum + (r.reward ?? 0), 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mes références</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Metrics row */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>
              {PARTNER_STATS.totalReferrals}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Total références</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="cash-outline" size={20} color={colors.secondary} />
            <Text style={[styles.metricValue, { color: colors.secondary }]}>
              {formatPrice(totalReward)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Récompenses totales</Text>
          </View>
        </View>

        {/* Info tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
            Les campagnes agricoles sont prioritaires. Aidez les fermiers à vendre du riz, tomates, mangues et huile de palme.
          </Text>
        </View>

        {/* List header */}
        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Historique des références</Text>
          <Button label="Nouveau contact" onPress={handleNewContact} variant="outline" />
        </View>

        <View style={styles.list}>
          {PARTNER_REFERRALS.map((referral) => (
            <View
              key={referral.id}
              style={[styles.referralCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.referralTop}>
                <View style={[styles.avatarBox, { backgroundColor: colors.muted }]}>
                  <Ionicons name="person-outline" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.referralName, { color: colors.foreground }]}>
                    {referral.clientName}
                  </Text>
                  <Text style={[styles.referralCampaign, { color: colors.mutedForeground }]}>
                    {referral.campaign}
                  </Text>
                </View>
                <Badge
                  label={referral.status}
                  variant={
                    referral.status === "Complétée"
                      ? "success"
                      : referral.status === "En attente"
                        ? "warning"
                        : "destructive"
                  }
                />
              </View>
              <View style={[styles.referralBottom, { borderTopColor: colors.border }]}>
                <Text style={[styles.referralDate, { color: colors.mutedForeground }]}>
                  {referral.referredAt}
                </Text>
                <Text style={[styles.referralReward, { color: colors.secondary }]}>
                  {formatPrice(referral.reward)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  metricsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    alignItems: "center",
  },
  metricValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  metricLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  tipText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, flex: 1 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 16, gap: 10 },
  referralCard: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  referralTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  referralName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  referralCampaign: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  referralBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  referralDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  referralReward: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
