import { eth } from "state/eth"; // Global state: ETH
import { useState } from "react"; // State management
import { token } from "state/token"; // Global state: Tokens
import Layout from "components/Layout"; // Layout wrapper
import styles from "styles/pages/Claim.module.scss"; // Page styles

export default function Claim() {
  // Global ETH state
  const { address, unlock }: { address: string | null; unlock: Function } = eth.useContainer();
  // Global token state
  const { contractErrorMessage, claimAirdrop }: { contractErrorMessage: null | string; claimAirdrop: Function; } = token.useContainer();
  // Local button loading
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  // Project details
  const tokenName: string = process.env.NEXT_PUBLIC_TOKEN_NAME ?? "Token Name";

  /**
   * Claims airdrop with local button loading
   */
  const claimWithLoading = async () => {
    setButtonLoading(true); // Toggle
    await claimAirdrop(); // Claim
    setButtonLoading(false); // Toggle
  };

  return (
    <Layout>
      <div className={styles.claim}>
        {!address ? (
          // Not authenticated
          <div className={styles.card}>
            <h1>You are not authenticated.</h1>
            <p>Please connect with your wallet to check your airdrop.</p>
            <button onClick={() => unlock()}>Connect Wallet</button>
          </div>
        ) : contractErrorMessage ? (
          // Show details about the error
          <div className={styles.card}>
            <h1>Claim failed...</h1>
            <p>{contractErrorMessage}</p>
            <p><a href="https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=0xf6dbd4683e9CE9f894389D3611dB451F1eAcAbc7">Buy {tokenName} on Uniswap.</a></p>
          </div>
        ) : (
          // Claim your airdrop
          <div className={styles.card}>
            <h1>Claim your airdrop.</h1>
            <p>You are eligible for about 1% of the Airdrop supply.</p>
            <button onClick={claimWithLoading} disabled={buttonLoading}>
              {buttonLoading ? "Claiming Airdrop..." : "Claim Airdrop"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
