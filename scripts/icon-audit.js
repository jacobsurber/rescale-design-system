#!/usr/bin/env node

/**
 * Icon Usage Audit Script
 * 
 * This script analyzes icon usage across the codebase to identify:
 * - Which icons are being used and where
 * - Consistency in icon usage patterns
 * - Missing or inconsistent icon implementations
 * - Suggestions for standardization
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎯 Icon Usage Audit - Analyzing icon consistency...\n');

// Helper to recursively find files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
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

// Extract icon usage from file content
function extractIconUsage(filePath, content) {
  const icons = [];
  
  // Pattern 1: <Icon name="..." />
  const iconComponentMatches = content.match(/<Icon\s+name=["']([^"']+)["']/g);
  if (iconComponentMatches) {
    iconComponentMatches.forEach(match => {
      const nameMatch = match.match(/name=["']([^"']+)["']/);
      if (nameMatch) {
        icons.push({
          name: nameMatch[1],
          usage: 'Icon component',
          pattern: match.trim(),
          file: filePath,
        });
      }
    });
  }
  
  // Pattern 2: Direct Ant Design icon imports and usage
  const antIconImports = content.match(/import\s*{([^}]*)}\s*from\s*['"]@ant-design\/icons['"];?/g);
  if (antIconImports) {
    antIconImports.forEach(importStatement => {
      const iconsMatch = importStatement.match(/{([^}]*)}/);
      if (iconsMatch) {
        const importedIcons = iconsMatch[1]
          .split(',')
          .map(icon => icon.trim())
          .filter(icon => icon && icon.endsWith('Outlined') || icon.endsWith('Filled') || icon.endsWith('TwoTone'));
        
        importedIcons.forEach(iconName => {
          // Find usage in the same file
          const usageRegex = new RegExp(`<${iconName}[^>]*>|<${iconName}\\s*/>`, 'g');
          const usageMatches = content.match(usageRegex);
          
          if (usageMatches) {
            usageMatches.forEach(usage => {
              icons.push({
                name: iconName,
                usage: 'Direct Ant Design',
                pattern: usage.trim(),
                file: filePath,
              });
            });
          } else {
            // Icon imported but maybe used as a variable
            icons.push({
              name: iconName,
              usage: 'Direct Ant Design (imported)',
              pattern: importStatement.trim(),
              file: filePath,
            });
          }
        });
      }
    });
  }
  
  // Pattern 3: Icon references in variables or props
  const iconProps = content.match(/icon\s*[:=]\s*<([A-Z][A-Za-z]*Outlined|[A-Z][A-Za-z]*Filled|[A-Z][A-Za-z]*TwoTone)/g);
  if (iconProps) {
    iconProps.forEach(match => {
      const iconMatch = match.match(/<([A-Z][A-Za-z]*(?:Outlined|Filled|TwoTone))/);
      if (iconMatch) {
        icons.push({
          name: iconMatch[1],
          usage: 'Icon prop',
          pattern: match.trim(),
          file: filePath,
        });
      }
    });
  }
  
  return icons;
}

// Analyze all icon usage in the codebase
function analyzeIconUsage() {
  console.log('🔍 Scanning files for icon usage...');
  
  const srcFiles = findFiles('src');
  const allIcons = [];
  const fileStats = [];
  
  srcFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const icons = extractIconUsage(filePath, content);
      
      if (icons.length > 0) {
        allIcons.push(...icons);
        fileStats.push({
          file: filePath,
          iconCount: icons.length,
          icons: icons.map(i => i.name),
        });
      }
    } catch (error) {
      console.warn(`⚠️ Could not read file: ${filePath}`);
    }
  });
  
  return { allIcons, fileStats };
}

// Analyze icon patterns and consistency
function analyzeIconPatterns(allIcons) {
  const iconCounts = {};
  const usagePatterns = {};
  const fileUsage = {};
  
  allIcons.forEach(icon => {
    // Count icon occurrences
    iconCounts[icon.name] = (iconCounts[icon.name] || 0) + 1;
    
    // Track usage patterns
    if (!usagePatterns[icon.name]) {
      usagePatterns[icon.name] = new Set();
    }
    usagePatterns[icon.name].add(icon.usage);
    
    // Track file usage
    if (!fileUsage[icon.name]) {
      fileUsage[icon.name] = new Set();
    }
    fileUsage[icon.name].add(icon.file);
  });
  
  return {
    iconCounts,
    usagePatterns: Object.fromEntries(
      Object.entries(usagePatterns).map(([name, patterns]) => [name, Array.from(patterns)])
    ),
    fileUsage: Object.fromEntries(
      Object.entries(fileUsage).map(([name, files]) => [name, Array.from(files)])
    ),
  };
}

// Get available Ant Design icons (basic list)
function getCommonAntIcons() {
  return [
    // Common action icons
    'EditOutlined', 'DeleteOutlined', 'PlusOutlined', 'MinusOutlined',
    'SearchOutlined', 'FilterOutlined', 'SettingOutlined', 'MenuOutlined',
    
    // Navigation icons
    'HomeOutlined', 'BackOutlined', 'ArrowLeftOutlined', 'ArrowRightOutlined',
    'UpOutlined', 'DownOutlined', 'CloseOutlined', 'CheckOutlined',
    
    // Status icons
    'InfoCircleOutlined', 'CheckCircleOutlined', 'CloseCircleOutlined',
    'ExclamationCircleOutlined', 'WarningOutlined', 'LoadingOutlined',
    
    // User & system icons
    'UserOutlined', 'TeamOutlined', 'BellOutlined', 'MailOutlined',
    'PhoneOutlined', 'CalendarOutlined', 'ClockCircleOutlined',
    
    // Data & analytics
    'BarChartOutlined', 'LineChartOutlined', 'PieChartOutlined',
    'DashboardOutlined', 'DatabaseOutlined', 'CloudOutlined',
    
    // File & document icons
    'FileOutlined', 'FolderOutlined', 'DownloadOutlined', 'UploadOutlined',
    'CopyOutlined', 'SaveOutlined', 'PrinterOutlined',
    
    // Communication & sharing
    'ShareAltOutlined', 'LinkOutlined', 'GlobalOutlined', 'WifiOutlined',
    
    // Business & workflow
    'ProjectOutlined', 'BankOutlined', 'ShopOutlined', 'TrophyOutlined',
    'StarOutlined', 'HeartOutlined', 'LikeOutlined',
    
    // System & tools
    'ToolOutlined', 'BugOutlined', 'CodeOutlined', 'ApiOutlined',
    'ReloadOutlined', 'PoweroffOutlined', 'EyeOutlined', 'EyeInvisibleOutlined',
  ];
}

// Check for icon consistency issues
function checkConsistencyIssues(iconCounts, usagePatterns) {
  const issues = [];
  
  // Check for mixed usage patterns
  Object.entries(usagePatterns).forEach(([iconName, patterns]) => {
    if (patterns.length > 1) {
      issues.push({
        type: 'Mixed Usage Pattern',
        icon: iconName,
        description: `Used with different patterns: ${patterns.join(', ')}`,
        severity: 'medium',
      });
    }
  });
  
  // Check for rarely used icons
  Object.entries(iconCounts).forEach(([iconName, count]) => {
    if (count === 1) {
      issues.push({
        type: 'Single Use Icon',
        icon: iconName,
        description: `Only used once - consider if it's needed`,
        severity: 'low',
      });
    }
  });
  
  // Check for Direct Ant Design usage instead of Icon component
  Object.entries(usagePatterns).forEach(([iconName, patterns]) => {
    if (patterns.includes('Direct Ant Design') && !patterns.includes('Icon component')) {
      issues.push({
        type: 'Inconsistent Pattern',
        icon: iconName,
        description: `Used directly instead of through Icon component`,
        severity: 'high',
      });
    }
  });
  
  return issues;
}

