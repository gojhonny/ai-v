import type { VoiceConfig } from './contracts.ts';
import { VoiceError, validateConfig } from './contracts.ts';
import { readBounded } from './audio.ts';

// Import only this client module in a web component, never server.ts / engine.ts.
// Host owns the visible play button, accessible status, and audible-quality evaluation.
export class SpeechPlayer extends EventTarget {
  #audio:HTMLAudioElement; #abort?:AbortController; #url?:string; #generation=0;
  #ended:()=>void;
  constructor(audio:HTMLAudioElement) {
    super(); this.#audio=audio;
    this.#ended=()=>{ this.#release(); this.dispatchEvent(new Event('playback-ended')); };
    audio.addEventListener('ended',this.#ended);
  }
  #release() { if(this.#url) URL.revokeObjectURL(this.#url); this.#url=undefined; }
  stop():void {
    this.#generation++; this.#abort?.abort(); this.#abort=undefined;
    this.#audio.pause(); this.#audio.removeAttribute('src'); this.#audio.load(); this.#release();
  }
  dispose():void { this.stop(); this.#audio.removeEventListener('ended',this.#ended); }
  async play():Promise<void> {
    const generation=this.#generation;
    await this.#audio.play();
    if(generation===this.#generation) this.dispatchEvent(new Event('playback-started'));
  }
  async speak(config:VoiceConfig,text:string):Promise<void> {
    const c=validateConfig(config); this.stop(); const generation=this.#generation;
    const controller=new AbortController(); this.#abort=controller;
    const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(65000)]);
    try {
      const response=await fetch(c.endpoint,{
        method:'POST',credentials:'same-origin',signal,headers:{'Content-Type':'application/json'},
        body:JSON.stringify({profileId:c.profileId,text,requestId:crypto.randomUUID()}),
      });
      if(!response.ok) throw new VoiceError('PROVIDER',`Speech endpoint returned HTTP ${response.status}`);
      const mediaType=response.headers.get('content-type')?.split(';')[0].trim();
      if(mediaType!=='audio/wav'&&mediaType!=='audio/mpeg') throw new VoiceError('PROTOCOL','Unsupported audio type');
      const bytes=await readBounded(response,signal); signal.throwIfAborted();
      if(generation!==this.#generation) throw new DOMException('Superseded','AbortError');
      this.#url=URL.createObjectURL(new Blob([bytes.slice().buffer as ArrayBuffer],{type:mediaType}));
      this.#audio.src=this.#url;
      this.dispatchEvent(new Event('audio-ready'));
      signal.throwIfAborted();
      if(generation!==this.#generation) throw new DOMException('Superseded','AbortError');
      await this.#audio.play(); // May reject under autoplay policy; host must offer a Play action.
      if(generation!==this.#generation) throw new DOMException('Superseded','AbortError');
      this.dispatchEvent(new Event('playback-started'));
    } catch(error) {
      if(error instanceof DOMException && error.name==='NotAllowedError' && generation===this.#generation) {
        // Retain the ready audio so an explicit user gesture can call player.play().
        this.dispatchEvent(new Event('playback-blocked'));
        throw error;
      }
      if(generation===this.#generation) this.stop();
      throw error;
    }
  }
}
