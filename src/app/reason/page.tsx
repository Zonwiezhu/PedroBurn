'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState } from 'react';
import { FaFire, FaChartLine, FaShieldAlt, FaPercentage, FaDollarSign, FaExchangeAlt, FaBriefcase, FaPalette } from "react-icons/fa";

const PedroBurnDiagram = () => {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'why-burn',
      title: 'WHY BURN PEDRO?',
      type: 'root',
      position: 'top-center',
      icon: <FaFire className="mx-auto mb-2" />
    },
    {
      id: 'economic',
      title: 'ECONOMIC BENEFITS',
      type: 'category',
      position: 'left',
      icon: <FaDollarSign className="mx-auto mb-2" />,
      benefits: [
        'Price Appreciation (Scarcity)',
        'Holder Protection (Anti-Inflation)',
        'Increased Token Value'
      ]
    },
    {
      id: 'community',
      title: 'COMMUNITY BENEFITS',
      type: 'category',
      position: 'right',
      icon: <FaChartLine className="mx-auto mb-2" />,
      benefits: [
        'Community Engagement',
        'Sustainable Growth'
      ]
    },
    {
      id: 'where-burn',
      title: 'WHERE TO BURN',
      type: 'action',
      position: 'bottom-center',
      icon: <FaFire className="mx-auto mb-2" />,
      platforms: [
        'Direct Burn Portal',
        'Pedro Jobs',
        'NFT Generator',
        'DEX Platforms'
      ]
    }
  ];

  const connections = [
    { from: 'why-burn', to: 'economic' },
    { from: 'why-burn', to: 'community' },
    { from: 'economic', to: 'where-burn' },
    { from: 'community', to: 'where-burn' }
  ];

  const getNodeDescription = (nodeId) => {
    const descriptions = {
      'why-burn': 'Burning PEDRO tokens creates a deflationary mechanism that benefits all holders through controlled supply reduction.',
      'economic': 'Economic benefits include price appreciation through scarcity, holder protection against inflation, and increased proportional token value.',
      'community': 'Community benefits include heightened engagement during burn events and sustainable ecosystem growth through balanced tokenomics.',
      'where-burn': 'Multiple platforms exist for burning PEDRO, each serving different ecosystem functions while contributing to supply reduction.'
    };
    return descriptions[nodeId] || '';
  };

  const Node = ({ node }) => (
    <motion.div
      className={`absolute ${getPositionClasses(node.position)} 
        p-4 rounded-lg border-2 cursor-pointer w-40 md:w-48
        ${activeNode === node.id ? 'bg-white/20 border-white' : 'bg-black/50 border-white/10'}
        transition-all duration-300 flex flex-col items-center`}
      whileHover={{ scale: 1.05 }}
      onClick={() => setActiveNode(node.id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-xl">
        {node.icon}
      </div>
      <h3 className="font-bold text-center mb-2 text-sm md:text-base">{node.title}</h3>
      
      {node.type === 'category' && (
        <ul className="text-xs space-y-1">
          {node.benefits.map((benefit, i) => (
            <li key={i}>• {benefit}</li>
          ))}
        </ul>
      )}
      
      {node.type === 'action' && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {node.platforms.map((platform, i) => (
            <div key={i} className="bg-white/5 p-1 rounded text-center truncate">
              {platform}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const Connection = ({ from, to }) => {
    const fromNode = nodes.find(n => n.id === from);
    const toNode = nodes.find(n => n.id === to);
    
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.line
          x1={getPositionX(fromNode.position)}
          y1={getPositionY(fromNode.position)}
          x2={getPositionX(toNode.position)}
          y2={getPositionY(toNode.position)}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>
    );
  };

  const getPositionClasses = (position) => {
    const classes = {
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'left': 'top-1/3 left-4 md:left-10',
      'right': 'top-1/3 right-4 md:right-10',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
    };
    return classes[position] || '';
  };

  const getPositionX = (position) => {
    const positions = {
      'top-center': '50%',
      'left': '20%',
      'right': '80%',
      'bottom-center': '50%'
    };
    return positions[position];
  };

  const getPositionY = (position) => {
    const positions = {
      'top-center': '10%',
      'left': '40%',
      'right': '40%',
      'bottom-center': '90%'
    };
    return positions[position];
  };

  return (
    <div className="relative w-full h-80 md:h-[500px] bg-black/30 rounded-xl border border-white/10 mt-12 overflow-hidden">
      {connections.map((conn, i) => (
        <Connection key={i} from={conn.from} to={conn.to} />
      ))}
      
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}

      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-400 bg-black/50">
        {activeNode ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
          >
            {getNodeDescription(activeNode)}
          </motion.p>
        ) : (
          <span className="text-white/70">Click on any node to learn more</span>
        )}
      </div>
    </div>
  );
};

export default function PedroBurnBenefits() {
  const benefits = [
    {
      icon: <FaChartLine className="text-sm" />,
      title: "Price Appreciation",
      description: "Burning PEDRO reduces the total supply, creating scarcity which can lead to price appreciation over time.",
      color: "text-green-400"
    },
    {
      icon: <FaShieldAlt className="text-sm" />,
      title: "Holder Protection",
      description: "Token burns help protect holders from inflation by systematically reducing circulating supply.",
      color: "text-red-400"
    },
    {
      icon: <FaPercentage className="text-sm" />,
      title: "Increased Value",
      description: "With fewer tokens in circulation, each remaining PEDRO becomes more valuable proportionally.",
      color: "text-blue-400"
    },
    {
      icon: <FaDollarSign className="text-sm" />,
      title: "Economic Incentives",
      description: "Burns create economic incentives for long-term holding and community participation.",
      color: "text-amber-400"
    },
    {
      icon: <FaFire className="text-sm" />,
      title: "Community Engagement",
      description: "Burn events generate excitement and engagement within the PEDRO community.",
      color: "text-purple-400"
    },
    {
      icon: <FaChartLine className="text-sm" />,
      title: "Sustainable Growth",
      description: "Controlled burns support sustainable ecosystem growth by balancing supply and demand.",
      color: "text-cyan-400"
    }
  ];

  const burnPlatforms = [
    {
      icon: <FaFire className="text-sm" />,
      title: "Direct Burn Portal",
      description: "Send PEDRO to the official burn address where tokens are permanently removed from circulation.",
      link: "#",
      linkText: "Go to Burn Portal",
      color: "bg-red-900/20"
    },
    {
      icon: <FaBriefcase className="text-sm" />,
      title: "Pedro Jobs",
      description: "Submit your CV on our jobs platform - a portion of the PEDRO used for submissions is burned.",
      link: "https://jobs.pedro.online",
      linkText: "Visit Pedro Jobs",
      color: "bg-green-900/20"
    },
    {
      icon: <FaPalette className="text-sm" />,
      title: "NFT Generator",
      description: "Create unique NFTs - the PEDRO used for generation is partially burned, fueling ecosystem growth.",
      link: "https://nft.pedro.online",
      linkText: "Create NFT",
      color: "bg-blue-900/20"
    },
    {
      icon: <FaExchangeAlt className="text-sm" />,
      title: "DEX Platforms",
      description: "Participate in liquidity pool burns on decentralized exchanges that support PEDRO trading pairs.",
      link: "#",
      linkText: "View DEX List",
      color: "bg-purple-900/20"
    }
  ];

  const economicImpacts = [
    {
      title: "Supply Reduction",
      description: "Each burn permanently removes tokens from circulation, reducing total supply.",
      icon: "📉"
    },
    {
      title: "Value Increase",
      description: "With reduced supply, the relative value of each remaining token increases.",
      icon: "💎"
    },
    {
      title: "Holder Rewards",
      description: "Long-term holders benefit from the appreciating value of their tokens.",
      icon: "🏆"
    }
  ];

  return (
    <>
      <Head>
        <title>WHY BURN PEDRO</title>
        <meta name="description" content="Understanding the benefits of burning PEDRO tokens and where to burn them" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden font-mono">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/wallpaper7.png"
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
              className="text-4xl md:text-7xl font-bold mb-5 bg-clip-text text-white"
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
              className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>
        </section>

        <div className="relative z-10 container mx-auto px-4 pb-16 max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 p-6 rounded-xl border border-white/10 mx-auto backdrop-blur-sm"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The PEDRO Burn Mechanism</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-300">
                Interactive visualization of how burning benefits the entire ecosystem
              </p>
            </div>

            <PedroBurnDiagram />

            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-6">Detailed Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-black/40 p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className={`flex items-center justify-center w-10 h-10 mb-4 mx-auto rounded-lg ${benefit.color.replace('text', 'bg')}/20`}>
                      {benefit.icon}
                    </div>
                    <h3 className={`text-xl font-bold text-center mb-3 ${benefit.color}`}>{benefit.title}</h3>
                    <p className="text-gray-300 text-center text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-6">Where You Can Burn PEDRO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {burnPlatforms.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`${platform.color} p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${platform.color.replace('bg', 'bg-opacity-50')}`}>
                        {platform.icon}
                      </div>
                      <h4 className="text-xl font-bold">{platform.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-5">{platform.description}</p>
                    <motion.a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-4 py-2 bg-white hover:bg-black text-black hover:text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {platform.linkText}
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-black/60 p-6 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-center mb-6">Economic Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {economicImpacts.map((impact, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="text-2xl mb-2">{impact.icon}</div>
                    <h4 className="font-semibold text-lg mb-2">{impact.title}</h4>
                    <p className="text-gray-300 text-sm">
                      {impact.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white hover:bg-black text-black hover:text-white rounded-lg transition-colors font-medium"
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