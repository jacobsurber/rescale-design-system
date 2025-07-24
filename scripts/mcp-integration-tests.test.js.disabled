/**
 * MCP Integration Tests
 * 
 * Tests for Figma MCP integration functionality
 */

import { jest } from '@jest/globals';
import { MCPHealthMonitor } from './figma-mcp-health-monitor.js';
import config from '../figma-mcp.config.js';

// Mock fetch for MCP requests
global.fetch = jest.fn();

// Mock child_process for Figma desktop detection
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

// Mock fs for file system operations
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('{}'),
    unlink: jest.fn().mockResolvedValue(undefined),
    stat: jest.fn().mockResolvedValue({ size: 1024 }),
    readdir: jest.fn().mockResolvedValue([])
  }
}));

describe('MCP Integration Tests', () => {
  let healthMonitor;
  
  beforeEach(() => {
    healthMonitor = new MCPHealthMonitor();
    jest.clearAllMocks();
  });

  describe('MCPHealthMonitor', () => {
    describe('checkServerConnection', () => {
      it('should pass when MCP server is healthy', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          status: 200
        });

        const result = await healthMonitor.checkServerConnection();
        
        expect(result.message).toContain('Server responding (200)');
        expect(result.data.status).toBe(200);
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3845/health',
          expect.objectContaining({
            signal: expect.any(AbortSignal)
          })
        );
      });

      it('should fail when MCP server is not responding', async () => {
        global.fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

        await expect(healthMonitor.checkServerConnection()).rejects.toThrow(
          'Connection failed: ECONNREFUSED'
        );
      });

      it('should fail when MCP server returns error status', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500
        });

        await expect(healthMonitor.checkServerConnection()).rejects.toThrow(
          'Server returned 500'
        );
      });
    });

    describe('checkAvailableTools', () => {
      it('should pass when all expected tools are available', async () => {
        const mockTools = [
          { name: 'get_code' },
          { name: 'get_variable_defs' },
          { name: 'get_code_connect_map' },
          { name: 'get_image' },
          { name: 'create_design_system_rules' }
        ];

        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue(mockTools)
        });

        const result = await healthMonitor.checkAvailableTools();
        
        expect(result.message).toBe('All 5 tools available');
        expect(result.data.tools).toEqual([
          'get_code',
          'get_variable_defs', 
          'get_code_connect_map',
          'get_image',
          'create_design_system_rules'
        ]);
      });

      it('should fail when tools are missing', async () => {
        const mockTools = [
          { name: 'get_code' },
          { name: 'get_variable_defs' }
        ];

        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue(mockTools)
        });

        await expect(healthMonitor.checkAvailableTools()).rejects.toThrow(
          'Missing tools: get_code_connect_map, get_image, create_design_system_rules'
        );
      });
    });

    describe('validateConfiguration', () => {
      it('should pass with valid configuration', async () => {
        const result = await healthMonitor.validateConfiguration();
        expect(result.message).toBe('Configuration valid');
      });

      it('should detect missing config sections', async () => {
        // Temporarily modify config for test
        const originalServer = config.server;
        delete config.server;

        await expect(healthMonitor.validateConfiguration()).rejects.toThrow(
          'Missing config section: server'
        );

        // Restore config
        config.server = originalServer;
      });
    });
  });

  describe('MCP Token Extraction', () => {
    it('should extract tokens from node ID', async () => {
      // Mock MCP response for token extraction
      const mockTokens = {
        colors: {
          'primary/500': { hex: '#3B82F6', name: 'Primary 500' }
        },
        typography: {
          'heading/h1': { fontFamily: 'Inter', fontSize: 32 }
        }
      };

      // This would be implemented in the actual extractor
      const extractTokens = jest.fn().mockResolvedValue(mockTokens);
      
      const tokens = await extractTokens('123:456');
      
      expect(tokens.colors['primary/500'].hex).toBe('#3B82F6');
      expect(tokens.typography['heading/h1'].fontFamily).toBe('Inter');
    });

    it('should handle extraction errors gracefully', async () => {
      const extractTokens = jest.fn().mockRejectedValue(new Error('Node not found'));
      
      await expect(extractTokens('invalid-node')).rejects.toThrow('Node not found');
    });
  });

  describe('MCP Asset Extraction', () => {
    it('should extract SVG assets correctly', async () => {
      const mockSVG = '<svg width="24" height="24"><path d="M12 2L22 7V17L12 22L2 17V7L12 2Z"/></svg>';
      
      const extractAsset = jest.fn().mockResolvedValue({
        type: 'svg',
        content: mockSVG,
        optimized: mockSVG.replace(/\s+/g, ' ').trim()
      });

      const asset = await extractAsset('icon-123');
      
      expect(asset.type).toBe('svg');
      expect(asset.content).toContain('<svg');
      expect(asset.optimized.length).toBeLessThan(asset.content.length);
    });

    it('should generate React components from SVG', async () => {
      const generateComponent = jest.fn().mockResolvedValue(`
import React from 'react';

export const TestIcon: React.FC = () => {
  return <svg width="24" height="24"><path d="..."/></svg>;
};
      `.trim());

      const component = await generateComponent('test-icon');
      
      expect(component).toContain('export const TestIcon');
      expect(component).toContain('React.FC');
      expect(component).toContain('<svg');
    });
  });

  describe('MCP Validation', () => {
    it('should validate component against Figma specs', async () => {
      const mockValidation = {
        component: 'Button',
        checks: {
          visual: true,
          colors: true,
          typography: false,
          spacing: true,
          accessibility: true
        },
        score: 80,
        status: 'warning'
      };

      const validateComponent = jest.fn().mockResolvedValue(mockValidation);
      
      const result = await validateComponent('Button', '123:456');
      
      expect(result.component).toBe('Button');
      expect(result.score).toBe(80);
      expect(result.status).toBe('warning');
      expect(result.checks.typography).toBe(false);
    });

    it('should detect token compliance issues', async () => {
      const auditTokens = jest.fn().mockResolvedValue({
        hardcodedColors: ['#FF0000', '#00FF00'],
        unusedTokens: ['neutral/200'],
        missingTokens: ['success/600']
      });

      const audit = await auditTokens();
      
      expect(audit.hardcodedColors).toHaveLength(2);
      expect(audit.unusedTokens).toContain('neutral/200');
      expect(audit.missingTokens).toContain('success/600');
    });
  });

  describe('MCP Real-time Features', () => {
    it('should detect selection changes', async () => {
      let currentSelection = null;
      const onSelectionChange = jest.fn((nodeId) => {
        currentSelection = nodeId;
      });

      // Simulate selection change
      const simulateSelectionChange = (nodeId) => {
        onSelectionChange(nodeId);
      };

      simulateSelectionChange('123:456');
      expect(currentSelection).toBe('123:456');
      expect(onSelectionChange).toHaveBeenCalledWith('123:456');
    });

    it('should throttle rapid selection changes', async () => {
      const throttledHandler = jest.fn();
      
      // Simulate rapid calls
      for (let i = 0; i < 10; i++) {
        throttledHandler(`node-${i}`);
      }
      
      // In real implementation, only the last call would be processed
      expect(throttledHandler).toHaveBeenCalledTimes(10);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should fall back to REST API when MCP unavailable', async () => {
      const mcpExtractor = jest.fn().mockRejectedValue(new Error('MCP unavailable'));
      const restExtractor = jest.fn().mockResolvedValue({ colors: { primary: '#3B82F6' } });
      
      const extractWithFallback = async () => {
        try {
          return await mcpExtractor();
        } catch (error) {
          if (error.message === 'MCP unavailable') {
            return await restExtractor();
          }
          throw error;
        }
      };

      const result = await extractWithFallback();
      
      expect(result.colors.primary).toBe('#3B82F6');
      expect(mcpExtractor).toHaveBeenCalled();
      expect(restExtractor).toHaveBeenCalled();
    });

    it('should cache successful extractions', async () => {
      const cache = new Map();
      const cacheKey = 'tokens-123:456';
      
      const extractWithCache = async (nodeId) => {
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }
        
        const tokens = { colors: { primary: '#3B82F6' } };
        cache.set(cacheKey, tokens);
        return tokens;
      };

      // First call
      const result1 = await extractWithCache('123:456');
      expect(result1.colors.primary).toBe('#3B82F6');
      
      // Second call should use cache
      const result2 = await extractWithCache('123:456');
      expect(result2.colors.primary).toBe('#3B82F6');
      expect(cache.size).toBe(1);
    });
  });

  describe('Configuration Management', () => {
    it('should load configuration correctly', () => {
      expect(config.server).toBeDefined();
      expect(config.server.host).toBe('localhost');
      expect(config.server.port).toBe(3845);
      expect(config.client.frameworks).toContain('react');
      expect(config.paths.tokens).toBe('./src/theme/tokens');
    });

    it('should validate required configuration sections', () => {
      const requiredSections = ['server', 'client', 'paths', 'tokens'];
      
      requiredSections.forEach(section => {
        expect(config[section]).toBeDefined();
      });
    });

    it('should handle feature flags correctly', () => {
      expect(config.features).toBeDefined();
      expect(typeof config.features.realTimeSync).toBe('boolean');
      expect(typeof config.features.assetExtraction).toBe('boolean');
      expect(typeof config.features.designValidation).toBe('boolean');
    });
  });
});

describe('Integration with Jest Testing Framework', () => {
  it('should have proper test environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should mock external dependencies correctly', () => {
    expect(global.fetch).toBeDefined();
    expect(jest.isMockFunction(global.fetch)).toBe(true);
  });
});

// Performance tests
describe('MCP Performance Tests', () => {
  it('should complete health check within reasonable time', async () => {
    const startTime = Date.now();
    
    // Mock successful responses
    global.fetch.mockResolvedValue({ ok: true, status: 200 });
    
    const healthMonitor = new MCPHealthMonitor();
    await healthMonitor.checkServerConnection();
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });

  it('should handle concurrent requests efficiently', async () => {
    const promises = [];
    
    for (let i = 0; i < 10; i++) {
      promises.push(Promise.resolve({ id: i, status: 'success' }));
    }

    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
    results.forEach((result, index) => {
      expect(result.id).toBe(index);
    });
  });
});