/**
 * @file src/main.tsx
 * @description Ponto de entrada React 19: monta <App /> no DOM, registra listeners globais de erro e importa estilos base.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { installGlobalErrorListeners } from './utils/telemetry';
import './index.css';

installGlobalErrorListeners();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
