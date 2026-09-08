// Server-only examples. No HTTP server/auth middleware is supplied here.
// Do not expose these provider API keys to a browser.

// https://developers.openai.com/api/docs/guides/realtime-webrtc
export async function openAIClientSecret({ model = 'gpt-realtime-2.1-mini', signal } = {}) {
  if (!['gpt-realtime-2.1-mini', 'gpt-realtime-2.1'].includes(model)) throw new Error('Unsupported model');
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required');
  const timeout = AbortSignal.timeout(15000);
  const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ session: { type: 'realtime', model, audio: { output: { voice: 'marin' } } } }),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error(`Session credential request returned ${response.status}`);
  const result = await response.json();
  if (typeof result.value !== 'string') throw new Error('Missing ephemeral credential');
  return { value: result.value, model }; // Only to an authenticated, authorized application client.
}

// https://ai.google.dev/gemini-api/docs/live-api/get-started-sdk
export async function geminiLive({ onAudio, onInterrupted, onError, onClose = () => {} }) {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required');
  const { GoogleGenAI, Modality } = await import('@google/genai');
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const session = await client.live.connect({
    model: 'gemini-3.1-flash-live-preview',
    config: { responseModalities: [Modality.AUDIO] },
    callbacks: {
      onmessage(message) {
        const content = message.serverContent;
        if (content?.interrupted) { onInterrupted(); return; }
        for (const part of content?.modelTurn?.parts ?? []) {
          if (part.inlineData?.data) {
            onAudio({ audio: new Uint8Array(Buffer.from(part.inlineData.data, 'base64')), encoding: 'pcm_s16le', sampleRate: 24000, channels: 1 });
          }
        }
      },
      onerror: onError,
      onclose: onClose,
    },
  });
  return {
    sendPcm16(audio) {
      if (!(audio instanceof Uint8Array) || audio.byteLength % 2 !== 0) throw new Error('Expected PCM16 bytes');
      session.sendRealtimeInput({ audio: { data: Buffer.from(audio).toString('base64'), mimeType: 'audio/pcm;rate=16000' } });
    },
    close() { session.close(); },
  };
}
