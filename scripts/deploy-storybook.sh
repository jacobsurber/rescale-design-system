#!/bin/bash

# Deploy Storybook to GitHub Pages
# This script builds Storybook and deploys it to the gh-pages branch

echo "🚀 Deploying Storybook to GitHub Pages..."

# Build Storybook
echo "📦 Building Storybook..."
npm run build:storybook

# Deploy to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d storybook-static --message "Deploy Storybook $(date '+%Y-%m-%d %H:%M:%S')"

echo "✅ Deployment complete!"
echo "🔗 Your Storybook will be available at: https://jacobsurber.github.io/rescale-design-system/"
echo "⏳ Note: It may take a few minutes for changes to appear on GitHub Pages"