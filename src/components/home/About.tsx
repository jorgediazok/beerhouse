import Image from "next/image";

export function About() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold">Nuestra Historia</h2>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <Image
          src="/images/about-1.jpeg"
          alt="Beer House"
          width={500}
          height={333}
          className="w-full rounded-xl object-cover shadow-md"
        />
        <div>
          <h3 className="text-xl font-semibold">
            Desde hace 5 años llevando a tu casa la mejor cerveza
          </h3>
          <p className="mt-3 text-dark/70">
            Beer House nace como el proyecto de 5 amigos que, cansados de
            consumir siempre las mismas marcas de cerveza, decidieron
            comenzar a importarlas de todo el mundo — y no sólo eso, también
            llevártelas.
          </p>
        </div>
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h3 className="text-xl font-semibold">Calidad y Servicio</h3>
          <p className="mt-3 text-dark/70">
            Hacé tu pedido ahora: si vivís en Buenos Aires lo tenés en tu casa
            dentro de las próximas 24 horas. Hacemos envíos a todo el país,
            consultá los plazos de entrega.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-dark/70">
            <li>• Cervezas de todo el mundo</li>
            <li>• Ofertas todas las semanas</li>
            <li>• Envío dentro de 24 horas</li>
          </ul>
        </div>
        <Image
          src="/images/about-2.jpeg"
          alt="Variedad de cervezas"
          width={1880}
          height={1253}
          className="order-1 w-full rounded-xl object-cover shadow-md lg:order-2"
        />
      </div>
    </section>
  );
}
