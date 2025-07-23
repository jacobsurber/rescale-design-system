#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files with trailing comma issues in icon imports
const filesToFix = [
  'src/components/molecules/ResourceMetrics/ResourceMetrics.tsx',
  'src/demo/JobsListPage.tsx',
  'src/demo/JobDetailPage.tsx',
  'src/demo/FormExamplePage.tsx',
  'src/demo/ConnectorsPage.tsx',
  'src/components/organisms/Sidebar/Sidebar.stories.tsx',
  'src/components/atoms/StatusTag/StatusTag.stories.tsx',
  'src/components/molecules/WorkflowCard/WorkflowCard.tsx',
  'src/components/molecules/QuickActions/QuickActions.tsx',
  'src/components/molecules/EnhancedSelect/EnhancedSelect.stories.tsx',
  'src/components/molecules/DateRangePicker/DateRangePicker.tsx'
];

let fixedCount = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Fix trailing commas in Ant Design icon imports
    // Pattern: import { Icon1, Icon2, } from '@ant-design/icons';
    content = content.replace(/import\s*{\s*([^}]+),\s*}\s*from\s*'@ant-design\/icons';/g, (match, iconList) => {
      const cleanIconList = iconList.trim().replace(/,\s*$/, '');
      return `import { ${cleanIconList} } from '@ant-design/icons';`;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    } else {
      console.log(`✨ Already clean: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files with trailing comma issues!`);