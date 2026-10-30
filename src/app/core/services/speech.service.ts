import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  public readonly isSpeaking = signal<boolean>(false);
  public readonly playbackRate = signal<number>(1.0); // 1.0 (normal) or 0.75 (slow)

  constructor() {
    this.initVoices();
  }

  private initVoices(): void {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth!.getVoices();
      // Prioritize natural English voices
      this.selectedVoice = 
        voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices.find(v => v.lang.startsWith('en-GB')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  public speak(text: string, rate?: number): void {
    if (!this.synth) return;

    this.stop();

    const cleanText = text.replace(/[#*_`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.lang = 'en-US';
    utterance.rate = rate ?? this.playbackRate();
    utterance.pitch = 1.0;

    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking.set(false);
    }
  }

  public setSpeed(rate: 1.0 | 0.75): void {
    this.playbackRate.set(rate);
  }

  public toggleSpeed(): number {
    const nextRate = this.playbackRate() === 1.0 ? 0.75 : 1.0;
    this.playbackRate.set(nextRate);
    return nextRate;
  }
}
