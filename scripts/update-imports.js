#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of old paths to new paths
const pathMappings = {
  // To atoms
  '../display/StatusTag': '../atoms/StatusTag',
  '../../display/StatusTag': '../../atoms/StatusTag',
  '../../../display/StatusTag': '../../../atoms/StatusTag',
  '../../../../display/StatusTag': '../../../../atoms/StatusTag',
  
  // To molecules  
  '../atoms/Card': '../molecules/Card',
  '../../atoms/Card': '../../molecules/Card',
  '../../../atoms/Card': '../../../molecules/Card',
  '../../../../atoms/Card': '../../../../molecules/Card',
  
  '../cards/ConnectorCard': '../molecules/ConnectorCard',
  '../../cards/ConnectorCard': '../../molecules/ConnectorCard',
  '../../../cards/ConnectorCard': '../../../molecules/ConnectorCard',
  '../../../../cards/ConnectorCard': '../../../../molecules/ConnectorCard',
  
  '../cards/MetricCard': '../molecules/MetricCard',
  '../../cards/MetricCard': '../../molecules/MetricCard',
  '../../../cards/MetricCard': '../../../molecules/MetricCard',
  '../../../../cards/MetricCard': '../../../../molecules/MetricCard',
  
  '../cards/WorkflowCard': '../molecules/WorkflowCard',
  '../../cards/WorkflowCard': '../../molecules/WorkflowCard',
  '../../../cards/WorkflowCard': '../../../molecules/WorkflowCard',
  '../../../../cards/WorkflowCard': '../../../../molecules/WorkflowCard',
  
  '../forms/DateRangePicker': '../molecules/DateRangePicker',
  '../../forms/DateRangePicker': '../../molecules/DateRangePicker',
  '../../../forms/DateRangePicker': '../../../molecules/DateRangePicker',
  '../../../../forms/DateRangePicker': '../../../../molecules/DateRangePicker',
  
  '../forms/EnhancedSelect': '../molecules/EnhancedSelect',
  '../../forms/EnhancedSelect': '../../molecules/EnhancedSelect',
  '../../../forms/EnhancedSelect': '../../../molecules/EnhancedSelect',
  '../../../../forms/EnhancedSelect': '../../../../molecules/EnhancedSelect',
  
  '../layout/PageHeader': '../molecules/PageHeader',
  '../../layout/PageHeader': '../../molecules/PageHeader',
  '../../../layout/PageHeader': '../../../molecules/PageHeader',
  '../../../../layout/PageHeader': '../../../../molecules/PageHeader',
  
  '../rescale/JobStatusIndicator': '../molecules/JobStatusIndicator',
  '../../rescale/JobStatusIndicator': '../../molecules/JobStatusIndicator',
  '../../../rescale/JobStatusIndicator': '../../../molecules/JobStatusIndicator',
  '../../../../rescale/JobStatusIndicator': '../../../../molecules/JobStatusIndicator',
  
  '../rescale/QuickActions': '../molecules/QuickActions',
  '../../rescale/QuickActions': '../../molecules/QuickActions',
  '../../../rescale/QuickActions': '../../../molecules/QuickActions',
  '../../../../rescale/QuickActions': '../../../../molecules/QuickActions',
  
  '../rescale/ResourceMetrics': '../molecules/ResourceMetrics',
  '../../rescale/ResourceMetrics': '../../molecules/ResourceMetrics',
  '../../../rescale/ResourceMetrics': '../../../molecules/ResourceMetrics',
  '../../../../rescale/ResourceMetrics': '../../../../molecules/ResourceMetrics',
  
  '../rescale/WorkspaceSelector': '../molecules/WorkspaceSelector',
  '../../rescale/WorkspaceSelector': '../../molecules/WorkspaceSelector',
  '../../../rescale/WorkspaceSelector': '../../../molecules/WorkspaceSelector',
  '../../../../rescale/WorkspaceSelector': '../../../../molecules/WorkspaceSelector',
  
  // To organisms
  '../navigation/Sidebar': '../organisms/Sidebar',
  '../../navigation/Sidebar': '../../organisms/Sidebar',
  '../../../navigation/Sidebar': '../../../organisms/Sidebar',
  '../../../../navigation/Sidebar': '../../../../organisms/Sidebar',
  
  '../navigation/TopBar': '../organisms/TopBar',
  '../../navigation/TopBar': '../../organisms/TopBar',
  '../../../navigation/TopBar': '../../../organisms/TopBar',
  '../../../../navigation/TopBar': '../../../../organisms/TopBar',
  
  '../rescale/AssistantChat': '../organisms/AssistantChat',
  '../../rescale/AssistantChat': '../../organisms/AssistantChat',
  '../../../rescale/AssistantChat': '../../../organisms/AssistantChat',
  '../../../../rescale/AssistantChat': '../../../../organisms/AssistantChat',
  
  '../rescale/SoftwareLogoGrid': '../organisms/SoftwareLogoGrid',
  '../../rescale/SoftwareLogoGrid': '../../organisms/SoftwareLogoGrid',
  '../../../rescale/SoftwareLogoGrid': '../../../organisms/SoftwareLogoGrid',
  '../../../../rescale/SoftwareLogoGrid': '../../../../organisms/SoftwareLogoGrid',
  
  '../utils/PerformanceDashboard': '../organisms/PerformanceDashboard',
  '../../utils/PerformanceDashboard': '../../organisms/PerformanceDashboard',
  '../../../utils/PerformanceDashboard': '../../../organisms/PerformanceDashboard',
  '../../../../utils/PerformanceDashboard': '../../../../organisms/PerformanceDashboard',
};

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Update import statements
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      const regex = new RegExp(`from ['"]${oldPath.replace(/\//g, '\\/')}`,'g');
      if (content.match(regex)) {
        content = content.replace(regex, `from '${newPath}`);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

function findAndUpdateFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      findAndUpdateFiles(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      updateImportsInFile(fullPath);
    }
  }
}

console.log('🔧 Updating import statements...');
const srcDir = path.join(__dirname, '../src');
findAndUpdateFiles(srcDir);
console.log('✅ Import statements updated!');