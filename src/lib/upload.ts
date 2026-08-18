import { createClient } from "@/lib/supabase/client";

export async function uploadDataUrl(bucket: "items" | "avatars", dataUrl: string) {
  if (dataUrl.startsWith("http")) return dataUrl;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Inicia sesión");
  const match = dataUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
  if (!match) throw new Error("Imagen inválida");
  const mime = match[1];
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: mime,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
