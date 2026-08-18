export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-3xl">No está</h1>
      <p className="mt-2 text-mute">Esa oferta o trueque ya no existe.</p>
      <a href="/explorar" className="btn-primary mt-6">
        Volver a explorar
      </a>
    </div>
  );
}
