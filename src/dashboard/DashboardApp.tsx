import type { FC } from 'react';
import { MinimalDashboard } from './MinimalDashboard';

/**
 * Standalone Figma MCP Dashboard App
 * 
 * This can be served independently from the main design system
 */
export const DashboardApp: FC = () => {
  return <MinimalDashboard />;
};

export default DashboardApp;