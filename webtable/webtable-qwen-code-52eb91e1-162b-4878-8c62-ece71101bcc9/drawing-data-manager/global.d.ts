// src/types/global.d.ts
declare global {
  interface Window {
    Buffer: typeof import('buffer').Buffer;
    process: typeof import('process');
    stream: typeof import('stream-browserify');
  }
}

export {}; // Это делает файл модулем TypeScript