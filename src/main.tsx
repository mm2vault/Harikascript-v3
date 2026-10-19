import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './index.css';

// GitHub Pages hosts this app under /Harikascript-v3/, not the domain root.
// Register the service worker under the same base path so it cannot point at
// an unrelated root-level /sw.js on mm2vault.github.io.
if ('serviceWorker' in navigator && import.meta.env.MODE !== 'test') {
  window.addEventListener('load', () => {
    const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(serviceWorkerUrl).catch((err) => {
      // Service-worker support is optional; it must never prevent the app from loading.
      console.warn('HarikaScript service worker registration skipped:', err);
    });
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error('HarikaScript could not start: #root element was not found.');
}
