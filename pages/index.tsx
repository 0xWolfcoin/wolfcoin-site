import Image from "next/image"; // Images
import { eth } from "state/eth"; // State container
import Layout from "components/Layout"; // Layout wrapper
import { useRouter } from "next/router"; // Routing
import styles from "styles/pages/Home.module.scss"; // Page styles

// Setup project details
const tokenName: string = process.env.NEXT_PUBLIC_TOKEN_NAME ?? "Token Name";
const heading: string = process.env.NEXT_PUBLIC_HEADING ?? "Some heading";

export default function Home() {
  // Routing
  const { push } = useRouter();
  // Global state
  const { address, unlock }: { address: string | null; unlock: Function } = eth.useContainer();

  return (
    <Layout>
      <div className={styles.home}>
        {/* Project logo */}
        <div>
          <Image src="/logo.png" alt="Logo" width={250} height={250} priority />
        </div>

        {/* Project introduction article, if it exists */}
        {process.env.NEXT_PUBLIC_ARTICLE ? (
          <a
            href={process.env.NEXT_PUBLIC_ARTICLE}
            target="_blank"
            rel="noopener noreferrer"
          >
            Introducing {tokenName}{" "}
            <Image src="/icons/arrow.svg" alt="Arrow" height={12} width={12} />
          </a>
        ) : null}

        {/* Project heading */}
        <h1>{heading} Airdrop</h1>

        {/* Project description */}
        <p>In a dog eat dog world, be a Wolf. Read our <a
            href={process.env.NEXT_PUBLIC_ARTICLE}
            target="_blank"
            rel="noopener noreferrer">
           Mission on Mirror.
          </a> Claim the Airdrop.
        </p>

        {/* Claim button */}
        {!address ? (
          <button onClick={() => unlock()}>
            Connect your Wallet to Claim Tokens
          </button>
        ) : (
          // Else, reroute to /claim
          <button onClick={() => push("/claim")}>Claim Tokens</button>
        )}
      </div>
    </Layout>
  );
}
