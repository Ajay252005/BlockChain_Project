# Blockchain Contest Scoring System - Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Hardhat and dependencies:**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
   ```

3. **Install Wagmi and Web3 dependencies:**
   ```bash
   npm install wagmi viem@2.x @tanstack/react-query
   ```

## Running the Project

### Step 1: Start Hardhat Local Node

In a terminal, start the local Hardhat network:

```bash
npx hardhat node
```

This will:
- Start a local blockchain on `http://127.0.0.1:8545`
- Provide you with test accounts and private keys
- Keep running in the background (keep this terminal open)

### Step 2: Deploy the Smart Contract

In a **new terminal**, deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will output the deployed contract address. Example:
```
ContestScoring deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 3: Configure the Frontend

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your contract address:
```
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 4: Configure MetaMask

1. Open MetaMask
2. Add a new network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

3. Import a test account from Hardhat:
   - Copy a private key from the Hardhat node terminal
   - In MetaMask: Import Account → Enter Private Key
   - Use the first account as the owner/admin

### Step 5: Start the Frontend

In a **third terminal**, start the Vite dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Using the Application

### As Admin (Contract Owner)

1. **Connect Wallet**: Connect the MetaMask account you used to deploy the contract
2. **Go to Admin Panel** tab
3. **Create a Contest**: Enter a name and create
4. **Add Judges**: Enter contest ID and judge addresses
5. **Add Contestants**: Enter contest ID and contestant addresses
6. **Lock Contest** (optional): Prevent further scoring

### As Judge

1. **Connect Wallet**: Connect a MetaMask account that was added as a judge
2. **Go to Judge Panel** tab
3. **Submit Scores**:
   - Enter the Contest ID
   - Enter the Contestant Address
   - Enter a score (0-100)
   - Click Submit

### View Leaderboard

1. **Go to Leaderboard** tab
2. **Enter Contest ID**
3. View real-time rankings sorted by total score

## Smart Contract Features

- **Owner-only functions**: Create contests, add judges/contestants, lock contests
- **Judge functions**: Submit scores (0-100, once per contestant)
- **Public view functions**: Get leaderboard, contest details
- **Events**: All actions emit events for transparency
- **OpenZeppelin**: Uses Ownable for access control

## Troubleshooting

### "Contract not deployed" error
- Make sure Hardhat node is running
- Redeploy the contract
- Update the contract address in `.env`
- Restart the frontend

### "User rejected transaction"
- Make sure you're connected to Hardhat Local network in MetaMask
- Check that you have sufficient ETH (test accounts have 10000 ETH)

### "Not a judge" error
- Verify the address was added as a judge by the owner
- Check you're connected with the correct MetaMask account
- Verify the contest ID is correct

### Network connection issues
- Ensure Hardhat node is running on port 8545
- Check MetaMask is connected to the right network
- Try restarting Hardhat node

## Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests (if you create them)
npx hardhat test

# Clean artifacts
npx hardhat clean

# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## Project Structure

```
├── contracts/
│   └── ContestScoring.sol       # Main smart contract
├── scripts/
│   └── deploy.js                # Deployment script
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx       # Admin interface
│   │   ├── JudgePanel.tsx       # Judge scoring interface
│   │   ├── Leaderboard.tsx      # Leaderboard display
│   │   └── WalletConnect.tsx    # Wallet connection
│   ├── config/
│   │   ├── contract.ts          # Contract ABI and address
│   │   └── wagmi.ts             # Wagmi configuration
│   └── pages/
│       └── Index.tsx            # Main app page
├── hardhat.config.js            # Hardhat configuration
└── .env                         # Environment variables
```

## Notes

- The local Hardhat network resets when you restart it
- You'll need to redeploy and update the contract address each time
- Test accounts have 10000 ETH each for testing
- All transactions are instant on the local network
- Smart contract events can be viewed in the Hardhat node terminal
