'use client';
import { useState, useEffect } from 'react';
import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {}
}

interface Token {
  name: string;
  symbol: string;
  denom: string;
  amount: string;
  burnAmount: string;
  decimals: number;
  human_readable_amount: string;
  logo?: string | null;
  description?: string;
  native?: boolean;
  is_verified?: boolean;
}

interface TokenApiResponse {
  address: string;
  token_info: {
    name: string;
    symbol: string;
    denom: string;
    amount: string;
    decimals: number;
    human_readable_amount: string;
    description?: string;
    logo?: string;
    is_verified?: boolean;
  }[];
}

const TokenBurnPage = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWalletType, setActiveWalletType] = useState<"keplr" | "leap" | null>(null);
  const [currentPedroImage, setCurrentPedroImage] = useState(1);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTokenName = (name: string) => {
    if (!name) return 'Unknown Token';
    return name.length > 20 ? `${name.substring(0, 14)}...` : name;
  };

  const formatNumber = (value: string, decimals: number): string => {
    if (!value || value === '0') return `0,${'0'.repeat(decimals)}`;
    
    const cleanValue = value.replace(/[^0-9,.]/g, '');
    
    const normalized = cleanValue.replace(/\./g, '').replace(',', '.');
    
    const [integerPart, fractionalPart = ''] = normalized.split('.');
    
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedInteger},${paddedFractional}`;
  };

  const setMaxAmount = (tokenAddress: string) => {
    setTokens(prev => prev.map(token => {
      if (token.denom === tokenAddress) {
        return { ...token, burnAmount: token.amount };
      }
      return token;
    }));
  };

  const formatIpfslogo = (logo: string | null | undefined): string => {
    if (!logo) return '';
    
    if (logo.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${logo.replace('ipfs://', '')}`;
    }

    if (logo.includes('.ipfs.')) {
      try {
        const url = new URL(logo);
        const domainParts = url.hostname.split('.');
        const rootCid = domainParts.find(part => 
          part.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/i)
        );

        const pathParts = url.pathname.split('/').filter(Boolean);
        const pathCid = pathParts.find(part => 
          part.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/i)
        );

        if (rootCid && pathCid) {
          return `https://ipfs.io/ipfs/${pathCid}`;
        }
        
        if (rootCid) {
          return `https://ipfs.io/ipfs/${rootCid}${url.pathname}`;
        }
      } catch (e) {
        console.warn('Failed to parse IPFS logo:', logo);
      }
    }

    if (logo.includes('ipfs/')) {
      const ipfsPath = logo.split('ipfs/')[1];
      if (ipfsPath) {
        return `https://ipfs.io/ipfs/${ipfsPath}`;
      }
    }

    if (logo.includes('imagedelivery.net')) {
      try {
        const url = new URL(logo);
        return logo;
      } catch (e) {
        console.warn('Invalid imagedelivery.net logo:', logo);
      }
    }

    const ALLOWED_HOSTS = [
      'i.postimg.cc',
      'i.imgur.com', 
      'images.pexels.com',
      'source.unsplash.com',
      'imagedelivery.net'
    ];

    try {
      const url = new URL(logo);
      if (ALLOWED_HOSTS.includes(url.hostname)) {
        return logo;
      }
    } catch (e) {
      console.warn('Invalid logo:', logo);
    }

    return logo;
  };

  const openExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.injective.network/account/${walletAddress}/`, "_blank");
    }
  };

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
    const wallet = walletType === "leap" ? window.leap : window.keplr;
    const chainId = "injective-1";
  
    if (!wallet) {
      setModalMessage(`Please install the ${walletType} extension!`);
      setIsModalOpen(true);
      setActiveWalletType(null);
      return;
    }
  
    setIsLoading(true);
  
    try {
      await wallet.enable(chainId);
      const offlineSigner = wallet.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;

      localStorage.setItem("connectedWalletType", walletType);
      localStorage.setItem("connectedWalletAddress", address);
      setWalletAddress(address);
      
      const tokenResponse = await fetch(`https://api.pedroinjraccoon.online/token_balances/${address}/`);
      const tokenResult: TokenApiResponse = await tokenResponse.json();
      
      const formattedTokens = tokenResult.token_info.map(token => ({
        name: token.name || 'Unknown Token',
        symbol: token.symbol || 'N/A',
        denom: token.denom,
        amount: token.amount,
        burnAmount: "",
        decimals: token.decimals,
        human_readable_amount: token.amount,
        logo: token.logo,
        description: token.description,
        native: token.denom === 'inj',
        is_verified: token.is_verified
      }));
            
      setTokens(formattedTokens);
      setIsConnected(true);
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : "An unknown error occurred");
      setIsModalOpen(true);
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
      token.denom === tokenAddress 
        ? { ...token, burnAmount: newAmount } 
        : token
    ));
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedTokens([]);
    setWalletAddress(null);
    setTokens([]);
    localStorage.removeItem("connectedWalletType");
    localStorage.removeItem("connectedWalletAddress");
  };

