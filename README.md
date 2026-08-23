# MeCuadra

Mercado de trueque entre personas en Cuba. Publicas lo que tienes, alguien toca **MeCuadra**, se abre el chat, confirman el encuentro y se valoran.

## Stack

- Next.js (App Router) en Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login: **solo Telegram Login Widget** (sin Google, correo OTP ni SMS)
- Explorar el mercado: público, sin cuenta
- Publicar y aplicar: con sesión de Telegram
- Chat cifrado en reposo con AES-256-GCM; TLS en tránsito; RLS

## Configuración local

Copia `.env.example` a `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://wcrgbcxewqqbnjvelwrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
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

En el SQL Editor de Supabase ejecuta `supabase/schema.sql` (incluye `profiles.telegram_id`).

## Telegram Login Widget

1. Crea el bot en [@BotFather](https://t.me/BotFather) y copia el token.
2. `/setdomain` → `mecuadra.vercel.app` (y `localhost` no sirve en prod; para local usa un túnel o el dominio de Vercel).
3. En Vercel: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` (mismo nombre sin @), `SUPABASE_SERVICE_ROLE_KEY`.
4. El widget llama a `/api/auth/telegram/login`, verifica el HMAC y abre sesión Supabase.

## Vercel

Importa `reykratosxx/mecuadra`, pega las variables y despliega.
