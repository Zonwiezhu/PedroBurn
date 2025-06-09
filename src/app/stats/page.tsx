'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { FaFire, FaCoins, FaSync } from "react-icons/fa";

export default function PedroBurnTracker() {
  const [burnedTokens, setBurnedTokens] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchBurnedTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.pedro.online/pedro');
      
      if (!response.ok) {
        throw new Error('Failed to fetch burned tokens data');
      }

      const data = await response.json();
      setBurnedTokens(data.totalBurned || 0);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setBurnedTokens(42069000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBurnedTokens();
    const interval = setInterval(fetchBurnedTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchBurnedTokens();
  };

  return (
      <>
        <Head>
          <title>BURN STATS</title>
          <meta name="description" content="Track the total amount of PEDRO tokens burned" />
        </Head>

        <div className="min-h-screen bg-black text-white overflow-hidden font-mono">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/wallpaper.webp"
                alt="Background texture"
                layout="fill"
                objectFit="cover"
                className="mix-blend-overlay"
              />
            </div>
          </div>

          <section className="flex items-center justify-center py-5 md:py-12 text-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="px-6 max-w-4xl relative z-10"
            >
              <motion.h1
                className="text-4xl md:text-7xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                BURN STATS
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
                className="h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
              />
            </motion.div>
          </section>

          <div className="relative z-10 container mx-auto px-4 pb-16 max-w-[1500px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 p-8 rounded-xl border border-orange-500/20 mx-auto text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="bg-orange-500/20 p-4 rounded-full mb-6">
                  <FaFire className="text-orange-400 text-4xl" />
                </div>
                
                <h2 className="text-2xl font-semibold text-orange-300 mb-2">Total PEDRO Burned</h2>
                
                {loading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-400 mb-4">{error}</div>
                ) : (
                  <>
                    <motion.div
                      key={burnedTokens}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-4"
                    >
                      {burnedTokens?.toLocaleString()}
                    </motion.div>
                    <div className="text-xl text-orange-300 mb-6">PEDRO Tokens</div>
                  </>
                )}

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <motion.button
                    onClick={handleRefresh}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <FaSync className={loading ? 'animate-spin' : ''} />
                    Refresh Data
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    onClick={() => window.open('https://pedro.online', '_blank')}
                  >
                    <FaCoins />
                    About PEDRO
                  </motion.button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-left max-w-2xl mx-auto">
                    <h3 className="font-medium text-red-300 mb-2">API Connection Issue</h3>
                    <p className="text-gray-300">
                      We're having trouble connecting to the PEDRO burn API. Currently showing mock data. 
                      Please try refreshing or check back later.
                    </p>
                  </div>
                )}

                <div className="mt-8 text-gray-400 text-sm">
                  <p>Data refreshes automatically every 30 seconds</p>
                  <p className="mt-1">Last updated: {lastUpdated || 'Never'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
  );
}