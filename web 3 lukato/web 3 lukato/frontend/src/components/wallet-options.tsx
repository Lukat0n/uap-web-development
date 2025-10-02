import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="w-full">
      <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">
        🔗 Conectar Wallet
      </h3>
      <div className="space-y-4">
        {connectors.map((connector) => (
          <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Selecciona tu wallet para comenzar
        </p>
      </div>
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      className={`w-full flex items-center justify-between p-5 border-2 rounded-2xl transition-all duration-200 transform ${
        ready
          ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-400 cursor-pointer hover:scale-105 shadow-md hover:shadow-xl"
          : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
      }`}
      disabled={!ready}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">
          {connector.name === "MetaMask"
            ? "🦊"
            : connector.name === "WalletConnect"
              ? "🔗"
              : connector.name === "Coinbase Wallet"
                ? "🟦"
                : "💼"}
        </div>
        <div className="flex flex-col items-start">
          <span
            className={`font-bold text-lg ${ready ? "text-gray-800" : "text-gray-500"}`}
          >
            {connector.name}
          </span>
          {!ready && (
            <span className="text-sm text-red-600 font-semibold">
              No disponible
            </span>
          )}
        </div>
      </div>
      {ready && (
        <div className="text-indigo-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
