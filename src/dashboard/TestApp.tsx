import type { FC } from 'react';

export const TestApp: FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1>🎨 Dashboard Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>
        Test Interaction
      </button>
    </div>
  );
};

export default TestApp;