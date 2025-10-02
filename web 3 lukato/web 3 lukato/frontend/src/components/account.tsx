import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
  useReadContracts,
} from "wagmi";
import { faucetTokenAddress, faucetTokenAbi } from "../contracts/faucetToken";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const { data: contracts } = useReadContracts({
    contracts: [
      {
        address: faucetTokenAddress,
        abi: faucetTokenAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: faucetTokenAddress,
        abi: faucetTokenAbi,
        functionName: "getFaucetAmount",
      },
      {
        address: faucetTokenAddress,
        abi: faucetTokenAbi,
        functionName: "hasAddressClaimed",
        args: address ? [address] : undefined,
      },
    ],
  });

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-6">
        {/* Avatar Section */}
        <div className="relative group">
          {ensAvatar ? (
            <img
              alt="ENS Avatar"
              src={ensAvatar}
              className="w-24 h-24 rounded-2xl border-4 border-purple-300 shadow-xl object-cover transform transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-105">
              <span className="text-3xl text-white font-bold">
                {ensName ? ensName[0].toUpperCase() : "🎭"}
              </span>
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Account Info */}
        <div className="text-center space-y-3 w-full">
          {ensName && (
            <h3 className="text-2xl font-bold text-gray-800">{ensName}</h3>
          )}
          {address && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-200 shadow-sm">
              <p className="text-xs text-indigo-600 font-semibold mb-2 uppercase tracking-wide">
                📍 Dirección Wallet
              </p>
              <p className="text-sm font-mono text-gray-800 font-semibold break-all">
                {`${address.slice(0, 8)}...${address.slice(-6)}`}
              </p>
            </div>
          )}
        </div>
        {/* Balance Info */}
        {balance && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200 w-full text-center shadow-sm">
            <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
              💰 Balance ETH
            </p>
            <p className="text-lg font-mono text-gray-800 font-bold">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}

        {/* Faucet Token Info */}
        <div className="w-full space-y-4">
          {contracts?.[0] && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-300 w-full text-center shadow-md transform transition-transform hover:scale-105">
              <p className="text-xs text-emerald-700 font-bold mb-2 uppercase tracking-wide">
                🪙 Tokens Disponibles
              </p>
              <p className="text-2xl font-mono text-emerald-800 font-extrabold">
                {contracts[0].result
                  ? (Number(contracts[0].result) / 1e18).toFixed(2) + " FT"
                  : "0 FT"}
              </p>
            </div>
          )}

          {contracts?.[1] && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300 w-full text-center shadow-md transform transition-transform hover:scale-105">
              <p className="text-xs text-amber-700 font-bold mb-2 uppercase tracking-wide">
                🎁 Cantidad por Reclamo
              </p>
              <p className="text-2xl font-mono text-amber-800 font-extrabold">
                {contracts[1].result
                  ? (Number(contracts[1].result) / 1e18).toFixed(2) + " FT"
                  : "0 FT"}
              </p>
            </div>
          )}

          {contracts?.[2] !== undefined && (
            <div
              className={`rounded-2xl p-4 border-2 w-full text-center shadow-md transform transition-all hover:scale-105 ${
                contracts[2].result
                  ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                  : "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-300"
              }`}
            >
              <p
                className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                  contracts[2].result ? "text-red-700" : "text-violet-700"
                }`}
              >
                🎯 Estado de Reclamo
              </p>
              <p
                className={`text-lg font-extrabold ${
                  contracts[2].result ? "text-red-800" : "text-violet-800"
                }`}
              >
                {contracts[2].result
                  ? "✅ Ya Reclamado"
                  : "🚀 Listo para Reclamar"}
              </p>
            </div>
          )}
        </div>

        {/* Contract Info */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border-2 border-slate-300 w-full shadow-sm">
          <p className="text-xs text-slate-600 font-bold mb-3 text-center uppercase tracking-wide">
            📜 Smart Contract
          </p>
          <p className="text-xs font-mono text-slate-700 text-center break-all bg-white/50 p-2 rounded-lg">
            {faucetTokenAddress}
          </p>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={() => disconnect()}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl transform hover:scale-105 active:scale-95"
        >
          <span className="text-xl">🚪</span>
          <span>Desconectar Wallet</span>
        </button>
      </div>
    </div>
  );
}
