# Blockchain Contest Scoring System

A decentralized, transparent, and tamper-proof contest scoring system built on Ethereum blockchain using React, TypeScript, Hardhat, and smart contracts.

## 🚀 Features

### Demo Mode (Fully Functional)
- **Score Submission**: Judges can submit scores for contestants (0-100 range)
- **Real-time Leaderboard**: Automatically updates with rankings, total scores, and averages
- **Contest Management**: Create, lock, unlock, and remove contests
- **Contestant Management**: Add and remove contestants
- **Admin Panel**: Password-protected admin access (demo password: `admin123`)
- **Copy Functionality**: Easy copy-to-clipboard for contestant addresses
- **Beautiful UI**: Pastel gradient background with glassmorphism effects

### Blockchain Features
- Smart contract-based scoring system
- Immutable score records
- Transparent and verifiable results
- Judge management system
- Contest locking mechanism

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet (for blockchain mode)
- Hardhat (for local development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ajay252005/BlockChain_Project.git
   cd BlockChain_Project/score-chain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_CONTRACT_ADDRESS=your_contract_address_here
   ```

## 🎮 Running the Application

### Demo Mode (No Blockchain Required)
Simply start the development server:
```bash
npm run dev
```
The application will run in demo mode by default, allowing you to test all features without connecting to a blockchain.

### Blockchain Mode Setup

1. **Start Hardhat local node**
   ```bash
   npx hardhat node
   ```

2. **Deploy the contract**
   In a new terminal:
   ```bash
   npx hardhat run scripts/deploy.cjs --network localhost
   ```

3. **Update .env file**
   Add the deployed contract address to your `.env` file:
   ```env
   VITE_CONTRACT_ADDRESS=0x...
   ```

4. **Configure MetaMask**
   - Network: Localhost 8545
   - Chain ID: 31337
   - Currency: ETH

5. **Start the app**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
score-chain/
├── contracts/          # Solidity smart contracts
│   └── ContestScoring.sol
├── scripts/           # Deployment scripts
│   └── deploy.cjs
├── src/
│   ├── components/    # React components
│   ├── config/        # Configuration files
│   ├── pages/         # Page components
│   │   └── Index.tsx  # Main application page
│   └── ...
├── hardhat.config.cjs # Hardhat configuration
└── package.json
```

## 🎯 Usage

### Demo Mode
1. Open the application in your browser
2. Navigate to **Judge Panel** to submit scores
3. View rankings in the **Leaderboard** tab
4. Access **Admin Panel** with password: `admin123`

### Key Features
- **Submit Scores**: Enter contest ID, contestant address, and score (0-100)
- **View Leaderboard**: See real-time rankings sorted by total score
- **Manage Contests**: Create, lock, unlock, or remove contests
- **Copy Addresses**: Click the copy icon next to any address
- **Admin Controls**: Full administrative access with password protection

## 🔒 Security Features

- Admin panel password protection
- Contest locking to prevent further score submissions
- Input validation for all forms
- Minimum ID validation (IDs cannot be less than 1)

## 🎨 UI Features

- Modern pastel gradient background
- Glassmorphism card effects
- Responsive design
- Shortened address display with copy functionality
- Real-time score updates
- Medal emojis for top 3 contestants

## 📝 Smart Contract

The `ContestScoring.sol` contract provides:
- Contest creation and management
- Judge assignment
- Score submission with validation
- Contest locking mechanism
- Immutable score records

## 🧪 Testing

```bash
# Run Hardhat tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Ajay Parmar**
- GitHub: [@Ajay252005](https://github.com/Ajay252005)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Uses [Hardhat](https://hardhat.org) for smart contract development
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Blockchain integration with [Wagmi](https://wagmi.sh) and [Viem](https://viem.sh)

---

**Note**: This project includes a fully functional demo mode that works without blockchain connectivity. For production use, deploy the smart contract and configure your environment accordingly.
