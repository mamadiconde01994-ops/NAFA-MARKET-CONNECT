import type { OrderStatus, ProductUnit, UserRole } from "@/types";

export function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} GNF`;
}

export function formatUnit(unit: ProductUnit): string {
  const map: Record<ProductUnit, string> = {
    kg: "/kg",
    g: "/100g",
    piece: "/pièce",
    bunch: "/botte",
    bag: "/sac",
    liter: "/L",
    bottle: "/bouteille",
  };
  return map[unit];
}

export function formatRole(role: UserRole): string {
  const map: Record<UserRole, string> = {
    farmer: "Agriculteur",
    trader: "Commerçant",
    warehouse: "Entrepôt",
    restaurant: "Restaurant",
    delivery: "Livreur",
    customer: "Client",
    partner: "Partenaire",
    "business-ambassador": "Ambassadeur",
  };
  return map[role];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    processing: "En préparation",
    delivering: "En livraison",
    delivered: "Livré",
    cancelled: "Annulé",
  };
  return map[status];
}

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

export function formatStatusVariant(status: OrderStatus): BadgeVariant {
  const map: Record<OrderStatus, BadgeVariant> = {
    pending: "warning",
    confirmed: "primary",
    processing: "primary",
    delivering: "secondary",
    delivered: "success",
    cancelled: "destructive",
  };
  return map[status];
}
