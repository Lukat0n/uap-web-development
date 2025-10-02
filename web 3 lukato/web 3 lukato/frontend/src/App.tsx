import { useAccount, WagmiProvider } from "wagmi";
import { config } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Account } from "./components/account";
import { WalletOptions } from "./components/wallet-options";
import { ClaimButton } from "./components/ClaimTokens";
import { FaucetUsers } from "./components/listUsers";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-4 mb-10">
              <h1 className="text-6xl font-extrabold text-white drop-shadow-2xl tracking-tight">
                🪙 CryptoFaucet
              </h1>
              <p className="text-2xl text-white/95 drop-shadow-lg font-medium">
                Distribuidor de Tokens de Prueba - Red Sepolia
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <p className="text-white/90 text-sm font-semibold">
                  ⚡ Rápido • 🔒 Seguro • 🆓 Gratuito
                </p>
              </div>
            </div>

            {/* Wallet Connection Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 p-8 transform transition-all hover:scale-[1.02]">
              <ConnectWallet />
            </div>

            {/* Claim Tokens Card */}
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 p-8 transform transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reclamar Tokens
                </h3>
              </div>
              <ClaimButton />
            </div>

            {/* Users List Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 p-8 transform transition-all hover:scale-[1.02]">
              <FaucetUsers />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
