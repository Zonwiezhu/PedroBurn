'use client';
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { FaFire, FaChartLine, FaShieldAlt, FaPercentage, FaDollarSign, FaExchangeAlt, FaBriefcase, FaPalette } from "react-icons/fa";

export default function PedroBurnBenefits() {
  const controls = useAnimation();

  const benefits = [
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Price Appreciation",
      description: "Burning PEDRO reduces the total supply, creating scarcity which can lead to price appreciation over time."
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Holder Protection",
      description: "Token burns help protect holders from inflation by systematically reducing circulating supply."
    },
    {
      icon: <FaPercentage className="text-3xl" />,
      title: "Increased Value",
      description: "With fewer tokens in circulation, each remaining PEDRO becomes more valuable proportionally."
    },
    {
      icon: <FaDollarSign className="text-3xl" />,
      title: "Economic Incentives",
      description: "Burns create economic incentives for long-term holding and community participation."
    },
    {
      icon: <FaFire className="text-3xl" />,
      title: "Community Engagement",
      description: "Burn events generate excitement and engagement within the PEDRO community."
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Sustainable Growth",
      description: "Controlled burns support sustainable ecosystem growth by balancing supply and demand."
    }
  ];

  const burnPlatforms = [
    {
      icon: <FaFire className="text-3xl" />,
      title: "Direct Burn Portal",
      description: "Send PEDRO to the official burn address where tokens are permanently removed from circulation.",
      link: "#",
      linkText: "Go to Burn Portal"
    },
    {
      icon: <FaBriefcase className="text-3xl" />,
      title: "Pedro Jobs",
      description: "Submit your CV on our jobs platform - a portion of the PEDRO used for submissions is burned.",
      link: "https://jobs.pedro.online",
      linkText: "Visit Pedro Jobs"
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: "NFT Generator",
      description: "Create unique NFTs - the PEDRO used for generation is partially burned, fueling ecosystem growth.",
      link: "https://nft.pedro.online",
      linkText: "Create NFT"
    },
    {
      icon: <FaExchangeAlt className="text-3xl" />,
      title: "DEX Platforms",
      description: "Participate in liquidity pool burns on decentralized exchanges that support PEDRO trading pairs.",
      link: "#",
      linkText: "View DEX List"
    }
  ];

  return (
    <>
      <Head>
        <title>WHY BURN PEDRO</title>
        <meta name="description" content="Understanding the benefits of burning PEDRO tokens and where to burn them" />
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
              WHY BURN PEDRO
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
            className="bg-black/50 p-8 rounded-xl border border-orange-500/20 mx-auto backdrop-blur-sm"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Benefits of Burning PEDRO</h2>
              <p className="text-xl max-w-3xl mx-auto">
                Token burning is a strategic mechanism that benefits the PEDRO ecosystem in multiple ways. 
                Here's how the community gains from each burn event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-black/40 p-6 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto bg-orange-500/20 rounded-full">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 text-center">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* New "Where to Burn" section */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-6">Where You Can Burn PEDRO</h3>
              <p className="text-xl text-center mb-10 max-w-3xl mx-auto">
                Participate in the PEDRO economy while contributing to token burns through these platforms:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {burnPlatforms.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/60 p-6 rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-14 h-14 bg-orange-500/20 rounded-full">
                        {platform.icon}
                      </div>
                      <h4 className="text-xl font-bold">{platform.title}</h4>
                    </div>
                    <p className="text-gray-300 mb-5">{platform.description}</p>
                    <motion.a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium"
                    >
                      {platform.linkText}
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-black/60 p-8 rounded-xl border border-orange-500/20">
              <h3 className="text-2xl font-bold text-center mb-6">Economic Impact of Burning</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-black/30 rounded-lg"
                >
                  <h4 className="font-semibold text-lg mb-2">Supply Reduction</h4>
                  <p className="text-gray-300">
                    Each burn permanently removes tokens from circulation, reducing total supply.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-black/30 rounded-lg"
                >
                  <h4 className="font-semibold text-lg mb-2">Value Increase</h4>
                  <p className="text-gray-300">
                    With reduced supply, the relative value of each remaining token increases.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-black/30 rounded-lg"
                >
                  <h4 className="font-semibold text-lg mb-2">Holder Rewards</h4>
                  <p className="text-gray-300">
                    Long-term holders benefit from the appreciating value of their tokens.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                onClick={() => window.open('https://pedro.online', '_blank')}
              >
                Learn More About PEDRO Economy
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}