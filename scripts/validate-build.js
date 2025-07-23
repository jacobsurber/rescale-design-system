#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    typecheck: false,
    build: false,
    lint: false
  },
  errors: [],
  warnings: [],
  recommendations: []
};

console.log('🔍 Starting build validation...\n');

// Helper function to run commands and capture output
function runCommand(command, description) {
  console.log(`📝 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    console.log(`✅ ${description} passed`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} failed`);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    return { success: false, error: error.message, output: error.stdout || error.stderr };
  }
}

// 1. TypeScript type checking
const typecheckResult = runCommand('npm run typecheck', 'TypeScript type checking');
report.summary.typecheck = typecheckResult.success;
if (!typecheckResult.success) {
  report.errors.push('TypeScript type checking failed');
}

// 2. Build validation
console.log('\n📦 Building library...');
const buildResult = runCommand('npm run build:lib', 'Library build');
report.summary.build = buildResult.success;

if (buildResult.success) {
  // Check if build artifacts exist
  const distExists = fs.existsSync('dist/index.js') && fs.existsSync('dist/index.mjs');
  if (distExists) {
    console.log('✅ Build artifacts created successfully');
    
    // Check build sizes
    const stats = {
      'dist/index.js': fs.statSync('dist/index.js').size,
      'dist/index.mjs': fs.statSync('dist/index.mjs').size,
      'dist/index.css': fs.existsSync('dist/index.css') ? fs.statSync('dist/index.css').size : 0
    };
    
    console.log('📊 Build sizes:');
    Object.entries(stats).forEach(([file, size]) => {
      const sizeKB = (size / 1024).toFixed(2);
      console.log(`   ${file}: ${sizeKB} KB`);
      
      // Add recommendations for large bundles
      if (file.includes('.js') && size > 500 * 1024) {
        report.warnings.push(`${file} is larger than 500KB (${sizeKB}KB)`);
        report.recommendations.push('Consider code splitting or tree shaking to reduce bundle size');
      }
    });
  } else {
    report.errors.push('Build artifacts not found after build');
    report.summary.build = false;
  }
} else {
  report.errors.push('Library build failed');
}

// 3. Lint checking (with tolerance for existing issues)
console.log('\n🧹 Running linter...');
const lintResult = runCommand('npm run lint', 'ESLint checking');
report.summary.lint = lintResult.success;

if (!lintResult.success) {
  report.warnings.push('Linting issues found');
  report.recommendations.push('Fix linting issues before merging to main');
}

// 4. Storybook build validation
console.log('\n📚 Building Storybook...');
const storybookResult = runCommand('npm run build:storybook', 'Storybook build');

if (storybookResult.success) {
  const storybookExists = fs.existsSync('storybook-static/index.html');
  if (storybookExists) {
    console.log('✅ Storybook built successfully');
  } else {
    report.warnings.push('Storybook build completed but index.html not found');
  }
} else {
  report.warnings.push('Storybook build failed');
  report.recommendations.push('Check Storybook configuration and stories');
}

// Generate final report
console.log('\n📋 Validation Summary:');
console.log(`   TypeScript: ${report.summary.typecheck ? '✅' : '❌'}`);
console.log(`   Build: ${report.summary.build ? '✅' : '❌'}`);
console.log(`   Lint: ${report.summary.lint ? '✅' : '⚠️'}`);

if (report.errors.length > 0) {
  console.log('\n❌ Errors:');
  report.errors.forEach(error => console.log(`   - ${error}`));
}

if (report.warnings.length > 0) {
  console.log('\n⚠️ Warnings:');
  report.warnings.forEach(warning => console.log(`   - ${warning}`));
}

if (report.recommendations.length > 0) {
  console.log('\n💡 Recommendations:');
  report.recommendations.forEach(rec => console.log(`   - ${rec}`));
}

// Save report
fs.writeFileSync('build-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Report saved to build-report.json');

// Exit with appropriate code
const hasErrors = report.errors.length > 0 || !report.summary.typecheck || !report.summary.build;
const exitCode = hasErrors ? 1 : 0;

console.log(`\n${hasErrors ? '❌' : '✅'} Validation ${hasErrors ? 'failed' : 'completed successfully'}`);
process.exit(exitCode);