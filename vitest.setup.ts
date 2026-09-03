import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
expect.extend(axeMatchers);

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => {
      const React = require('react');
      return React.createElement('div', props, children);
    },
    aside: ({ children, ...props }: { children: React.ReactNode }) => {
      const React = require('react');
      return React.createElement('aside', props, children);
    },
    button: ({ children, ...props }: { children: React.ReactNode }) => {
      const React = require('react');
      return React.createElement('button', props, children);
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => {
    const React = require('react');
    return React.createElement(React.Fragment, null, children);
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('gsap', () => ({
  default: { context: (fn: () => void) => { fn(); return { revert: () => {} }; }, ticker: { remove: () => {}, add: () => {} }, to: () => ({ kill: () => {} }), set: () => {} },
  context: (fn: () => void) => { fn(); return { revert: () => {} }; },
  ticker: { remove: () => {}, add: () => {} },
}));

// Mock matchMedia for framer-motion and responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock SpeechSynthesis
class MockSpeechSynthesisUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  pitch = 1;
  volume = 1;
  lang = 'en-US';
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}
global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;

const mockVoices: SpeechSynthesisVoice[] = [
  { name: 'Google US English Natural', lang: 'en-US', default: true, localService: false, voiceURI: 'Google US English Natural' } as SpeechSynthesisVoice,
  { name: 'Microsoft Heera - English (India)', lang: 'en-IN', default: false, localService: false, voiceURI: 'Microsoft Heera' } as SpeechSynthesisVoice,
];

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    getVoices: () => mockVoices,
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onvoiceschanged: null,
  },
});

// Mock Web Speech API
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onresult: ((e: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  start() { this.onstart?.(); }
  stop() { this.onend?.(); }
}
(
  window as unknown as { SpeechRecognition: unknown; webkitSpeechRecognition: unknown }
).SpeechRecognition = MockSpeechRecognition;
(
  window as unknown as { SpeechRecognition: unknown; webkitSpeechRecognition: unknown }
).webkitSpeechRecognition = MockSpeechRecognition;

// Mock next/navigation
// Vitest will auto-mock via manual mock file if needed; keep simple here

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView for StepNavigation
Element.prototype.scrollIntoView = function () {};
