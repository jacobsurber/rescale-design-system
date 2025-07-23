#!/usr/bin/env node

/**
 * Test CI Build Script
 * 
 * This script simulates the CI environment to identify build failures
 * before they occur in GitHub Actions.
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Testing CI Build Process...\n');

const steps = [
  {
    name: 'Install Dependencies',
    command: 'npm ci',
    required: true,
  },
  {
    name: 'TypeScript Check',
    command: 'npm run typecheck',
    required: true,
  },
  {
    name: 'Build Library',
    command: 'npm run build:lib',
    required: true,
  },
  {
    name: 'Build Storybook',
    command: 'npm run build:storybook',
    required: true,
  },
  {
    name: 'Validate Build',
    command: 'npm run validate-build',
    required: false,
  },
];

let passed = 0;
let failed = 0;

for (const step of steps) {
  console.log(`📋 ${step.name}...`);
  
  try {
    const startTime = Date.now();
    const output = execSync(step.command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, CI: 'true' }
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ ${step.name} completed (${duration}s)`);
    passed++;
    
    // Show brief output for important steps
    if (step.name.includes('Build')) {
      const lines = output.split('\n').filter(line => 
        line.includes('built in') || 
        line.includes('✓') || 
        line.includes('kB')
      );
      if (lines.length > 0) {
        console.log(`   ${lines[lines.length - 1].trim()}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ ${step.name} failed`);
    
    if (error.stdout) {
      console.log('📄 Output:');
      console.log(error.stdout.toString().slice(-500)); // Last 500 chars
    }
    
    if (error.stderr) {
      console.log('🚨 Error:');
      console.log(error.stderr.toString().slice(-500)); // Last 500 chars
    }
    
    failed++;
    
    if (step.required) {
      console.log(`\n💥 Required step failed: ${step.name}`);
      console.log('Build process cannot continue.');
      break;
    } else {
      console.log(`⚠️ Optional step failed: ${step.name} (continuing...)`);
    }
  }
  
  console.log(''); // Empty line for readability
}

// Summary
console.log('📊 CI Build Test Summary');
console.log('═'.repeat(40));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

// Check for critical build artifacts
const artifacts = [
  { path: 'dist/index.js', name: 'Library JS Bundle' },
  { path: 'dist/index.mjs', name: 'Library ESM Bundle' },
  { path: 'dist/index.d.ts', name: 'TypeScript Declarations' },
  { path: 'storybook-static/index.html', name: 'Storybook HTML' },
];

console.log('\n📦 Build Artifacts Check:');
artifacts.forEach(artifact => {
  const exists = fs.existsSync(artifact.path);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${artifact.name}: ${exists ? 'Present' : 'Missing'}`);
  
  if (exists) {
    const stats = fs.statSync(artifact.path);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   Size: ${size} KB`);
  }
});

if (failed === 0) {
  console.log('\n🎉 All CI build steps would succeed!');
  console.log('✅ Ready for deployment');
} else {
  console.log('\n⚠️ Some issues detected that may cause CI failure');
  console.log('🔧 Review the errors above and fix before pushing');
}

console.log('\n🚀 CI Build Test Complete');