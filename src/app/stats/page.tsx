'use client';
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { FaFire, FaCoins, FaSync, FaUsers, FaExternalLinkAlt } from "react-icons/fa";

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
              PEDRO STATS
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
              className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>
        </section>

        <div className="relative z-10 p-6 max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 rounded-xl border border-white/10 backdrop-blur-sm mx-auto p-8"
          >
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-5 rounded-full mb-6 shadow-lg shadow-red-500/10">
                <FaFire className="text-orange-400 text-4xl" />
              </div>
              
              <h2 className="text-2xl font-semibold text-white mb-2">Total PEDRO Burned</h2>
              
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
                    className="text-6xl md:text-8xl font-bold text-white mb-4"
                  >
                    {displayedNumber.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="text-xl text-white/80 mb-8">PEDRO Tokens</div>

              {/* Stats Grid */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-black/40 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white/10 p-3 rounded-full">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Holders</h3>
                  </div>
                  <div className="text-3xl font-bold text-center text-white">{holders.toLocaleString()}</div>
                </motion.div>

                <motion.div 
                  className="bg-black/40 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white/10 p-3 rounded-full">
                      <FaCoins className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Circulating Supply</h3>
                  </div>
                  <div className="text-3xl font-bold text-center text-white">{circulatingSupply.toLocaleString()}</div>
                </motion.div>

                <motion.div 
                  className="bg-black/40 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white/10 p-3 rounded-full">
                      <FaFire className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Top 10 Holders</h3>
                  </div>
                  <div className="text-3xl font-bold text-center text-white">{top10HoldersPercent}%</div>
                </motion.div>
              </div>

              <div className="mt-8 text-white/50 text-sm">
                <p>Last updated: {lastUpdated || 'Loading...'}</p>              
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}