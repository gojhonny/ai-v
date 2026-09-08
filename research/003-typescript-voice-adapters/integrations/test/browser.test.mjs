import test from 'node:test';
import assert from 'node:assert/strict';
import { SpeechPlayer } from '../src/browser.ts';
import { profiles } from '../src/profiles.ts';
import { pcm16ToWav } from '../src/audio.ts';

class FakeAudio extends EventTarget {
  src=''; plays=0; blocked=false;
  pause(){}
  load(){}
  removeAttribute(name){if(name==='src')this.src='';}
  async play(){this.plays++;if(this.blocked)throw new DOMException('Gesture required','NotAllowedError');}
}
const response=()=>new Response(pcm16ToWav(Uint8Array.of(0,0)),{headers:{'Content-Type':'audio/wav'}});

test('autoplay rejection preserves synthesized audio for a later user-initiated play',async()=>{
  const original=globalThis.fetch; let calls=0;
  globalThis.fetch=async()=>{calls++;return response();};
  const audio=new FakeAudio(); audio.blocked=true; const player=new SpeechPlayer(audio);
  try {
    await assert.rejects(()=>player.speak(profiles.cartesia,'Hello'),{name:'NotAllowedError'});
    assert(audio.src.startsWith('blob:')); audio.blocked=false; await player.play();
    assert.equal(calls,1); assert.equal(audio.plays,2);
  } finally {player.dispose();globalThis.fetch=original;}
});

test('reentrant stop during audio-ready never starts playback',async()=>{
  const original=globalThis.fetch; globalThis.fetch=async()=>response();
  const audio=new FakeAudio(),player=new SpeechPlayer(audio);
  player.addEventListener('audio-ready',()=>player.stop());
  try {
    await assert.rejects(()=>player.speak(profiles.cartesia,'Hello'),{name:'AbortError'});
    assert.equal(audio.plays,0); assert.equal(audio.src,'');
  } finally {player.dispose();globalThis.fetch=original;}
});

test('a superseded delayed response cannot overwrite or stop the newest audio',async()=>{
  const original=globalThis.fetch; let release,calls=0;
  globalThis.fetch=async()=>{calls++;return calls===1?new Promise(resolve=>{release=resolve;}):response();};
  const audio=new FakeAudio(),player=new SpeechPlayer(audio);
  try {
    const first=player.speak(profiles.cartesia,'First');
    const rejected=assert.rejects(first,{name:'AbortError'});
    await player.speak(profiles.cartesia,'Second'); const newest=audio.src;
    release(response()); await rejected;
    assert.equal(audio.src,newest); assert.equal(audio.plays,1);
  } finally {player.dispose();globalThis.fetch=original;}
});
