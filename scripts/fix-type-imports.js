#!/usr/bin/env node

/**
 * Script to automatically fix common TypeScript type import issues
 * This addresses verbatimModuleSyntax errors by converting regular imports to type-only imports
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common type identifiers that should be type-only imports
const TYPE_IDENTIFIERS = [
  // React types
  'ReactNode', 'ReactElement', 'ComponentType', 'FC', 'PropsWithChildren',
  'CSSProperties', 'MouseEvent', 'KeyboardEvent', 'ChangeEvent',
  
  // Testing types  
  'RenderOptions', 'RenderResult', 'UseQueryResult', 'UseMutationResult',
  'ErrorInfo',
  
  // Storybook types
  'Meta', 'StoryObj', 'ArgTypes',
  
  // Ant Design types
  'MenuProps', 'TableProps', 'ColumnTitle', 'ColumnType', 'ColumnGroupType',
  
  // Custom types - Add your custom interface/type names here
  'ChatMessage', 'QuickAction', 'ResourceMetric', 'SoftwareItem', 
  'Workspace', 'Job', 'JobStatus', 'JobPriority', 'JobFilters', 
  'PaginationParams', 'WebSocketMessage', 'JobUpdatePayload',
  'ResourceUpdatePayload', 'NotificationPayload', 'Workstation',
  'ResourceRequirements', 'JobMetrics', 'ResourceUsage'
];

// Pattern to match import statements
const IMPORT_PATTERN = /^import\s+({[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]+['"];?$/gm;

function isTypeOnlyIdentifier(identifier) {
  return TYPE_IDENTIFIERS.includes(identifier.trim());
}

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  const fixedContent = content.replace(IMPORT_PATTERN, (match) => {
    // Skip if already a type import
    if (match.includes('import type')) {
      return match;
    }
    
    // Extract import specifiers
    const importMatch = match.match(/import\s+({[^}]+})/);
    if (!importMatch) {
      return match; // Skip default imports or namespace imports for now
    }
    
    const specifiers = importMatch[1]
      .slice(1, -1) // Remove braces
      .split(',')
      .map(s => s.trim());
    
    const typeImports = [];
    const regularImports = [];
    
    specifiers.forEach(spec => {
      const name = spec.includes(' as ') ? spec.split(' as ')[0].trim() : spec;
      if (isTypeOnlyIdentifier(name)) {
        typeImports.push(spec);
      } else {
        regularImports.push(spec);
      }
    });
    
    // If we found type imports, split them
    if (typeImports.length > 0) {
      modified = true;
      const fromPart = match.match(/from\s+['"][^'"]+['"];?$/)[0];
      
      let result = '';
      if (regularImports.length > 0) {
        result += match.replace(/{[^}]+}/, `{ ${regularImports.join(', ')} }`);
        result += '\n';
      }
      result += `import type { ${typeImports.join(', ')} } ${fromPart}`;
      
      return result;
    }
    
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed type imports in: ${filePath}`);
    return true;
  }
  
  return false;
}

function fixUnusedVariables(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix unused parameters by adding underscore prefix
  let fixedContent = content.replace(
    /\(([^)]*?)\b(\w+)\b([^)]*?)\)\s*=>/g,
    (match, before, paramName, after) => {
      // Check if parameter is used in the function body
      const fullMatch = content.substr(content.indexOf(match));
      const functionBody = fullMatch.split('=>')[1]?.split('\n')[0] || '';
      
      if (!functionBody.includes(paramName)) {
        modified = true;
        return `(${before}_${paramName}${after}) =>`;
      }
      return match;
    }
  );
  
  // Fix unused imports by commenting them out
  fixedContent = fixedContent.replace(
    /import\s+{\s*([^}]+)\s*}\s+from\s+['"][^'"]+['"];?\n/g,
    (match, imports) => {
      const importList = imports.split(',').map(i => i.trim());
      const usedImports = importList.filter(imp => {
        const impName = imp.split(' as ')[0].trim();
        return content.includes(impName) && content.split(impName).length > 2;
      });
      
      if (usedImports.length !== importList.length) {
        modified = true;
        if (usedImports.length === 0) {
          return `// ${match.trim()} // Unused import\n`;
        } else {
          return match.replace(imports, usedImports.join(', '));
        }
      }
      return match;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed unused variables in: ${filePath}`);
    return true;
  }
  
  return false;
}

function findFiles(dir, extension) {
  const files = [];
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath);
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && (fullPath.endsWith(extension) || fullPath.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function main() {
  console.log('🔧 Fixing TypeScript type import issues...');
  
  const sourceDir = path.join(__dirname, '../src');
  const files = findFiles(sourceDir, '.ts');
  
  let totalFixed = 0;
  
  for (const file of files) {
    try {
      const fixedImports = fixImportsInFile(file);
      const fixedVariables = fixUnusedVariables(file);
      
      if (fixedImports || fixedVariables) {
        totalFixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`✅ Completed! Fixed ${totalFixed} files.`);
  
  // Run TypeScript check to see remaining issues
  console.log('\n📋 Running TypeScript check...');
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Some TypeScript errors remain. Check the output above.');
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixImportsInFile, fixUnusedVariables };