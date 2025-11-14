#!/bin/bash
# Quick script to push to GitHub after creating the repo

echo "📤 Pushing to GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Ritesh261/3d-data-grid-visualization.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code is on GitHub!"
    echo "🌐 Repository: https://github.com/Ritesh261/3d-data-grid-visualization"
    echo ""
    echo "📝 To enable GitHub Pages:"
    echo "   1. Go to: https://github.com/Ritesh261/3d-data-grid-visualization/settings/pages"
    echo "   2. Source: Deploy from a branch"
    echo "   3. Branch: main, Folder: / (root)"
    echo "   4. Save"
    echo ""
    echo "   Your live site will be at:"
    echo "   https://Ritesh261.github.io/3d-data-grid-visualization"
else
    echo ""
    echo "⚠️  Make sure you've created the repository at:"
    echo "   https://github.com/new"
    echo "   Name: 3d-data-grid-visualization"
fi

