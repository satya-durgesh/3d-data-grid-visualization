#!/bin/bash

# GitHub Repository Setup Script
# This script helps you create a GitHub repository and push your code

echo "🚀 Setting up GitHub repository..."
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists."
    read -p "Do you want to remove it and set a new one? (y/n): " answer
    if [ "$answer" = "y" ]; then
        git remote remove origin
    else
        echo "Exiting..."
        exit 1
    fi
fi

# Get repository name
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: 3d-data-grid-visualization): " REPO_NAME
REPO_NAME=${REPO_NAME:-3d-data-grid-visualization}

echo ""
echo "📋 Repository details:"
echo "   Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_NAME"
echo ""

read -p "Create repository on GitHub? (y/n): " CREATE_REPO

if [ "$CREATE_REPO" = "y" ]; then
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Animated 3D grid visualization with data-related terms"
    echo "4. Choose Public or Private"
    echo "5. DO NOT initialize with README, .gitignore, or license (we already have them)"
    echo "6. Click 'Create repository'"
    echo ""
    read -p "Press Enter when you've created the repository..."
    
    # Add remote and push
    echo ""
    echo "🔗 Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Success! Your repository is now at:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "🌐 To enable GitHub Pages:"
    echo "   1. Go to Settings > Pages"
    echo "   2. Source: Deploy from a branch"
    echo "   3. Branch: main"
    echo "   4. Folder: / (root)"
    echo "   5. Save"
    echo ""
    echo "   Your site will be available at:"
    echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME"
else
    echo "Skipping GitHub repository creation."
    echo "You can manually add a remote later with:"
    echo "  git remote add origin https://github.com/USERNAME/REPO.git"
    echo "  git push -u origin main"
fi

