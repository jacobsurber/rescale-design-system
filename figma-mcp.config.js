/**
 * Figma MCP Configuration
 * 
 * Centralized configuration for all MCP-based Figma integration tools
 */

export default {
  // MCP Server Configuration
  server: {
    host: 'localhost',
    port: 3845,
    protocol: 'http',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
  },

  // Default client information for MCP requests
  client: {
    name: 'rescale-design-system',
    frameworks: ['react', 'typescript', 'styled-components'],
    languages: ['typescript', 'javascript'],
    version: '1.0.0'
  },

  // Output paths for generated files
  paths: {
    tokens: './src/theme/tokens',
    components: './src/components/generated-mcp',
    assets: './src/assets/figma',
    stories: './src/stories/figma-mcp',
    validation: './validation',
    cache: './.mcp-cache'
  },

  // Token extraction settings
  tokens: {
    formats: ['json', 'css', 'js', 'ts', 'scss'],
    organization: {
      colors: {
        byType: true,      // primary, secondary, neutral, etc.
        byBrightness: true // light, medium, dark
      },
      typography: {
        responsive: true,
        includeLineHeight: true
      },
      spacing: {
        generateUtilities: true
      }
    }
  },

  // Asset extraction settings
  assets: {
    optimization: {
      enabled: true,
      svgo: true,
      minify: true
    },
    formats: {
      icons: ['svg', 'react-component'],
      images: ['png', 'webp', 'jpg']
    },
    sizes: {
      default: [1, 2, 3], // 1x, 2x, 3x
      custom: []
    }
  },

  // Real-time sync configuration
  realtime: {
    pollInterval: 2000,     // Check for changes every 2 seconds
    debounceDelay: 500,     // Debounce rapid changes
    hotReload: true,        // Enable hot reload integration
    autoCommit: false,      // Auto-commit changes to git
    buildStorybook: false   // Auto-build Storybook after sync
  },

  // Validation settings
  validation: {
    visual: {
      threshold: 0.1,       // 10% pixel difference threshold
      ignoreAntialiasing: true
    },
    accessibility: {
      standard: 'WCAG21AA',  // WCAG 2.1 AA compliance
      colorContrast: 4.5,    // Minimum contrast ratio
      touchTargets: 44       // Minimum touch target size (px)
    },
    tokens: {
      enforceUsage: true,    // Flag hardcoded values
      unusedTokens: 'warn'   // Warn about unused tokens
    }
  },

  // Template configuration
  templates: {
    component: './templates/mcp-component.tsx.hbs',
    story: './templates/mcp-story.tsx.hbs',
    icon: './templates/mcp-icon.tsx.hbs',
    tokens: './templates/tokens.js.hbs'
  },

  // Error handling and fallbacks
  errorHandling: {
    fallbackToAPI: true,          // Fall back to REST API if MCP fails
    cacheResults: true,           // Cache successful extractions
    cacheTTL: 300000,            // Cache TTL in milliseconds (5 minutes)
    maxRetries: 3,               // Maximum retry attempts
    continueOnError: false       // Continue processing other items on error
  },

  // CI/CD integration
  cicd: {
    enabled: false,
    autoValidate: true,          // Auto-validate on PR
    reportFormat: 'html',        // Validation report format
    notifyOnFailure: true,       // Notify team on validation failure
    allowedFailures: 0           // Number of allowed validation failures
  },

  // Team collaboration
  collaboration: {
    notifications: {
      slack: {
        enabled: false,
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#design-system'
      },
      teams: {
        enabled: false,
        webhook: process.env.TEAMS_WEBHOOK_URL
      }
    },
    approvals: {
      required: false,
      reviewers: [],
      autoMerge: false
    }
  },

  // Performance optimization
  performance: {
    caching: {
      enabled: true,
      strategy: 'lru',      // LRU cache strategy
      maxSize: 100,         // Maximum cached items
      ttl: 300000          // Time to live (5 minutes)
    },
    batching: {
      enabled: true,
      batchSize: 10,        // Maximum requests per batch
      delay: 100           // Delay between batches (ms)
    },
    backgroundProcessing: {
      enabled: false,       // Use web workers for heavy operations
      maxWorkers: 2        // Maximum number of web workers
    }
  },

  // Development settings
  development: {
    debug: process.env.NODE_ENV === 'development',
    verbose: false,
    dryRun: false,          // Don't write files, just show what would be done
    watchMode: false        // Enable file watching
  },

  // Feature flags
  features: {
    realTimeSync: true,
    assetExtraction: true,
    designValidation: true,
    tokenGeneration: true,
    componentGeneration: true,
    storybookSync: true
  }
};