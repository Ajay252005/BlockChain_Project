const hre = require("hardhat");

async function main() {
  console.log("Deploying ContestScoring contract...");

  const ContestScoring = await hre.ethers.getContractFactory("ContestScoring");
  const contestScoring = await ContestScoring.deploy();

  await contestScoring.waitForDeployment();

  const address = await contestScoring.getAddress();
  console.log("ContestScoring deployed to:", address);
  console.log("\nAdd this address to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
