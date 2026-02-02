#!/bin/bash
# Deploy frontend to GitHub Pages

# Build the frontend
npm run build

# Add deploy directory to git
git add dist
git commit -m "Deploy frontend to GitHub Pages"

# Push to gh-pages branch
git subtree push --prefix dist origin gh-pages
