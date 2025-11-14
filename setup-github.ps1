# PowerShell script to set up GitHub repository and Pages
Write-Host "🚀 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "=" * 50

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username is required!" -ForegroundColor Red
    exit 1
}

# Get repository name
$repoName = Read-Host "Enter repository name (default: 3d-data-grid-visualization)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "3d-data-grid-visualization"
}

Write-Host ""
Write-Host "📋 Repository: $username/$repoName" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Please create the repository on GitHub first:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "   2. Repository name: $repoName" -ForegroundColor White
Write-Host "   3. Description: Animated 3D grid visualization with data-related terms" -ForegroundColor White
Write-Host "   4. Choose Public or Private" -ForegroundColor White
Write-Host "   5. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host "   6. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Press Enter when you've created the repository (or 'q' to quit)"
if ($continue -eq 'q') {
    exit 0
}

# Remove existing remote if any
Write-Host ""
Write-Host "🔗 Setting up remote..." -ForegroundColor Cyan
git remote remove origin 2>$null

# Add new remote
git remote add origin "https://github.com/$username/$repoName.git"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remote might already exist or error occurred" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Repository URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next steps to enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://github.com/$username/$repoName/settings/pages" -ForegroundColor White
    Write-Host "   2. Source: Deploy from a branch" -ForegroundColor White
    Write-Host "   3. Branch: main" -ForegroundColor White
    Write-Host "   4. Folder: / (root)" -ForegroundColor White
    Write-Host "   5. Click Save" -ForegroundColor White
    Write-Host ""
    Write-Host "   Your live site will be at:" -ForegroundColor Green
    Write-Host "   https://$username.github.io/$repoName" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Push failed. Make sure:" -ForegroundColor Red
    Write-Host "   1. The repository exists at: https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host "   2. You have push access to the repository" -ForegroundColor White
    Write-Host "   3. Your GitHub credentials are configured" -ForegroundColor White
}

