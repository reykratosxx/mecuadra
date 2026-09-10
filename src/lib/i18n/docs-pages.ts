import type { Locale } from "./types";
import type { DocsCopy } from "@/components/docs/DocsPageView";

const en = {
  home: {
    kicker: "MeCuadra · Docs",
    title: "The barter notebook.",
    lead: "How you publish, apply, talk and close a swap — worldwide. Bitcoin keys, encrypted chat, no prices. Same purple handshake as the app.",
    blocks: [
      {
        type: "flow",
        items: [
          { n: "01", title: "You publish", text: "What you have, with a photo and a city." },
          { n: "02", title: "Someone applies", text: "They tap MeCuadra and propose." },
          { n: "03", title: "You talk", text: "NIP-44 chat. Only the two of you." },
          { n: "04", title: "You meet", text: "Both mark delivered." },
          { n: "05", title: "You rate", text: "Reputation stays. The graph does not." },
        ],
      },
      { type: "h2", text: "Who this notebook is for" },
      {
        type: "p",
        text: "For anyone who wants a P2P swap market with photos, filters and memory — without putting the deal on Bitcoin’s public ledger. And for anyone building MeCuadra: keys, API, NIP-44 and ZK.",
      },
      {
        type: "cards",
        items: [
          {
            href: "/docs/trueque",
            kicker: "Start",
            title: "The swap in 5 taps",
            hint: "The full cycle, drawn.",
          },
          {
            href: "/docs/cypherpunk",
            kicker: "Hackathon",
            title: "Cypherpunk + ZK",
            hint: "How we use Bitcoin without a payment trail.",
          },
        ],
      },
      {
        type: "callout",
        title: "Golden rule",
        body: "If you ask for cash, it is not MeCuadra. Sale apps cover selling. Here the product is the swap.",
      },
      {
        type: "hint",
        text: "Press ⌘K or the search box above. The left index stays open on desktop.",
      },
    ],
  },
  trueque: {
    kicker: "Flow",
    title: "Five taps and the deal is live.",
    lead: "There is no balance to freeze. What holds the meeting is reputation, private chat, and both sides marking delivered.",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "You publish what you swap",
            text: "First the item (photos, condition, category). Then the offer: what you give, what you need, city, and whether you can travel.",
          },
          {
            title: "Someone taps MeCuadra",
            text: "They pick from their inventory or write a free proposal — even something they have not listed.",
          },
          {
            title: "Chat opens",
            text: "Owner and applicant only. NIP-44 ciphertext on the server. Nobody else reads the thread.",
          },
          {
            title: "You accept one proposal",
            text: "The others are declined. The offer moves in progress.",
          },
          {
            title: "Confirm and rate",
            text: "Each side marks delivered. When both do, the swap closes and you rate. A ZK badge can prove enough good ratings without naming who.",
          },
        ],
      },
      {
        type: "callout",
        title: "City is a filter, never a wall",
        body: "You can browse the whole market. Filtering by Lisbon or Mexico City is optional. We never ask for GPS to let you in.",
      },
    ],
  },
  cuenta: {
    kicker: "Account",
    title: "Your account is a Bitcoin key.",
    lead: "Same secp256k1 curve as Bitcoin and Nostr. Your npub is the account. No phone, no KYC, no Google. Telegram is optional legacy, not the gate.",
    blocks: [
      { type: "h2", text: "How sign-in works" },
      {
        type: "ul",
        items: [
          "**Explore** — no account. Offers are public.",
          "**Create a new key** — the app derives nsec/npub in this browser. Back up the nsec. MeCuadra never sees it.",
          "**NIP-07** — if you have Alby / nos2x, sign without pasting a secret.",
          "**Import** — paste an nsec. It stays in this browser for NIP-44 chat.",
        ],
      },
      {
        type: "steps",
        items: [
          { title: "Generate or import", text: "Create a key, or sign with an extension." },
          { title: "Backup", text: "Copy the nsec offline. Anyone with it can use your identity." },
          { title: "Enter the market", text: "A signed Nostr event (kind 22242) opens the session. Publish and apply." },
        ],
      },
      { type: "h2", text: "What we ask and what we do not" },
      {
        type: "ul",
        items: [
          "No SMS, email or Google to enter.",
          "No GPS. City and neighborhood are what you type on offers.",
          "Telegram remains as collapsed legacy for the Cuba product. It is not required here.",
        ],
      },
      {
        type: "callout",
        title: "Privacy",
        tone: "ok",
        body: "Never send your nsec to anyone. MeCuadra does not store it. If a stranger asks for your secret “to help you log in”, close the tab and start again at `/login`.",
      },
    ],
  },
  ofertas: {
    kicker: "Market",
    title: "What you have / what you need / city.",
    lead: "The same handshake everywhere: photos, a city, no prices. Neighborhood stays optional and private to chat.",
    blocks: [
      { type: "h2", text: "First the item" },
      {
        type: "p",
        text: "Title, description, category, condition (new, used or sealed) and several photos. You can swipe the gallery, then edit or remove your items whenever you want.",
      },
      { type: "h2", text: "Then the offer" },
      {
        type: "ul",
        items: [
          "What you offer (one or several items).",
          "What you need, or “open to proposals”.",
          "Country, city, optional neighborhood.",
          "Transport: I have it, they come to me, or I will travel.",
        ],
      },
      {
        type: "p",
        text: "You can edit or take down your offer while it is open. If you touched it after creating it, the card shows when it was edited.",
      },
      {
        type: "callout",
        title: "Anti-spam is not a price",
        body: "Publishing asks for a Cashu stamp (test mint or labeled demo). Lightning invoices here mint the stamp. They never price the bike or the camera.",
      },
      {
        type: "callout",
        title: "Share",
        body: "Each offer can open Telegram, WhatsApp or Facebook. You pick the group. The text is have / need / city plus the link.",
      },
    ],
  },
  aplicar: {
    kicker: "Apply",
    title: "One tap. A proposal. A chat.",
    lead: "MeCuadra is the moment you stop browsing and nominate yourself as counterpart. No money in escrow. There is what you give in return.",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "You open the offer",
            text: "Photos, what they give, what they need, city and transport.",
          },
          {
            title: "You tap MeCuadra",
            text: "Mark your items or write something that is not listed.",
          },
          {
            title: "The owner decides",
            text: "Accept or decline. If they accept, the other proposals on that offer fall away.",
          },
        ],
      },
      {
        type: "callout",
        title: "You cannot apply to your own offer",
        body: "Nor without a session. The server blocks it; it is not only the UI.",
      },
    ],
  },
  chat: {
    kicker: "Conversation",
    title: "The thread belongs to the two of you.",
    lead: "Clarify, offer something else, or pick a park. The text is encrypted with NIP-44 before it is stored. The database never holds plaintext.",
    blocks: [
      { type: "h2", text: "Who sees what" },
      {
        type: "p",
        text: "Only the offer owner and the applicant. The rule lives in Postgres (RLS), not in a browser `if`.",
      },
      { type: "h2", text: "How a message travels" },
      {
        type: "code",
        label: "http",
        code: `POST /api/trades/{id}/messages
{ "text": "nip44v2.<ciphertext>" }

GET  /api/trades/{id}/messages`,
      },
      {
        type: "p",
        text: "The client encrypts with your local nsec (or NIP-07). The API stores the blob. The operator cannot read the park you agreed on.",
      },
      {
        type: "callout",
        title: "Realtime",
        body: "A new row on the thread triggers a reload of ciphertext. We do not push plaintext over the websocket.",
      },
    ],
  },
  reputacion: {
    kicker: "Trust",
    title: "The rating you leave is the guarantee.",
    lead: "Swaps split into Accepted, Incoming and Sent. When the deal closes, you rate. The average can stay on the profile — or you prove it with a ZK badge and keep counterparties off the graph.",
    blocks: [
      {
        type: "steps",
        items: [
          { title: "Pending", text: "Someone applied. The owner accepts or declines." },
          { title: "Accepted", text: "Chat continues. You coordinate the meeting." },
          { title: "Delivered", text: "One side already confirmed. The other still has to." },
          { title: "Completed", text: "Both confirmed. Rate 1 to 5." },
        ],
      },
      { type: "h2", text: "What goes on the profile" },
      {
        type: "p",
        text: "Average, number of ratings and closed swaps — if you want that public. The ZK path (`circuits/reputation.circom` + client Pedersen proofs) lets you show “enough good trades” without publishing who you met. See Cypherpunk for what Bitcoin L1 does and does not verify.",
      },
    ],
  },
  api: {
    kicker: "Build",
    title: "Few routes. Tightly closed.",
    lead: "The app talks to Postgres with the authenticated client. The server steps in for Nostr login, Cashu stamps and storing chat ciphertext — not for reading it.",
    blocks: [
      { type: "h2", text: "Session" },
      {
        type: "p",
        text: "A signed Nostr event (kind 22242) hits `POST /api/auth/nostr`. The server checks the signature and opens a Supabase session bound to that pubkey. Telegram login remains as optional legacy.",
      },
      {
        type: "code",
        label: "auth",
        code: `POST /api/auth/nostr
POST /api/auth/telegram/login
GET  /auth/signout`,
      },
      {
        type: "p",
        text: "Next.js refreshes the session with `getUser()`. Never expose the service role to the browser.",
      },
      { type: "h2", text: "Messages" },
      {
        type: "code",
        label: "json",
        code: `POST /api/trades/:id/messages
Authorization: session cookie
{ "text": "nip44v2.<ciphertext>" }

201 { "message": { "id", "tradeId", "senderId", "text", "createdAt" } }`,
      },
      {
        type: "p",
        text: "Usual errors: 401 with no session, 403 if you are not a party, 409 if the swap already closed.",
      },
      { type: "h2", text: "Public data (read)" },
      {
        type: "p",
        text: "Visible profiles, items and open offers read under RLS. Trades, notifications and chat ciphertext exist only for the two parties.",
      },
      {
        type: "callout",
        title: "There is no chat dump",
        body: "Each thread is born from a swap. If you are not a party, the database answers empty.",
      },
    ],
  },
  seguridad: {
    kicker: "Technical trust",
    title: "The door is in the database, not the button.",
    lead: "Even if someone talks to the API with the anon key, Postgres decides which rows exist for that user.",
    blocks: [
      { type: "h2", text: "Layers" },
      {
        type: "ul",
        items: [
          "**Transit** — HTTPS on Vercel and Supabase.",
          "**Identity** — secp256k1 / Nostr event. The server verifies the signature before opening a session. Explore is public; publish and apply need a key.",
          "**Authorization** — Row Level Security on every table.",
          "**Chat at rest** — NIP-44 ciphertext. The nsec never leaves the browser. Legacy Cuba rows used server AES; this fork does not decrypt those for the operator.",
          "**Reputation** — Pedersen + range proofs in the client. Circom/fflonk circuit matches BitVM’s 2-output interface. Bitcoin Script does not run here.",
          "**Photos** — the storage path starts with your authenticated user.",
        ],
      },
      { type: "h2", text: "What we do not ask" },
      {
        type: "ul",
        items: [
          "SMS or phone OTP to enter.",
          "Mandatory GPS. You type the city.",
          "Money in escrow. MeCuadra does not intermediate cash or sats for goods.",
        ],
      },
      {
        type: "callout",
        title: "Sign out",
        tone: "ok",
        body: "Sign out is yes/no in the web. Your Bitcoin key is still yours; only this browser session closes. The nsec, if generated here, stays in local storage until you clear it.",
      },
    ],
  },
  desplegar: {
    kicker: "Production",
    title: "Vercel in front. Keys at the door.",
    lead: "The market is public. The session comes from a Bitcoin / Nostr key. Supabase stores the profile, offers and chat ciphertext. Keep Cuba `main` separate from this hackathon branch.",
    blocks: [
      { type: "h2", text: "Variables" },
      {
        type: "p",
        text: "Use your own project. Do not copy production URLs or keys into a public repo.",
      },
      {
        type: "code",
        label: ".env.local",
        code: `NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MESSAGE_ENCRYPTION_KEY=
CASHU_DEMO_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_SITE_URL=https://your-domain.example`,
      },
      {
        type: "p",
        text: "`MESSAGE_ENCRYPTION_KEY` is 32 bytes as hex (64 characters), used only for legacy Cuba blobs. Generate your own; do not reuse it across environments.",
      },
      {
        type: "code",
        label: "shell",
        code: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
      },
      { type: "h2", text: "Database" },
      {
        type: "p",
        text: "In the Supabase SQL editor run `supabase/schema.sql` and `supabase/hackathon_cypherpunk.sql` (npub, silent payment code, zk columns). Do not destroy Cuba province defaults on a shared project.",
      },
      { type: "h2", text: "This fork vs Cuba production" },
      {
        type: "ul",
        items: [
          "Branch `hackathon/boss-battle` — Bitcoin keys, NIP-44, Cashu, ZK.",
          "Branch `main` — Cuba / Telegram product. Do not merge this fork into `main`.",
          "Deploy previews with `vercel` without `--prod` so `mecuadra.vercel.app` stays Cuba.",
        ],
      },
      {
        type: "callout",
        title: "No Google, no SMS",
        body: "The cypherpunk path is a key. Telegram is optional legacy, not required to publish or apply.",
      },
    ],
  },
} satisfies Record<string, DocsCopy>;

