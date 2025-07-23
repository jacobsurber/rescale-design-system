#!/usr/bin/env node

/**
 * CI Debug Script
 * 
 * This script helps debug common CI/CD issues by running a comprehensive
 * check of the build environment and dependencies.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 CI Debug Script - Checking for common issues...\n');

const checks = [];

// Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  checks.push({ name: 'Node.js Version', status: '✅', value: nodeVersion });
} catch (error) {
  checks.push({ name: 'Node.js Version', status: '❌', error: error.message });
}

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  checks.push({ name: 'npm Version', status: '✅', value: npmVersion });
} catch (error) {
  checks.push({ name: 'npm Version', status: '❌', error: error.message });
}

// Check if package.json exists and is valid
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  checks.push({ name: 'package.json', status: '✅', value: `${packageJson.name}@${packageJson.version}` });
} catch (error) {
  checks.push({ name: 'package.json', status: '❌', error: error.message });
}

// Check if node_modules exists
const nodeModulesExists = fs.existsSync('node_modules');
checks.push({ 
  name: 'node_modules', 
  status: nodeModulesExists ? '✅' : '❌', 
  value: nodeModulesExists ? 'Present' : 'Missing - run npm install' 
});

// Check critical directories
const criticalDirs = ['src', 'scripts', '.storybook'];
criticalDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  checks.push({ 
    name: `Directory: ${dir}`, 
    status: exists ? '✅' : '❌', 
    value: exists ? 'Present' : 'Missing' 
  });
});

// Check script files
const scriptFiles = ['validate-build.js', 'figma-extractor.js', 'figma-to-storybook.js', 'auto-sync-figma.js'];
scriptFiles.forEach(script => {
  const scriptPath = path.join('scripts', script);
  const exists = fs.existsSync(scriptPath);
  let executable = false;
  
  if (exists) {
    try {
      const stats = fs.statSync(scriptPath);
      executable = !!(stats.mode & parseInt('111', 8));
    } catch (err) {
      // Ignore permission check errors
    }
  }
  
  checks.push({ 
    name: `Script: ${script}`, 
    status: exists ? (executable ? '✅' : '⚠️') : '❌', 
    value: exists ? (executable ? 'Present & Executable' : 'Present but not executable') : 'Missing' 
  });
});

// Check TypeScript configuration
try {
  const tsconfigExists = fs.existsSync('tsconfig.json');
  if (tsconfigExists) {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    checks.push({ name: 'TypeScript Config', status: '✅', value: 'Valid tsconfig.json' });
  } else {
    checks.push({ name: 'TypeScript Config', status: '❌', error: 'tsconfig.json missing' });
  }
} catch (error) {
  checks.push({ name: 'TypeScript Config', status: '❌', error: 'Invalid tsconfig.json' });
}

// Check package.json scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['typecheck', 'build:lib', 'build:storybook', 'test:ci', 'validate-build'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length === 0) {
    checks.push({ name: 'Required Scripts', status: '✅', value: 'All scripts present' });
  } else {
    checks.push({ name: 'Required Scripts', status: '❌', error: `Missing: ${missingScripts.join(', ')}` });
  }
} catch (error) {
  checks.push({ name: 'Required Scripts', status: '❌', error: error.message });
}

// Check for common CI issues
const commonIssues = [];

// Check if there are .env files that might be missing
if (fs.existsSync('.env.example') && !fs.existsSync('.env')) {
  commonIssues.push('⚠️ .env.example exists but .env is missing');
}

// Check for husky hooks that might block CI
if (fs.existsSync('.husky')) {
  commonIssues.push('⚠️ Husky hooks detected - ensure they work in CI environment');
}

// Print results
console.log('📊 Environment Check Results:');
console.log('═'.repeat(50));

checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.value || check.error || 'OK'}`);
});

if (commonIssues.length > 0) {
  console.log('\n🚨 Potential Issues:');
  commonIssues.forEach(issue => console.log(issue));
}

// Quick tests
console.log('\n🧪 Quick Command Tests:');
console.log('═'.repeat(30));

const quickTests = [
  { cmd: 'npm run typecheck', name: 'TypeScript' },
  { cmd: 'npm run build:lib', name: 'Library Build' },
];

for (const test of quickTests) {
  try {
    console.log(`Running: ${test.name}...`);
    execSync(test.cmd, { stdio: 'pipe' });
    console.log(`✅ ${test.name} passed`);
  } catch (error) {
    console.log(`❌ ${test.name} failed: ${error.message.split('\n')[0]}`);
  }
}

console.log('\n✨ Debug complete! Check results above for any issues.');