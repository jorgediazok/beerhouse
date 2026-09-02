export function Footer() {
  return (
    <footer className="bg-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold text-orange">LA CERVEZA VA A TU CASA</h2>
          <p className="mt-2 text-sm text-cream/70">
            Beer House — cerveza artesanal e importada, a domicilio.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-gold uppercase">
            Contactanos
          </h3>
          <p className="mt-2 text-sm text-cream/70">
            Talcahuano 1095
            <br />
            Buenos Aires, 1088
            <br />
            (011) 22334455
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-gold uppercase">
            Horarios
          </h3>
          <p className="mt-2 text-sm text-cream/70">
            Lunes a viernes
            <br /> 9:00 - 18:00
          </p>
          <p className="mt-2 text-sm text-cream/70">
            Sábados y domingos
            <br /> 12:00 - 24:00
          </p>
        </div>
      </div>
      <p className="border-t border-cream/10 py-4 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Beer House
      </p>
    </footer>
  );
}
