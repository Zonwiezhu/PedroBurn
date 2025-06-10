'use client';
import { useState } from 'react';
import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Token {
  name: string;
  symbol: string;
  address: string;
  amount: string;
  burnAmount: string;
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
      burnAmount: '0',
      decimals: 18,
      native: true
    },
    {
      name: 'Wrapped ETH',
      symbol: 'WETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amount: '2.50',
      burnAmount: '0',
      decimals: 18
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '500.00',
      burnAmount: '0',
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
        ? { ...token, burnAmount: newAmount } 
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

  const getBurnSummary = (amount: string, burnAmount: string) => {
    const amountNum = parseFloat(amount.replace(',', '.'));
    let burnNum = parseFloat(burnAmount.replace(',', '.'));
    
    if (isNaN(burnNum)) burnNum = 0;
    if (burnNum < 0) burnNum = 0;
    
    const actualBurn = Math.min(burnNum, amountNum);
    const remaining = Math.max(0, amountNum - actualBurn);
    
    return {
      display: `${amount} - ${actualBurn.toFixed(2)} = ${remaining.toFixed(2)}`,
      actualBurn: actualBurn.toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-mono selection:bg-white selection:text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <Image
            src="/wallpaper.webp"
            alt="Background texture"
            layout="fill"
            objectFit="cover"
            className="opacity-20 mix-blend-overlay"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-[1500px] mx-auto">
        <section className="flex items-center justify-center py-12 text-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="px-6 max-w-4xl relative z-10"
            >
              <motion.h1
                className="text-4xl md:text-7xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                BURN TOKEN
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
                className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </motion.div>
          </section>

        {!isConnected ? (
          <motion.div 
            className="text-center py-20 bg-black/50 rounded-xl border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl mb-6">Connect your wallet to view tokens</h2>
            <motion.button
              onClick={handleConnect}
              className="px-6 py-3 bg-white hover:bg-white/10 rounded-lg transition-all duration-300 border text-black hover:text-white font-medium text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect Wallet
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-end mb-8">
              <motion.button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-transparent hover:bg-white/10 rounded-lg transition-all duration-300 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Disconnect
              </motion.button>
            </div>

            <motion.div 
              className="bg-black/50 rounded-xl overflow-hidden border border-white/10 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left w-12"></th>
                    <th className="px-6 py-4 text-left">Token</th>
                    <th className="px-6 py-4 text-left">Address</th>
                    <th className="px-6 py-4 text-right">Balance</th>
                    <th className="px-6 py-4 text-right">Burn Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, index) => (
                    <motion.tr 
                      key={token.address} 
                      className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}`}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4">
                        <motion.button
                          onClick={() => toggleTokenSelection(token.address)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                            selectedTokens.includes(token.address) 
                              ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20' 
                              : 'border border-white/30 hover:border-white/50'
                          }`}
                          whileTap={{ scale: 0.9 }}
                        >
                          {selectedTokens.includes(token.address) && (
                            <FiCheck className="text-white" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-white/50 text-sm">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white/50">
                            {token.native ? 'Native' : token.address}
                          </span>
                          {!token.native && (
                            <motion.button 
                              className="text-blue-400 hover:text-blue-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiExternalLink size={14} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {token.amount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <motion.input
                            type="number"
                            value={token.burnAmount}
                            onChange={(e) => updateTokenAmount(token.address, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 w-32 text-right font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                            min="0"
                            max={token.amount}
                            step={1 / (10 ** token.decimals)}
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="flex justify-center mb-8">
              <motion.button
                onClick={handleBurn}
                disabled={selectedTokens.length === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-all relative overflow-hidden ${
                  selectedTokens.length === 0
                    ? 'bg-white/5 text-white/50 cursor-not-allowed border border-white/10'
                    : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg hover:shadow-red-500/30 border border-red-500/50 hover:border-red-500'
                }`}
                whileHover={selectedTokens.length > 0 ? { scale: 1.05 } : {}}
                whileTap={selectedTokens.length > 0 ? { scale: 0.95 } : {}}
              >
                <FaFire className="text-white" />
                Burn Selected Tokens
                {selectedTokens.length > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm font-mono">
                    {selectedTokens.length}
                  </span>
                )}
                {selectedTokens.length > 0 && (
                  <motion.div 
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
                  </motion.div>
                )}
              </motion.button>
            </div>

            {selectedTokens.length > 0 && (
              <motion.div 
                className="mt-6 p-6 bg-black/50 border border-white/10 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold mb-4 text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  Burn Summary
                </h3>
                <ul className="space-y-3">
                  {tokens
                    .filter(token => selectedTokens.includes(token.address))
                    .map(token => {
                      const summary = getBurnSummary(token.amount, token.burnAmount);
                      return (
                        <motion.li 
                          key={token.address} 
                          className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">
                              {token.symbol.charAt(0)}
                            </div>
                            <span>{token.name} ({token.symbol})</span>
                          </div>
                          <span className="font-mono text-orange-400">
                            {summary.display}
                          </span>
                        </motion.li>
                      );
                    })}
                </ul>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TokenBurnPage;