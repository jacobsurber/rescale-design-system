import React, { createContext, useContext } from 'react';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import rescaleTheme from './rescaleTheme';
import { designTokens } from './tokens';
import type { DesignTokens } from './tokens';

// CSS Variables for custom components
import './cssVariables.css';

interface RescaleThemeContextValue {
  tokens: DesignTokens;
  antdTheme: typeof rescaleTheme;
}

const RescaleThemeContext = createContext<RescaleThemeContextValue | undefined>(undefined);

export interface RescaleThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<typeof rescaleTheme>;
}

/**
 * RescaleThemeProvider - Provides theme context and Ant Design configuration
 * 
 * This component wraps your app to provide:
 * - Ant Design theme configuration
 * - CSS variables for custom components
 * - Theme tokens accessible via useRescaleTheme hook
 * 
 * @example
 * ```tsx
 * import { RescaleThemeProvider } from '@/theme';
 * 
 * function App() {
 *   return (
 *     <RescaleThemeProvider>
 *       <YourAppContent />
 *     </RescaleThemeProvider>
 *   );
 * }
 * ```
 */
export const RescaleThemeProvider: React.FC<RescaleThemeProviderProps> = ({
  children,
  customTheme,
}) => {
  // Merge custom theme with base theme if provided
  const mergedTheme = customTheme 
    ? {
        ...rescaleTheme,
        token: { ...rescaleTheme.token, ...customTheme.token },
        components: { ...rescaleTheme.components, ...customTheme.components },
      }
    : rescaleTheme;

  const contextValue: RescaleThemeContextValue = {
    tokens: designTokens,
    antdTheme: mergedTheme,
  };

  return (
    <RescaleThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={mergedTheme}>
        {children}
      </ConfigProvider>
    </RescaleThemeContext.Provider>
  );
};

/**
 * useRescaleTheme - Hook to access Rescale theme tokens and configuration
 * 
 * @returns Object containing design tokens and Ant Design theme
 * 
 * @example
 * ```tsx
 *  * 
 * function MyComponent() {
 *   
 *   return (
 *     <div style={{ color: tokens.colors.primary.brandBlue }}>
 *       Rescale Blue Text
 *     </div>
 *   );
 * }
 * ```
 */
export const useRescaleTheme = () => {
  const context = useContext(RescaleThemeContext);
  
  if (context === undefined) {
    throw new Error('useRescaleTheme must be used within a RescaleThemeProvider');
  }
  
  return context;
};

export default RescaleThemeProvider;