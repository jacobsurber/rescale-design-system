#!/usr/bin/env node

/**
 * Fix Remaining Icon Issues Script
 * 
 * This script fixes the remaining direct Ant Design icon usage that's causing
 * Storybook errors by converting them to use the Icon component.
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing remaining icon issues in Storybook...\n');

// Critical files that need fixes (based on the analysis)
const criticalFixes = [
  {
    file: 'src/components/organisms/TopBar/TopBar.tsx',
    fixes: [
      { old: '<BellOutlined />', new: '<Icon name="BellOutlined" />' },
      { old: '<QuestionCircleOutlined />', new: '<Icon name="QuestionCircleOutlined" />' },
      { old: '<RobotOutlined />', new: '<Icon name="RobotOutlined" />' },
      { old: '<UserOutlined />', new: '<Icon name="UserOutlined" />' },
    ]
  },
  {
    file: 'src/components/organisms/Sidebar/Sidebar.tsx',
    addImport: true,
    fixes: [
      { old: '<UserOutlined />', new: '<Icon name="UserOutlined" />' },
      { old: '<QuestionCircleOutlined />', new: '<Icon name="QuestionCircleOutlined" />' },
      { old: '<MenuFoldOutlined />', new: '<Icon name="MenuFoldOutlined" />' },
      { old: '<MenuUnfoldOutlined />', new: '<Icon name="MenuUnfoldOutlined" />' },
      { old: '<LogoutOutlined />', new: '<Icon name="LogoutOutlined" />' },
    ]
  },
  {
    file: 'src/components/molecules/JobStatusIndicator/JobStatusIndicator.tsx',
    fixes: [
      { old: '<LoadingOutlined />', new: '<Icon name="LoadingOutlined" />' },
      { old: '<ExclamationCircleOutlined />', new: '<Icon name="ExclamationCircleOutlined" />' },
    ]
  },
  {
    file: 'src/components/organisms/JobsTable/JobsTable.tsx',
    fixes: [
      { old: '<EyeOutlined />', new: '<Icon name="EyeOutlined" />' },
      { old: '<PauseCircleOutlined />', new: '<Icon name="PauseCircleOutlined" />' },
      { old: '<StopOutlined />', new: '<Icon name="StopOutlined" />' },
      { old: '<MoreOutlined />', new: '<Icon name="MoreOutlined" />' },
    ]
  },
  {
    file: 'src/components/molecules/WorkspaceSelector/WorkspaceSelector.tsx',
    fixes: [
      { old: '<LockOutlined />', new: '<Icon name="LockOutlined" />' },
      { old: '<FolderOutlined />', new: '<Icon name="FolderOutlined" />' },
    ]
  },
  {
    file: 'src/components/molecules/FileBrowser/FileBrowser.tsx',
    fixes: [
      { old: '<FolderOutlined />', new: '<Icon name="FolderOutlined" />' },
      { old: '<FolderOpenOutlined />', new: '<Icon name="FolderOpenOutlined" />' },
      { old: '<FileTextOutlined />', new: '<Icon name="FileTextOutlined" />' },
      { old: '<FileOutlined />', new: '<Icon name="FileOutlined" />' },
      { old: '<ReloadOutlined />', new: '<Icon name="ReloadOutlined" />' },
    ]
  },
  {
    file: 'src/components/molecules/EnhancedSelect/EnhancedSelect.tsx',
    fixes: [
      { old: '<LoadingOutlined />', new: '<Icon name="LoadingOutlined" />' },
    ]
  },
];

function fixFile(filePath, fixes, addImport = false) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Add Icon import if needed
    if (addImport && !content.includes("import { Icon }")) {
      // Find the right place to add import
      const importPattern = /import.*from ['"]@ant-design\/icons['"];?\n/;
      const match = content.match(importPattern);
      
      if (match) {
        const insertPoint = content.indexOf(match[0]) + match[0].length;
        content = content.slice(0, insertPoint) + "import { Icon } from '../../atoms/Icon';\n" + content.slice(insertPoint);
        modified = true;
        console.log(`   ✅ Added Icon import`);
      }
    }
    
    // Apply icon fixes
    fixes.forEach(fix => {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, fix.new);
        modified = true;
        console.log(`   ✅ Fixed ${matches.length}x: ${fix.old} → ${fix.new}`);
      }
    });
    
    // Clean up unused imports
    fixes.forEach(fix => {
      const iconName = fix.old.match(/<(\w+)/)?.[1];
      if (iconName) {
        // Remove from import if it's no longer used directly
        const importRegex = new RegExp(`import\\s*{[^}]*${iconName}[^}]*}\\s*from\\s*['"]@ant-design/icons['"];?`, 'g');
        const importMatch = content.match(importRegex);
        
        if (importMatch && !content.includes(`<${iconName}`)) {
          importMatch.forEach(importStatement => {
            const iconsInImport = importStatement.match(/{([^}]*)}/)[1];
            const iconList = iconsInImport.split(',').map(icon => icon.trim()).filter(icon => icon !== iconName && icon !== '');
            
            if (iconList.length === 0) {
              content = content.replace(importStatement, '');
              console.log(`   🧹 Removed entire import for ${iconName}`);
            } else {
              const newImport = importStatement.replace(/{[^}]*}/, `{ ${iconList.join(', ')} }`);
              content = content.replace(importStatement, newImport);
              console.log(`   🧹 Removed ${iconName} from import`);
            }
            modified = true;
          });
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process all critical fixes
let totalFixed = 0;
let totalFiles = 0;

criticalFixes.forEach(({ file, fixes, addImport }) => {
  console.log(`📋 Processing: ${file}`);
  
  const success = fixFile(file, fixes, addImport);
  if (success) {
    totalFixed++;
  }
  totalFiles++;
  
  console.log(''); // Empty line for readability
});

console.log('📊 Summary:');
console.log(`Files processed: ${totalFiles}`);
console.log(`Files modified: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n🚀 Next steps:');
  console.log('1. Test Storybook locally: npm run storybook');
  console.log('2. Build Storybook: npm run build:storybook');
  console.log('3. Commit and push changes');
  
  console.log('\n✨ Icon fixes completed!');
} else {
  console.log('\n💡 No fixes needed - all icons are already properly converted');
}