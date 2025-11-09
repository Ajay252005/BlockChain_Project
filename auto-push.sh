#!/bin/bash

# Auto-push script that attempts multiple authentication methods

REPO="https://github.com/Ajay252005/BlockChain_Project.git"
BRANCH="main"

echo "🔍 Attempting to push to GitHub..."
echo ""

# Method 1: Try direct push (might work if credentials are cached)
echo "📤 Attempt 1: Direct push..."
if git push -u origin $BRANCH 2>&1 | grep -q "success\|pushed\|up to date"; then
    echo "✅ Successfully pushed!"
    exit 0
fi

# Method 2: Check for token in environment
if [ -n "$GITHUB_TOKEN" ]; then
    echo "📤 Attempt 2: Using GITHUB_TOKEN environment variable..."
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
    if git push -u origin $BRANCH 2>&1 | grep -q "success\|pushed"; then
        echo "✅ Successfully pushed using GITHUB_TOKEN!"
        git remote set-url origin "$REPO"
        exit 0
    fi
fi

# Method 3: Try to get token from keychain
echo "📤 Attempt 3: Checking for stored credentials..."
TOKEN=$(security find-generic-password -a "github_token" -w 2>/dev/null)
if [ -n "$TOKEN" ]; then
    git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
    if git push -u origin $BRANCH 2>&1 | grep -q "success\|pushed"; then
        echo "✅ Successfully pushed using stored token!"
        git remote set-url origin "$REPO"
        exit 0
    fi
fi

# Method 4: Interactive token input
echo ""
echo "❌ Automatic push failed. Authentication required."
echo ""
echo "Please provide your GitHub Personal Access Token:"
echo "1. Get token from: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select 'repo' scope"
echo ""
read -sp "Enter token: " TOKEN
echo ""

if [ -n "$TOKEN" ]; then
    git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"
    if git push -u origin $BRANCH; then
        echo "✅ Successfully pushed!"
        git remote set-url origin "$REPO"
        exit 0
    else
        echo "❌ Push failed. Please check your token has 'repo' permissions."
        exit 1
    fi
else
    echo "❌ No token provided. Exiting."
    exit 1
fi

