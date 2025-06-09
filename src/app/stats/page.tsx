'use client';
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { FaFire, FaCoins, FaSync, FaUsers } from "react-icons/fa";

export default function PedroBurnTracker() {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const targetNumber = 2773123212;
  const controls = useAnimation();

  const holders = 3568;
  const totalSupply = 10000000000;
  const burnedAmount = targetNumber;
  const circulatingSupply = totalSupply - burnedAmount;
  const top10HoldersPercent = 36;

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
    
    const animateCountUp = async () => {
      await controls.start("visible");
      
      const duration = 5; 
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;
      
      const updateNumber = () => {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / (endTime - startTime));
        const currentNumber = Math.floor(progress * targetNumber);
        setDisplayedNumber(currentNumber);
        
        if (now < endTime) {
          requestAnimationFrame(updateNumber);
        } else {
          setDisplayedNumber(targetNumber);
        }
      };
      
      requestAnimationFrame(updateNumber);
    };
    
    animateCountUp();
  }, [controls]);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleString());
    
    setDisplayedNumber(0);
    controls.start("hidden").then(() => {
      controls.start("visible");
      const duration = 5;
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;
      
      const updateNumber = () => {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / (endTime - startTime));
        const currentNumber = Math.floor(progress * targetNumber);
        setDisplayedNumber(currentNumber);
        
        if (now < endTime) {
          requestAnimationFrame(updateNumber);
        } else {
          setDisplayedNumber(targetNumber);
        }
      };
      
      requestAnimationFrame(updateNumber);
    });
  };

  return (
    <>
      <Head>
        <title>BURN STATS</title>
        <meta name="description" content="Track the total amount of PEDRO tokens burned" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden font-mono">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
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

        <section className="flex items-center justify-center py-5 md:py-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="px-6 max-w-4xl relative"
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
            className="bg-black/50 p-8 rounded-xl border border-orange-500/20 mx-auto text-center backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="bg-orange-500/20 p-4 rounded-full mb-6">
                <FaFire className="text-orange-400 text-4xl" />
              </div>
              
              <h2 className="text-2xl font-semibold text-orange-300 mb-2">Total PEDRO Burned</h2>
              
              <div className="relative h-32 md:h-48 flex items-center justify-center overflow-hidden w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedNumber}
                    initial={{ y: -20, opacity: 0, rotateX: 90 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1, 
                      rotateX: 0,
                      transition: { 
                        type: "spring",
                        stiffness: 100,
                        damping: 10
                      }
                    }}
                    exit={{ y: 20, opacity: 0, rotateX: -90 }}
                    className="text-6xl md:text-8xl font-bold text-orange-400 mb-4"
                    style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.7)' }}
                  >
                    {displayedNumber.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="text-xl text-orange-300 mb-6">PEDRO Tokens</div>

              {/* Additional Stats Section */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-black/40 p-6 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaUsers className="text-orange-400 text-2xl" />
                    <h3 className="text-xl font-semibold text-orange-300">Holders</h3>
                  </div>
                  <div className="text-3xl font-bold text-white">{holders.toLocaleString()}</div>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaCoins className="text-orange-400 text-2xl" />
                    <h3 className="text-xl font-semibold text-orange-300">Circulating Supply</h3>
                  </div>
                  <div className="text-3xl font-bold text-white">{circulatingSupply.toLocaleString()}</div>
                </div>

                <div className="bg-black/40 p-6 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaFire className="text-orange-400 text-2xl" />
                    <h3 className="text-xl font-semibold text-orange-300">Top 10 Holders</h3>
                  </div>
                  <div className="text-3xl font-bold text-white">{top10HoldersPercent}%</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <motion.button
                  onClick={handleRefresh}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <FaSync />
                  Replay Animation
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

              <div className="mt-8 text-gray-400 text-sm">
                <p>Last updated: {lastUpdated || 'Loading...'}</p>              
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}