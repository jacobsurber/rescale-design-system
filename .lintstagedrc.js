module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'npm run test -- --bail --findRelatedTests --passWithNoTests',
  ],
  '*.{json,md,mdx,css,html,yml,yaml}': [
    'prettier --write',
  ],
  '*.{ts,tsx}': [
    'npm run typecheck',
  ],
  // Run accessibility tests when component files change
  'src/components/**/*.{ts,tsx}': [
    'npm run test:accessibility -- --bail --passWithNoTests',
  ],
};