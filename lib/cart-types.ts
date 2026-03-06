import type { PricedLineItem, SelectedOptionSummary, SelectionMap } from "@/lib/types";

export type ConfiguredCartItem = {
  kind: "configured";
  id: string;
  productSlug: string;
  productName: string;
  productImageUrl: string;
  selections: SelectionMap;
  lineItems: PricedLineItem[];
  selectedOptions: SelectedOptionSummary[];
  totalCents: number;
  quantity: 1;
};

export type AccessoryCartItem = {
  kind: "accessory";
  id: string;
  accessorySlug: string;
  label: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
};

export type CartItem = ConfiguredCartItem | AccessoryCartItem;

export type Cart = {
  version: 1;
  items: CartItem[];
};

export function getCartItemTotal(item: CartItem): number {
  if (item.kind === "configured") {
    return item.totalCents;
  }
  return item.priceCents * item.quantity;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getCartItemTotal(item), 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}
