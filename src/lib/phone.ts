/** Celular cubano E.164: +53 y 8 dígitos. */
export function normalizeCubanPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("53") && digits.length >= 10) return `+${digits.slice(0, 10)}`;
  if (digits.length === 8) return `+53${digits}`;
  if (raw.trim().startsWith("+") && digits.length >= 10) return `+${digits.slice(0, 10)}`;
  return `+53${digits}`;
}

export function isCubanMobile(e164: string) {
  return /^\+53\d{8}$/.test(e164);
}

export function friendlyAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("unsupported phone provider") || m.includes("unsupported provider")) {
    return "Twilio y Google no envían a Cuba. En Supabase activa Phone y el gancho Send SMS hacia /api/auth/send-sms (BudgetSMS).";
  }
  if (m.includes("error sending") && m.includes("sms")) {
    return "El SMS no salió. Revisa las claves de BudgetSMS y el gancho Send SMS en Auth → Hooks.";
  }
  if (m.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (m.includes("user already registered")) {
    return "Ese correo ya tiene cuenta. Entra con la contraseña.";
  }
  if (m.includes("password should be")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (m.includes("signups not allowed")) {
    return "El alta no está activa. En Auth → Providers deja Email encendido.";
  }
  return message;
}
