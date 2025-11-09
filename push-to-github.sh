#!/bin/bash

# Script to push code to GitHub repository
# Usage: ./push-to-github.sh [YOUR_GITHUB_TOKEN]

set -e

REPO_URL="https://github.com/Ajay252005/BlockChain_Project.git"
REMOTE_NAME="origin"
BRANCH="main"

echo "🚀 Blockchain Project - GitHub Push Script"
echo "=========================================="
echo ""

# Check if token is provided as argument
if [ -n "$1" ]; then
    TOKEN="$1"
    echo "✅ Token provided via command line"
    # Update remote URL with token
    git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
    echo "✅ Remote URL updated with token"
elif [ -n "$GITHUB_TOKEN" ]; then
    TOKEN="$GITHUB_TOKEN"
    echo "✅ Token found in environment variable"
    git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
    echo "✅ Remote URL updated with token"
else
    echo "📝 No token provided. You have two options:"
    echo ""
    echo "OPTION 1: Run with token as argument:"
    echo "  ./push-to-github.sh YOUR_TOKEN_HERE"
    echo ""
    echo "OPTION 2: Set environment variable:"
    echo "  export GITHUB_TOKEN=YOUR_TOKEN_HERE"
    echo "  ./push-to-github.sh"
    echo ""
    echo "OPTION 3: Create token interactively:"
    echo "  1. Visit: https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token (classic)'"
    echo "  3. Name: 'BlockChain Project'"
    echo "  4. Scope: Select 'repo'"
    echo "  5. Generate and copy token"
    echo ""
    read -p "Enter your GitHub Personal Access Token: " TOKEN
    if [ -z "$TOKEN" ]; then
        echo "❌ No token provided. Exiting."
        exit 1
    fi
    git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
fi

echo ""
echo "📦 Checking git status..."
git status --short

echo ""
echo "🔄 Pushing to GitHub..."
if git push -u "$REMOTE_NAME" "$BRANCH"; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo "🌐 View your repository at: $REPO_URL"
    echo ""
    # Reset remote URL to remove token (for security)
    git remote set-url origin "$REPO_URL"
    echo "🔒 Remote URL reset (token removed for security)"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "  1. Token has 'repo' permissions"
    echo "  2. Repository exists and you have access"
    echo "  3. Internet connection is working"
    exit 1
fi

