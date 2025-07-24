#!/usr/bin/env node

/**
 * Mock MCP Server for Testing
 * 
 * Simulates a Figma MCP server on localhost:3845 for testing the dashboard
 * without requiring the actual MCP server installation
 */

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3845;

// Enable CORS for dashboard requests
app.use(cors());
app.use(express.json());

// Mock health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: `localhost:${port}`,
    figmaConnected: true,
    version: '1.0.0-mock'
  });
});

// Mock variable definitions endpoint
app.post('/tools/get_variable_defs', (req, res) => {
  console.log('📊 Variable definitions requested:', req.body);
  
  // Simulate realistic design tokens
  const mockVariables = {
    'colors/primary/500': '#3B82F6',
    'colors/primary/600': '#2563EB', 
    'colors/success/500': '#10B981',
    'colors/success/600': '#059669',
    'colors/neutral/100': '#F5F5F5',
    'colors/neutral/900': '#1F2937',
    'typography/heading/h1': 'Inter 32px/40px',
    'typography/heading/h2': 'Inter 24px/32px',
    'typography/body/regular': 'Inter 16px/24px',
    'spacing/xs': '4px',
    'spacing/sm': '8px',
    'spacing/md': '16px',
    'spacing/lg': '24px',
    'spacing/xl': '32px',
    'shadows/sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    'shadows/md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    'shadows/lg': '0 10px 15px rgba(0, 0, 0, 0.1)'
  };

  // Simulate some processing delay
  setTimeout(() => {
    res.json(mockVariables);
  }, 500);
});

// Mock code extraction endpoint
app.post('/tools/get_code', (req, res) => {
  console.log('🧩 Code extraction requested:', req.body);
  
  const mockCode = {
    nodeId: req.body.nodeId || '123:456',
    name: 'Button Component',
    type: 'COMPONENT',
    description: 'Primary button component with multiple variants',
    properties: {
      width: 120,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 500
    },
    css: `
.button {
  width: 120px;
  height: 40px;
  border-radius: 8px;
  background-color: #3B82F6;
  color: #FFFFFF;
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
    `.trim()
  };

  setTimeout(() => {
    res.json(mockCode);
  }, 300);
});

// Mock current selection endpoint
app.post('/tools/get_current_selection', (req, res) => {
  console.log('🎯 Current selection requested');
  
  // Simulate changing selections
  const selections = [
    {
      nodeId: '123:456',
      name: 'Primary Button',
      type: 'COMPONENT',
      properties: { width: 120, height: 40, backgroundColor: '#3B82F6' }
    },
    {
      nodeId: '789:012',
      name: 'Card Container',
      type: 'FRAME',
      properties: { width: 320, height: 200, backgroundColor: '#FFFFFF' }
    },
    {
      nodeId: '345:678',
      name: 'Header Text',
      type: 'TEXT',
      properties: { fontFamily: 'Inter', fontSize: 24, color: '#1F2937' }
    }
  ];

  // Randomly return one of the selections or null
  const randomSelection = Math.random() > 0.3 
    ? selections[Math.floor(Math.random() * selections.length)]
    : null;

  setTimeout(() => {
    res.json(randomSelection);
  }, 200);
});

// Mock image endpoint
app.post('/tools/get_image', (req, res) => {
  console.log('🖼️ Image requested for node:', req.body.nodeId);
  
  res.json({
    nodeId: req.body.nodeId,
    imageUrl: `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="8" fill="#3B82F6"/>
        <text x="60" y="25" text-anchor="middle" fill="white" font-family="Inter" font-size="14">Button</text>
      </svg>
    `).toString('base64')}`,
    format: 'svg',
    scale: 1
  });
});

// Mock code connect map endpoint
app.post('/tools/get_code_connect_map', (req, res) => {
  console.log('🔗 Code connect map requested');
  
  const mockMap = {
    '123:456': {
      codeConnectSrc: 'src/components/atoms/Button/Button.tsx',
      codeConnectName: 'Button'
    },
    '789:012': {
      codeConnectSrc: 'src/components/molecules/Card/Card.tsx', 
      codeConnectName: 'Card'
    }
  };

  res.json(mockMap);
});

// List available tools
app.get('/tools', (req, res) => {
  res.json([
    { name: 'get_variable_defs', description: 'Extract design variable definitions' },
    { name: 'get_code', description: 'Extract code information for components' },
    { name: 'get_current_selection', description: 'Get currently selected Figma node' },
    { name: 'get_image', description: 'Extract image/SVG for a node' },
    { name: 'get_code_connect_map', description: 'Get code connection mapping' },
    { name: 'create_design_system_rules', description: 'Generate design system rules' }
  ]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Mock MCP Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`🎨 Mock MCP Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🛠️ Available tools: http://localhost:${port}/tools`);
  console.log('');
  console.log('✨ Ready for dashboard connection!');
  console.log('   Dashboard: http://localhost:3001/dashboard.html');
  console.log('');
  console.log('Press Ctrl+C to stop');
});

export default app;