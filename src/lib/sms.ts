/** BudgetSMS (Países Bajos): tiene ruta a Cubacel/+53. Twilio la cortó en 2025. */

export async function sendCubanSms(toE164: string, text: string) {
  const username = process.env.BUDGETSMS_USERNAME;
  const userid = process.env.BUDGETSMS_USERID;
  const handle = process.env.BUDGETSMS_HANDLE;
  const from = process.env.BUDGETSMS_FROM || "MeCuadra";

  if (!username || !userid || !handle) {
    throw new Error("Faltan BUDGETSMS_USERNAME, BUDGETSMS_USERID o BUDGETSMS_HANDLE.");
  }

  const to = toE164.replace(/\D/g, "");
  const url = new URL("https://api.budgetsms.net/sendsms/");
  url.searchParams.set("username", username);
  url.searchParams.set("userid", userid);
  url.searchParams.set("handle", handle);
  url.searchParams.set("msg", text);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const body = (await res.text()).trim();
  if (!res.ok || body.toUpperCase().startsWith("ERR")) {
    throw new Error(body || `BudgetSMS HTTP ${res.status}`);
  }
  return body;
}
