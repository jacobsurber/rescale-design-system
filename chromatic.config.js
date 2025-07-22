module.exports = {
  // Project token will be set via environment variable
  // Set CHROMATIC_PROJECT_TOKEN in your environment or CI/CD pipeline
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,

  // Build Storybook in this directory
  buildScriptName: 'build:storybook',
  storybookBuildDir: 'storybook-static',

  // Auto-accept changes on main branch
  autoAcceptChanges: 'main',

  // Only run Chromatic on specific branches to save snapshots
  onlyChanged: true,
  untraced: ['package-lock.json', 'yarn.lock', '.env*'],

  // Configure which files trigger visual regression tests
  externals: ['public/**'],

  // Skip Chromatic on dependency-only changes
  skip: 'dependabot/**',

  // Ignore specific stories or components
  ignore: [
    'src/**/*.test.stories.tsx',
    'src/**/*.dev.stories.tsx',
  ],

  // Configure viewport sizes for responsive testing
  modes: {
    desktop: {
      viewport: 'desktop',
      colorScheme: 'light',
    },
    mobile: {
      viewport: 'mobile',
      colorScheme: 'light',
    },
    'desktop-dark': {
      viewport: 'desktop',
      colorScheme: 'dark',
    },
    'mobile-dark': {
      viewport: 'mobile',
      colorScheme: 'dark',
    },
  },

  // Threshold for acceptable visual changes (percentage)
  threshold: 0.2,

  // Delay before taking screenshots (milliseconds)
  delay: 500,

  // Configure how long to wait for fonts and images to load
  pauseAnimationAtEnd: true,
  
  // Exit with error code if there are visual changes
  exitZeroOnChanges: false,
  exitOnceUploaded: true,

  // Configure file matching for stories
  zip: true,

  // Debug options
  diagnostics: false,
  debug: false,

  // Configure how many parallel uploads
  uploadConcurrency: 10,

  // Configure Storybook configuration
  storybookConfigDir: '.storybook',
  
  // Cypress integration (if using Cypress for interaction testing)
  cypress: false,
  
  // Configure which branches should auto-accept
  branchName: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME,
  
  // Configure repository information for better integration
  repositorySlug: process.env.GITHUB_REPOSITORY,
};