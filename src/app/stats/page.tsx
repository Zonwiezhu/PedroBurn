'use client';
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useState, useEffect } from 'react';
import { FaFire, FaCoins, FaUsers, FaPercentage, FaSyncAlt } from "react-icons/fa";
import Image from "next/image";

type CornerCircleProps = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  speed: number;
  reverse?: boolean;
};

export default function PedroBurnStats() {
  const [displayedNumber, setDisplayedNumber] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const targetNumber = 2773123212;
  const controls = useAnimation();

  // Stats data
  const holders = 3568;
  const totalSupply = 10000000000;
  const burnedAmount = targetNumber;
  const circulatingSupply = totalSupply - burnedAmount;
  const top10HoldersPercent = 36;

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const CornerCircle = ({ position, speed, reverse = false }: CornerCircleProps) => {
    const positions = {
      'top-left': 'top-20 left-20',
      'top-right': 'top-20 right-20',
      'bottom-left': 'bottom-20 left-20',
      'bottom-right': 'bottom-20 right-20'
    };
    
    if (isMobile) return null;
    
    return (
      <motion.div 
        className={`absolute ${positions[position]} w-[200px] h-[200px] rounded-full border-2 border-white/10 pointer-events-none`}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`${position}-item-${i}`}
            className="absolute top-0 left-1/2 w-5 h-5 transform -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `rotate(${i * 45}deg) translateY(-100px) rotate(${-i * 45}deg)` }}
          >
            <div className="w-5 h-5 text-white/30">
              <FaFire className="w-full h-full" />
            </div>
          </div>
        ))}
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border border-white/5"></div>
      </motion.div>
    );
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

        {/* Corner Circles - Only show on desktop */}
        <CornerCircle position="top-left" speed={60} />
        <CornerCircle position="top-right" speed={80} reverse />
        <CornerCircle position="bottom-left" speed={100} />
        <CornerCircle position="bottom-right" speed={70} reverse />

        {/* Side decorations - Only show on desktop */}
        {!isMobile && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Left side decoration */}
            <div className="absolute top-1/2 left-10 transform -translate-y-1/2">
              <motion.div 
                className="w-1 h-64 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </div>

            {/* Right side decoration */}
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2">
              <motion.div 
                className="w-1 h-64 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Central content */}
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              className="inline-block"
            >
              <h1 className="text-3xl md:text-6xl font-bold mb-4">
                TOKEN PEDRO
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
          <div className="flex flex-col items-center mb-12 md:mb-20 relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 md:mb-8"
            >
              <FaFire className="text-5xl md:text-6xl" />
            </motion.div>
            
            <h2 className="text-lg md:text-2xl mb-3 md:mb-4">TOTAL PEDRO BURNED</h2>
            
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedNumber}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-4xl md:text-7xl font-bold mb-2 font-mono"
                >
                  {displayedNumber.toLocaleString()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="text-base md:text-lg">PEDRO TOKENS</div>
            
            <motion.div 
              className="w-full max-w-md h-3 md:h-4 bg-gray-800 rounded-full mt-4 md:mt-6 overflow-hidden"
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
            <div className="text-xs md:text-sm mt-2 text-gray-300">
              {((burnedAmount / totalSupply) * 100).toFixed(2)}% of total supply burned
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Holders Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-4 md:p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-full border border-white/20">
                  <FaUsers className="text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl">HOLDERS</h3>
              </div>
              <div className="text-2xl md:text-3xl font-mono">{holders.toLocaleString()}</div>
            </motion.div>

            {/* Circulating Supply Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-4 md:p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-full border border-white/20">
                  <FaCoins className="text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl">CIRCULATING SUPPLY</h3>
              </div>
              <div className="text-2xl md:text-3xl font-mono">{circulatingSupply.toLocaleString()}</div>
            </motion.div>

            {/* Top 10 Holders Card */}
            <motion.div 
              className="border border-white/20 bg-black/50 p-4 md:p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-full border border-white/20">
                  <FaPercentage className="text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl">TOP 10 HOLDERS</h3>
              </div>
              <div className="text-2xl md:text-3xl font-mono">{top10HoldersPercent}%</div>
            </motion.div>
          </div>

          {/* Last Updated with Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-8 md:mt-12"
          >
            <div className="text-white/80 text-xs md:text-sm flex justify-center items-center gap-2 mb-4 md:mb-6">
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
            </div>
            
            {/* Image gallery */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6 md:mt-8 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((item, index) => (
                <motion.div
                  key={`pedro-img-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + (index * 0.1) }}
                  className="relative w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/20"
                  whileHover={{ scale: isMobile ? 1 : 1.1, zIndex: 10 }}
                >
                  <Image 
                    src={`/pedro${item}.png`}
                    alt={`Pedro ${item}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}