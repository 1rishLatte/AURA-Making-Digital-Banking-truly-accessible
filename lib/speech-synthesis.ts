'use client';

export const getBestVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  if (!voices.length) return null;

  // Priority 1: High-quality / Neural / Natural local voices
  const preferredVoice = voices.find((v) =>
    (v.name.includes('Natural') ||
     v.name.includes('Enhanced') ||
     v.name.includes('Google') ||
     v.name.includes('Samantha') ||
     v.name.includes('Daniel') ||
     v.name.includes('Siri')) &&
    v.lang.startsWith('en')
  );

  if (preferredVoice) return preferredVoice;

  // Priority 2: Standard English voices
  const defaultEnglish = voices.find((v) => v.lang.startsWith('en'));
  return defaultEnglish || voices[0];
};

export const sanitizeTextForSpeech = (text: string): string => {
  return text
    // Replace currency symbols with explicit spoken words
    .replace(/₹\s?(\d+)/g, '$1 rupees')
    .replace(/\$\s?(\d+)/g, '$1 dollars')
    // Expand common technical jargon & acronyms
    .replace(/\bMFA\b/g, 'Multi-Factor Authentication')
    .replace(/\bCAPTCHA\b/g, 'Cap-Cha security puzzle')
    .replace(/\bIP\b/g, 'I P address')
    .replace(/\bPAT\b/g, 'Passkey authentication token')
    // Convert math operators and separators into pauses (with surrounding spaces handling)
    .replace(/\s*\/\s*/g, ' out of ')
    .replace(/\s*•\s*/g, ', ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const speakClearText = (
  text: string, 
  customRate: number = 0.9, 
  onEnd?: () => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Cancel any overlapping/queued audio to prevent garbled output
  window.speechSynthesis.cancel();

  const cleanText = sanitizeTextForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Load and apply the best available voice
  const voices = window.speechSynthesis.getVoices();
  const bestVoice = getBestVoice(voices);
  if (bestVoice) utterance.voice = bestVoice;

  // Audio Enunciation Tuning
  utterance.rate = Math.max(0.7, Math.min(customRate, 1.1)); // Keep within legible speed boundaries
  utterance.pitch = 1.0; // Warm, natural pitch baseline (avoid unnatural high/low pitches)
  utterance.volume = 1.0; // Full clarity volume output

  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
};
