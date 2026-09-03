import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBestVoice, sanitizeTextForSpeech, speakClearText } from './speech-synthesis';

describe('speech-synthesis', () => {
  describe('getBestVoice', () => {
    it('returns null for empty array', () => {
      expect(getBestVoice([])).toBeNull();
    });

    it('prefers Natural/Google/Samantha/Daniel/Siri voices', () => {
      const voices = [
        { name: 'Microsoft Heera', lang: 'en-IN' },
        { name: 'Google US English Natural', lang: 'en-US' },
        { name: 'Samantha', lang: 'en-US' },
      ] as SpeechSynthesisVoice[];
      const best = getBestVoice(voices);
      expect(best?.name).toBe('Google US English Natural');
    });

    it('falls back to default English voice', () => {
      const voices = [
        { name: 'French Voice', lang: 'fr-FR' },
        { name: 'English Voice', lang: 'en-GB' },
      ] as SpeechSynthesisVoice[];
      expect(getBestVoice(voices)?.lang).toBe('en-GB');
    });

    it('falls back to first voice if no English', () => {
      const voices = [{ name: 'French', lang: 'fr-FR' } as SpeechSynthesisVoice];
      expect(getBestVoice(voices)?.name).toBe('French');
    });
  });

  describe('sanitizeTextForSpeech', () => {
    it('replaces INR and USD symbols', () => {
      expect(sanitizeTextForSpeech('₹5000')).toBe('5000 rupees');
      expect(sanitizeTextForSpeech('$100')).toBe('100 dollars');
    });

    it('expands acronyms', () => {
      expect(sanitizeTextForSpeech('Verify MFA and CAPTCHA with IP and PAT')).toBe(
        'Verify Multi-Factor Authentication and Cap-Cha security puzzle with I P address and Passkey authentication token'
      );
    });

    it('converts separators to pauses', () => {
      expect(sanitizeTextForSpeech('A/B • C — D')).toBe('A out of B, C, D');
    });

    it('trims whitespace', () => {
      expect(sanitizeTextForSpeech('  hello  ')).toBe('hello');
    });
  });

  describe('speakClearText', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('cancels previous speech and speaks sanitized text', () => {
      const mockSpeak = vi.fn();
      const mockCancel = vi.fn();
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: {
          getVoices: () => [{ name: 'Google Natural', lang: 'en-US' } as SpeechSynthesisVoice],
          speak: mockSpeak,
          cancel: mockCancel,
        },
      });

      speakClearText('₹5000 MFA', 0.9);

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
      const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utterance.text).toContain('rupees');
      expect(utterance.text).toContain('Multi-Factor Authentication');
      expect(utterance.rate).toBe(0.9);
      expect(utterance.pitch).toBe(1.0);
      expect(utterance.volume).toBe(1.0);
    });

    it('clamps rate between 0.7 and 1.1', () => {
      const mockSpeak = vi.fn();
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: {
          getVoices: () => [],
          speak: mockSpeak,
          cancel: () => {},
        },
      });

      speakClearText('hello', 2.0);
      expect((mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance).rate).toBe(1.1);

      speakClearText('hello', 0.1);
      expect((mockSpeak.mock.calls[1][0] as SpeechSynthesisUtterance).rate).toBe(0.7);
    });

    it('calls onEnd when provided', () => {
      const mockSpeak = vi.fn();
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: {
          getVoices: () => [],
          speak: mockSpeak,
          cancel: () => {},
        },
      });

      const onEnd = vi.fn();
      speakClearText('hello', 0.9, onEnd);
      const utterance = mockSpeak.mock.calls[0][0] as SpeechSynthesisUtterance;
      utterance.onend?.(new Event('end') as unknown as SpeechSynthesisEvent);
      expect(onEnd).toHaveBeenCalled();
    });
  });
});
