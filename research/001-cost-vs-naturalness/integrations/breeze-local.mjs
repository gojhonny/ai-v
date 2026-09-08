// The provider's local Python server must already be running.
// Research/noncommercial license restrictions apply to weights and self-hosted outputs.
// https://huggingface.co/BreezeBlue/Breeze-TTS-2
export async function breezeLocal({ text, referenceAudio, referenceText, signal }) {
  if (!text || !(referenceAudio instanceof Blob) || !referenceText) throw new Error('Text, reference Blob and transcript are required');
  const form = new FormData();
  form.set('text', text);
  form.set('ref_audio', referenceAudio, 'reference.wav');
  form.set('ref_text', referenceText);
  form.set('instruction', 'Use a relaxed conversational rhythm.');
  form.set('cfg_scale', '4');
  const response = await fetch('http://127.0.0.1:7860/v1/audio/speech', { method: 'POST', body: form, signal });
  if (!response.ok || !response.body) throw new Error('Local synthesis failed');
  return { stream: response.body, encoding: 'pcm_s16le', sampleRate: 24000, channels: 1 };
}