// Main audit function
function runIconAudit() {
  console.log('📊 Running comprehensive icon audit...\n');
  
  const { allIcons, fileStats } = analyzeIconUsage();
  const { iconCounts, usagePatterns, fileUsage } = analyzeIconPatterns(allIcons);
  const commonIcons = getCommonAntIcons();
  const issues = checkConsistencyIssues(iconCounts, usagePatterns);
  
  // Sort icons by usage frequency
  const sortedIcons = Object.entries(iconCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
  
  console.log('📈 Icon Usage Analysis:');
  console.log('═'.repeat(50));
  console.log(`Total icons found: ${allIcons.length}`);
  console.log(`Unique icons: ${Object.keys(iconCounts).length}`);
  console.log(`Files with icons: ${fileStats.length}`);
  
  console.log('\n🏆 Most Used Icons:');
  sortedIcons.slice(0, 10).forEach((icon, index) => {
    const patterns = usagePatterns[icon.name] || [];
    console.log(`${index + 1}. ${icon.name} (${icon.count} uses) - ${patterns.join(', ')}`);
  });
  
  console.log('\n📁 Files with Most Icons:');
  fileStats
    .sort((a, b) => b.iconCount - a.iconCount)
    .slice(0, 10)
    .forEach((file, index) => {
      const relativePath = file.file.replace(process.cwd(), '.');
      console.log(`${index + 1}. ${relativePath} (${file.iconCount} icons)`);
    });
  
  console.log('\\n🎯 Usage Patterns:');
  const patternStats = {};
  allIcons.forEach(icon => {
    patternStats[icon.usage] = (patternStats[icon.usage] || 0) + 1;
  });
  
  Object.entries(patternStats).forEach(([pattern, count]) => {
    console.log(`- ${pattern}: ${count} uses`);
  });
  
  // Issues analysis
  if (issues.length > 0) {
    console.log('\\n🚨 Consistency Issues:');
    console.log('═'.repeat(40));
    
    const highIssues = issues.filter(i => i.severity === 'high');
    const mediumIssues = issues.filter(i => i.severity === 'medium');
    const lowIssues = issues.filter(i => i.severity === 'low');
    
    if (highIssues.length > 0) {
      console.log('\\n❌ High Priority Issues:');
      highIssues.forEach(issue => {
        console.log(`  - ${issue.icon}: ${issue.description}`);
      });
    }
    
    if (mediumIssues.length > 0) {
      console.log('\\n⚠️ Medium Priority Issues:');
      mediumIssues.forEach(issue => {
        console.log(`  - ${issue.icon}: ${issue.description}`);
      });
    }
    
    if (lowIssues.length > 0) {
      console.log('\\n💡 Low Priority Issues:');
      lowIssues.forEach(issue => {
        console.log(`  - ${issue.icon}: ${issue.description}`);
      });
    }
  } else {
    console.log('\\n✅ No major consistency issues found!');
  }
  
  // Recommendations
  console.log('\\n💡 Recommendations:');
  console.log('═'.repeat(40));
  
  const directUsageIcons = Object.entries(usagePatterns)
    .filter(([, patterns]) => patterns.includes('Direct Ant Design'))
    .map(([name]) => name);
  
  if (directUsageIcons.length > 0) {
    console.log('🔧 Convert direct Ant Design icon usage to Icon component:');
    directUsageIcons.forEach(iconName => {
      console.log(`  - Replace <${iconName} /> with <Icon name="${iconName}" />`);
    });
  }
  
  const singleUseIcons = Object.entries(iconCounts)
    .filter(([, count]) => count === 1)
    .map(([name]) => name);
  
  if (singleUseIcons.length > 0) {
    console.log('\\n🧹 Consider removing or consolidating single-use icons:');
    singleUseIcons.forEach(iconName => {
      console.log(`  - ${iconName} (used only once)`);
    });
  }
  
  // Calculate consistency score
  const totalIssues = issues.length;
  const totalIcons = Object.keys(iconCounts).length;
  const consistencyScore = Math.max(0, Math.round(100 - (totalIssues / Math.max(totalIcons, 1)) * 100));
  
  console.log(`\\n📈 Icon Consistency Score: ${consistencyScore}%`);
  
  if (consistencyScore >= 80) {
    console.log('✅ Icon usage is well-organized!');
  } else if (consistencyScore >= 60) {
    console.log('⚠️ Icon usage has some inconsistencies - review recommended');
  } else {
    console.log('❌ Icon usage needs significant cleanup');
  }
  
  // Save detailed report
  const report = {
    summary: {
      totalIcons: allIcons.length,
      uniqueIcons: Object.keys(iconCounts).length,
      filesWithIcons: fileStats.length,
      consistencyScore,
    },
    iconUsage: sortedIcons,
    usagePatterns,
    fileUsage,
    issues,
    patternStats,
    recommendations: {
      convertToIconComponent: directUsageIcons,
      reviewSingleUse: singleUseIcons,
    },
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync('icon-audit-report.json', JSON.stringify(report, null, 2));
  console.log('\\n📄 Detailed report saved to: icon-audit-report.json');
}

// Run the audit
runIconAudit();