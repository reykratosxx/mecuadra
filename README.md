# MeCuadra

Mercado de trueque entre personas en Cuba. Publicas lo que tienes, alguien toca **MeCuadra**, se abre el chat, confirman el encuentro y se valoran.

## Stack

- Next.js (App Router) en Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login con **Google** y **teléfono** (E.164, Cuba `+53`)
- Publicar y aplicar exigen teléfono verificado
- Chat cifrado en reposo con AES-256-GCM; TLS en tránsito; RLS para que solo las dos partes vean el hilo

## Configuración local

Copia `.env.example` a `.env.local` y rellena las claves (Supabase → Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://wcrgbcxewqqbnjvelwrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
```

`MESSAGE_ENCRYPTION_KEY` es 32 bytes en hexadecimal (64 caracteres):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
npm install
npm run dev
```

## Base de datos

En el SQL Editor de Supabase ejecuta `supabase/schema.sql`.

Luego, en Authentication:

1. Providers → Google (Client ID y Secret de Google Cloud, redirect `https://wcrgbcxewqqbnjvelwrp.supabase.co/auth/v1/callback`)
2. Providers → Phone (Twilio). En Site URL y Redirect URLs añade `http://localhost:3000/auth/callback` y `https://TU-DOMINIO.vercel.app/auth/callback`

## Vercel

Importa el repo `reykratosxx/mecuadra`, pega las mismas tres variables de entorno y despliega.
