'use client';
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useState, useEffect, useRef } from 'react';
import { FaFire, FaCoins, FaUsers, FaPercentage, FaSyncAlt } from "react-icons/fa";

export default function PedroBurnStats() {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const targetNumber = 2773123212;
  const controls = useAnimation();

  // Stats data
  const holders = 3568;
  const totalSupply = 10000000000;
  const burnedAmount = targetNumber;
  const circulatingSupply = totalSupply - burnedAmount;
  const top10HoldersPercent = 36;

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
    
    const duration = 5; // 5 seconds count-up
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const updateNumber = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / (endTime - startTime));
      // Ease-out function for smoother ending
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easedProgress * targetNumber);
      setDisplayedNumber(currentNumber);
      
      if (now < endTime) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayedNumber(targetNumber);
      }
    };
    
    updateNumber();
  }, []);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleString());
    controls.start({
      rotate: 360,
      transition: { duration: 0.8 }
    }).then(() => {
      controls.set({ rotate: 0 });
    });
  };

  return (
    <>
      <Head>
        <title>PEDRO BURN STATS</title>
        <meta name="description" content="Track the total amount of PEDRO tokens burned" />
      </Head>

      <div 
        className="min-h-screen text-white overflow-hidden font-mono relative"
        style={{
          backgroundImage: "url('/wallpaper.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80 z-0"></div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                PEDRO BURN STATS
              </h1>
            </motion.div>
            <motion.div 
              className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </motion.div>

          {/* Main Burn Counter */}
          <div className="flex flex-col items-center mb-20 relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <FaFire className="text-6xl" />
            </motion.div>
            
            <h2 className="text-xl md:text-2xl mb-4">TOTAL PEDRO BURNED</h2>
            
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedNumber}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-5xl md:text-7xl font-bold mb-2 font-mono"
                >
                  {displayedNumber.toLocaleString()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="text-lg">PEDRO TOKENS</div>
            
            <motion.div 
              className="w-full max-w-md h-4 bg-gray-800 rounded-full mt-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-gray-300 to-white"
                initial={{ width: 0 }}
                animate={{ width: `${(burnedAmount / totalSupply) * 100}%` }}
                transition={{ delay: 0.8, duration: 1.5, type: 'spring' }}
              />
            </motion.div>
            <div className="text-sm mt-2 text-gray-300">
              {((burnedAmount / totalSupply) * 100).toFixed(2)}% of total supply burned
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Holders Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full border border-white/20">
                  <FaUsers className="text-xl" />
                </div>
                <h3 className="text-xl">HOLDERS</h3>
              </div>
              <div className="text-3xl font-mono">{holders.toLocaleString()}</div>
            </motion.div>

            {/* Circulating Supply Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full border border-white/20">
                  <FaCoins className="text-xl" />
                </div>
                <h3 className="text-xl">CIRCULATING SUPPLY</h3>
              </div>
              <div className="text-3xl font-mono">{circulatingSupply.toLocaleString()}</div>
            </motion.div>

            {/* Top 10 Holders Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full border border-white/20">
                  <FaPercentage className="text-xl" />
                </div>
                <h3 className="text-xl">TOP 10 HOLDERS</h3>
              </div>
              <div className="text-3xl font-mono">{top10HoldersPercent}%</div>
            </motion.div>
          </div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-12 text-white/80 text-sm flex justify-center items-center gap-2"
          >
            <button 
              onClick={handleRefresh}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Refresh data"
            >
              <motion.div
                animate={controls}
              >
                <FaSyncAlt />
              </motion.div>
            </button>
            <span>Last updated: {lastUpdated || 'Loading...'}</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
