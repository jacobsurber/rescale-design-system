import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel configuration for better optimization
      babel: {
        plugins: [
          // Add babel plugins for better performance
          ['babel-plugin-styled-components', { displayName: true, ssr: false }],
          // Enable AntD tree shaking - temporarily disabled to fix ConfigProvider issue
          // ['babel-plugin-import', {
          //   libraryName: 'antd',
          //   libraryDirectory: 'es',
          //   style: true,
          // }, 'antd'],
          // Enable AntD icons tree shaking - temporarily disabled to fix icon undefined errors
          // ['babel-plugin-import', {
          //   libraryName: '@ant-design/icons',
          //   libraryDirectory: 'es/icons',
          //   camel2DashComponentName: false,
          // }, 'ant-design-icons'],
        ],
      },
    }),
  ],
  base: '/rescale-design-system/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: true,
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'framer-vendor': ['framer-motion'],
          'query-vendor': ['@tanstack/react-query'],
          'utils-vendor': ['lodash-es', 'date-fns', 'dayjs'],
          // Component chunks
          'components-atoms': [
            './src/components/atoms/Button',
            './src/components/atoms/Card',
            './src/components/atoms/LoadingSpinner',
            './src/components/atoms/Skeleton',
          ],
          'components-rescale': [
            './src/components/rescale/AssistantChat',
            './src/components/rescale/JobStatusIndicator',
            './src/components/rescale/QuickActions',
            './src/components/rescale/ResourceMetrics',
            './src/components/rescale/SoftwareLogoGrid',
            './src/components/rescale/WorkspaceSelector',
          ],
        },
      },
    },
    // Optimize build size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable tree shaking
    target: 'es2020',
  },
  // Development optimizations
  server: {
    // Enable HMR
    hmr: true,
    // Faster file system watching
    watch: {
      usePolling: false,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      '@ant-design/icons',
      'framer-motion',
      '@tanstack/react-query',
      'lodash-es',
      'styled-components',
    ],
    // Force pre-bundling of large dependencies
    force: false,
  },
  // Performance monitoring
  define: {
    __PERFORMANCE_MONITORING__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
})
