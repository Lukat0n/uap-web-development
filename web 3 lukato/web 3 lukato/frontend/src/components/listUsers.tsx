import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getFaucetInfo, isAuthenticated } from "../services/api";
import { faucetTokenAddress } from "../contracts/faucetToken";

export function FaucetUsers() {
  const { isConnected } = useAccount();
  const [faucetInfo, setFaucetInfo] = useState<{
    totalUsers: number;
    network: string;
    chainId: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFaucetInfo();
  }, []);

  const loadFaucetInfo = async () => {
    setIsLoading(true);
    try {
      const info = await getFaucetInfo();
      setFaucetInfo(info);
    } catch (error) {
      console.error("Error cargando info del faucet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticated = isAuthenticated();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>📊</span> Panel Informativo
        </h3>
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-xs text-gray-600 font-semibold">
              Actualizando...
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Estado de conexión y autenticación */}
        <div
          className={`${
            isConnected && authenticated
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400"
              : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400"
          } border-2 rounded-2xl p-5 shadow-lg`}
        >
          <h4
            className={`${
              isConnected && authenticated ? "text-green-900" : "text-amber-900"
            } font-bold text-lg mb-3 flex items-center gap-2`}
          >
            <span className="text-2xl">
              {isConnected && authenticated ? "✅" : "⚠️"}
            </span>
            {isConnected && authenticated
              ? "Sistema Operativo"
              : "Estado de Conexión"}
          </h4>
          <div className="space-y-2 text-sm font-semibold">
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-700">🔌 Wallet:</span>
              <span
                className={isConnected ? "text-green-700" : "text-amber-700"}
              >
                {isConnected ? "Conectada" : "Desconectada"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
              <span className="text-gray-700">🔐 Autenticación:</span>
              <span
                className={authenticated ? "text-green-700" : "text-amber-700"}
              >
                {authenticated ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas del Faucet */}
        {faucetInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-2xl p-5 shadow-lg">
            <h4 className="text-blue-900 font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">📈</span> Estadísticas de Red
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                <span className="text-blue-700 font-bold">🌐 Red:</span>
                <span className="text-blue-900 font-bold text-base">
                  {faucetInfo.network}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                <span className="text-blue-700 font-bold">🔗 Chain ID:</span>
                <span className="text-blue-900 font-bold text-base">
                  {faucetInfo.chainId}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                <span className="text-blue-700 font-bold">
                  👥 Usuarios Totales:
                </span>
                <span className="text-blue-900 font-extrabold text-lg">
                  {faucetInfo.totalUsers}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Información del contrato */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-400 rounded-2xl p-5 shadow-lg">
          <h4 className="text-indigo-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> Smart Contract
          </h4>
          <div className="space-y-3 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <span className="text-indigo-700 font-bold block mb-2">
                📍 Dirección:
              </span>
              <p className="font-mono text-indigo-900 break-all text-xs bg-white p-2 rounded">
                {faucetTokenAddress}
              </p>
              <a
                href={`https://sepolia.etherscan.io/address/${faucetTokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 underline font-bold text-sm"
              >
                Ver en Etherscan →
              </a>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-2xl p-5 shadow-lg">
          <h4 className="text-purple-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">📖</span> Guía de Uso
          </h4>
          <ol className="text-purple-800 text-sm space-y-2 font-semibold">
            {[
              "Conecta tu wallet preferida (MetaMask recomendado)",
              "Autentica tu identidad firmando un mensaje (gratis)",
              "Presiona el botón 'Reclamar Mis Tokens'",
              "El backend procesará tu solicitud automáticamente",
              "¡Recibe tus tokens y comienza a probar!",
            ].map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-white/50 rounded-lg p-2"
              >
                <span className="text-purple-600 font-bold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Funcionalidades disponibles */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-400 rounded-2xl p-5 shadow-lg">
          <h4 className="text-teal-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">⚡</span> Características
          </h4>
          <ul className="text-teal-800 text-sm space-y-2 font-semibold">
            {[
              "🔐 Autenticación Web3 con SIWE (Sign-In with Ethereum)",
              "⛽ Sin costos de gas - el backend paga por ti",
              "📊 Consulta tu balance y estado en tiempo real",
              "🛡️ Protección con tokens JWT seguros",
              "🎯 Un reclamo por wallet - justo para todos",
            ].map((feature, index) => (
              <li key={index} className="bg-white/50 rounded-lg p-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Enlaces útiles */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-400 rounded-2xl p-5 shadow-lg">
          <h4 className="text-slate-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">🔗</span> Recursos Externos
          </h4>
          <div className="space-y-3 text-sm">
            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/70 hover:bg-white p-3 rounded-xl transition-all transform hover:scale-105 shadow-sm"
            >
              <span className="text-slate-800 font-bold">
                🚰 Faucet de ETH Sepolia
              </span>
              <span className="text-blue-600">→</span>
            </a>
            <a
              href="https://sepolia.etherscan.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/70 hover:bg-white p-3 rounded-xl transition-all transform hover:scale-105 shadow-sm"
            >
              <span className="text-slate-800 font-bold">
                🔍 Explorador Sepolia
              </span>
              <span className="text-blue-600">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
