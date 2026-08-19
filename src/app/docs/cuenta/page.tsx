import { Callout, CodeBlock, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y códigos" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Telegram es el SMS gratis de Cuba."
        lead="No existe un proveedor que envíe SMS a Cubacel de balde: ETECSA cobra el mensaje. Lo que sí es gratis y llega a la isla es Telegram. MeCuadra verifica el celular pidiéndote que compartas el contacto Cubacel con el bot."
      />
      <h2>Las puertas</h2>
      <ul>
        <li>
          <strong>Google</strong> — sin contraseña. Si la isla lo bloquea, usa correo.
        </li>
        <li>
          <strong>Correo</strong> — un código de 6 dígitos. Sin contraseña.
        </li>
        <li>
          <strong>Cubacel por Telegram</strong> — gratis. El bot pide tu contacto; Telegram
          ya comprobó ese número cuando te registraste.
        </li>
        <li>
          <strong>SMS de pago</strong> — solo si hay crédito en BudgetSMS. No es
          obligatorio.
        </li>
      </ul>
      <Steps
        items={[
          { title: "Entras", text: "Google (si está activo) o código al correo." },
          { title: "Abres el bot", text: "Tocas Verificar con Telegram." },
          { title: "Compartes el Cubacel", text: "Un botón. Sin SMS. Sin cobro." },
        ]}
      />
      <h2>Cerrar sesión</h2>
      <p>Un “sí, salir”. El código es para entrar, no para irte: si no, el límite de correo te deja atrapado.</p>
      <h2>Plantilla del correo</h2>
      <p>
        Si el mail dice “toca este link”, la plantilla Magic Link de Supabase no tiene el token.
        Authentication → Email Templates → Magic Link:
      </p>
      <CodeBlock
        label="html"
        code={`<h2>Tu código MeCuadra</h2>
<p>Escríbelo en la app. Caduca en minutos. No lo compartas.</p>
<p style="font-size:28px;letter-spacing:6px;font-weight:700">{{ .Token }}</p>`}
      />
      <Callout title="Por qué no hay SMS gratis" tone="warn">
        Cubacel no termina mensajes internacionales de a gratis. Twilio cortó +53 en 2025.
        Las APIs “free” o no cubren Cuba, o son números virtuales para recibir, no para
        enviarte el código a tu SIM.
      </Callout>
    </article>
  );
}
