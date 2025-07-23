#!/usr/bin/env node

/**
 * Icon Consistency Fix Script
 * 
 * This script converts direct Ant Design icon usage to our standardized Icon component
 * across the entire codebase, focusing on the most commonly used icons first.
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Icon Consistency Fix - Converting to standardized Icon component...\n');

// Top priority icons to convert (based on audit results)
const PRIORITY_ICONS = [
  'PlayCircleOutlined',
  'CloudOutlined', 
  'TeamOutlined',
  'DeleteOutlined',
  'PlusOutlined',
  'SettingOutlined',
  'ClockCircleOutlined',
  'DatabaseOutlined',
  'EditOutlined',
  'CheckCircleOutlined',
  'CheckOutlined',
  'CloseCircleOutlined',
  'DownloadOutlined',
  'SearchOutlined',
  'SaveOutlined',
  'UploadOutlined',
  'HeartOutlined',
  'StarOutlined',
  'ShareAltOutlined',
  'HomeOutlined',
];

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

// Convert icons in a file
function convertIconsInFile(filePath, iconNames) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const conversions = [];
    
    // Check if file already imports Icon component
    const hasIconImport = content.includes("import { Icon }") || content.includes("from '../atoms/Icon'") || content.includes("from './Icon'");
    let needsIconImport = false;
    
    iconNames.forEach(iconName => {
      // Pattern 1: Self-closing tags <IconName />
      const selfClosingRegex = new RegExp(`<${iconName}\\s*/>`, 'g');
      const selfClosingMatches = content.match(selfClosingRegex);
      
      if (selfClosingMatches) {
        content = content.replace(selfClosingRegex, `<Icon name="${iconName}" />`);
        conversions.push(`${iconName} (${selfClosingMatches.length} self-closing)`);
        modified = true;
        needsIconImport = true;
      }
      
      // Pattern 2: Tags with props <IconName prop="value" />
      const propsRegex = new RegExp(`<${iconName}\\s+([^>]+)\\s*/>`, 'g');
      const propsMatches = content.match(propsRegex);
      
      if (propsMatches) {
        propsMatches.forEach(match => {
          const propsMatch = match.match(new RegExp(`<${iconName}\\s+([^>]+)\\s*/>`));
          if (propsMatch) {
            const props = propsMatch[1];
            // Filter out props that should go to Icon component vs the inner icon
            const iconProps = props.replace(/spin|rotate|style|className/g, '').trim();
            const wrapperProps = props.match(/spin|rotate|style|className/g)?.join(' ') || '';
            
            const replacement = wrapperProps 
              ? `<Icon name="${iconName}" ${wrapperProps} />`
              : `<Icon name="${iconName}" />`;
            
            content = content.replace(match, replacement);
          }
        });
        conversions.push(`${iconName} (${propsMatches.length} with props)`);
        modified = true;
        needsIconImport = true;
      }
      
      // Pattern 3: Opening/closing tags <IconName>...</IconName>
      const openCloseRegex = new RegExp(`<${iconName}([^>]*)>([^<]*)</${iconName}>`, 'g');
      const openCloseMatches = content.match(openCloseRegex);
      
      if (openCloseMatches) {
        openCloseMatches.forEach(match => {
          const fullMatch = match.match(new RegExp(`<${iconName}([^>]*)>([^<]*)</${iconName}>`));
          if (fullMatch) {
            const props = fullMatch[1];
            const innerContent = fullMatch[2];
            
            // If there's inner content, preserve it, otherwise use self-closing
            const replacement = innerContent.trim() 
              ? `<Icon name="${iconName}"${props}>${innerContent}</Icon>`
              : `<Icon name="${iconName}"${props} />`;
            
            content = content.replace(match, replacement);
          }
        });
        conversions.push(`${iconName} (${openCloseMatches.length} open/close)`);
        modified = true;
        needsIconImport = true;
      }
    });
    
    // Add Icon import if needed and not already present
    if (needsIconImport && !hasIconImport) {
      // Find the right place to add the import
      const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
      
      if (importLines.length > 0) {
        // Find if there's already an import from the atoms directory
        const atomsImportIndex = content.indexOf("from '../atoms/");
        const relativeImportIndex = content.indexOf("from './");
        
        let importStatement;
        if (atomsImportIndex !== -1) {
          importStatement = "import { Icon } from '../atoms/Icon';";
        } else if (relativeImportIndex !== -1) {
          importStatement = "import { Icon } from './Icon';";
        } else {
          // Default to relative path - this might need adjustment
          importStatement = "import { Icon } from '../atoms/Icon';";
        }
        
        // Add import after the last import statement
        const lastImportIndex = content.lastIndexOf('\nimport');
        if (lastImportIndex !== -1) {
          const nextLineIndex = content.indexOf('\n', lastImportIndex + 1);
          content = content.slice(0, nextLineIndex) + '\n' + importStatement + content.slice(nextLineIndex);
        } else {
          // Add at the beginning if no imports found
          content = importStatement + '\n' + content;
        }
        
        conversions.push('Added Icon import');
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, conversions };
    }
    
    return { success: false, conversions: [] };
  } catch (error) {
    return { success: false, error: error.message, conversions: [] };
  }
}

// Remove unused Ant Design icon imports
function removeUnusedIconImports(filePath, iconNames) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const removedImports = [];
    
    iconNames.forEach(iconName => {
      // Check if the icon is still used in the file (not as Icon component)
      const stillUsed = content.includes(`<${iconName}`) && !content.includes(`name="${iconName}"`);
      
      if (!stillUsed) {
        // Remove from import statements
        const importRegex = new RegExp(`import\\s*{[^}]*${iconName}[^}]*}\\s*from\\s*['"]@ant-design/icons['"];?`, 'g');
        const importMatches = content.match(importRegex);
        
        if (importMatches) {
          importMatches.forEach(importStatement => {
            // Remove the specific icon from the import
            const iconsInImport = importStatement.match(/{([^}]*)}/)[1];
            const iconList = iconsInImport.split(',').map(icon => icon.trim()).filter(icon => icon !== iconName);
            
            if (iconList.length === 0) {
              // Remove the entire import if no icons left
              content = content.replace(importStatement, '');
              removedImports.push(`Removed entire import: ${iconName}`);
            } else {
              // Update the import with remaining icons
              const newImport = importStatement.replace(/{[^}]*}/, `{ ${iconList.join(', ')} }`);
              content = content.replace(importStatement, newImport); 
              removedImports.push(`Removed from import: ${iconName}`);
            }
            modified = true;
          });
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, removedImports };
    }
    
    return { success: false, removedImports: [] };
  } catch (error) {
    return { success: false, error: error.message, removedImports: [] };
  }
}