const es: typeof en = {
  home: {
    kicker: "MeCuadra · Docs",
    title: "El cuaderno del trueque.",
    lead: "Cómo se publica, se aplica, se habla y se cierra un intercambio — en cualquier país. Claves Bitcoin, chat cifrado, sin precios. El mismo morado del apretón de manos.",
    blocks: [
      {
        type: "flow",
        items: [
          { n: "01", title: "Publicas", text: "Lo que tienes, con foto y ciudad." },
          { n: "02", title: "Alguien aplica", text: "Toca MeCuadra y propone." },
          { n: "03", title: "Hablan", text: "Chat NIP-44. Solo ustedes." },
          { n: "04", title: "Se ven", text: "Confirman la entrega." },
          { n: "05", title: "Se valoran", text: "La reputación queda. El grafo, no." },
        ],
      },
      { type: "h2", text: "Para quién es este cuaderno" },
      {
        type: "p",
        text: "Para quien quiere un mercado P2P con fotos, filtros y memoria — sin poner el trato en el ledger público de Bitcoin. Y para quien construye MeCuadra: claves, API, NIP-44 y ZK.",
      },
      {
        type: "cards",
        items: [
          {
            href: "/docs/trueque",
            kicker: "Empieza",
            title: "El trueque en 5 toques",
            hint: "El ciclo completo, dibujado.",
          },
          {
            href: "/docs/cypherpunk",
            kicker: "Hackathon",
            title: "Cypherpunk + ZK",
            hint: "Cómo usamos Bitcoin sin rastro de pago.",
          },
        ],
      },
      {
        type: "callout",
        title: "Regla de oro",
        body: "Si pides efectivo, no es MeCuadra. Las apps de venta cubren la venta. Aquí el producto es el trueque.",
      },
      {
        type: "hint",
        text: "Pulsa ⌘K o el buscador de arriba. El índice de la izquierda no se esconde en escritorio.",
      },
    ],
  },
  trueque: {
    kicker: "Flujo",
    title: "Cinco toques y el trato está vivo.",
    lead: "No hay saldo que congelar. Lo que custodia el encuentro es la reputación, el chat privado y que las dos partes marquen entregado.",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "Publicas lo que cambias",
            text: "Primero el artículo (fotos, condición, categoría). Luego la oferta: qué das, qué buscas, ciudad y si puedes moverte.",
          },
          {
            title: "Alguien toca MeCuadra",
            text: "Elige de su inventario o escribe una propuesta libre — incluso algo que no tiene publicado.",
          },
          {
            title: "Se abre el chat",
            text: "Solo dueño y aplicante. Ciphertext NIP-44 en el servidor. Nadie más lee el hilo.",
          },
          {
            title: "Aceptas una propuesta",
            text: "Las demás se rechazan. La oferta pasa a en proceso.",
          },
          {
            title: "Confirman y valoran",
            text: "Cada uno marca entregado. Cuando ambos lo hacen, el trueque se cierra y se califican. Un badge ZK puede probar suficientes notas buenas sin nombrar con quién.",
          },
        ],
      },
      {
        type: "callout",
        title: "La ciudad es un filtro, nunca un muro",
        body: "Puedes ver el mercado entero. Filtrar por Lisboa o Ciudad de México es opcional. Nunca pedimos GPS para dejar entrar.",
      },
    ],
  },
  cuenta: {
    kicker: "Cuenta",
    title: "Tu cuenta es una clave Bitcoin.",
    lead: "La misma curva secp256k1 que Bitcoin y Nostr. Tu npub es la cuenta. Sin teléfono, sin KYC, sin Google. Telegram es legado opcional, no la puerta.",
    blocks: [
      { type: "h2", text: "Cómo se entra" },
      {
        type: "ul",
        items: [
          "**Explorar** — sin cuenta. Las ofertas son públicas.",
          "**Crear una clave nueva** — la app deriva nsec/npub en este navegador. Guarda el nsec. MeCuadra no lo ve.",
          "**NIP-07** — si tienes Alby / nos2x, firmas sin pegar un secreto.",
          "**Importar** — pega un nsec. Se queda en este navegador para el chat NIP-44.",
        ],
      },
      {
        type: "steps",
        items: [
          { title: "Generar o importar", text: "Creas una clave o entras con extensión." },
          { title: "Respaldo", text: "Copia el nsec fuera de línea. Quien lo tenga usa tu identidad." },
          { title: "Entrar al mercado", text: "Un evento Nostr firmado (kind 22242) abre la sesión. Publicas y aplicas." },
        ],
      },
      { type: "h2", text: "Qué pedimos y qué no" },
      {
        type: "ul",
        items: [
          "No pedimos SMS, correo ni Google para entrar.",
          "No pedimos GPS. Ciudad y barrio los escribes tú en las ofertas.",
          "Telegram sigue como legado colapsado del producto Cuba. Aquí no es obligatorio.",
        ],
      },
      {
        type: "callout",
        title: "Privacidad",
        tone: "ok",
        body: "Nunca envíes tu nsec a nadie. MeCuadra no lo guarda. Si un extraño pide tu secreto “para ayudarte a entrar”, cierra y vuelve a `/login`.",
      },
    ],
  },
  ofertas: {
    kicker: "Mercado",
    title: "Lo que tienes / lo que necesitas / ciudad.",
    lead: "El mismo apretón en cualquier país: fotos, una ciudad, sin precios. El barrio es opcional y queda para el chat.",
    blocks: [
      { type: "h2", text: "Primero el artículo" },
      {
        type: "p",
        text: "Título, descripción, categoría, condición (nuevo, usado o sellado) y varias fotos. Recorres la galería, luego editas o eliminas cuando quieras.",
      },
      { type: "h2", text: "Luego la oferta" },
      {
        type: "ul",
        items: [
          "Qué ofreces (uno o varios artículos).",
          "Qué necesitas, o “escucho propuestas”.",
          "País, ciudad, barrio opcional.",
          "Transporte: tengo, deben venir, o voy al lugar.",
        ],
      },
      {
        type: "p",
        text: "Puedes editar o dar de baja una oferta tuya mientras esté abierta. Si la tocaste después de crearla, se ve cuándo se editó.",
      },
      {
        type: "callout",
        title: "El anti-spam no es un precio",
        body: "Publicar pide un sello Cashu (mint de prueba o demo etiquetado). Las invoices Lightning acuñan el sello. Nunca ponen precio a la bici o a la cámara.",
      },
      {
        type: "callout",
        title: "Compartir",
        body: "Cada oferta puede abrir Telegram, WhatsApp o Facebook. Tú eliges el grupo. El texto es ofrezco / necesito / ciudad más el enlace.",
      },
    ],
  },
  aplicar: {
    kicker: "Aplicar",
    title: "Un toque. Una propuesta. Un chat.",
    lead: "MeCuadra es el momento en que dejas de mirar y te postulas como contraparte. No hay dinero en custodia. Hay lo que ofreces a cambio.",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "Abres la oferta",
            text: "Fotos, lo que da, lo que busca, ciudad y transporte.",
          },
          {
            title: "Tocas MeCuadra",
            text: "Marcas tus artículos o escribes algo que no está publicado.",
          },
          {
            title: "El dueño decide",
            text: "Acepta o rechaza. Si acepta, las demás propuestas de esa oferta caen.",
          },
        ],
      },
      {
        type: "callout",
        title: "No puedes aplicar a lo tuyo",
        body: "Ni sin sesión. El servidor lo bloquea; no es solo la interfaz.",
      },
    ],
  },
  chat: {
    kicker: "Conversación",
    title: "El hilo es de ustedes dos.",
    lead: "Puedes aclarar, ofrecer otra cosa o citar un parque. El texto se cifra con NIP-44 antes de guardarse. En la base no queda el mensaje en claro.",
    blocks: [
      { type: "h2", text: "Quién ve qué" },
      {
        type: "p",
        text: "Solo el dueño de la oferta y quien aplicó. La regla vive en Postgres (RLS), no en un `if` del navegador.",
      },
      { type: "h2", text: "Cómo viaja un mensaje" },
      {
        type: "code",
        label: "http",
        code: `POST /api/trades/{id}/messages
{ "text": "nip44v2.<ciphertext>" }

GET  /api/trades/{id}/messages`,
      },
      {
        type: "p",
        text: "El cliente cifra con tu nsec local (o NIP-07). La API guarda el blob. El operador no puede leer el parque en el que quedaron.",
      },
      {
        type: "callout",
        title: "Tiempo real",
        body: "Un alta en el hilo dispara una recarga de ciphertext. No mandamos plaintext por el websocket.",
      },
    ],
  },
  reputacion: {
    kicker: "Confianza",
    title: "La nota que dejas es la garantía.",
    lead: "Los trueques se parten en Aceptados, Recibidos y Enviados. Cuando el trato cierra, se valoran. Esa media puede verse en el perfil — o la demuestras con un badge ZK y dejas a las contrapartes fuera del grafo.",
    blocks: [
      {
        type: "steps",
        items: [
          { title: "Pendiente", text: "Alguien aplicó. El dueño acepta o rechaza." },
          { title: "Aceptado", text: "El chat sigue. Coordinan el encuentro." },
          { title: "Entregado", text: "Una parte ya confirmó. Falta la otra." },
          { title: "Completado", text: "Ambos confirmaron. Toca valorar de 1 a 5." },
        ],
      },
      { type: "h2", text: "Qué sube al perfil" },
      {
        type: "p",
        text: "Promedio, cantidad de notas y trueques cerrados — si quieres eso público. El camino ZK (`circuits/reputation.circom` + Pedersen en el cliente) permite mostrar “suficientes trueques buenos” sin publicar con quién te viste. En Cypherpunk está qué verifica Bitcoin L1 y qué no.",
      },
    ],
  },
  api: {
    kicker: "Construir",
    title: "Pocas rutas. Bien cerradas.",
    lead: "La app habla con Postgres vía el cliente autenticado. El servidor interviene en el login Nostr, los sellos Cashu y al guardar ciphertext del chat — no para leerlo.",
    blocks: [
      { type: "h2", text: "Sesión" },
      {
        type: "p",
        text: "Un evento Nostr firmado (kind 22242) llega a `POST /api/auth/nostr`. El servidor verifica la firma y abre una sesión de Supabase ligada a esa pubkey. Telegram sigue como legado opcional.",
      },
      {
        type: "code",
        label: "auth",
        code: `POST /api/auth/nostr
POST /api/auth/telegram/login
GET  /auth/signout`,
      },
      {
        type: "p",
        text: "Next.js refresca la sesión con `getUser()`. No expongas la service role al navegador.",
      },
      { type: "h2", text: "Mensajes" },
      {
        type: "code",
        label: "json",
        code: `POST /api/trades/:id/messages
Authorization: cookie de sesión
{ "text": "nip44v2.<ciphertext>" }

201 { "message": { "id", "tradeId", "senderId", "text", "createdAt" } }`,
      },
      {
        type: "p",
        text: "Errores habituales: 401 sin sesión, 403 si no eres parte, 409 si el trueque ya cerró.",
      },
      { type: "h2", text: "Datos públicos (lectura)" },
      {
        type: "p",
        text: "Perfiles visibles, artículos y ofertas abiertas se leen con RLS. Trueques, notificaciones y el ciphertext del chat solo existen para los pares del trato.",
      },
      {
        type: "callout",
        title: "No hay un dump de chats",
        body: "Cada hilo nace de un trueque. Si no eres parte, la base responde vacío.",
      },
    ],
  },
  seguridad: {
    kicker: "Confianza técnica",
    title: "La puerta está en la base, no en el botón.",
    lead: "Aunque alguien hable directo al API con la clave anónima, Postgres decide qué filas existen para ese usuario.",
    blocks: [
      { type: "h2", text: "Capas" },
      {
        type: "ul",
        items: [
          "**Tránsito** — HTTPS en Vercel y en Supabase.",
          "**Identidad** — secp256k1 / evento Nostr. El servidor valida la firma antes de crear la sesión. Explorar es público; publicar y aplicar piden clave.",
          "**Autorización** — Row Level Security en todas las tablas.",
          "**Chat en reposo** — ciphertext NIP-44. El nsec no sale del navegador. Las filas legado de Cuba usaban AES de servidor; este fork no las descifra para el operador.",
          "**Reputación** — Pedersen + range proofs en el cliente. El circuito Circom/fflonk copia la interfaz de 2 salidas de BitVM. Bitcoin Script no corre aquí.",
          "**Fotos** — el path de storage empieza por tu usuario autenticado.",
        ],
      },
      { type: "h2", text: "Qué no pedimos" },
      {
        type: "ul",
        items: [
          "SMS ni OTP de teléfono para entrar.",
          "GPS obligatorio. La ciudad la escribes tú.",
          "Dinero en custodia. MeCuadra no intermedia efectivo ni sats por el bien.",
        ],
      },
      {
        type: "callout",
        title: "Cerrar sesión",
        tone: "ok",
        body: "Cerrar sesión es un sí/no en la web. Tu clave Bitcoin sigue siendo tuya; solo se cierra esta sesión del navegador. El nsec, si se generó aquí, queda en local storage hasta que lo borres.",
      },
    ],
  },
  desplegar: {
    kicker: "Producción",
    title: "Vercel delante. Claves en la puerta.",
    lead: "El mercado es público. La sesión sale de una clave Bitcoin / Nostr. Supabase guarda el perfil, las ofertas y el ciphertext del chat. Mantén `main` de Cuba aparte de esta rama del hackathon.",
    blocks: [
      { type: "h2", text: "Variables" },
      {
        type: "p",
        text: "Usa tu propio proyecto. No copies URLs ni claves de producción a un repo público.",
      },
      {
        type: "code",
        label: ".env.local",
        code: `NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MESSAGE_ENCRYPTION_KEY=
CASHU_DEMO_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_SITE_URL=https://your-domain.example`,
      },
      {
        type: "p",
        text: "`MESSAGE_ENCRYPTION_KEY` son 32 bytes en hex (64 caracteres), solo para blobs legado de Cuba. Genera una propia; no la reutilices entre entornos.",
      },
      {
        type: "code",
        label: "shell",
        code: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
      },
      { type: "h2", text: "Base de datos" },
      {
        type: "p",
        text: "En el SQL Editor de Supabase ejecuta `supabase/schema.sql` y `supabase/hackathon_cypherpunk.sql` (npub, silent payment, columnas zk). No destruyas los defaults de provincia de Cuba en un proyecto compartido.",
      },
      { type: "h2", text: "Este fork vs producción Cuba" },
      {
        type: "ul",
        items: [
          "Rama `hackathon/boss-battle` — claves Bitcoin, NIP-44, Cashu, ZK.",
          "Rama `main` — producto Cuba / Telegram. No mezcles este fork en `main`.",
          "Despliega previews con `vercel` sin `--prod` para que `mecuadra.vercel.app` siga siendo Cuba.",
        ],
      },
      {
        type: "callout",
        title: "Sin Google ni SMS",
        body: "El camino cypherpunk es una clave. Telegram es legado opcional, no hace falta para publicar o aplicar.",
      },
    ],
  },
};

export const DOCS_PAGES = { en, es };

export function docsCopy(slug: keyof typeof en, locale: Locale): DocsCopy {
  return DOCS_PAGES[locale][slug];
}
