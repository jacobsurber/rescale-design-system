#!/usr/bin/env node

/**
 * Fix Icon Import Paths Script
 * 
 * This script fixes incorrect Icon component import paths that were created
 * during the automatic icon conversion process.
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Icon import paths...\n');

// Helper to find all files recursively
function findFiles(dir, extensions = ['.tsx', '.ts']) {
  const files = [];
  
  function traverseDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir);
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
          traverseDir(fullPath);
        } else if (stat.isFile() && extensions.some(ext => entry.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverseDir(dir);
  return files;
}

// Fix import paths based on file location
function fixIconImportPath(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Determine the correct relative path based on file location
    const relativePath = path.relative(process.cwd(), filePath);
    const pathParts = relativePath.split(path.sep);
    
    let correctImportPath;
    
    if (pathParts.includes('atoms')) {
      // Files in atoms directory
      if (pathParts.includes('Icon')) {
        // Files in the Icon directory itself
        correctImportPath = './Icon';
      } else {
        // Other atoms
        correctImportPath = '../Icon';
      }
    } else if (pathParts.includes('molecules')) {
      correctImportPath = '../../atoms/Icon';
    } else if (pathParts.includes('organisms')) {
      correctImportPath = '../../atoms/Icon';
    } else if (pathParts.includes('templates')) {
      correctImportPath = '../../../atoms/Icon';
    } else if (pathParts.includes('demo')) {
      correctImportPath = '../components/atoms/Icon';
    } else if (pathParts.includes('stories')) {
      correctImportPath = '../components/atoms/Icon';
    } else {
      // Default fallback
      correctImportPath = '../atoms/Icon';
    }
    
    // Fix various incorrect import patterns
    const incorrectPatterns = [
      /import\s*{\s*Icon\s*}\s*from\s*['"]\.\/Icon['"];?/g,
      /import\s*{\s*Icon\s*}\s*from\s*['"]\.\.\/atoms\/Icon['"];?/g,
      /import\s*{\s*Icon\s*}\s*from\s*['"]\.\.\/\.\.\/atoms\/Icon['"];?/g,
      /import\s*{\s*Icon\s*}\s*from\s*['"]\.\.\/\.\.\/\.\.\/atoms\/Icon['"];?/g,
      /import\s*{\s*Icon\s*}\s*from\s*['"]\.\.\/components\/atoms\/Icon['"];?/g,
    ];
    
    const correctImport = `import { Icon } from '${correctImportPath}';`;
    
    incorrectPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, correctImport);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)} -> ${correctImportPath}`);
      return { success: true, path: correctImportPath };
    }
    
    return { success: false };
  } catch (error) {
    console.warn(`⚠️ Error processing ${filePath}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main execution
function fixAllImports() {
  const srcFiles = findFiles('src');
  let fixedFiles = 0;
  
  srcFiles.forEach(filePath => {
    const result = fixIconImportPath(filePath);
    if (result.success) {
      fixedFiles++;
    }
  });
  
  console.log(`\n📊 Summary: Fixed ${fixedFiles} files`);
  
  if (fixedFiles > 0) {
    console.log('\n🚀 Next: Run npm run build:lib to verify fixes');
  } else {
    console.log('\n✅ No import path fixes needed');
  }
}

// Run the fix
fixAllImports();