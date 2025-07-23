#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional import fixes for absolute paths
const absolutePathMappings = {
  '@components/atoms': {
    Card: '@components/molecules',
  },
  '@components/display': {
    StatusTag: '@components/atoms',
  },
  '@components/cards': {
    ConnectorCard: '@components/molecules',
    MetricCard: '@components/molecules',
    WorkflowCard: '@components/molecules',
  },
  '@components/forms': {
    DateRangePicker: '@components/molecules',
    EnhancedSelect: '@components/molecules',
  },
  '@components/navigation': {
    Sidebar: '@components/organisms',
    TopBar: '@components/organisms',
  },
  '@components/rescale': {
    JobStatusIndicator: '@components/molecules',
    QuickActions: '@components/molecules',
    ResourceMetrics: '@components/molecules',
    WorkspaceSelector: '@components/molecules',
    AssistantChat: '@components/organisms',
    SoftwareLogoGrid: '@components/organisms',
  },
  '@components/utils': {
    PerformanceDashboard: '@components/organisms',
  },
  '@components/layout': {
    PageHeader: '@components/molecules',
  },
};

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Fix imports that moved from old paths to new paths
    for (const [oldBasePath, componentMappings] of Object.entries(absolutePathMappings)) {
      for (const [component, newPath] of Object.entries(componentMappings)) {
        // Pattern: import { Component } from 'oldPath'
        const singleImportRegex = new RegExp(`import\\s*{\\s*${component}\\s*}\\s*from\\s*['"]${oldBasePath.replace(/\//g, '\\/')}['"]`, 'g');
        if (content.match(singleImportRegex)) {
          content = content.replace(singleImportRegex, `import { ${component} } from '${newPath}'`);
          updated = true;
        }
        
        // Pattern: import { Component, Other } from 'oldPath' - need to split
        const multiImportRegex = new RegExp(`import\\s*{([^}]*${component}[^}]*)}\\s*from\\s*['"]${oldBasePath.replace(/\//g, '\\/')}['"]`, 'g');
        const matches = content.match(multiImportRegex);
        if (matches) {
          for (const match of matches) {
            const importsMatch = match.match(/import\s*{([^}]*)}/) ;
            if (importsMatch) {
              const imports = importsMatch[1].split(',').map(imp => imp.trim());
              const remainingImports = imports.filter(imp => imp !== component);
              
              if (remainingImports.length > 0) {
                // Keep other imports, add new import for moved component
                const newImportLine = `import { ${component} } from '${newPath}';\nimport { ${remainingImports.join(', ')} } from '${oldBasePath}'`;
                content = content.replace(match, newImportLine);
              } else {
                // Only this component was imported
                content = content.replace(match, `import { ${component} } from '${newPath}'`);
              }
              updated = true;
            }
          }
        }
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

console.log('🔧 Fixing remaining import statements...');
const srcDir = path.join(__dirname, '../src');
findAndUpdateFiles(srcDir);
console.log('✅ Remaining import statements fixed!');