#!/usr/bin/env node

/**
 * Build Validation Script
 * Runs comprehensive checks and provides actionable feedback
 */

import { execSync } from 'child_process';
import fs from 'fs';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function runCommand(command, description, options = {}) {
  console.log(`\n${colorize('🔍', 'blue')} ${description}...`);
  
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    console.log(`${colorize('✅', 'green')} ${description} passed`);
    return { success: true, output: result };
  } catch (error) {
    console.log(`${colorize('❌', 'red')} ${description} failed`);
    if (options.silent && error.stdout) {
      console.log(error.stdout);
    }
    return { success: false, output: error.stdout || error.message };
  }
}

function analyzeTypeScriptErrors(output) {
  const errors = output.split('\n').filter(line => line.includes('error TS'));
  const categories = {
    typeImports: [],
    themeProperties: [],
    unusedVariables: [],
    missingTypes: [],
    other: []
  };

  errors.forEach(error => {
    if (error.includes('must be imported using a type-only import')) {
      categories.typeImports.push(error);
    } else if (error.includes('does not exist on type \'DefaultTheme\'')) {
      categories.themeProperties.push(error);
    } else if (error.includes('is declared but its value is never read')) {
      categories.unusedVariables.push(error);
    } else if (error.includes('Cannot find name') || error.includes('has no exported member')) {
      categories.missingTypes.push(error);
    } else {
      categories.other.push(error);
    }
  });

  return categories;
}

function printErrorAnalysis(categories) {
  console.log(`\n${colorize('📊 Build Error Analysis', 'cyan')}`);
  console.log('=' .repeat(50));

  if (categories.typeImports.length > 0) {
    console.log(`\n${colorize('🔧 Type Import Issues', 'yellow')} (${categories.typeImports.length})`);
    console.log('   Fix with: npm run fix-types');
    categories.typeImports.slice(0, 3).forEach(error => {
      console.log(`   • ${error.slice(0, 80)}...`);
    });
  }

  if (categories.themeProperties.length > 0) {
    console.log(`\n${colorize('🎨 Theme Property Issues', 'yellow')} (${categories.themeProperties.length})`);
    console.log('   Update: src/theme/tokens.ts and src/theme/styled.d.ts');
    categories.themeProperties.slice(0, 3).forEach(error => {
      console.log(`   • ${error.slice(0, 80)}...`);
    });
  }

  if (categories.unusedVariables.length > 0) {
    console.log(`\n${colorize('🧹 Unused Variable Issues', 'yellow')} (${categories.unusedVariables.length})`);
    console.log('   Prefix with underscore or remove unused code');
    categories.unusedVariables.slice(0, 3).forEach(error => {
      console.log(`   • ${error.slice(0, 80)}...`);
    });
  }

  if (categories.missingTypes.length > 0) {
    console.log(`\n${colorize('❓ Missing Type Issues', 'red')} (${categories.missingTypes.length})`);
    console.log('   Add missing imports or type definitions');
    categories.missingTypes.slice(0, 3).forEach(error => {
      console.log(`   • ${error.slice(0, 80)}...`);
    });
  }

  if (categories.other.length > 0) {
    console.log(`\n${colorize('❗ Other Issues', 'red')} (${categories.other.length})`);
    categories.other.slice(0, 3).forEach(error => {
      console.log(`   • ${error.slice(0, 80)}...`);
    });
  }
}

function generateReport(results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    summary: {
      typecheck: results.typecheck.success,
      build: results.build?.success,
      lint: results.lint?.success,
    },
    recommendations: []
  };

  if (!results.typecheck.success) {
    report.recommendations.push('Run: npm run fix-types');
    report.recommendations.push('Update theme properties in src/theme/tokens.ts');
    report.recommendations.push('Fix unused variables by prefixing with underscore');
  }

  if (!results.lint?.success) {
    report.recommendations.push('Run: npm run lint:fix');
  }

  if (!results.build?.success) {
    report.recommendations.push('Fix TypeScript errors first, then retry build');
  }

  fs.writeFileSync('build-report.json', JSON.stringify(report, null, 2));
  console.log(`\n${colorize('📄 Build report saved to:', 'cyan')} build-report.json`);
}

async function main() {
  console.log(colorize('🚀 Rescale Design System - Build Validation', 'magenta'));
  console.log(colorize('='.repeat(55), 'magenta'));

  const results = {};

  // 1. TypeScript Check
  results.typecheck = runCommand(
    'npm run typecheck', 
    'TypeScript type checking', 
    { silent: true }
  );

  // 2. Analyze TypeScript errors if any
  if (!results.typecheck.success) {
    const categories = analyzeTypeScriptErrors(results.typecheck.output);
    printErrorAnalysis(categories);
  }

  // 3. Build check (only if typecheck passes or user forces)
  if (results.typecheck.success || process.argv.includes('--force-build')) {
    results.build = runCommand('npm run build', 'Production build');
  } else {
    console.log(`\n${colorize('⏭️', 'yellow')} Skipping build due to TypeScript errors`);
    console.log('   Use --force-build to attempt build anyway');
  }

  // 4. Lint check (non-blocking)
  results.lint = runCommand(
    'npm run lint', 
    'ESLint validation', 
    { silent: true }
  );

  // 5. Generate report
  generateReport(results);

  // 6. Summary and next steps
  console.log(`\n${colorize('📋 Summary', 'cyan')}`);
  console.log('=' .repeat(20));
  
  const allPassed = Object.values(results).every(r => r.success);
  
  if (allPassed) {
    console.log(`${colorize('🎉 All checks passed!', 'green')} Ready for commit and deploy.`);
  } else {
    console.log(`${colorize('⚠️  Issues found.', 'yellow')} See recommendations above.`);
    console.log(`\n${colorize('🔧 Quick fixes:', 'blue')}`);
    console.log('   npm run fix-types    # Fix type import issues');
    console.log('   npm run lint:fix     # Fix linting issues');
    console.log('   npm run format       # Fix formatting');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run validation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(colorize('💥 Validation script failed:', 'red'), error);
    process.exit(1);
  });
}