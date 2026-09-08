// Proposed application interface. This is not a provider SDK or a working adapter.
// A provider-specific implementation must fulfill every advertised capability.

export type AudioFormat =
  | { container: 'raw'; encoding: 'pcm_s16le' | 'pcm_f32le'; sampleRate: number; channels: 1 | 2 }
  | { container: 'wav' | 'mp3' | 'ogg'; mimeType: string };

export interface VoiceCapabilities {
  kind: 'synthesis' | 'conversation';
  incrementalTextInput: boolean;
  streamingAudioOutput: boolean;
  providerCancellation: boolean;
  steering: boolean;
  timestamps: boolean;
  ephemeralClientAuth: boolean;
}

export type VoiceEvent =
  | { type: 'connected' }
  | { type: 'audio'; generationId: string; bytes: Uint8Array; format: AudioFormat }
  | { type: 'transcript'; generationId: string; speaker: 'user' | 'assistant'; text: string; final: boolean }
  | { type: 'timestamps'; generationId: string; items: Array<{ text: string; startMs: number; endMs: number }> }
  | { type: 'generation-ended'; generationId: string; reason: 'complete' | 'interrupted' | 'cancelled' }
  | { type: 'interrupted'; generationId: string }
  | { type: 'usage'; provider: string; quantities: Record<string, { amount: number; unit: string }>; estimated: boolean }
  | { type: 'error'; code: string; retryable: boolean }
  | { type: 'closed' };

export interface SpeechSynthesizer {
  readonly capabilities: VoiceCapabilities & { kind: 'synthesis' };
  synthesize(request: { text: string | AsyncIterable<string>; instructions?: string; voice: string; locale?: string; generationId: string; signal: AbortSignal }): AsyncIterable<VoiceEvent>;
}

export interface ConversationSession {
  readonly capabilities: VoiceCapabilities & { kind: 'conversation' };
  events: AsyncIterable<VoiceEvent>;
  connect(options: { locale?: string; signal: AbortSignal }): Promise<void>;
  sendAudio(audio: Uint8Array, format: AudioFormat): Promise<void>;
  sendText(text: string): Promise<void>;
  interrupt(generationId: string): Promise<void>;
  close(): Promise<void>;
}

export type VoiceProvider = SpeechSynthesizer | ConversationSession;
