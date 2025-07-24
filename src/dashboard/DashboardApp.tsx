import type { FC } from 'react';
import { ConfigProvider } from 'antd';
import { FigmaMCPDashboard } from './FigmaMCPDashboard';

/**
 * Standalone Figma MCP Dashboard App
 * 
 * This can be served independently from the main design system
 */
export const DashboardApp: FC = () => {
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
      <FigmaMCPDashboard />
    </ConfigProvider>
  );
};

export default DashboardApp;