# MeCuadra

Mercado de trueque entre personas en Cuba. Publicas lo que tienes, alguien toca **MeCuadra**, se abre el chat, confirman el encuentro y se valoran.

## Stack

- Next.js (App Router) en Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login: **Google** (sin clave), **correo y contraseña**, o **Cubacel por Telegram (gratis)**
- No hay SMS gratis a Cubacel (ETECSA cobra). Telegram es el canal libre en la isla
- SMS de pago opcional vía BudgetSMS; Twilio cortó +53 en 2025
- Publicar y aplicar exigen celular cubano
- Cerrar sesión pide un código al correo o un SMS
- Chat cifrado en reposo con AES-256-GCM; TLS en tránsito; RLS para que solo las dos partes vean el hilo

## Configuración local

Copia `.env.example` a `.env.local` y rellena las claves (Supabase → Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://wcrgbcxewqqbnjvelwrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
BUDGETSMS_USERNAME=
BUDGETSMS_USERID=
BUDGETSMS_HANDLE=
BUDGETSMS_FROM=MeCuadra
SEND_SMS_HOOK_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
TELEGRAM_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
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

1. Providers → Email: activo (correo y contraseña).
2. Providers → Google. Redirect: `https://wcrgbcxewqqbnjvelwrp.supabase.co/auth/v1/callback`
3. Cubacel gratis: crea un bot en Telegram con @BotFather. Pon `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` y `SUPABASE_SERVICE_ROLE_KEY`. Webhook:
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://mecuadra.vercel.app/api/auth/telegram`
4. SMS de pago (opcional): Phone + gancho a `/api/auth/send-sms` y cuenta en [BudgetSMS](https://www.budgetsms.net).
5. Redirect URLs: `http://localhost:3000/auth/callback` y `https://mecuadra.vercel.app/auth/callback`

## Vercel

Importa el repo `reykratosxx/mecuadra`, pega las variables de entorno (Supabase + BudgetSMS + el secreto del gancho SMS) y despliega.