const getBurnSummary = (amount: string, burnAmount: string) => {
  // Handle empty/zero amount case
  if (!amount || amount === '0') {
    return { 
      burnAmount: '0',
      remainingAmount: '0'
    };
  }

  // Convert string inputs to numbers for comparison
  const amountNum = Number(amount);
  const burnAmountNum = Number(burnAmount || '0');

  // Calculate actual burn amount (can't burn more than available)
  const actualBurn = Math.min(burnAmountNum, amountNum);
  
  // Calculate remaining amount
  const remaining = amountNum - actualBurn;

  return {
    burnAmount: actualBurn.toString(),
    remainingAmount: remaining.toString()
  };
};

  const handleBurn = () => {
    const burnTransactions = tokens
      .filter(token => selectedTokens.includes(token.denom))
      .map(token => {
        const summary = getBurnSummary(token.human_readable_amount, token.burnAmount);
        return {
          symbol: token.symbol,
          amount: summary.burnAmount,
          remaining: summary.remainingAmount,
          denom: token.denom
        };
      });
    
    alert(`Preparing to burn:\n${JSON.stringify(burnTransactions, null, 2)}`);
  };

  return (
    <>
      <Head>
        <title>Pedro | Token Burner</title>
        <meta name="description" content="Burn your tokens with Pedro" />
        <meta property="og:image" content="/pedro_logo4.png" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden font-mono selection:bg-white selection:text-black px-4 md:px-8 lg:px-12 pb-12">
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
                TOKEN BURN
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
              className="flex flex-col max-w-[1500px] p-5 mx-auto items-center justify-center text-center py-32 px-4 sm:px-8 pb-16 bg-black bg-opacity-20 rounded-xl border-2 border-white/20 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div 
                    className="w-[500px] h-[500px] rounded-full border border-white/05 relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div 
                        key={`arrow-cw-${i}`}
                        className="absolute top-0 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `rotate(${i * 45}deg)` }}
                      >
                        <div className="w-4 h-4 text-white/50">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    className="w-[600px] h-[600px] rounded-full border border-white/05 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div 
                        key={`arrow-ccw-${i}`}
                        className="absolute top-0 left-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                      >
                        <div className="w-6 h-6 text-white/30">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  <div className="w-[700px] h-[700px] rounded-full border border-white/03 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
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
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  BURN
                </h2>
              </motion.div>
              
              <div className="relative z-10 w-full flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-4 w-full max-w-xs"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                  <span className="text-white/50 text-sm">CHOOSE WALLET</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </motion.div>
                
                <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
                  <motion.button
                    onClick={() => connectWallet("keplr")}
                    disabled={isLoading && activeWalletType !== "keplr"}
                    className={`w-full rounded-lg text-black bg-white hover:bg-black hover:text-white font-weight-600 font-medium border border-white/50 hover:border-white transition-all duration-300 py-3 px-4 ${
                      isLoading && activeWalletType === "keplr" ? 'opacity-70' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading && activeWalletType === "keplr" ? (
                      <span className="flex items-center justify-center">
                        <span className="loading-spinner mr-2"></span>
                        CONNECTING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center font-bold">
                        <img 
                          src="/keplr logo.png" 
                          alt="Keplr Logo" 
                          className="w-6 h-6 mr-3" 
                        />
                        CONNECT KEPLR
                      </span>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => connectWallet("leap")}
                    disabled={isLoading && activeWalletType !== "leap"}
                    className={`w-full rounded-lg text-black bg-white hover:bg-black hover:text-white font-weight-600 font-medium border border-white/50 hover:border-white transition-all duration-300 py-3 px-4 ${
                      isLoading && activeWalletType === "leap" ? 'opacity-70' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading && activeWalletType === "leap" ? (
                      <span className="flex items-center justify-center">
                        <span className="loading-spinner mr-2"></span>
                        CONNECTING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center font-bold">
                        <img 
                          src="/leap logo.png" 
                          alt="Leap Logo" 
                          className="w-6 h-6 mr-3" 
                        />
                        CONNECT LEAP
                      </span>
                    )}
                  </motion.button>
                </div>
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
                  src={`/Pedro${currentPedroImage}.png`}
                  alt="Pedro animation"
                  width={256}
                  height={256}
                  className="object-contain relative z-10 grayscale contrast-125"
                  priority
                />
              </motion.div>
            </motion.div>
          ) : (
            <section className="relative py-8 px-4 sm:px-6 mx-auto max-w-[1750px]">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                <button 
                  onClick={openExplorer}
                  className="relative group focus:outline-none"
                >
                  <div className="flex items-center space-x-2 bg-gray-900/80 hover:bg-gray-800/90 transition-all duration-300 rounded-full pl-4 pr-3 py-2.5 border border-white/10 hover:border-white/20 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse mr-2"></div>
                      <span className="text-sm font-mono text-white/90">
                        {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                      </span>
                    </div>
                    <FiExternalLink className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    View on Explorer
                  </div>
                </button>
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-white text-black hover:text-white hover:bg-black rounded-lg transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Disconnect
                  </motion.button>
                </div>
              </div>

              <motion.div 
                className="bg-black bg-opacity-50 rounded-xl overflow-hidden border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="xl:hidden">
                  {tokens.map((token) => {
                    const imagelogo = token.logo ? formatIpfslogo(token.logo) : '';                    
                    const shortenedDenom = token.native 
                      ? 'Native' 
                      : `${token.denom.slice(0, 5)}...${token.denom.slice(-5)}`;
                    const explorerLink = token.native 
                      ? null 
                      : `https://explorer.injective.network/asset/${encodeURIComponent(token.denom)}`;

                    return (
                      <motion.div 
                        key={token.denom}
                        className="border-b border-white/10 last:border-b-0 p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTokenSelection(token.denom)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                                selectedTokens.includes(token.denom) 
                                  ? 'bg-white shadow-lg' 
                                  : 'border border-white/30 hover:border-white'
                              }`}
                            >
                              {selectedTokens.includes(token.denom) && (
                                <FiCheck className="text-black" />
                              )}
                            </button>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                {imagelogo ? (
                                  <img 
                                    src={imagelogo} 
                                    alt={token.symbol}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const imgElement = e.target as HTMLImageElement;
                                      imgElement.src = '';
                                      const parent = imgElement.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('span');
                                        fallback.className = 'flex items-center justify-center w-full h-full';
                                        fallback.textContent = token.symbol.charAt(0);
                                        parent.replaceChild(fallback, imgElement);
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full">
                                    {token.symbol.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{formatTokenName(token.name)}</div>
                                <div className="text-white/50 text-sm">{token.symbol}</div>
                              </div>
                            </div>
                          </div>
                          {token.is_verified && (
                            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-white/50 text-sm mb-1">Address</div>
                            <div className="text-sm flex items-center gap-1">
                              {explorerLink ? (
                                <a 
                                  href={explorerLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-white/70 hover:text-white hover:underline"
                                >
                                  {shortenedDenom}
                                </a>
                              ) : (
                                <span className="text-white/50">{shortenedDenom}</span>
                              )}
                              {explorerLink && (
                                <FiExternalLink size={14} className="text-white/50" />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="text-white/50 text-sm mb-1">Balance</div>
                            <div className="text-sm font-mono">
                              {token.human_readable_amount}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white/50 text-sm">Burn Amount</span>
                            <button 
                              onClick={() => setMaxAmount(token.denom)}
                              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                            >
                              ALL
                            </button>
                          </div>
                          <input
                            type="text"
                            value={token.burnAmount}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9,.]/g, '');
                              
                              const hasComma = value.includes(',');
                              const hasPeriod = value.includes('.');
                              let cleanedValue = value;
                              
                              if (hasComma && hasPeriod) {
                                const commaIndex = value.indexOf(',');
                                const periodIndex = value.indexOf('.');
                                cleanedValue = commaIndex < periodIndex 
                                  ? value.replace(/\./g, '') 
                                  : value.replace(/,/g, '');
                              }
                              
                              const decimalSeparatorIndex = Math.max(
                                cleanedValue.indexOf(','),
                                cleanedValue.indexOf('.')
                              );
                              
                              if (decimalSeparatorIndex !== -1) {
                                const fractionalPart = cleanedValue.slice(decimalSeparatorIndex + 1);
                                if (fractionalPart.length > token.decimals) {
                                  cleanedValue = cleanedValue.slice(0, decimalSeparatorIndex + 1 + token.decimals);
                                }
                              }
                              
                              updateTokenAmount(token.denom, cleanedValue);
                            }}
                            onBlur={(e) => {
                              const formatted = formatNumber(e.target.value, token.decimals);
                              updateTokenAmount(token.denom, formatted);
                            }}
                            className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

               <div className="hidden xl:block">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left w-12"></th>
                      <th className="px-6 py-4 text-left">Token</th>
                      <th className="px-6 py-4 text-left">Address</th>
                      <th className="px-6 py-4 text-center">Verified</th>
                      <th className="px-6 py-4 text-right">Balance</th>
                      <th className="px-6 py-4 text-right">Burn Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => {
                      const imagelogo = formatIpfslogo(token.logo);
                      const shortenedDenom = token.native 
                        ? 'Native' 
                        : `${token.denom.slice(0, 5)}...${token.denom.slice(-5)}`;
                      const explorerLink = token.native 
                        ? null 
                        : `https://explorer.injective.network/asset/${encodeURIComponent(token.denom)}`;

                      return (
                        <motion.tr 
                          key={token.denom} 
                        >
                          <td className="px-6 py-4">
                            <motion.button
                              onClick={() => toggleTokenSelection(token.denom)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                                selectedTokens.includes(token.denom) 
                                  ? 'bg-white shadow-lg' 
                                  : 'border border-white/30 hover:border-white'
                              }`}
                              whileTap={{ scale: 0.9 }}
                            >
                              {selectedTokens.includes(token.denom) && (
                                <FiCheck className="text-black" />
                              )}
                            </motion.button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                {imagelogo ? (
                                  <img 
                                    src={imagelogo} 
                                    alt={token.symbol}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const imgElement = e.target as HTMLImageElement;
                                      imgElement.src = '';
                                      const parent = imgElement.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('span');
                                        fallback.className = 'flex items-center justify-center w-full h-full';
                                        fallback.textContent = token.symbol.charAt(0);
                                        parent.replaceChild(fallback, imgElement);
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full">
                                    {token.symbol.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{formatTokenName(token.name)}</div>
                                <div className="text-white/50 text-sm">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {explorerLink ? (
                                <a 
                                  href={explorerLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-white/70 hover:text-white hover:underline"
                                >
                                  {shortenedDenom}
                                </a>
                              ) : (
                                <span className="text-white/50">{shortenedDenom}</span>
                              )}
                              {explorerLink && (
                                <FiExternalLink size={14} className="text-white/50" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {token.is_verified ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-900/20 text-green-400">
                                <FiCheck className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-900/20 text-red-400">
                                <span className="w-4 h-4">—</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-mono">
                            {token.human_readable_amount}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end items-center gap-2">
                              <input
                                  type="text" 
                                  value={token.burnAmount}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9,.]/g, '');
                                    
                                    const hasComma = value.includes(',');
                                    const hasPeriod = value.includes('.');
                                    let cleanedValue = value;
                                    
                                    if (hasComma && hasPeriod) {
                                      const commaIndex = value.indexOf(',');
                                      const periodIndex = value.indexOf('.');
                                      cleanedValue = commaIndex < periodIndex 
                                        ? value.replace(/\./g, '') 
                                        : value.replace(/,/g, '');
                                    }
                                    
                                    const decimalSeparatorIndex = Math.max(
                                      cleanedValue.indexOf(','),
                                      cleanedValue.indexOf('.')
                                    );
                                    
                                    if (decimalSeparatorIndex !== -1) {
                                      const fractionalPart = cleanedValue.slice(decimalSeparatorIndex + 1);
                                      if (fractionalPart.length > token.decimals) {
                                        cleanedValue = cleanedValue.slice(0, decimalSeparatorIndex + 1 + token.decimals);
                                      }
                                    }
                                    
                                    updateTokenAmount(token.denom, cleanedValue);
                                  }}
                                  onBlur={(e) => {
                                    const formatted = formatNumber(e.target.value, token.decimals);
                                    updateTokenAmount(token.denom, formatted);
                                  }}
                                  className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                                />
                              <button 
                                onClick={() => setMaxAmount(token.denom)}
                                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                              >
                                ALL
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </motion.div>

              {selectedTokens.length > 0 && (
                <motion.div 
                  className="mt-6 p-4 sm:p-6 bg-black border border-white/20 rounded-lg mx-2 sm:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold mb-4 text-xl">
                    BURN SUMMARY
                  </h3>
                  <ul className="space-y-3">
                    {tokens
                      .filter(token => selectedTokens.includes(token.denom))
                      .map(token => {
                        const { burnAmount, remainingAmount } = getBurnSummary(
                          token.human_readable_amount,
                          token.burnAmount
                        );
                        
                        return (
                          <motion.li 
                            key={token.denom} 
                            className="py-2 border-b border-white/5 last:border-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">
                                  {token.symbol.charAt(0)}
                                </div>
                                <span className="truncate max-w-[100px] sm:max-w-none">
                                  {token.symbol}
                                  {token.is_verified && (
                                    <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-1 rounded">
                                      ✓
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-mono text-sm sm:text-base">
                                  Burning: {burnAmount}
                                </span>
                                <span className="font-mono text-sm text-white/50">
                                  Remaining: {remainingAmount}
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                  </ul>
                </motion.div>
              )}

              <div className="flex justify-center m-8">
                <motion.button
                  onClick={handleBurn}
                  disabled={selectedTokens.length === 0}
                  className={`flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg font-bold transition-all relative overflow-hidden ${
                    selectedTokens.length === 0
                      ? 'bg-white/5 text-white/50 cursor-not-allowed border border-white/20'
                      : 'bg-white text-black hover:bg-white/90 shadow-lg border border-white'
                  }`}
                  whileHover={selectedTokens.length > 0 ? { scale: 1.05 } : {}}
                  whileTap={selectedTokens.length > 0 ? { scale: 0.95 } : {}}
                >
                  <FaFire className="text-orange-500" />
                  BURN TOKENS
                  {selectedTokens.length > 0 && (
                    <span className="ml-2 bg-black/20 px-2 py-1 rounded text-sm font-mono">
                      {selectedTokens.length}
                    </span>
                  )}
                </motion.button>
              </div>
            </section>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isModalOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black"
                onClick={() => setIsModalOpen(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={isModalOpen ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="relative z-10 w-full max-w-md bg-gradient-to-br from-black to-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-center text-white mb-2">Notice</h3>
                  <p className="text-gray-300 text-center mb-6">{modalMessage}</p>
                  
                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-200 font-medium transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Got it
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default TokenBurnPage;