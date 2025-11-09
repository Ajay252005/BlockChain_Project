# 🚀 Quick Push Guide

## Easiest Way to Push (3 Steps)

### Step 1: Get Your GitHub Token
1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `BlockChain Project`
4. Select scope: **`repo`** (check the box)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Run the Push Script
Open terminal in the project folder and run:

```bash
cd "/Users/ajayparmar/BlockChain Project/score-chain"
./push-to-github.sh YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

### Step 3: Done! ✅
Your code will be pushed to: https://github.com/Ajay252005/BlockChain_Project

---

## Alternative: Manual Push

If you prefer to do it manually:

```bash
cd "/Users/ajayparmar/BlockChain Project/score-chain"

# Set remote with your token
git remote set-url origin https://YOUR_TOKEN@github.com/Ajay252005/BlockChain_Project.git

# Push
git push -u origin main
```

---

## What's Ready to Push?

✅ 3 commits with all your code:
- Complete Blockchain Contest Scoring System with Demo Mode
- Updated .gitignore and comprehensive README
- Removed .env from repository

✅ All files included:
- Source code
- Smart contracts
- Configuration
- Documentation

---

## Need Help?

The push script (`push-to-github.sh`) will guide you through the process interactively if you run it without arguments.

