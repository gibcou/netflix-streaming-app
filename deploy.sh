#!/bin/bash

echo "🚀 Netflix Clone Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building the React application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

echo "📤 Pushing to GitHub repository..."
git add .
git commit -m "Update build for deployment" || echo "No changes to commit"
git push -u origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your authentication."
    echo "💡 Try running: gh auth login"
    exit 1
fi

echo "✅ Code pushed to GitHub successfully!"

echo "🌐 Deploying to GitHub Pages..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ GitHub Pages deployment failed."
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🎉 Your Netflix clone should be available at:"
echo "   https://gibcou.github.io/netflix-streaming-app"
echo ""
echo "⏳ Note: It may take a few minutes for GitHub Pages to update."