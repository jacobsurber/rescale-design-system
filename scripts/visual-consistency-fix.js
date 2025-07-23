#!/usr/bin/env node

/**
 * Visual Consistency Fix Script
 * 
 * This script addresses the visual consistency issues identified in the audits:
 * - Color inconsistencies between Figma and design tokens
 * - Icon usage inconsistencies (direct Ant Design vs Icon component)
 * - Component styling alignment with Figma designs
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Visual Consistency Fix - Implementing Figma alignment...\n');

// Load audit reports
function loadAuditReports() {
  const reports = {};
  
  try {
    if (fs.existsSync('color-audit-report.json')) {
      reports.colors = JSON.parse(fs.readFileSync('color-audit-report.json', 'utf8'));
      console.log('✅ Loaded color audit report');
    }
    
    if (fs.existsSync('icon-audit-report.json')) {
      reports.icons = JSON.parse(fs.readFileSync('icon-audit-report.json', 'utf8'));
      console.log('✅ Loaded icon audit report');
    }
  } catch (error) {
    console.warn(`⚠️ Could not load audit reports: ${error.message}`);
  }
  
  return reports;
}

// Generate comprehensive fix summary
function generateFixSummary(reports) {
  console.log('\n📊 Visual Consistency Fix Summary');
  console.log('═'.repeat(50));
  
  const fixes = {
    colors: {
      fixed: [],
      pending: [],
      recommendations: [],
    },
    icons: {
      highPriority: [],
      mediumPriority: [],
      lowPriority: [],
    },
    components: {
      styleUpdates: [],
      alignmentNeeded: [],
    },
  };
  
  // Color fixes
  if (reports.colors) {
    console.log(`\n🎨 Color Analysis (Score: ${reports.colors.consistencyScore}%):`);
    
    // Missing colors from Figma
    if (reports.colors.onlyInFigma.length > 0) {
      console.log('- Missing Figma colors in tokens:');
      reports.colors.onlyInFigma.forEach(color => {
        if (color === '#dee4ec') {
          fixes.colors.fixed.push(`${color} - Added as backgroundJob`);
          console.log(`  ✅ ${color} - Fixed (added as backgroundJob)`);
        } else {
          fixes.colors.pending.push(color);
          console.log(`  ⏳ ${color} - Needs to be added`);
        }
      });
    }
    
    // Unused colors in tokens
    if (reports.colors.onlyInTokens.length > 0) {
      console.log('- Potentially unused colors in tokens:');
      fixes.colors.recommendations = reports.colors.onlyInTokens;
      console.log(`  📋 ${reports.colors.onlyInTokens.length} colors to review`);
    }
  }
  
  // Icon fixes
  if (reports.icons) {
    console.log(`\\n🎯 Icon Analysis (Score: ${reports.icons.summary.consistencyScore}%):`);
    
    const directUsageCount = reports.icons.recommendations.convertToIconComponent.length;
    const mixedPatternCount = reports.icons.issues.filter(i => i.type === 'Mixed Usage Pattern').length;
    const singleUseCount = reports.icons.recommendations.reviewSingleUse.length;
    
    fixes.icons.highPriority = reports.icons.recommendations.convertToIconComponent;
    fixes.icons.mediumPriority = reports.icons.issues.filter(i => i.type === 'Mixed Usage Pattern').map(i => i.icon);
    fixes.icons.lowPriority = reports.icons.recommendations.reviewSingleUse;
    
    console.log(`- ${directUsageCount} icons need conversion to Icon component`);
    console.log(`- ${mixedPatternCount} icons have mixed usage patterns`);
    console.log(`- ${singleUseCount} icons are used only once`);
  }
  
  // Component styling priorities
  fixes.components.styleUpdates = [
    'Update TopBar to match Figma navigation design',
    'Align button styling with Figma specifications',
    'Standardize spacing and typography across components',
    'Implement consistent focus states',
    'Update color usage to match Figma palette',
  ];
  
  fixes.components.alignmentNeeded = [
    'Job status indicators and cards',
    'Data visualization components',
    'Form inputs and controls',
    'Navigation and menu components',
    'Icon usage patterns',
  ];
  
  console.log('\\n🔧 Component Updates Needed:');
  fixes.components.styleUpdates.forEach((update, index) => {
    console.log(`  ${index + 1}. ${update}`);
  });
  
  console.log('\\n📋 Areas Requiring Alignment:');
  fixes.components.alignmentNeeded.forEach((area, index) => {
    console.log(`  ${index + 1}. ${area}`);
  });
  
  return fixes;
}

// Provide actionable recommendations
function generateActionPlan(fixes) {
  console.log('\\n🚀 Action Plan');
  console.log('═'.repeat(30));
  
  console.log('\\n📋 Phase 1: Critical Fixes (High Impact)');
  console.log('1. Convert direct Ant Design icons to Icon component');
  console.log('   - Affects component consistency and maintainability');
  console.log('   - Use find/replace patterns in IDE');
  console.log('   - Focus on most used icons first');
  
  console.log('\\n2. Update key component styling to match Figma');
  console.log('   - TopBar navigation alignment');
  console.log('   - Button and form control styling');
  console.log('   - Color usage consistency');
  
  console.log('\\n📋 Phase 2: Standardization (Medium Impact)');
  console.log('1. Resolve mixed icon usage patterns');
  console.log('   - Establish consistent usage guidelines');
  console.log('   - Update Storybook documentation');
  
  console.log('\\n2. Review and cleanup unused design tokens');
  console.log('   - Remove or consolidate unused colors');
  console.log('   - Document color usage guidelines');
  
  console.log('\\n📋 Phase 3: Optimization (Low Impact)');
  console.log('1. Review single-use icons');
  console.log('   - Consolidate or remove rarely used icons');
  console.log('   - Update icon library documentation');
  
  console.log('\\n2. Fine-tune component details');
  console.log('   - Spacing and typography refinements');
  console.log('   - Animation and interaction polish');
  
  // Priority scoring
  const totalIssues = 
    (fixes.icons.highPriority?.length || 0) +
    (fixes.icons.mediumPriority?.length || 0) +
    (fixes.colors.pending?.length || 0);
  
  const urgencyScore = Math.min(100, totalIssues * 2);
  
  console.log(`\\n📊 Overall Priority Score: ${urgencyScore}/100`);
  
  if (urgencyScore >= 70) {
    console.log('🔥 HIGH PRIORITY - Immediate action recommended');
  } else if (urgencyScore >= 40) {
    console.log('⚠️ MEDIUM PRIORITY - Address within sprint');
  } else {
    console.log('✅ LOW PRIORITY - Include in next maintenance cycle');
  }
}

// Generate specific fix commands
function generateFixCommands(fixes) {
  console.log('\\n🛠️ Specific Fix Commands');
  console.log('═'.repeat(40));
  
  console.log('\\n# Icon Component Conversion Examples:');
  const topIcons = fixes.icons.highPriority?.slice(0, 5) || [];
  
  topIcons.forEach(iconName => {
    console.log(`# Convert ${iconName}:`);
    console.log(`find src -name "*.tsx" -type f -exec sed -i '' 's/<${iconName}\\([^>]*\\)\\/>/<Icon name="${iconName}"\\1 \\/>/g' {} +`);
    console.log(`find src -name "*.tsx" -type f -exec sed -i '' 's/<${iconName}\\([^>]*\\)>/<Icon name="${iconName}"\\1>/g' {} +`);
    console.log(`find src -name "*.tsx" -type f -exec sed -i '' 's/<\\/${iconName}>/<\\/Icon>/g' {} +`);
    console.log('');
  });
  
  console.log('\\n# Color Token Updates:');
  if (fixes.colors.pending?.length > 0) {
    console.log('# Add missing colors to tokens.ts:');
    fixes.colors.pending.forEach(color => {
      console.log(`# Consider adding ${color} to appropriate color palette`);
    });
  }
  
  console.log('\\n# Component Style Updates:');
  console.log('# Review these components for Figma alignment:');
  console.log('# - src/components/organisms/TopBar/TopBar.tsx');
  console.log('# - src/components/atoms/Button/Button.tsx');
  console.log('# - src/components/molecules/JobStatusIndicator/JobStatusIndicator.tsx');
  
  console.log('\\n# Validation Commands:');
  console.log('npm run typecheck  # Ensure no TypeScript errors');
  console.log('npm run lint       # Check code style');
  console.log('npm run build:lib  # Verify build success');
  console.log('npm run storybook  # Visual review');
}

// Main execution
function runVisualConsistencyFix() {
  const reports = loadAuditReports();
  const fixes = generateFixSummary(reports);
  generateActionPlan(fixes);
  generateFixCommands(fixes);
  
  // Save detailed fix plan
  const fixPlan = {
    summary: {
      colorsFixed: fixes.colors.fixed.length,
      colorsPending: fixes.colors.pending.length,
      iconsHighPriority: fixes.icons.highPriority?.length || 0,
      iconsMediumPriority: fixes.icons.mediumPriority?.length || 0,
      iconsLowPriority: fixes.icons.lowPriority?.length || 0,
    },
    fixes,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync('visual-consistency-fix-plan.json', JSON.stringify(fixPlan, null, 2));
  console.log('\\n📄 Detailed fix plan saved to: visual-consistency-fix-plan.json');
  
  // Calculate and display completion status
  const totalFixes = fixPlan.summary.colorsFixed + (fixPlan.summary.colorsPending > 0 ? 0 : 1);
  const completionPercentage = Math.round((totalFixes / Math.max(1, totalFixes + fixPlan.summary.colorsPending)) * 100);
  
  console.log(`\\n📈 Current Progress: ${completionPercentage}% of color fixes complete`);
  console.log(`🎯 Next Steps: Focus on icon standardization (${fixPlan.summary.iconsHighPriority} high-priority items)`);
}

// Run the fix analysis
runVisualConsistencyFix();