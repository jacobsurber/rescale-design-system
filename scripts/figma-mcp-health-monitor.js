#!/usr/bin/env node

/**
 * Figma MCP Health Monitor
 * 
 * Monitors MCP server health and provides fallback strategies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../figma-mcp.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class MCPHealthMonitor {
  constructor() {
    this.server = config.server;
    this.baseUrl = `${this.server.protocol}://${this.server.host}:${this.server.port}`;
    this.healthLog = [];
    this.cacheDir = path.resolve(__dirname, '../.mcp-cache');
  }

  /**
   * Main health check interface
   */
  async run() {
    console.log(`${colors.cyan}${colors.bright}🏥 Figma MCP Health Monitor${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    
    console.log(`${colors.yellow}Server: ${this.baseUrl}${colors.reset}\n`);

    const healthStatus = await this.performHealthCheck();
    this.displayHealthStatus(healthStatus);
    
    if (process.argv.includes('--monitor')) {
      await this.startContinuousMonitoring();
    }

    if (process.argv.includes('--fix')) {
      await this.attemptFixes(healthStatus);
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    const checks = [
      { name: 'MCP Server Connection', test: () => this.checkServerConnection() },
      { name: 'Figma Desktop App', test: () => this.checkFigmaDesktop() },
      { name: 'Available Tools', test: () => this.checkAvailableTools() },
      { name: 'Cache Directory', test: () => this.checkCacheDirectory() },
      { name: 'Configuration', test: () => this.validateConfiguration() },
      { name: 'Permissions', test: () => this.checkPermissions() }
    ];

    const results = [];
    
    for (const check of checks) {
      console.log(`Checking ${colors.cyan}${check.name}${colors.reset}...`);
      
      try {
        const result = await check.test();
        results.push({
          name: check.name,
          status: 'pass',
          details: result.message || 'OK',
          data: result.data
        });
        console.log(`  ${colors.green}✅ Pass${colors.reset}`);
      } catch (error) {
        results.push({
          name: check.name,
          status: 'fail',
          details: error.message,
          error: error
        });
        console.log(`  ${colors.red}❌ Fail: ${error.message}${colors.reset}`);
      }
    }

    return results;
  }

  /**
   * Check MCP server connection
   */
  async checkServerConnection() {
    try {
      const response = await this.makeRequest('/health', { timeout: 5000 });
      
      if (response.ok) {
        return { 
          message: `Server responding (${response.status})`,
          data: { status: response.status }
        };
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused - MCP server not running');
      }
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  /**
   * Check if Figma desktop app is running
   */
  async checkFigmaDesktop() {
    try {
      // Check if Figma process is running (macOS/Linux)
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      let command;
      if (process.platform === 'darwin') {
        command = 'pgrep -f "Figma"';
      } else if (process.platform === 'linux') {
        command = 'pgrep figma';
      } else {
        command = 'tasklist /FI "IMAGENAME eq Figma*"';
      }
      
      const { stdout } = await execAsync(command);
      
      if (stdout.trim()) {
        return { message: 'Figma desktop app is running' };
      } else {
        throw new Error('Figma desktop app not detected');
      }
    } catch (error) {
      throw new Error('Could not detect Figma desktop app');
    }
  }

  /**
   * Check available MCP tools
   */
  async checkAvailableTools() {
    try {
      const response = await this.makeRequest('/tools');
      const tools = await response.json();
      
      const expectedTools = [
        'get_code',
        'get_variable_defs', 
        'get_code_connect_map',
        'get_image',
        'create_design_system_rules'
      ];
      
      const availableTools = tools.map(t => t.name);
      const missingTools = expectedTools.filter(tool => !availableTools.includes(tool));
      
      if (missingTools.length === 0) {
        return { 
          message: `All ${expectedTools.length} tools available`,
          data: { tools: availableTools }
        };
      } else {
        throw new Error(`Missing tools: ${missingTools.join(', ')}`);
      }
    } catch (error) {
      throw new Error(`Tools check failed: ${error.message}`);
    }
  }

  /**
   * Check cache directory
   */
  async checkCacheDirectory() {
    try {
      await fs.promises.mkdir(this.cacheDir, { recursive: true });
      
      // Test write permissions
      const testFile = path.join(this.cacheDir, '.health-test');
      await fs.promises.writeFile(testFile, 'test');
      await fs.promises.unlink(testFile);
      
      const stats = await fs.promises.stat(this.cacheDir);
      
      return {
        message: `Cache directory accessible`,
        data: { 
          path: this.cacheDir,
          size: await this.getCacheSize()
        }
      };
    } catch (error) {
      throw new Error(`Cache directory issue: ${error.message}`);
    }
  }

  /**
   * Validate configuration
   */
  async validateConfiguration() {
    const issues = [];
    
    // Check required config sections
    const requiredSections = ['server', 'client', 'paths'];
    for (const section of requiredSections) {
      if (!config[section]) {
        issues.push(`Missing config section: ${section}`);
      }
    }
    
    // Check output paths exist
    for (const [name, path] of Object.entries(config.paths)) {
      try {
        await fs.promises.mkdir(path, { recursive: true });
      } catch (error) {
        issues.push(`Cannot create path ${name}: ${path}`);
      }
    }
    
    if (issues.length > 0) {
      throw new Error(issues.join(', '));
    }
    
    return { message: 'Configuration valid' };
  }

  /**
   * Check file system permissions
   */
  async checkPermissions() {
    const testPaths = [
      config.paths.tokens,
      config.paths.components,
      config.paths.assets
    ];
    
    for (const testPath of testPaths) {
      try {
        await fs.promises.mkdir(testPath, { recursive: true });
        const testFile = path.join(testPath, '.permission-test');
        await fs.promises.writeFile(testFile, 'test');
        await fs.promises.unlink(testFile);
      } catch (error) {
        throw new Error(`No write permission for ${testPath}`);
      }
    }
    
    return { message: 'All paths writable' };
  }

  /**
   * Display health status
   */
  displayHealthStatus(results) {
    console.log(`\n${colors.cyan}${colors.bright}📊 Health Check Results${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.cyan}📋 Total: ${results.length}${colors.reset}\n`);
    
    // Show detailed results
    results.forEach(result => {
      const icon = result.status === 'pass' ? `${colors.green}✅` : `${colors.red}❌`;
      console.log(`${icon} ${colors.bright}${result.name}${colors.reset}`);
      console.log(`   ${result.details}`);
      
      if (result.data) {
        Object.entries(result.data).forEach(([key, value]) => {
          console.log(`   ${colors.cyan}${key}:${colors.reset} ${value}`);
        });
      }
      console.log('');
    });
    
    // Overall health score
    const healthScore = Math.round((passed / results.length) * 100);
    let healthColor = colors.red;
    if (healthScore >= 80) healthColor = colors.green;
    else if (healthScore >= 60) healthColor = colors.yellow;
    
    console.log(`${colors.cyan}Overall Health Score: ${healthColor}${healthScore}%${colors.reset}\n`);
    
    // Recommendations
    if (failed > 0) {
      console.log(`${colors.yellow}💡 Recommendations:${colors.reset}`);
      results.filter(r => r.status === 'fail').forEach(result => {
        console.log(`• Fix ${result.name}: ${result.details}`);
      });
      console.log(`\nRun with ${colors.cyan}--fix${colors.reset} to attempt automatic fixes.\n`);
    }
  }

  /**
   * Start continuous monitoring
   */
  async startContinuousMonitoring() {
    console.log(`${colors.blue}👀 Starting continuous monitoring...${colors.reset}`);
    console.log(`${colors.yellow}Checking health every 30 seconds. Press Ctrl+C to stop.${colors.reset}\n`);
    
    setInterval(async () => {
      try {
        const healthStatus = await this.performHealthCheck();
        const failed = healthStatus.filter(r => r.status === 'fail').length;
        
        if (failed > 0) {
          console.log(`${colors.red}⚠️  Health issues detected at ${new Date().toLocaleTimeString()}${colors.reset}`);
          console.log(`${colors.red}   ${failed} checks failed${colors.reset}\n`);
        } else {
          console.log(`${colors.green}✅ All systems healthy at ${new Date().toLocaleTimeString()}${colors.reset}`);
        }
      } catch (error) {
        console.error(`${colors.red}❌ Monitoring error:${colors.reset}`, error.message);
      }
    }, 30000);

    // Keep process alive
    process.stdin.resume();
  }

  /**
   * Attempt automatic fixes
   */
  async attemptFixes(healthStatus) {
    console.log(`${colors.blue}🔧 Attempting automatic fixes...${colors.reset}\n`);
    
    const failedChecks = healthStatus.filter(r => r.status === 'fail');
    
    for (const check of failedChecks) {
      console.log(`Fixing ${colors.cyan}${check.name}${colors.reset}...`);
      
      try {
        switch (check.name) {
          case 'Cache Directory':
            await fs.promises.mkdir(this.cacheDir, { recursive: true });
            console.log(`  ${colors.green}✅ Created cache directory${colors.reset}`);
            break;
            
          case 'Configuration':
            // Create missing directories
            for (const [name, path] of Object.entries(config.paths)) {
              await fs.promises.mkdir(path, { recursive: true });
            }
            console.log(`  ${colors.green}✅ Created missing directories${colors.reset}`);
            break;
            
          default:
            console.log(`  ${colors.yellow}⚠️  No automatic fix available${colors.reset}`);
        }
      } catch (error) {
        console.log(`  ${colors.red}❌ Fix failed: ${error.message}${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.blue}Re-running health check...${colors.reset}\n`);
    const newStatus = await this.performHealthCheck();
    this.displayHealthStatus(newStatus);
  }

  /**
   * Utility methods
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    
    if (options.timeout) {
      setTimeout(() => controller.abort(), options.timeout);
    }
    
    const response = await fetch(url, {
      signal: controller.signal,
      ...options
    });
    
    return response;
  }

  async getCacheSize() {
    try {
      const files = await fs.promises.readdir(this.cacheDir);
      let totalSize = 0;
      
      for (const file of files) {
        const stats = await fs.promises.stat(path.join(this.cacheDir, file));
        totalSize += stats.size;
      }
      
      return `${Math.round(totalSize / 1024)}KB`;
    } catch (error) {
      return 'Unknown';
    }
  }
}

// Export class for use in other modules
export { MCPHealthMonitor };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new MCPHealthMonitor();
  
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🏥 Figma MCP Health Monitor

Usage:
  node figma-mcp-health-monitor.js [options]

Options:
  --monitor        Start continuous monitoring
  --fix           Attempt automatic fixes
  --help, -h      Show this help message

Examples:
  # Single health check
  node figma-mcp-health-monitor.js

  # Continuous monitoring
  node figma-mcp-health-monitor.js --monitor

  # Check and attempt fixes
  node figma-mcp-health-monitor.js --fix
`);
    process.exit(0);
  }
  
  monitor.run().catch(console.error);
}

export default MCPHealthMonitor;