/**
 * MCP Service
 * 
 * Handles communication with the Figma MCP server
 */

export interface MCPServerConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  timeout: number;
}

export interface MCPHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  server: string;
  figmaConnected: boolean;
}

export interface MCPTokensResponse {
  colors: Record<string, { hex: string; name: string; opacity?: number }>;
  typography: Record<string, { fontFamily: string; fontSize: number; fontWeight?: number; lineHeight?: number }>;
  spacing: Record<string, { value: number; unit: string }>;
  shadows: Record<string, { x: number; y: number; blur: number; spread: number; color: string }>;
}

export interface MCPSelectionResponse {
  nodeId: string;
  name: string;
  type: string;
  properties: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    fills?: Array<{ type: string; color: { r: number; g: number; b: number; a: number } }>;
    strokes?: Array<{ type: string; color: { r: number; g: number; b: number; a: number } }>;
    effects?: Array<{ type: string; radius?: number; color?: { r: number; g: number; b: number; a: number } }>;
    fontName?: { family: string; style: string };
    fontSize?: number;
    characters?: string;
  };
}

export interface MCPComponentResponse {
  nodeId: string;
  name: string;
  description?: string;
  componentSetId?: string;
  variantProperties?: Record<string, string>;
  codeConnectInfo?: {
    src: string;
    name: string;
    props?: Record<string, any>;
  };
}

class MCPService {
  private config: MCPServerConfig;
  private baseUrl: string;

  constructor(config: Partial<MCPServerConfig> = {}) {
    this.config = {
      host: 'localhost',
      port: 3845,
      protocol: 'http',
      timeout: 10000,
      ...config
    };
    this.baseUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}`;
  }

  /**
   * Check MCP server health and Figma connection
   */
  async checkHealth(): Promise<MCPHealthResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // For now, simulate the response since the actual MCP server might not have this endpoint
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: `${this.config.host}:${this.config.port}`,
        figmaConnected: true
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * Get current Figma selection
   */
  async getCurrentSelection(): Promise<MCPSelectionResponse | null> {
    try {
      // This would use the MCP get_current_selection tool
      // For now, simulate the call
      const response = await this.makeRequest('/tools/get_current_selection', {
        method: 'POST',
        body: JSON.stringify({
          clientName: 'figma-mcp-dashboard',
          clientLanguages: 'typescript,javascript',
          clientFrameworks: 'react'
        })
      });

      if (response.nodeId) {
        return response;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get current selection:', error);
      return null;
    }
  }

  /**
   * Extract design tokens from a specific node
   */
  async extractTokens(nodeId?: string): Promise<MCPTokensResponse> {
    try {
      const body: any = {
        clientName: 'figma-mcp-dashboard',
        clientLanguages: 'typescript,javascript',
        clientFrameworks: 'react'
      };

      if (nodeId) {
        body.nodeId = nodeId;
      }

      // Use the MCP get_variable_defs tool
      const variableDefs = await this.makeRequest('/tools/get_variable_defs', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      // Also get code for additional token information
      const codeInfo = await this.makeRequest('/tools/get_code', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      // Parse and structure the tokens
      return this.parseTokensFromMCPResponse(variableDefs, codeInfo);
    } catch (error) {
      console.error('Failed to extract tokens:', error);
      throw error;
    }
  }

  /**
   * Get component information
   */
  async getComponentInfo(nodeId: string): Promise<MCPComponentResponse> {
    try {
      const [codeInfo, codeConnectMap] = await Promise.all([
        this.makeRequest('/tools/get_code', {
          method: 'POST',
          body: JSON.stringify({
            nodeId,
            clientName: 'figma-mcp-dashboard',
            clientLanguages: 'typescript,javascript',
            clientFrameworks: 'react'
          })
        }),
        this.makeRequest('/tools/get_code_connect_map', {
          method: 'POST',
          body: JSON.stringify({
            nodeId,
            clientName: 'figma-mcp-dashboard',
            clientLanguages: 'typescript,javascript',
            clientFrameworks: 'react'
          })
        })
      ]);

      return {
        nodeId,
        name: codeInfo.name || 'Unknown Component',
        description: codeInfo.description,
        codeConnectInfo: codeConnectMap[nodeId]
      };
    } catch (error) {
      console.error('Failed to get component info:', error);
      throw error;
    }
  }

  /**
   * Get image for a node
   */
  async getNodeImage(nodeId: string): Promise<string> {
    try {
      const response = await this.makeRequest('/tools/get_image', {
        method: 'POST',
        body: JSON.stringify({
          nodeId,
          clientName: 'figma-mcp-dashboard',
          clientLanguages: 'typescript,javascript',
          clientFrameworks: 'react'
        })
      });

      return response.imageUrl || response.image;
    } catch (error) {
      console.error('Failed to get node image:', error);
      throw error;
    }
  }

  /**
   * Generic request helper
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * Parse tokens from MCP response
   */
  private parseTokensFromMCPResponse(variableDefs: any, codeInfo: any): MCPTokensResponse {
    // This would parse the actual MCP response format
    // For now, return a structured format
    
    const tokens: MCPTokensResponse = {
      colors: {},
      typography: {},
      spacing: {},
      shadows: {}
    };

    // Parse variable definitions
    if (variableDefs && typeof variableDefs === 'object') {
      Object.entries(variableDefs).forEach(([key, value]: [string, any]) => {
        if (key.includes('color') || key.includes('Color')) {
          tokens.colors[key] = {
            hex: value.toString(),
            name: key
          };
        } else if (key.includes('font') || key.includes('Font') || key.includes('text')) {
          tokens.typography[key] = {
            fontFamily: value.fontFamily || 'Inter',
            fontSize: value.fontSize || 16
          };
        } else if (key.includes('spacing') || key.includes('Spacing') || key.includes('gap')) {
          tokens.spacing[key] = {
            value: parseInt(value.toString()) || 0,
            unit: 'px'
          };
        }
      });
    }

    return tokens;
  }
}

// Export singleton instance
export const mcpService = new MCPService();
export default MCPService;