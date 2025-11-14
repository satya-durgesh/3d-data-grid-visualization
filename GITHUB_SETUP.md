# GitHub Repository Setup Guide

## Quick Setup (Automated)

Run the setup script:
```bash
./setup-github.sh
```

## Manual Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `3d-data-grid-visualization` (or your preferred name)
3. Description: `Animated 3D grid visualization with data-related terms in checkerboard pattern`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have them)
6. Click **Create repository**

### Step 2: Connect Local Repository to GitHub

```bash
# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/3d-data-grid-visualization.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**

Your site will be available at:
```
https://USERNAME.github.io/3d-data-grid-visualization
```

## Alternative: Deploy to Vercel/Netlify

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow the prompts

## Testing Locally

Before deploying, test locally:
```bash
npm start
```

Visit: http://localhost:3000