// Main conversion function
function convertIconsInCodebase() {
  console.log('🔍 Scanning files for icon conversions...');
  
  const srcFiles = findFiles('src');
  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalConversions = 0;
  const results = [];
  
  srcFiles.forEach(filePath => {
    totalFiles++;
    
    // Convert icons to Icon component
    const conversionResult = convertIconsInFile(filePath, PRIORITY_ICONS);
    
    if (conversionResult.success) {
      modifiedFiles++;
      totalConversions += conversionResult.conversions.length;
      
      // Clean up unused imports
      const cleanupResult = removeUnusedIconImports(filePath, PRIORITY_ICONS);
      
      results.push({
        file: filePath,
        conversions: conversionResult.conversions,
        removedImports: cleanupResult.removedImports || [],
        error: conversionResult.error || cleanupResult.error,
      });
      
      if (conversionResult.conversions.length > 0) {
        console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        conversionResult.conversions.forEach(conversion => {
          console.log(`   - ${conversion}`);
        });
        
        if (cleanupResult.removedImports && cleanupResult.removedImports.length > 0) {
          cleanupResult.removedImports.forEach(removal => {
            console.log(`   - ${removal}`);
          });
        }
      }
    } else if (conversionResult.error) {
      console.warn(`⚠️ Error processing ${filePath}: ${conversionResult.error}`);
    }
  });
  
  return { totalFiles, modifiedFiles, totalConversions, results };
}

// Validation function
function validateConversions() {
  console.log('\n🧪 Validating conversions...');
  
  const srcFiles = findFiles('src');
  const issues = [];
  
  srcFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for any remaining direct icon usage
      PRIORITY_ICONS.forEach(iconName => {
        const directUsage = content.match(new RegExp(`<${iconName}[^>]*>`, 'g'));
        if (directUsage) {
          directUsage.forEach(usage => {
            if (!usage.includes('name=')) {
              issues.push({
                file: filePath,
                icon: iconName,
                usage: usage.trim(),
                issue: 'Direct icon usage still present'
              });
            }
          });
        }
      });
      
      // Check for Icon usage without proper import
      if (content.includes('<Icon ') && !content.includes("import { Icon }")) {
        issues.push({
          file: filePath,
          issue: 'Icon component used but not imported'
        });
      }
      
    } catch (error) {
      issues.push({
        file: filePath,
        issue: `Validation error: ${error.message}`
      });
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ All conversions validated successfully!');
  } else {
    console.log(`⚠️ Found ${issues.length} validation issues:`);
    issues.forEach(issue => {
      console.log(`   - ${path.relative(process.cwd(), issue.file)}: ${issue.issue}`);
      if (issue.usage) {
        console.log(`     Usage: ${issue.usage}`);
      }
    });
  }
  
  return issues;
}

// Main execution
function runIconFix() {
  console.log(`🎯 Converting ${PRIORITY_ICONS.length} priority icons to Icon component...\n`);
  
  const { totalFiles, modifiedFiles, totalConversions, results } = convertIconsInCodebase();
  
  console.log('\n📊 Conversion Summary:');
  console.log('═'.repeat(40));
  console.log(`Files scanned: ${totalFiles}`);
  console.log(`Files modified: ${modifiedFiles}`);
  console.log(`Total conversions: ${totalConversions}`);
  
  // Validate the conversions
  const validationIssues = validateConversions();
  
  // Save detailed results
  const report = {
    summary: {
      totalFiles,
      modifiedFiles,
      totalConversions,
      validationIssues: validationIssues.length,
    },
    iconsCovered: PRIORITY_ICONS,
    results,
    validationIssues,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync('icon-conversion-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: icon-conversion-report.json');
  
  if (totalConversions > 0) {
    console.log('\n🚀 Next Steps:');
    console.log('1. Run: npm run typecheck (ensure no TypeScript errors)');
    console.log('2. Run: npm run lint (check code style)');
    console.log('3. Run: npm run build:lib (verify build success)');
    console.log('4. Run: npm run storybook (visual review)');
    
    console.log('\n✨ Icon consistency conversion completed!');
  } else {
    console.log('\n💡 No conversions needed - icons are already using Icon component!');
  }
}

// Run the fix
runIconFix();