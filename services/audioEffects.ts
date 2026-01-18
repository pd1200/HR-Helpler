/**
 * HR Pro Toolbox - Audio Effects Service
 * Uses Web Audio API to generate sound effects without external dependencies.
 */

// Singleton AudioContext
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

/**
 * Plays a short "tick" sound for the reel spinning effect.
 * Sound: High pitched short wooded block / click style.
 */
export const playTickSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Filter to make it less harsh (more like a woodblock)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    oscillator.disconnect();
    oscillator.connect(filter);
    filter.connect(gainNode);

    oscillator.type = 'square';
    oscillator.frequency.value = 800; // High pitch tick
    
    // Envelope for very short click
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

/**
 * Plays a celebration "Ta-da!" sound (Major arpeggio).
 * Notes: C5, E5, G5, C6
 */
export const playWinSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;
    const duration = 0.5; // Duration of each note overlap slightly

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle'; // Mellower than square/sawtooth
      osc.frequency.setValueAtTime(freq, startTime + index * 0.1);

      // Envelope: Attack -> Decay
      const noteStart = startTime + index * 0.1;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.3, noteStart + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

      osc.start(noteStart);
      osc.stop(noteStart + duration + 0.1);
    });
  } catch (e) {
    console.warn('Win audio failed', e);
  }
};
