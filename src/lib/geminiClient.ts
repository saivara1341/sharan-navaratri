import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side helpers that call the `gemini-ai` edge function.
 * The Gemini API key lives only on the server — never in the browser.
 */

async function invokeGemini<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("gemini-ai", { body });
  if (error) throw new Error(error.message || "AI request failed");
  if ((data as any)?.error) throw new Error((data as any).error);
  return data as T;
}

export async function embedText(text: string): Promise<number[]> {
  const data = await invokeGemini<{ embedding: number[] }>({ action: "embed", text });
  return data.embedding;
}

export async function generateContent(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction?: string,
): Promise<string> {
  const data = await invokeGemini<{ text: string }>({
    action: "generate",
    contents,
    systemInstruction,
  });
  return data.text;
}

export async function extractFileText(base64Data: string, mimeType: string): Promise<string> {
  const data = await invokeGemini<{ text: string }>({
    action: "extract",
    base64Data,
    mimeType,
  });
  return data.text;
}
