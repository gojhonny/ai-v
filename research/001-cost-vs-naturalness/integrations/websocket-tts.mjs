// Node-only, optional dependency: ws. Complete-text speech demonstrations.
// A production adapter adds incremental text, backpressure and session reuse.

async function collectSpeech({ url, openingMessages, decode, onAudio = () => {}, signal }) {
  if (signal?.aborted) throw signal.reason ?? new Error('Aborted');
  const { default: WebSocket } = await import('ws');
  if (signal?.aborted) throw signal.reason ?? new Error('Aborted');
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    let settled = false;
    let count = 0;
    const timer = setTimeout(() => finish(new Error('Speech stream timed out')), 120000);
    const abort = () => finish(signal.reason ?? new Error('Aborted'));
    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      if (socket.readyState === WebSocket.OPEN) socket.close();
      else if (socket.readyState === WebSocket.CONNECTING) socket.terminate();
      if (error) reject(error); else resolve({ audioBytes: count });
    }
    socket.on('error', finish);
    socket.on('open', () => {
      if (settled) return;
      try { for (const message of openingMessages) socket.send(JSON.stringify(message)); }
      catch (error) { finish(error); }
    });
    socket.on('message', raw => {
      if (settled) return;
      try {
        const result = decode(JSON.parse(raw.toString()));
        if (result.error) { finish(result.error); return; }
        if (result.audio) {
          count += result.audio.byteLength;
          onAudio(result.audio); // Synchronous sink; production code must bound its queue.
        }
        if (result.done) finish(count ? undefined : new Error('No audio received'));
      } catch (error) { finish(error); }
    });
    socket.on('close', () => { if (!settled) finish(new Error('Speech connection closed before completion')); });
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
  });
}

// https://soniox.com/docs/api-reference/tts/websocket-api
export function sonioxSpeech({ text, voiceId, apiKey, onAudio, signal, language = 'en' }) {
  if (!text || !voiceId || !apiKey) throw new Error('Text, voice and API key are required');
  const streamId = crypto.randomUUID();
  return collectSpeech({
    url: 'wss://tts-rt.soniox.com/tts-websocket', onAudio, signal,
    openingMessages: [
      { api_key: apiKey, stream_id: streamId, model: 'tts-rt-v2', language, voice: voiceId, audio_format: 'pcm_s16le', sample_rate: 24000 },
      { stream_id: streamId, text, text_end: true },
    ],
    decode(event) {
      if (event.error_code != null || event.error_type === 'max_audio_duration_reached') {
        return { error: new Error('Soniox reported an error or duration limit') };
      }
      return { audio: event.audio ? Buffer.from(event.audio, 'base64') : null, done: event.terminated === true };
    },
  });
}

// https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tdd
export function elevenLabsSpeech({ text, voiceId, apiKey, onAudio, signal }) {
  if (!text || !voiceId || !apiKey) throw new Error('Text, voice and API key are required');
  return collectSpeech({
    url: 'wss://api.elevenlabs.io/v1/text-to-dialogue/stream-input?model_id=eleven_v3_conversational&output_format=mp3_44100_128',
    onAudio, signal,
    openingMessages: [
      { voices: [voiceId], xi_api_key: apiKey },
      { inputs: [{ text, voice_id: voiceId, new_turn: false }] },
      { close_socket: true },
    ],
    decode(event) {
      if (event.error) return { error: new Error('ElevenLabs reported a stream error') };
      return { audio: event.audio ? Buffer.from(event.audio, 'base64') : null, done: event.is_final === true };
    },
  });
}
