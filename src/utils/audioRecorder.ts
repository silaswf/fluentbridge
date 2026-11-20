export interface AudioRecorderHandle {
  stop: () => void;
  cancel: () => void;
}

export function isAudioRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof window.MediaRecorder !== 'undefined'
  );
}

function pickSupportedMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidates) {
    if (typeof window.MediaRecorder.isTypeSupported === 'function') {
      if (window.MediaRecorder.isTypeSupported(type)) return type;
    }
  }
  return undefined;
}

export async function startAudioRecording(callbacks: {
  maxSeconds?: number;
  onTick?: (elapsedSec: number) => void;
  onComplete: (blob: Blob, durationSec: number) => void;
  onError: (message: string) => void;
}): Promise<AudioRecorderHandle | null> {
  if (!isAudioRecordingSupported()) {
    callbacks.onError(
      'Gravação de áudio não é suportada neste navegador. Tente Chrome, Edge ou Safari atualizados.',
    );
    return null;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    callbacks.onError(
      'Não foi possível acessar o microfone. Verifique a permissão de áudio no navegador.',
    );
    return null;
  }

  const maxSeconds = callbacks.maxSeconds ?? 30;
  const mimeType = pickSupportedMimeType();
  let recorder: MediaRecorder;
  try {
    recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
  } catch {
    stream.getTracks().forEach((t) => t.stop());
    callbacks.onError('Erro ao inicializar gravador de áudio neste dispositivo.');
    return null;
  }

  const chunks: BlobPart[] = [];
  const startedAt = Date.now();
  let cancelled = false;
  let timerId: number | undefined;

  const stopTracks = () => {
    stream.getTracks().forEach((t) => t.stop());
    if (timerId !== undefined) {
      window.clearInterval(timerId);
    }
  };

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    stopTracks();
    if (cancelled) return;
    const durationSec = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const finalType = recorder.mimeType || mimeType || 'audio/webm';
    const blob = new Blob(chunks, { type: finalType });
    if (blob.size === 0) {
      callbacks.onError('Nenhum áudio gravado. Tente falar mais perto do microfone.');
      return;
    }
    callbacks.onComplete(blob, durationSec);
  };

  recorder.onerror = () => {
    stopTracks();
    callbacks.onError('Falha durante a gravação do áudio.');
  };

  recorder.start(250);

  timerId = window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    callbacks.onTick?.(elapsed);
    if (elapsed >= maxSeconds && recorder.state === 'recording') {
      recorder.stop();
    }
  }, 500);

  return {
    stop: () => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    },
    cancel: () => {
      cancelled = true;
      if (recorder.state === 'recording') {
        recorder.stop();
      } else {
        stopTracks();
      }
    },
  };
}
