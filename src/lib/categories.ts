export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "rubias", label: "Rubias y Doradas" },
  { slug: "rojas-ambar", label: "Rojas y Ámbar" },
  { slug: "negras", label: "Negras" },
  { slug: "ipa", label: "IPA" },
  { slug: "trigo", label: "Trigo" },
  { slug: "especiales", label: "Especiales" },
];

// Derived from each product's own Contentful description (color/style already
// present there) rather than a new CMS field — see conversation for the
// reasoning behind grouping by color family plus a few recognizable styles.
const BEER_CATEGORY: Record<string, string> = {
  // Rubias y Doradas
  "6Ql23ZTRMkVGi0yG9oZ22A": "rubias", // Sapporo Japan
  "4qRQtAlF8frleypqLIoLBv": "rubias", // Hertog Jan Tripel
  "73s9gZoAQEarlY1VYUxUAS": "rubias", // Oranjeboom Strong
  "4zCp6IbR7TECAxddRtwKT3": "rubias", // Cerveza Schofferhoffer
  "MIGB8SFpAqMd3OUAqnscj": "rubias", // Patagonia Bohemian
  "6r0UMMFq6JgV19dtiI5Bo8": "rubias", // Stella Artois Btl
  "VXhtbslOSsOlG4m1IQUam": "rubias", // Patagonia Kuné
  "7221U69fOoE6ewasf93s13": "rubias", // Patagonia Abrazo Oso
  "2jjaLAZr3XptvNh4jElXqa": "rubias", // Corona Extra
  "3o9tyw7fVWMbc8zSJpLN8U": "rubias", // Japi Premium Lager
  "6Q00Z54PBtaoACCS6GT6Dn": "rubias", // Antares Caravana
  "29E9c2XHFyJJ2JAOV76leZ": "rubias", // Antares Kolsch

  // Rojas y Ámbar
  qqAZg8fkPDo8qJDzDJg0M: "rojas-ambar", // Patagonia Amber Lager
  "6H0I5QyPgPybo1FhM3mYIU": "rojas-ambar", // Andes Roja lata
  "1azdXgyKMrhPinlrk75nG0": "rojas-ambar", // Antares 20 años
  "6eZFbvq10eh0oRilpHrJtU": "rojas-ambar", // Antares El Centinela
  "5kNcUSgnNcWOzjdA9ovelu": "rojas-ambar", // Antares Monasterio
  NQQyJHyoNwZI3AETeHOZ4: "rojas-ambar", // Antares Cuatro Tres
  "69ocZX2oRtYRHLkkcB3YWc": "rojas-ambar", // Antares Fin de Tarde
  "4B8UZ9yYBBwQDLNfVF01YM": "rojas-ambar", // Cerveza Antares Honey

  // Negras
  "5lF3YCq0YDzYvlB7EZRz86": "negras", // Antares Catalina Grande
  Zi6LhG6qIlTH87fHKaEfF: "negras", // Antares Cream Stout
  "3kY1I4aYsb58QnXnRhliy8": "negras", // Antares Imperial Stout
  "7MGajSyRuXsbcPiFWYFzz4": "negras", // Antares Porter
  "3qH0IhCj1PGngmuDUOX3L4": "negras", // Cerveza Antares Stout

  // IPA
  "1YTIhz5UbEmAHLMEefaBQp": "ipa", // Ocaso Tropical APA
  "3XVRQIXwGzDLfVxTdZYUqo": "ipa", // Almirante Donn IPA
  "7p54KWzkMPhxEyuyWtCnK4": "ipa", // Grunge IPA lata
  "73taynf3rF8nHT5FwyqS0u": "ipa", // Patagonia IPA 24.7
  EOxktCachajShAmygLcPT: "ipa", // Antares IPA
  "4VrX8OK3BFsgNHiFgE6Lea": "ipa", // Patagonia Vera IPA

  // Trigo
  "63ucsF7bVwcBLrrldk7x00": "trigo", // Patagonia Weisse
  "2d9ghWsz262Ikpb9AtL0ls": "trigo", // Antares Playa Grande

  // Especiales
  "7yet2lsuSY9mPJZysbYPqC": "especiales", // Patagonia Sidra
  "4FFoKtIJqd4DlDf9PWnHtI": "especiales", // Brahma Edición Limitada
  "0ju73irOYIH2Ikp7VAs27": "especiales", // Antares Barley Wine
  "7EXvQ8t2vCpoO5Ozt0dKCq": "especiales", // Antares Titánica
  Fol8zbnFgdCtgZwFgohSk: "especiales", // Otro Mundo Winter
  "1FhhukseEyQKs8QHensA0j": "especiales", // Cerveza Otro Mundo
  "5EUeAZPvT0wE98unEmdSP3": "especiales", // Cerveza Antares Scotch
};

export function getCategoryForBeer(beerId: string): Category | undefined {
  const slug = BEER_CATEGORY[beerId];
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
