# MeCuadra

Mercado de trueque entre personas en Cuba. Publicas lo que tienes, alguien toca **MeCuadra**, se abre el chat, confirman el encuentro y se valoran.

## Stack

- Next.js (App Router) en Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login: **Telegram** (Login Widget oficial; acceso alternativo por el bot si el widget se atasca)
- Explorar el mercado: público, sin cuenta
- Publicar y aplicar: con sesión
- Chat cifrado en reposo con AES-256-GCM; TLS en tránsito; RLS

## Configuración local

Crea `.env.local` con tu propio proyecto (no pegues URLs ni tokens ajenos en un repo público):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
```

`MESSAGE_ENCRYPTION_KEY` es 32 bytes en hex (64 caracteres):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
npm install
npm run dev
```

## Base de datos

En el SQL Editor de Supabase ejecuta `supabase/schema.sql` y las migraciones en `supabase/*.sql` que apliquen a tu entorno.

## Telegram

1. Crea el bot en [@BotFather](https://t.me/BotFather) y guarda el token solo en variables de entorno.
2. `/setdomain` → el dominio público de tu despliegue (`localhost` no sirve en prod; para local usa un túnel o el dominio de preview).
3. En Vercel: las variables de Telegram, Supabase y `MESSAGE_ENCRYPTION_KEY`.
4. El widget autentica vía el endpoint de login (HMAC). Si hace falta, configura el webhook del bot desde el setup del proyecto.

## Vercel

Importa el repo, pega las variables de **tu** proyecto y despliega.
