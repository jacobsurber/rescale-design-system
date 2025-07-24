import React from 'react';
import { ConfigProvider } from 'antd';
import { FigmaMCPDashboard } from './FigmaMCPDashboard';
import { RescaleThemeProvider } from '../theme/ThemeProvider';
import '../index.css';

/**
 * Standalone Figma MCP Dashboard App
 * 
 * This can be served independently from the main design system
 */
export const DashboardApp: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3B82F6',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      }}
    >
      <RescaleThemeProvider>
        <FigmaMCPDashboard />
      </RescaleThemeProvider>
    </ConfigProvider>
  );
};

export default DashboardApp;