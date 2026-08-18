import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo withWord />
          <p className="mt-3 max-w-sm text-sm leading-6 text-mute">
            Mercado P2P de trueque para Cuba. Publicas lo que tienes, aplicas a
            lo que necesitas, y el trato se cierra entre personas — sin depósitos
            ni ventas disfrazadas.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mute">Producto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/explorar" className="hover:text-brand">Explorar ofertas</Link></li>
            <li><Link href="/publicar" className="hover:text-brand">Publicar</Link></li>
            <li><Link href="/como-funciona" className="hover:text-brand">Cómo funciona</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mute">Confianza</p>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li>Solo intercambio · cero efectivo en listados</li>
            <li>Municipio y barrio, no GPS obligatorio</li>
            <li>Reputación, chat y confirmación mutua</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-mute">
        MeCuadra · Trueque P2P para Cuba · 2026
      </div>
    </footer>
  );
}
