'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { useState } from 'react';
import { FaFire, FaChartLine, FaShieldAlt, FaPercentage, FaDollarSign, FaExchangeAlt, FaBriefcase, FaPalette } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

// Type definitions
type RootNode = {
  id: string;
  title: string;
  type: 'root';
  icon: React.ReactNode;
  color: string;
};

type CategoryNode = {
  id: string;
  title: string;
  type: 'category';
  icon: React.ReactNode;
  color: string;
  benefits: string[];
};

type ActionNode = {
  id: string;
  title: string;
  type: 'action';
  icon: React.ReactNode;
  color: string;
  platforms: string[];
};

type NodeData = RootNode | CategoryNode | ActionNode;

interface Connection {
  from: string;
  to: string;
}

interface NodeProps {
  node: NodeData;
  index: number;
}

interface ConnectionProps {
  from: string;
  to: string;
}

const PedroBurnDiagram = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: NodeData[] = [
    {
      id: 'why-burn',
      title: 'WHY BURN PEDRO?',
      type: 'root',
      icon: <FaFire className="text-amber-400" size={20} />,
      color: 'bg-gradient-to-r from-amber-500 to-yellow-500'
    },
    {
      id: 'economic',
      title: 'ECONOMIC BENEFITS',
      type: 'category',
      icon: <FaDollarSign className="text-emerald-400" size={18} />,
      color: 'bg-gradient-to-r from-emerald-500 to-green-500',
      benefits: [
        'Price Appreciation',
        'Holder Protection',
        'Increased Token Value'
      ]
    },
    {
      id: 'community',
      title: 'COMMUNITY BENEFITS',
      type: 'category',
      icon: <FaChartLine className="text-blue-400" size={18} />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      benefits: [
        'Community Engagement',
        'Sustainable Growth'
      ]
    },
    {
      id: 'where-burn',
      title: 'WHERE TO BURN',
      type: 'action',
      icon: <FaFire className="text-red-400" size={20} />,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      platforms: [
        'Burn Portal',
        'Pedro Jobs',
        'NFT Generator',
        'DEX Platforms'
      ]
    }
  ];

  const connections: Connection[] = [
    { from: 'why-burn', to: 'economic' },
    { from: 'economic', to: 'community' },
    { from: 'community', to: 'where-burn' }
  ];

  const Node = ({ node, index }: NodeProps) => {
    const isActive = activeNode === node.id;
    const isHovered = hoveredNode === node.id;
    const isRelated = hoveredNode && 
      (connections.some(conn => conn.from === node.id && conn.to === hoveredNode)) || 
      (connections.some(conn => conn.from === hoveredNode && conn.to === node.id));

    return (
      <motion.div
        className={`relative mx-4 p-5 rounded-xl cursor-pointer w-56
          ${isActive || isHovered ? node.color : 'bg-gray-800 border border-gray-700'}
          shadow-lg transition-all duration-300 flex flex-col items-center z-10`}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setHoveredNode(node.id)}
        onHoverEnd={() => setHoveredNode(null)}
        onClick={() => setActiveNode(isActive ? null : node.id)}
        animate={{
          opacity: isRelated && !isHovered ? 0.8 : 1,
          scale: isRelated && !isHovered ? 0.95 : 1,
        }}
      >
        <div className={`p-3 rounded-full mb-3 ${isActive || isHovered ? 'bg-white/20' : 'bg-black/30'}`}>
          {node.icon}
        </div>
        <h3 className={`font-bold text-center mb-3 text-sm ${isActive || isHovered ? 'text-white' : 'text-gray-200'}`}>
          {node.title}
        </h3>

        {node.type === 'category' && (
          <ul className="space-y-1 text-left w-full px-2">
            {node.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <span className={`mr-2 text-xs ${isActive || isHovered ? 'text-white' : 'text-gray-400'}`}>•</span>
                <span className={`text-xs ${isActive || isHovered ? 'text-white/90' : 'text-gray-300'}`}>
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        )}

        {node.type === 'action' && (
          <div className="grid grid-cols-2 gap-2 w-full mt-2">
            {node.platforms.map((platform, i) => (
              <div 
                key={i} 
                className={`p-1 rounded text-center text-xs ${isActive || isHovered ? 'bg-white/20' : 'bg-black/30'}`}
              >
                {platform}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const Connection = ({ from, to }: ConnectionProps) => {
    return (
      <motion.div 
        className="relative h-px bg-gray-600 mx-2 my-auto flex-grow"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute h-full bg-white origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hoveredNode === from || hoveredNode === to ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  const getNodeDescription = (nodeId: string): string => {
    const descriptions: Record<string, string> = {
      'why-burn': 'Burning PEDRO tokens creates a deflationary mechanism that benefits all holders through controlled supply reduction.',
      'economic': 'Economic benefits include price appreciation through scarcity, holder protection against inflation, and increased proportional token value.',
      'community': 'Community benefits include heightened engagement during burn events and sustainable ecosystem growth through balanced tokenomics.',
      'where-burn': 'Multiple platforms exist for burning PEDRO, each serving different ecosystem functions while contributing to supply reduction.'
    };
    return descriptions[nodeId] || '';
  };

  return (
    <div className="relative w-full bg-gray-900/50 rounded-2xl border border-gray-700 mt-12 overflow-hidden p-8">
      <div className="flex items-center justify-center">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <Node node={node} index={index} />
            {index < nodes.length - 1 && (
              <Connection from={nodes[index].id} to={nodes[index + 1].id} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 px-6 pb-4">
        <motion.div 
          className="max-w-4xl mx-auto bg-gray-800/90 p-4 rounded-lg border border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: activeNode ? 1 : 0.7,
            y: activeNode ? 0 : 20
          }}
        >
          <p className="text-gray-300 text-center text-sm">
            {activeNode 
              ? getNodeDescription(activeNode) 
              : "Click on any node to learn more about PEDRO token burning"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const PriceReductionChart = () => {
  interface ChartData {
    milestone: string;
    burned: number;
    reduction: number;
    price: string;
    color: string;
  }

  const data: ChartData[] = [
    { milestone: 'Current', burned: 0, reduction: 0, price: '100%', color: '#64748b' },
    { milestone: '400M Burned', burned: 400, reduction: 50, price: '50%', color: '#f59e0b' },
    { milestone: '500M Burned', burned: 500, reduction: 75, price: '25%', color: '#ef4444' },
    { milestone: '600M Burned', burned: 600, reduction: 87.5, price: '12.5%', color: '#10b981' },
    { milestone: '700M Burned', burned: 700, reduction: 93.75, price: '6.25%', color: '#3b82f6' },
    { milestone: '800M Burned', burned: 800, reduction: 96.875, price: '3.125%', color: '#8b5cf6' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          axisLine={false}
        />
        <YAxis 
          dataKey="milestone" 
          type="category" 
          width={120}
          tick={{ fontSize: 14 }}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value: number | string, name: string) => {
            if (name === 'price') return [`Service price: ${value} of original`, ''];
            return [value, name];
          }}
          contentStyle={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
          }}
        />
        <Bar 
          dataKey="reduction" 
          name="Price Reduction"
          animationDuration={1500}
          radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList 
            dataKey="price" 
            position="right" 
            fill="#ffffff"
            fontSize={14}
            offset={10}
          />
        </Bar>
        
        <Bar 
          dataKey="burned" 
          name="Tokens Burned"
          stackId="a"
          fill="transparent"
        >
          <LabelList 
            dataKey="burned" 
            position="left" 
            fill="#94a3b8"
            fontSize={12}
            offset={-80}
            formatter={(value: number) => value > 0 ? `${value}M $PEDRO` : ''}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface BurnPlatform {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  color: string;
}

interface EconomicImpact {
  title: string;
  description: string;
  icon: string;
}

export default function PedroBurnBenefits() {
  const benefits: BenefitItem[] = [
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

  const burnPlatforms: BurnPlatform[] = [
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

  const economicImpacts: EconomicImpact[] = [
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
        <title>WHY BURN</title>
        <meta name="description" content="Understanding the benefits of burning PEDRO tokens and where to burn them" />
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
              className="text-4xl md:text-7xl font-bold mb-5 bg-clip-text text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              WHY BURN
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
              <h3 className="text-3xl font-bold text-center mb-6">Service Price Reduction Schedule</h3>
              <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
                Every 100M $PEDRO burned reduces ecosystem service prices by 50% starting at 400M burned
              </p>
              
              <div className="h-[500px] w-full bg-black/40 p-4 rounded-xl border border-white/10">
                <PriceReductionChart />
              </div>
            </div>

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