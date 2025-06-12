'use client';
import { useState, useEffect } from 'react';
import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaFire, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

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
      name: 'Random Shit Token',
      symbol: 'SHIT',
      address: '0x789...012',
      amount: '500000.00',
      burnAmount: '0',
      decimals: 18
    },
    {
      name: 'Another Useless Token',
      symbol: 'USELESS',
      address: '0x345...678',
      amount: '25000.00',
      burnAmount: '0',
      decimals: 18
    }
  ]);

  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWalletType, setActiveWalletType] = useState<"keplr" | "leap" | null>(null);
  const [currentPedroImage, setCurrentPedroImage] = useState(1);
  const [useAlternateWallpaper, setUseAlternateWallpaper] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        setCurrentPedroImage(prev => (prev % 24) + 1);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const connectWallet = async (walletType: "keplr" | "leap") => {
      setActiveWalletType(walletType);
      setIsLoading(true);
      
      try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setIsConnected(true);
      } finally {
          setIsLoading(false);
          setActiveWalletType(null);
      }
  };

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

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedTokens([]);
  };

  const handleBurn = () => {
    alert(`UI Mock: Burning ${selectedTokens.length} selected tokens`);
  };

  const toggleWallpaper = () => {
    setUseAlternateWallpaper(!useAlternateWallpaper);
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
    <>
      <Head>
        <title>Pedro | Token Burner</title>
        <meta name="description" content="Burn your tokens with Pedro" />
        <meta property="og:image" content="/pedro_logo4.png" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden font-mono selection:bg-white selection:text-black">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0">
            <Image
              src={useAlternateWallpaper ? "/wallpaper.webp" : "/wallpaper.webp"}
              alt="Background texture"
              layout="fill"
              objectFit="cover"
              className="opacity-40 mix-blend-overlay"
              priority
            />
          </div>
        </div>

        <div className="relative z-10">
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
                TOKEN BURNER
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
              className="flex flex-col max-w-[1500px] p-5 mx-auto items-center justify-center text-center py-32 px-8 bg-black rounded-xl border-2 border-white/20 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-[250px] h-[250px] rounded-full border border-white/05"></div>
                  <div className="w-[700px] h-[700px] rounded-full border border-white/05 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="w-[800px] h-[800px] rounded-full border border-white/03 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={`radial-${i}`}
                    className="absolute top-1/2 left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
                      transformOrigin: 'left center'
                    }}
                  ></div>
                ))}

                <div className="absolute inset-0">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div 
                      key={`diamond-${i}`}
                      className="absolute top-1/2 left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-white/05 to-transparent"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${45 + (i * 10)}deg)`,
                        transformOrigin: 'left center',
                        opacity: 0.3 - (i * 0.03)
                      }}
                    ></div>
                  ))}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div 
                      key={`diamond2-${i}`}
                      className="absolute top-1/2 left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-white/05 to-transparent"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${-45 - (i * 10)}deg)`,
                        transformOrigin: 'left center',
                        opacity: 0.3 - (i * 0.03)
                      }}
                    ></div>
                  ))}
                </div>

                <div className="absolute inset-0 grid grid-cols-24 grid-rows-24 opacity-5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={`pixel-col-${i}`} className="border-r border-white/05"></div>
                  ))}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={`pixel-row-${i}`} className="border-b border-white/05"></div>
                  ))}
                </div>

                <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-white/20"></div>
                <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-white/20"></div>
                <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-white/20"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-white/20"></div>

                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/30 rounded-full"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 relative z-10"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-4 bg-white/10 rounded-full blur-md"></div>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  PEDRO X BURN
                </h2>
              </motion.div>
              
              <div className="relative z-10 w-full max-w-md space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                  <span className="text-white/50 text-sm">CHOOSE WALLET</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </motion.div>
                
                <motion.button
                  onClick={() => connectWallet("keplr")}
                  disabled={isLoading && activeWalletType !== "keplr"}
                  className={`w-full px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                    isLoading && activeWalletType === "keplr" 
                      ? "bg-white/10 border-2 border-white/20" 
                      : "bg-black border-2 border-white/20 hover:border-white/40 shadow-lg"
                  }`}
                  whileHover={{ 
                    scale: isLoading && activeWalletType === "keplr" ? 1 : 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading && activeWalletType === "keplr" ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      CONNECTING...
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center justify-center relative z-10">
                        <img 
                          src="/keplr logo.png" 
                          alt="Keplr Logo" 
                          className="w-6 h-6 mr-3" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/wallet-fallback.png';
                          }}
                        />
                        CONNECT KEPLR
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => connectWallet("leap")}
                  disabled={isLoading && activeWalletType !== "leap"}
                  className={`w-full px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                    isLoading && activeWalletType === "leap" 
                      ? "bg-white/10 border-2 border-white/20" 
                      : "bg-black border-2 border-white/20 hover:border-white/40 shadow-lg"
                  }`}
                  whileHover={{ 
                    scale: isLoading && activeWalletType === "leap" ? 1 : 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading && activeWalletType === "leap" ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      CONNECTING...
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center justify-center relative z-10">
                        <img 
                          src="/leap logo.png" 
                          alt="Leap Logo" 
                          className="w-6 h-6 mr-3" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/wallet-fallback.png';
                          }}
                        />
                        CONNECT LEAP
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </motion.button>
              </div>

              <motion.div 
                className="mt-12 relative w-64 h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute inset-4 border-2 border-white/10 rounded-full"></div>
                <Image
                  src={`/pedro${currentPedroImage}.png`}
                  alt="Pedro animation"
                  width={256}
                  height={256}
                  className="object-contain relative z-10 grayscale contrast-125"
                  priority
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  animate={{
                    borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <section className="relative py-8 px-4 mx-auto max-w-[1500px]">
              <div className="flex justify-end mb-8">
                <motion.button 
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-transparent hover:bg-white/10 rounded-lg transition-all duration-300 border border-white hover:border-white text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Disconnect
                </motion.button>
              </div>

              <motion.div 
                className="bg-black rounded-xl overflow-hidden border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
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
                        className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-black' : 'bg-black/80'}`}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-6 py-4">
                          <motion.button
                            onClick={() => toggleTokenSelection(token.address)}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                              selectedTokens.includes(token.address) 
                                ? 'bg-white shadow-lg' 
                                : 'border border-white/30 hover:border-white'
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            {selectedTokens.includes(token.address) && (
                              <FiCheck className="text-black" />
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
                                className="text-white/70 hover:text-white"
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
                              className="bg-white/5 border border-white/20 rounded-md px-3 py-2 w-32 text-right font-mono focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
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
                      ? 'bg-white/5 text-white/50 cursor-not-allowed border border-white/20'
                      : 'bg-white text-black hover:bg-white/90 shadow-lg border border-white'
                  }`}
                  whileHover={selectedTokens.length > 0 ? { scale: 1.05 } : {}}
                  whileTap={selectedTokens.length > 0 ? { scale: 0.95 } : {}}
                >
                  <FaFire className="" />
                  Burn Selected Tokens
                  {selectedTokens.length > 0 && (
                    <span className="ml-2 bg-black/20 px-2 py-1 rounded text-sm font-mono">
                      {selectedTokens.length}
                    </span>
                  )}
                  {selectedTokens.length > 0 && (
                    <motion.div 
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
                    </motion.div>
                  )}
                </motion.button>
              </div>

              {selectedTokens.length > 0 && (
                <motion.div 
                  className="mt-6 p-6 bg-black border border-white/20 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold mb-4 text-xl">
                    BURN SUMMARY
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
                            <span className="font-mono">
                              {summary.display}
                            </span>
                          </motion.li>
                        );
                      })}
                  </ul>
                </motion.div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default TokenBurnPage;