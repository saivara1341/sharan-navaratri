// Web Audio API Ambient Soundscape & Voice Generator for Siddhi AI

class SiddhiAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlayingAmbient: boolean = false;
  private ambientGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleAmbientSound(): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbientSound();
      return false;
    } else {
      this.startAmbientSound();
      return true;
    }
  }

  public startAmbientSound() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      this.stopAmbientSound();

      // Master gain node
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      this.ambientGain.connect(this.audioCtx.destination);

      // Deep Root Tanpura Drone (C# / G# harmonic blend)
      const baseFreqs = [138.59, 207.65, 277.18, 415.30]; // C#3, G#3, C#4, G#4 harmonic frequencies

      baseFreqs.forEach((freq, idx) => {
        if (!this.audioCtx || !this.ambientGain) return;
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Subtle LFO modulation for organic breathing feel
        const lfo = this.audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.audioCtx.currentTime);
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);

        lfo.connect(oscGain.gain);
        lfo.start();
        this.oscillators.push(lfo);

        oscGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.ambientGain);

        osc.start();
        this.oscillators.push(osc);
      });

      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn("Ambient audio start prevented by browser autoplay policy", e);
      this.isPlayingAmbient = false;
    }
  }

  public stopAmbientSound() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
    this.isPlayingAmbient = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbient;
  }

  public speakWisdom(text: string, onEnd?: () => void): boolean {
    if (!('speechSynthesis' in window)) return false;

    window.speechSynthesis.cancel(); // Stop current speech

    // Clean markdown symbols from text
    const cleanText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92; // Calm, deliberate pace
    utterance.pitch = 0.95; // Deep, serene tone

    // Try finding an Indian English voice or a smooth English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const siddhiAudio = new SiddhiAudioEngine();
