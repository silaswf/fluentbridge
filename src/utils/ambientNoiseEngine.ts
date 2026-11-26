export type AmbientNoisePreset = 'clean' | 'cafe' | 'station' | 'phone';
export type AmbientNoiseIntensity = 'soft' | 'real' | 'challenge';

export interface AmbientNoiseOption {
  id: AmbientNoisePreset;
  labelPt: string;
  badge: string;
  descriptionPt: string;
}

export const AMBIENT_INTENSITY_OPTIONS: Array<{
  id: AmbientNoiseIntensity;
  labelPt: string;
  multiplier: number;
}> = [
  { id: 'soft', labelPt: 'Suave', multiplier: 0.5 },
  { id: 'real', labelPt: 'Real', multiplier: 1.0 },
  { id: 'challenge', labelPt: 'Desafio', multiplier: 1.6 },
];

const BASE_PRESET_GAIN: Record<Exclude<AmbientNoisePreset, 'clean'>, number> = {
  cafe: 0.06,
  station: 0.08,
  phone: 0.05,
};

let activePresetRef: AmbientNoisePreset = 'clean';
let activeIntensityRef: AmbientNoiseIntensity = 'real';

export const AMBIENT_NOISE_OPTIONS: AmbientNoiseOption[] = [
  {
    id: 'clean',
    labelPt: 'Estúdio Limpo',
    badge: 'Limpo',
    descriptionPt: 'Áudio sem ruído de fundo',
  },
  {
    id: 'cafe',
    labelPt: 'Café Movimentado',
    badge: 'Café',
    descriptionPt: 'Simula conversa em cafeteria (B1+)',
  },
  {
    id: 'station',
    labelPt: 'Estação de Trem',
    badge: 'Estação',
    descriptionPt: 'Simula ambiente urbano de embarque',
  },
  {
    id: 'phone',
    labelPt: 'Ligação Telefônica',
    badge: 'Telefone',
    descriptionPt: 'Simula áudio comprimido de chamada',
  },
];

let activeAudioCtx: AudioContext | null = null;
let activeSourceNode: AudioBufferSourceNode | null = null;
let activeGainNode: GainNode | null = null;

export function stopAmbientNoise(): void {
  try {
    activeSourceNode?.stop();
  } catch {
    // Ignore stop errors if already stopped
  }
  activeSourceNode = null;
  if (activeGainNode) {
    try {
      activeGainNode.disconnect();
    } catch {
      // Ignore disconnect errors
    }
    activeGainNode = null;
  }
  if (activeAudioCtx && activeAudioCtx.state !== 'closed') {
    void activeAudioCtx.close().catch(() => {});
  }
  activeAudioCtx = null;
}

function getIntensityMultiplier(intensity: AmbientNoiseIntensity): number {
  return (
    AMBIENT_INTENSITY_OPTIONS.find((opt) => opt.id === intensity)?.multiplier ?? 1.0
  );
}

export function setAmbientNoiseIntensity(intensity: AmbientNoiseIntensity): void {
  activeIntensityRef = intensity;
  if (activeGainNode && activePresetRef !== 'clean') {
    activeGainNode.gain.value =
      BASE_PRESET_GAIN[activePresetRef] * getIntensityMultiplier(intensity);
  }
}

/**
 * Gera um som ambiente suave e sintético via Web Audio API para treinar
 * escuta realista em níveis intermediários e avançados, sem depender de MP3 externo.
 */
export function startAmbientNoise(
  preset: AmbientNoisePreset,
  intensity: AmbientNoiseIntensity = activeIntensityRef,
): void {
  stopAmbientNoise();
  activePresetRef = preset;
  activeIntensityRef = intensity;
  if (preset === 'clean' || typeof window === 'undefined') return;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink/brownian smoothing so it sounds soft rather than harsh static
      lastOut = (lastOut + 0.04 * white) / 1.04;
      data[i] = lastOut * 2.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const mult = getIntensityMultiplier(intensity);

    if (preset === 'cafe') {
      filter.type = 'lowpass';
      filter.frequency.value = 650;
      gain.gain.value = BASE_PRESET_GAIN.cafe * mult;
    } else if (preset === 'station') {
      filter.type = 'bandpass';
      filter.frequency.value = 420;
      filter.Q.value = 0.7;
      gain.gain.value = BASE_PRESET_GAIN.station * mult;
    } else {
      // phone line hum/bandpass
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 1.8;
      gain.gain.value = BASE_PRESET_GAIN.phone * mult;
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    activeAudioCtx = ctx;
    activeSourceNode = source;
    activeGainNode = gain;
  } catch {
    // Graceful no-op when autoplay policy or headless environment blocks Web Audio
    stopAmbientNoise();
  }
}
