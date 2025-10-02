import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import {
  claimTokens,
  getFaucetStatus,
  requestSignInMessage,
  signIn,
  isAuthenticated,
  signOut,
  formatBalance,
} from "../services/api";

export function ClaimButton() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [balance, setBalance] = useState("0");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar autenticación al montar y cuando cambia la dirección
  useEffect(() => {
    setAuthenticated(isAuthenticated());

    if (address && isAuthenticated()) {
      loadFaucetStatus();
    } else {
      setHasClaimed(false);
      setBalance("0");
    }
  }, [address]);

  const loadFaucetStatus = async () => {
    if (!address) return;

    setIsLoadingStatus(true);
    setError(null);

    try {
      const status = await getFaucetStatus(address);
      setHasClaimed(status.hasClaimed);
      setBalance(status.balance);
    } catch (err: any) {
      console.error("Error cargando estado:", err);

      if (
        err.message?.includes("Token") ||
        err.message?.includes("autenticación")
      ) {
        signOut();
        setAuthenticated(false);
      }
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleAuthenticate = async () => {
    if (!address) return;

    setIsAuthenticating(true);
    setError(null);

    try {
      // 1. Solicitar mensaje SIWE al backend
      const { message } = await requestSignInMessage(address);

      // 2. Firmar el mensaje con la wallet
      const signature = await signMessageAsync({ message });

      // 3. Enviar firma al backend y obtener JWT
      const response = await signIn(message, signature);

      setAuthenticated(true);
      setSuccess(
        `✅ Autenticado como ${response.address.slice(0, 6)}...${response.address.slice(-4)}`
      );

      // 4. Cargar estado del faucet
      await loadFaucetStatus();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error en autenticación:", err);
      setError(err.message || "Error al autenticar");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    setError(null);
    setTxHash(null);

    try {
      const response = await claimTokens();

      setTxHash(response.txHash);
      setSuccess("✅ Tokens reclamados con éxito!");

      // Actualizar estado después de reclamar
      setTimeout(() => {
        loadFaucetStatus();
      }, 2000);
    } catch (err: any) {
      console.error("Error reclamando tokens:", err);
      setError(err.message || "Error al reclamar tokens");

      // Si hay error de autenticación, limpiar sesión
      if (
        err.message?.includes("Token") ||
        err.message?.includes("autenticación")
      ) {
        signOut();
        setAuthenticated(false);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setAuthenticated(false);
    setHasClaimed(false);
    setBalance("0");
    setSuccess("Sesión cerrada");
    setTimeout(() => setSuccess(null), 2000);
  };

  // No conectado
  if (!isConnected || !address) {
    return (
      <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-3xl">⚠️</span>
          <p className="text-amber-800 font-bold text-lg">
            Conecta tu wallet para continuar
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="space-y-5">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-md">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">🔐</span>
            <div>
              <p className="text-blue-900 font-bold text-lg mb-2">
                Autenticación Requerida
              </p>
              <p className="text-blue-700 text-sm">
                Firma un mensaje con tu wallet para verificar tu identidad (sin
                costo de gas)
              </p>
            </div>
          </div>
        </div>

        <button
          disabled={isAuthenticating}
          onClick={handleAuthenticate}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-2xl transition-all duration-200 shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
        >
          <span className="text-xl">🔑</span>
          <span>
            {isAuthenticating ? "Autenticando..." : "Firmar para Autenticar"}
          </span>
        </button>

        {error && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl shadow-md">
            <div className="flex items-center space-x-2">
              <span className="text-xl">❌</span>
              <p className="text-red-800 text-sm font-semibold">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Autenticado - Verificando estado
  if (isLoadingStatus) {
    return (
      <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-300 rounded-2xl shadow-md">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <p className="text-gray-700 font-semibold">Verificando estado...</p>
        </div>
      </div>
    );
  }

  // Ya reclamó tokens
  if (hasClaimed) {
    return (
      <div className="space-y-5">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">✅</span>
            <p className="text-green-900 font-bold text-xl">
              Tokens ya Reclamados
            </p>
          </div>
          {balance !== "0" && (
            <div className="bg-white/50 rounded-xl p-3 mt-3">
              <p className="text-green-800 text-sm font-semibold">
                💰 Tu Balance:{" "}
                <span className="text-lg">{formatBalance(balance)} tokens</span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    );
  }

  // Puede reclamar
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border-2 border-indigo-200">
        <div className="text-sm text-indigo-800 font-semibold flex items-center space-x-2">
          <span>🔓</span>
          <span>
            Autenticado: {address.slice(0, 8)}...{address.slice(-6)}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
        >
          Cerrar sesión
        </button>
      </div>

      <button
        disabled={isClaiming}
        onClick={handleClaim}
        className="w-full py-5 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl transition-all duration-200 shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
      >
        <span className="text-2xl">🎁</span>
        <span>{isClaiming ? "Procesando..." : "Reclamar Mis Tokens"}</span>
      </button>

      {txHash && (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl shadow-md">
          <p className="text-blue-900 text-sm font-bold mb-2 flex items-center space-x-2">
            <span>📝</span>
            <span>Transacción Confirmada:</span>
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs break-all underline font-mono bg-white/50 p-2 rounded-lg block"
          >
            {txHash}
          </a>
        </div>
      )}

      {success && (
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✅</span>
            <p className="text-green-900 font-bold">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-xl">❌</span>
            <p className="text-red-800 text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
