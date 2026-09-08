// Optional dependencies: @inworld/tts and @google/genai.
// Dynamic imports keep unrelated providers usable without installing both SDKs.
// Documentation-checked, not live-tested or SDK-version-locked.

// https://docs.inworld.ai/tts/node-sdk
export async function* inworldSpeech({ text, voiceId, model = 'inworld-tts-2-flash' }) {
  if (!text || !voiceId || !process.env.INWORLD_API_KEY) throw new Error('Text, voice and INWORLD_API_KEY are required');
  if (!['inworld-tts-2', 'inworld-tts-2-flash'].includes(model)) throw new Error('Unsupported example model');
  const { InworldTTS } = await import('@inworld/tts');
  const tts = InworldTTS();
  for await (const audio of tts.stream({
    text, voice: voiceId, model, encoding: 'WAV', sampleRate: 48000,
  })) {
    yield { audio, container: 'wav', sampleRate: 48000 };
  }
}

// https://ai.google.dev/gemini-api/docs/speech-generation
export async function* geminiSpeech({ text, voice = 'Kore' }) {
  if (!text || !process.env.GEMINI_API_KEY) throw new Error('Text and GEMINI_API_KEY are required');
  const { GoogleGenAI } = await import('@google/genai');
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const events = await client.interactions.create({
    model: 'gemini-3.1-flash-tts-preview', input: text,
    response_format: { type: 'audio' },
    generation_config: { speech_config: [{ voice }] }, stream: true,
  });
  for await (const event of events) {
    if (event.event_type === 'error') throw new Error('Gemini speech stream failed');
    if (event.event_type === 'step.delta' && event.delta?.type === 'audio') {
      yield { audio: new Uint8Array(Buffer.from(event.delta.data, 'base64')), container: 'raw', encoding: 'pcm_s16le', sampleRate: 24000, channels: 1 };
    }
  }
}
