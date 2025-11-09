#!/bin/bash
# Quick push - just needs your token

echo "🚀 Quick Push to GitHub"
echo "======================"
echo ""
echo "Your commits ready to push:"
git log --oneline -4
echo ""
echo "📝 To push, you need a GitHub Personal Access Token"
echo "   Get one from: https://github.com/settings/tokens"
echo ""
read -sp "Paste your token here: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

git remote set-url origin "https://${TOKEN}@github.com/Ajay252005/BlockChain_Project.git"

if git push -u origin main; then
    echo ""
    echo "✅ SUCCESS! All code pushed to GitHub!"
    echo "🌐 Repository: https://github.com/Ajay252005/BlockChain_Project"
    git remote set-url origin "https://github.com/Ajay252005/BlockChain_Project.git"
else
    echo ""
    echo "❌ Failed. Check your token has 'repo' permissions"
    exit 1
fi
