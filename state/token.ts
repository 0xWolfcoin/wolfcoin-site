import { eth } from "state/eth"; // ETH state provider
import { ethers } from "ethers"; // Ethers
import { useState } from "react"; // React
import { createContainer } from "unstated-next"; // State management
import { ContractError } from '../types/ContractError'

function useToken() {
  // Collect global ETH state
  const {
    address,
    provider,
  }: {
    address: string | null;
    provider: ethers.providers.Web3Provider | null;
  } = eth.useContainer();

  // Local state
  const [contractErrorMessage, setContractErrorMessage] = useState<null | string>(null); // Data retrieval status

  /**
   * Get contract
   * @returns {ethers.Contract} signer-initialized contract
   */
  const getContract = (): ethers.Contract => {
    return new ethers.Contract(
      // Contract address
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "",
      [
        // claimAirdrop function mapping
        "function claimAirdrop() public returns (uint256)",
      ],
      // Get signer from authed provider
      provider?.getSigner()
    );
  };

  const claimAirdrop = async (): Promise<void> => {
    // If not authenticated throw
    if (!address) {
      throw new Error("Not Authenticated");
    }

    // Collect token contract
    const token: ethers.Contract = getContract();

    // Try to claim airdrop and refresh sync status
    try {
      const tx = await token.claimAirdrop();
      await tx.wait(1);
    } catch (error) {
      console.error(`Error when claiming tokens: ${JSON.stringify(error)}`);
      const startOfMsg = "execution reverted: Wolfcoin:"
      const contractError = error as ContractError
      switch (contractError.reason) {
        case (`${startOfMsg} Claim is inactive.`): {
          setContractErrorMessage("The Airdrop is over.");
          break
        }
        case (`${startOfMsg} Airdrop supply gone.`): {
          setContractErrorMessage("The Airdrop supply has been completely claimed.");
          break
        }
        case (`${startOfMsg} Balance too low.`): {
          setContractErrorMessage("Your wallet balance is too low. You need at least 0.25 ETH in your wallet.");
          break
        }
        case (`${startOfMsg} Already claimed.`): {
          setContractErrorMessage("You have already claimed your slice of the Airdrop.");
          break
        }
      }
    }
  };

  return {
    contractErrorMessage,
    claimAirdrop,
  };
}

// Create unstated-next container
export const token = createContainer(useToken);
