import { supabase } from "@/integrations/supabase/client";

const memCache = new Map<string, string>();

function key(text: string, lang: string) {
  return `tx:${lang}:${text}`;
}

export async function translateText(
  text: string | null | undefined,
  targetLang: string,
): Promise<string> {
  if (!text) return "";
  const trimmed = text.trim();
  if (!trimmed) return "";
  // Skip when target is English
  if (targetLang.startsWith("en")) return text;

  const k = key(trimmed, targetLang);
  if (memCache.has(k)) return memCache.get(k)!;

  try {
    const cached = localStorage.getItem(k);
    if (cached) {
      memCache.set(k, cached);
      return cached;
    }
  } catch {
    // ignore
  }

  try {
    const { data, error } = await supabase.functions.invoke("translate-text", {
      body: { text, targetLang },
    });
    if (error) {
      console.warn("translate error", error);
      return text;
    }
    const translated: string = data?.translated ?? text;
    memCache.set(k, translated);
    try {
      localStorage.setItem(k, translated);
    } catch {
      // ignore quota
    }
    return translated;
  } catch (e) {
    console.warn("translate exception", e);
    return text;
  }
}
