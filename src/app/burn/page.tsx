'use client';
import { useState } from 'react';
import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

interface Token {
  name: string;
  symbol: string;
  address: string;
  amount: string;
  decimals: number;
  native?: boolean;
}

const TokenBurnPage = () => {
  const [tokens, setTokens] = useState<Token[]>([
    {
      name: 'PEDRO',
      symbol: 'PEDRO',
      address: '0x123...456',
      amount: '1000.00',
      decimals: 18,
      native: true
    },
    {
      name: 'Wrapped ETH',
      symbol: 'WETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amount: '2.50',
      decimals: 18
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '500.00',
      decimals: 6
    }
  ]);

  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const toggleTokenSelection = (tokenAddress: string) => {
    setSelectedTokens(prev => 
      prev.includes(tokenAddress) 
        ? prev.filter(addr => addr !== tokenAddress) 
        : [...prev, tokenAddress]
    );
  };

  const updateTokenAmount = (tokenAddress: string, newAmount: string) => {
    setTokens(prev => prev.map(token => 
      token.address === tokenAddress 
        ? { ...token, amount: newAmount } 
        : token
    ));
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedTokens([]);
  };

  const handleBurn = () => {
    alert(`UI Mock: Burning ${selectedTokens.length} selected tokens`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Token Burn Portal</h1>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl">
            <h2 className="text-2xl mb-4">Connect your wallet to view tokens</h2>
            <button
              onClick={handleConnect}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-6">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left w-12"></th>
                    <th className="px-6 py-4 text-left">Token</th>
                    <th className="px-6 py-4 text-left">Address</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Burn Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, index) => (
                    <tr 
                      key={token.address} 
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleTokenSelection(token.address)}
                          className={`w-6 h-6 rounded flex items-center justify-center ${
                            selectedTokens.includes(token.address) 
                              ? 'bg-green-500' 
                              : 'border border-gray-500'
                          }`}
                        >
                          {selectedTokens.includes(token.address) && (
                            <FiCheck className="text-white" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-gray-400 text-sm">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">
                            {token.native ? 'Native' : token.address}
                          </span>
                          {!token.native && (
                            <button className="text-blue-400 hover:text-blue-300">
                              <FiExternalLink size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {token.amount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <input
                            type="number"
                            value={token.amount}
                            onChange={(e) => updateTokenAmount(token.address, e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 w-32 text-right"
                            min="0"
                            max={token.amount}
                            step={1 / (10 ** token.decimals)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleBurn}
                disabled={selectedTokens.length === 0}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all ${
                  selectedTokens.length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg hover:shadow-red-500/20'
                }`}
              >
                <FaFire />
                Burn Selected Tokens
                {selectedTokens.length > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                    {selectedTokens.length}
                  </span>
                )}
              </button>
            </div>

            {selectedTokens.length > 0 && (
              <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="font-bold mb-2">Burn Summary</h3>
                <ul className="space-y-2">
                  {tokens
                    .filter(token => selectedTokens.includes(token.address))
                    .map(token => (
                      <li key={token.address} className="flex justify-between">
                        <span>{token.name} ({token.symbol})</span>
                        <span className="font-mono">{token.amount} → 0</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TokenBurnPage;