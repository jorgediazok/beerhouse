export type OfertaOverride = {
  beerId: string;
  discountPercent: number;
  cutoutSrc: string;
};

export const OFERTAS: OfertaOverride[] = [
  { beerId: "6Ql23ZTRMkVGi0yG9oZ22A", discountPercent: 15, cutoutSrc: "/ofertas/sapporo.png" },
  { beerId: "4qRQtAlF8frleypqLIoLBv", discountPercent: 15, cutoutSrc: "/ofertas/hertog.png" },
  { beerId: "73s9gZoAQEarlY1VYUxUAS", discountPercent: 15, cutoutSrc: "/ofertas/oranje.png" },
  { beerId: "4zCp6IbR7TECAxddRtwKT3", discountPercent: 12, cutoutSrc: "/ofertas/schoffer.png" },
  { beerId: "MIGB8SFpAqMd3OUAqnscj", discountPercent: 15, cutoutSrc: "/ofertas/bohemian.png" },
];
