export const SHIPPING_FEE = 1500;
export const FREE_SHIPPING_THRESHOLD = 15000;

export function getShippingCost(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
