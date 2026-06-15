import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/common/EmptyState";
import { OrderCard } from "@/components/orders/OrderCard";
import { MOCK_ORDERS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import type { OrderStatus } from "@/types";

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "delivering"];
const DONE_STATUSES: OrderStatus[] = ["delivered", "cancelled"];

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const activeOrders = MOCK_ORDERS.filter((o) =>
    ACTIVE_STATUSES.includes(o.status),
  );
  const doneOrders = MOCK_ORDERS.filter((o) =>
    DONE_STATUSES.includes(o.status),
  );
  const orders = activeTab === "active" ? activeOrders : doneOrders;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Mes commandes
        </Text>

        {/* Tabs */}
        <View
          style={[
            styles.tabs,
            { backgroundColor: colors.muted, borderRadius: colors.radius },
          ]}
        >
          {(["active", "done"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab ? colors.card : "transparent",
                  borderRadius: colors.radius - 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === tab
                        ? colors.foreground
                        : colors.mutedForeground,
                    fontFamily:
                      activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {tab === "active" ? `En cours (${activeOrders.length})` : `Terminées (${doneOrders.length})`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* List */}
      {orders.length === 0 ? (
        <EmptyState
          icon="bag-outline"
          title={
            activeTab === "active"
              ? "Aucune commande en cours"
              : "Aucune commande terminée"
          }
          subtitle="Vos commandes apparaîtront ici."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: bottomPad }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  tabs: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabLabel: { fontSize: 13 },
});
