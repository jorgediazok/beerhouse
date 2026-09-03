export type HistoriaChapter = {
  num: string;
  when: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

export const HISTORIA: HistoriaChapter[] = [
  {
    num: "01",
    when: "2020 · La idea",
    title: "Todo empezó con una charla de boliche",
    body: "Cinco amigos, cansados de tomar siempre las mismas marcas, se preguntaron: ¿y si las importamos nosotros? Beer House nació ahí, sin plan de negocios, solo con ganas de tomar algo distinto.",
    image: "/images/historia/01-la-idea.jpg",
    alt: "Amigos brindando con cerveza en un bar",
  },
  {
    num: "02",
    when: "2021 · La selección",
    title: "Recorrimos el mundo buscando etiquetas nuevas",
    body: "Empezamos a traer cervezas que nadie más tenía acá — belgas, japonesas, alemanas. Hoy seguimos eligiendo cada una a mano, país por país, estilo por estilo.",
    image: "/images/historia/02-la-seleccion.jpg",
    alt: "Depósito con cajones de cerveza importada de todo el mundo",
  },
  {
    num: "03",
    when: "2022 · Abrimos las puertas",
    title: "De changa entre amigos a un lugar real",
    body: "Beer House dejó de ser una idea de sobremesa. Abrimos las puertas y las primeras botellas salieron de ahí — hace ya más de cinco años.",
    image: "/images/historia/03-abrimos-las-puertas.jpg",
    alt: "Barra de un bar de cervezas artesanales",
  },
  {
    num: "04",
    when: "Hoy · A tu puerta",
    title: "Seguimos siendo los mismos cinco (y alguno más)",
    body: "La selección que armamos con tanto cariño ahora llega directo a tu casa en 24 horas. La forma cambió; las ganas de compartir una buena cerveza, no.",
    image: "/images/historia/04-a-tu-puerta.jpg",
    alt: "Repartidor en moto con cajones de cerveza",
  },
];
