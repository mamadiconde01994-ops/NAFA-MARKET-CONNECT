import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
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
      "Fonctionnalité prochainement",
      "Ajout d'un nouveau contact disponible bientôt dans NAFA Partners.",
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Mes références</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Suivez vos contacts, récompenses et statuts de referral.</Text>
      </View>

      <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.metricTitle, { color: colors.mutedForeground }]}>Total des références</Text>
        <Text style={[styles.metricValue, { color: colors.secondary }]}>{PARTNER_STATS.totalReferrals}</Text>
        <Text style={[styles.metricCaption, { color: colors.mutedForeground }]}>Plus d'opportunités pour les campagnes d'agriculture et restauration.</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Historique</Text>
        <Button label="Nouveau contact" onPress={handleNewContact} variant="outline" />
      </View>

      <View style={styles.list}>
        {PARTNER_REFERRALS.map((referral) => (
          <View key={referral.id} style={[styles.referralCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.referralTop}>
              <View>
                <Text style={[styles.referralName, { color: colors.foreground }]}>{referral.clientName}</Text>
                <Text style={[styles.referralCampaign, { color: colors.mutedForeground }]}>{referral.campaign}</Text>
              </View>
              <Badge label={referral.status} variant={referral.status === "Complétée" ? "success" : referral.status === "En attente" ? "warning" : "destructive"} />
            </View>
            <View style={styles.referralBottom}>
              <Text style={[styles.referralDate, { color: colors.mutedForeground }]}>{referral.referredAt}</Text>
              <Text style={[styles.referralReward, { color: colors.secondary }]}>{formatPrice(referral.reward)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  metricCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginHorizontal: 16, marginBottom: 20 },
  metricTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  metricValue: { fontSize: 28, fontFamily: "Inter_700Bold" },
  metricCaption: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 8, lineHeight: 18 },
  listHeader: { paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 16, gap: 12 },
  referralCard: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 12 },
  referralTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  referralName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  referralCampaign: { fontSize: 12, fontFamily: "Inter_400Regular" },
  referralBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  referralDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  referralReward: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
