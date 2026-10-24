// Web Audio API Synthesizer - 100% offline, zero external audio asset dependencies

class SoundController {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  // Play pleasant completion chime (C5 -> G5 chord progression)
  public playCompletionChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.3);
    });
  }

  // Play short starting sound
  public playStartChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Play soft tactile click for buttons / checkboxes
  public playTactileClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Start continuous ambient noise: 'whitenoise' | 'binaural' | 'rain'
  public startAmbient(type: 'whitenoise' | 'binaural' | 'rain') {
    this.stopAmbient();
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (type === 'whitenoise' || type === 'rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/Brown noise curve for soothing sound rather than harsh static
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Brown noise
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          // Pink noise
          data[i] = (lastOut + (0.05 * white)) / 1.05;
          lastOut = data[i];
          data[i] *= 2.0;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 850 : 1200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(0);
      this.noiseNode = noise;
    } else if (type === 'binaural') {
      // 40Hz Gamma focus binaural beat: Left ear 200Hz, Right ear 240Hz
      const merger = ctx.createChannelMerger(2);

      const oscLeft = ctx.createOscillator();
      oscLeft.frequency.value = 200;
      const gainLeft = ctx.createGain();
      gainLeft.gain.value = 0.05;
      oscLeft.connect(gainLeft);
      gainLeft.connect(merger, 0, 0);

      const oscRight = ctx.createOscillator();
      oscRight.frequency.value = 240; // 40Hz difference for deep focus
      const gainRight = ctx.createGain();
      gainRight.gain.value = 0.05;
      oscRight.connect(gainRight);
      gainRight.connect(merger, 0, 1);

      merger.connect(ctx.destination);

      oscLeft.start();
      oscRight.start();

      this.noiseNode = {
        stop: () => {
          try {
            oscLeft.stop();
            oscRight.stop();
          } catch {
            // ignore if already stopped
          }
        }
      } as unknown as AudioNode;
    }
  }

  public stopAmbient() {
    if (this.noiseNode) {
      try {
        if ('stop' in this.noiseNode && typeof (this.noiseNode as AudioBufferSourceNode).stop === 'function') {
          (this.noiseNode as AudioBufferSourceNode).stop();
        }
      } catch {
        // already stopped
      }
      this.noiseNode = null;
    }
  }
}

export const sound = new SoundController();
