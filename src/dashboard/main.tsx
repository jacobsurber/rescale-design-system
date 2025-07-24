import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TestApp } from './TestApp';

console.log('Main.tsx loaded');

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
console.log('React root created');

root.render(
  <StrictMode>
    <TestApp />
  </StrictMode>
);

console.log('React app rendered');