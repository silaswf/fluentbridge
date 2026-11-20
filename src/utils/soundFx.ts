type SoundEffectKind = 'correct' | 'wrong' | 'match' | 'complete' | 'levelup';

let muted = false;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => undefined);
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setSoundMuted(value: boolean): void {
  muted = value;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startOffsetSec: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  peakGain = 0.12,
): void {
  const now = ctx.currentTime + startOffsetSec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

export function playSound(kind: SoundEffectKind): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (kind) {
      case 'correct':
        playTone(ctx, 523.25, 0, 0.12, 'triangle', 0.12);
        playTone(ctx, 659.25, 0.08, 0.18, 'triangle', 0.13);
        break;
      case 'match':
        playTone(ctx, 587.33, 0, 0.1, 'sine', 0.1);
        playTone(ctx, 880, 0.06, 0.14, 'sine', 0.11);
        break;
      case 'wrong':
        playTone(ctx, 240, 0, 0.14, 'sawtooth', 0.06);
        playTone(ctx, 185, 0.09, 0.18, 'sawtooth', 0.06);
        break;
      case 'complete':
        playTone(ctx, 523.25, 0, 0.12, 'triangle', 0.12);
        playTone(ctx, 659.25, 0.09, 0.12, 'triangle', 0.12);
        playTone(ctx, 783.99, 0.18, 0.16, 'triangle', 0.13);
        playTone(ctx, 1046.5, 0.28, 0.28, 'triangle', 0.14);
        break;
      case 'levelup':
        playTone(ctx, 440, 0, 0.11, 'sine', 0.11);
        playTone(ctx, 554.37, 0.08, 0.11, 'sine', 0.11);
        playTone(ctx, 659.25, 0.16, 0.11, 'sine', 0.12);
        playTone(ctx, 880, 0.24, 0.3, 'sine', 0.13);
        break;
    }
  } catch {
    // Ignore audio context autoplay restrictions
  }
}
