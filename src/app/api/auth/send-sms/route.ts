import { Webhook } from "standardwebhooks";
import { sendCubanSms } from "@/lib/sms";

export const runtime = "nodejs";

type SmsHook = {
  user?: { phone?: string };
  sms?: { otp?: string };
};

function hookSecret() {
  const raw = process.env.SEND_SMS_HOOK_SECRET ?? "";
  return raw.replace(/^v1,whsec_/, "").replace(/^whsec_/, "");
}

export async function POST(request: Request) {
  const payload = await request.text();
  const secret = hookSecret();
  if (!secret) {
    return Response.json(
      { error: { http_code: 500, message: "Falta SEND_SMS_HOOK_SECRET." } },
      { status: 500 },
    );
  }

  try {
    const wh = new Webhook(secret);
    const event = wh.verify(payload, {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
    }) as SmsHook;

    const phone = event.user?.phone ?? "";
    const otp = event.sms?.otp ?? "";
    if (!phone || !otp) {
      return Response.json(
        { error: { http_code: 400, message: "Falta teléfono u OTP." } },
        { status: 400 },
      );
    }

    await sendCubanSms(phone, `MeCuadra: tu codigo es ${otp}. No lo compartas.`);
    return Response.json({}, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "No se pudo enviar el SMS.";
    return Response.json(
      { error: { http_code: 500, message } },
      { status: 500 },
    );
  }
}
