/**
 * Siddhi Dynamics — gemini-ai Edge Function
 * Server-side proxy for Google Gemini. The API key never leaves the server.
 * Requires a valid signed-in session.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) return json({ error: 'AI service not configured' }, 500);

  // --- Auth: require a valid session ---
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await req.json();
    const action = String(body?.action ?? '');

    if (action === 'embed') {
      const text = String(body?.text ?? '');
      if (!text.trim() || text.length > 100_000) return json({ error: 'Invalid text' }, 400);

      const res = await fetch(
        `${GEMINI_BASE}/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text }] },
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        console.error('[gemini-ai] embed failed', res.status);
        return json({ error: 'Embedding generation failed' }, 502);
      }
      return json({ embedding: data.embedding.values });
    }

    if (action === 'generate') {
      const contents = body?.contents;
      const systemInstruction = body?.systemInstruction;
      if (!Array.isArray(contents) || contents.length === 0) {
        return json({ error: 'Invalid contents' }, 400);
      }

      const payload: Record<string, unknown> = { contents };
      if (typeof systemInstruction === 'string' && systemInstruction.trim()) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const res = await fetch(`${GEMINI_BASE}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[gemini-ai] generate failed', res.status);
        return json({ error: 'AI generation failed' }, 502);
      }
      return json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '' });
    }

    if (action === 'extract') {
      const base64Data = String(body?.base64Data ?? '');
      const mimeType = String(body?.mimeType ?? '');
      if (!base64Data || !mimeType) return json({ error: 'Invalid file payload' }, 400);

      const res = await fetch(`${GEMINI_BASE}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              {
                text:
                  'Extract all detailed factual information, business rules, pricing list, guidelines, and text content from this document/image. Return a comprehensive, clean, structured text output summarizing everything found. Do not add conversational intro/outro.',
              },
            ],
          }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[gemini-ai] extract failed', res.status);
        return json({ error: 'File processing failed' }, 502);
      }
      return json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '' });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    console.error('[gemini-ai] unexpected error', err instanceof Error ? err.message : err);
    return json({ error: 'Request failed' }, 500);
  }
});
