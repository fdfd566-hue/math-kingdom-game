class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Sound enabled by default
    const saved = localStorage.getItem('math_kingdom_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('math_kingdom_sound_enabled', String(this.enabled));
    return this.enabled;
  }

  // Sweet chime for correct answer: C5 -> E5 -> G5 -> C6
  public playCorrect(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
    });
  }

  // Gentle, friendly tone for trying again
  public playWrong(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 392]; // A4 -> G4 soft
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 0.35);
    });
  }

  // Click / tap sound
  public playClick(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  // Victory fanfare for completing lesson or quiz
  public playVictory(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 880, 1046.5];
    const times = [0, 0.1, 0.2, 0.3, 0.45, 0.6];
    const durations = [0.15, 0.15, 0.15, 0.2, 0.15, 0.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + times[idx]);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + times[idx]);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[idx] + durations[idx]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + times[idx]);
      osc.stop(ctx.currentTime + times[idx] + durations[idx] + 0.05);
    });
  }
}

export const sounds = new SoundEffects();
