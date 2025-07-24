const fs = require('fs');
const path = require('path');

// Function to find all story files
function findStoryFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findStoryFiles(filePath, fileList);
    } else if (file.endsWith('.stories.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check for Icon usage in a file
function checkIconUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const iconUsagePattern = /<Icon\s+name=["'](\w+)["']/g;
  const importPattern = /import\s+.*Icon.*from/;
  
  const hasIconUsage = iconUsagePattern.test(content);
  const hasIconImport = importPattern.test(content);
  
  if (hasIconUsage) {
    // Reset regex after test
    iconUsagePattern.lastIndex = 0;
    const iconNames = [];
    let match;
    while ((match = iconUsagePattern.exec(content)) !== null) {
      iconNames.push(match[1]);
    }
    
    return {
      hasIconUsage: true,
      hasIconImport,
      iconNames,
      filePath
    };
  }
  
  return {
    hasIconUsage: false,
    hasIconImport,
    filePath
  };
}

// Main execution
console.log('Checking all components for Icon usage and imports...\n');

const srcPath = path.join(__dirname, '..', 'src');
const storyFiles = findStoryFiles(srcPath);

console.log(`Found ${storyFiles.length} story files\n`);

const issues = [];
const componentsWithIcons = [];

storyFiles.forEach(file => {
  const result = checkIconUsage(file);
  
  if (result.hasIconUsage) {
    const relativePath = path.relative(srcPath, file);
    componentsWithIcons.push({
      file: relativePath,
      hasImport: result.hasIconImport,
      icons: result.iconNames
    });
    
    if (!result.hasIconImport) {
      issues.push({
        file: relativePath,
        issue: 'Missing Icon import',
        icons: result.iconNames
      });
    }
  }
});

// Display results
console.log('Components using Icon component:');
console.log('================================\n');

componentsWithIcons.forEach(comp => {
  console.log(`📁 ${comp.file}`);
  console.log(`   Import: ${comp.hasImport ? '✅' : '❌ MISSING'}`);
  console.log(`   Icons: ${comp.icons.join(', ')}`);
  console.log('');
});

if (issues.length > 0) {
  console.log('\n⚠️  ISSUES FOUND:');
  console.log('================\n');
  issues.forEach(issue => {
    console.log(`❌ ${issue.file}`);
    console.log(`   ${issue.issue}`);
    console.log(`   Icons used: ${issue.icons.join(', ')}`);
    console.log('');
  });
} else {
  console.log('\n✅ All components with Icon usage have proper imports!');
}

// Check for potentially problematic icon names
console.log('\n\nChecking Icon availability in @ant-design/icons:');
console.log('=================================================\n');

const icons = require('@ant-design/icons');
const allIconNames = new Set();

componentsWithIcons.forEach(comp => {
  comp.icons.forEach(icon => allIconNames.add(icon));
});

const missingIcons = [];
allIconNames.forEach(iconName => {
  const exists = typeof icons[iconName] !== 'undefined';
  if (!exists) {
    missingIcons.push(iconName);
  }
  console.log(`${iconName}: ${exists ? '✅' : '❌ NOT FOUND'}`);
});

if (missingIcons.length > 0) {
  console.log('\n\n⚠️  MISSING ICONS IN @ant-design/icons:');
  console.log('======================================\n');
  missingIcons.forEach(icon => {
    console.log(`❌ ${icon} - This icon does not exist in @ant-design/icons`);
  });
}