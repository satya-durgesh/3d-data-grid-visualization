#!/usr/bin/env python3
"""
GitHub Repository Creation Script
Creates a GitHub repository and pushes the code automatically
"""

import subprocess
import sys
import os

def run_command(cmd):
    """Run a shell command and return the output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def main():
    print("🚀 GitHub Repository Setup")
    print("=" * 50)
    
    # Get GitHub username
    username = input("Enter your GitHub username: ").strip()
    if not username:
        print("❌ Username is required!")
        sys.exit(1)
    
    # Get repository name
    repo_name = input("Enter repository name (default: 3d-data-grid-visualization): ").strip()
    if not repo_name:
        repo_name = "3d-data-grid-visualization"
    
    print(f"\n📋 Repository: {username}/{repo_name}")
    print("\n⚠️  To create the repository automatically, you need a GitHub Personal Access Token.")
    print("   Get one at: https://github.com/settings/tokens")
    print("   Required scope: 'repo'")
    
    use_token = input("\nDo you have a token? (y/n): ").strip().lower()
    
    if use_token == 'y':
        token = input("Enter your GitHub token: ").strip()
        if token:
            # Create repo using GitHub API
            import json
            import urllib.request
            import urllib.error
            
            url = "https://api.github.com/user/repos"
            data = {
                "name": repo_name,
                "description": "Animated 3D grid visualization with data-related terms in checkerboard pattern",
                "private": False,
                "auto_init": False
            }
            
            req = urllib.request.Request(url)
            req.add_header('Authorization', f'token {token}')
            req.add_header('Content-Type', 'application/json')
            
            try:
                with urllib.request.urlopen(req, data=json.dumps(data).encode()) as response:
                    print("✅ Repository created successfully!")
            except urllib.error.HTTPError as e:
                if e.code == 401:
                    print("❌ Invalid token. Please check your token.")
                elif e.code == 422:
                    print("⚠️  Repository might already exist. Continuing...")
                else:
                    print(f"❌ Error: {e.code} - {e.read().decode()}")
            except Exception as e:
                print(f"❌ Error: {e}")
    
    # Add remote and push
    print("\n🔗 Setting up remote...")
    remote_url = f"https://github.com/{username}/{repo_name}.git"
    
    # Remove existing remote if any
    run_command("git remote remove origin 2>/dev/null")
    
    # Add new remote
    stdout, stderr, code = run_command(f"git remote add origin {remote_url}")
    if code != 0 and "already exists" not in stderr:
        print(f"⚠️  {stderr}")
    else:
        print("✅ Remote added")
    
    # Push to GitHub
    print("\n📤 Pushing to GitHub...")
    stdout, stderr, code = run_command("git push -u origin main")
    
    if code == 0:
        print("✅ Code pushed successfully!")
        print(f"\n🌐 Repository URL: https://github.com/{username}/{repo_name}")
        print("\n📝 Next steps:")
        print("   1. Go to Settings > Pages")
        print("   2. Source: Deploy from a branch")
        print("   3. Branch: main, Folder: / (root)")
        print("   4. Your site will be at: https://{username}.github.io/{repo_name}")
    else:
        print(f"⚠️  Push failed: {stderr}")
        print("\n💡 Manual steps:")
        print(f"   1. Create repo at: https://github.com/new")
        print(f"   2. Then run: git push -u origin main")

if __name__ == "__main__":
    main()

