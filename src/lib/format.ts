const priceFormatter = new Intl.NumberFormat("es-CL", {
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return `$ ${priceFormatter.format(value)}`;
}
