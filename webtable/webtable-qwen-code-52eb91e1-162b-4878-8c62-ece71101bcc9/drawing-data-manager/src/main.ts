import { Buffer } from 'buffer';
import process from 'process/browser';
import stream from 'stream-browserify';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
    stream: typeof stream;
  }
}

window.Buffer = Buffer;
window.process = process;
window.process.env = window.process.env || {};
window.stream = stream;

import './polyfills.js'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
