'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import React from "react";
import { useState } from 'react';
import { FaFire, FaChartLine, FaShieldAlt, FaPercentage, FaDollarSign, FaExchangeAlt, FaBriefcase, FaPalette } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

type RootNode = {
  id: string;
  title: string;
  type: 'root';
  icon: React.ReactNode;
};

type CategoryNode = {
  id: string;
  title: string;
  type: 'category';
  icon: React.ReactNode;
  benefits: string[];
};

type ActionNode = {
  id: string;
  title: string;
  type: 'action';
  icon: React.ReactNode;
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
  isMobile: boolean;
}

interface ConnectionProps {
  from: string;
  to: string;
  isMobile: boolean;
}

const PedroBurnDiagram = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const nodes: NodeData[] = [
    {
      id: 'why-burn',
      title: 'WHY BURN PEDRO?',
      type: 'root',
      icon: <FaFire className="text-white" size={isMobile ? 16 : 20} />,
    },
    {
      id: 'economic',
      title: 'ECONOMIC BENEFITS',
      type: 'category',
      icon: <FaDollarSign className="text-white" size={isMobile ? 14 : 18} />,
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
      icon: <FaChartLine className="text-white" size={isMobile ? 14 : 18} />,
      benefits: [
        'Community Engagement',
        'Sustainable Growth'
      ]
    },
    {
      id: 'where-burn',
      title: 'WHERE TO BURN',
      type: 'action',
      icon: <FaFire className="text-white" size={isMobile ? 16 : 20} />,
      platforms: [
        'Burn Portal',
        'Submitting CV',
        'NFT Generator',
        'More Incoming'
      ]
    }
  ];

  const connections: Connection[] = [
    { from: 'why-burn', to: 'economic' },
    { from: 'economic', to: 'community' },
    { from: 'community', to: 'where-burn' }
  ];

  const Node = ({ node, index, isMobile }: NodeProps) => {
    const isActive = activeNode === node.id;
    const isHovered = hoveredNode === node.id;
    const isRelated = hoveredNode && 
      (connections.some(conn => conn.from === node.id && conn.to === hoveredNode) || 
      connections.some(conn => conn.from === hoveredNode && conn.to === node.id));

    return (
      <motion.div
        className={`relative ${isMobile ? 'my-2 w-full' : 'mx-2 w-48'} p-4 rounded-xl cursor-pointer min-h-[180px]
          ${isActive || isHovered ? 'bg-white text-black' : 'bg-black/80 text-white border border-white/30'}
          shadow-lg transition-all duration-300 flex flex-col z-10 backdrop-blur-sm`}
        whileHover={{ scale: isMobile ? 1 : 1.05 }}
        onHoverStart={() => !isMobile && setHoveredNode(node.id)}
        onHoverEnd={() => !isMobile && setHoveredNode(null)}
        onClick={() => setActiveNode(isActive ? null : node.id)}
        animate={{
          opacity: isRelated && !isHovered ? 0.8 : 1,
          scale: isRelated && !isHovered ? 0.95 : 1,
        }}
      >
        <div className="flex flex-col items-center">
          <div className={`p-2 rounded-full mb-2 ${isActive || isHovered ? 'bg-black/20' : 'bg-white/10'}`}>
            {node.icon}
          </div>
          <h3 className={`font-bold text-center mb-2 text-xs ${isActive || isHovered ? 'text-black' : 'text-white'}`}>
            {node.title}
          </h3>
        </div>

        <div className="flex-grow flex flex-col justify-center">
          {node.type === 'root' && (
            <div className="flex items-center justify-center h-full">
              <p className={`text-[10px] text-center ${isActive || isHovered ? 'text-black/90' : 'text-white'}`}>
                Explore the benefits of burning PEDRO tokens.
              </p>
            </div>
          )}

          {node.type === 'category' && (
            <ul className="space-y-1 text-left w-full px-1">
              {node.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <span className={`mr-1 text-[10px] ${isActive || isHovered ? 'text-black' : 'text-white'}`}>•</span>
                  <span className={`text-[10px] ${isActive || isHovered ? 'text-black/90' : 'text-white'}`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {node.type === 'action' && (
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-1 w-full`}>
              {node.platforms.map((platform, i) => (
                <div 
                  key={i} 
                  className={`p-1 rounded text-center text-[10px] flex items-center justify-center ${isActive || isHovered ? 'bg-black/20' : 'bg-white/10'}`}
                >
                  {platform}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const Connection = ({ from, to, isMobile }: ConnectionProps) => {
    if (isMobile) {
      return (
        <motion.div 
          className="relative w-px h-4 bg-white/30 my-1 mx-auto"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute w-full bg-white origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: hoveredNode === from || hoveredNode === to ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        className="relative h-px bg-white/30 mx-1 my-auto flex-grow"
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
    <div className="relative w-full bg-black/50 rounded-2xl border border-white/30 mt-8 overflow-hidden p-2 md:p-8 backdrop-blur-sm">
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'items-center justify-center'} relative z-10`}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <Node node={node} index={index} isMobile={isMobile} />
            {index < nodes.length - 1 && (
              <Connection from={nodes[index].id} to={nodes[index + 1].id} isMobile={isMobile} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 px-2 md:px-6 pb-2">
        <motion.div 
          className="max-w-7xl mx-auto bg-black/50 p-3 rounded-lg border border-white/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: activeNode ? 1 : 0.7,
            y: activeNode ? 0 : 0
          }}
        >
          <p className="text-white text-center text-xs md:text-sm">
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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  interface ChartData {
    milestone: string;
    burned: number;
    reduction: number;
    price: string;
    priceValue: number;
  }

  const data: ChartData[] = [
    { milestone: '300M', burned: 300, reduction: 0, price: '100%', priceValue: 1.0 },
    { milestone: '400M', burned: 400, reduction: 50, price: '50%', priceValue: 0.5 },
    { milestone: '500M', burned: 500, reduction: 75, price: '25%', priceValue: 0.25 },
    { milestone: '600M', burned: 600, reduction: 87.5, price: '12.5%', priceValue: 0.125 },
    { milestone: '700M', burned: 700, reduction: 93.75, price: '6.25%', priceValue: 0.0625 },
    { milestone: '800M', burned: 800, reduction: 96.875, price: '3.125%', priceValue: 0.03125 },
  ];

  const originalPrice = 100000;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPrice = originalPrice * payload[0].payload.priceValue;
      return (
        <div className="bg-black/90 p-3 rounded-lg border border-white/30 text-xs">
          <p className="font-bold">{payload[0].payload.milestone} Burned</p>
          <p className="text-white/80">Price Reduction: {payload[0].payload.price}</p>
          <p className="text-green-400">CV Submitting: ~{Math.round(currentPrice / 1000)}k $PEDRO</p>
          <p className="text-purple-400">NFT Generator: ~{Math.round(currentPrice / 1000)}k $PEDRO</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-sm font-bold">Tokens Burned</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={isMobile ? 
            { top: 5, right: 5, left: 5, bottom: 20 } : 
            { top: 10, right: 20, left: 40, bottom: 30 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" horizontal={false} />
          
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            axisLine={false}
            tick={{ fill: 'white', fontSize: isMobile ? 8 : 10 }}
            tickMargin={isMobile ? 5 : 10}
          />
          
          <YAxis 
            dataKey="milestone" 
            type="category" 
            width={isMobile ? 30 : 60}
            tick={{ fontSize: isMobile ? 9 : 11, fill: 'white' }}
            axisLine={false}
            tickMargin={isMobile ? 5 : 10}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar 
            dataKey="reduction" 
            name="Price Reduction"
            animationDuration={1500}
            radius={[0, 4, 4, 0]}
            fill="#ffffff80"
          >
            <LabelList 
              dataKey="price" 
              position="right" 
              fill="#ffffff"
              fontSize={isMobile ? 9 : 11}
              offset={isMobile ? 5 : 10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function PedroBurnBenefits() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const benefits = [
    {
      icon: <FaChartLine className="text-xs md:text-sm" />,
      title: "Price Appreciation",
      description: "Burning PEDRO reduces the total supply, creating scarcity which can lead to price appreciation over time.",
    },
    {
      icon: <FaShieldAlt className="text-xs md:text-sm" />,
      title: "Holder Protection",
      description: "Token burns help protect holders from inflation by systematically reducing circulating supply.",
    },
    {
      icon: <FaPercentage className="text-xs md:text-sm" />,
      title: "Increased Value",
      description: "With fewer tokens in circulation, each remaining PEDRO becomes more valuable proportionally.",
    },
    {
      icon: <FaDollarSign className="text-xs md:text-sm" />,
      title: "Economic Incentives",
      description: "Burns create economic incentives for long-term holding and community participation.",
    },
    {
      icon: <FaFire className="text-xs md:text-sm" />,
      title: "Community Engagement",
      description: "Burn events generate excitement and engagement within the PEDRO community.",
    },
    {
      icon: <FaChartLine className="text-xs md:text-sm" />,
      title: "Sustainable Growth",
      description: "Controlled burns support sustainable ecosystem growth by balancing supply and demand.",
    }
  ];

  const burnPlatforms = [
    {
      icon: <FaFire className="text-xs md:text-sm" />,
      title: "Burn Portal",
      description: "Send PEDRO to the official burn address where tokens are permanently removed.",
      link: "https://pedro-burn.vercel.app/burn",
      linkText: "Burn Pedro",
    },
    {
      icon: <FaBriefcase className="text-xs md:text-sm" />,
      title: "Pedro Jobs",
      description: "Submit your CV on our platform. The PEDRO used for submissions is burned.",
      link: "https://job.pedroinjraccoon.online/uploadcv",
      linkText: "Pedro Jobs",
    },
    {
      icon: <FaPalette className="text-xs md:text-sm" />,
      title: "NFT Generator",
      description: "Generate NFT with the layers. The PEDRO will be burned.",
      link: "https://art.pedroinjraccoon.online/nftgenerator",
      linkText: "Create NFT",
    },
    {
      icon: <FaExchangeAlt className="text-xs md:text-sm" />,
      title: "More Incoming",
      description: "More Incoming for $PEDRO & $FFI.",
      link: "https://pedroinjraccoon.online/",
      linkText: "Main Page",
    }
  ];

  return (
    <>
      <Head>
        <title>WHY BURN</title>
        <meta name="description" content="Understanding the benefits of burning PEDRO tokens and where to burn them" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="fixed inset-0 z-10">
        <Image
          src="/wallpaper.webp"
          alt="Background texture"
          layout="fill"
          objectFit="cover"
          className="opacity-20 mix-blend-overlay"
          priority
        />
      </div>

      <div className="min-h-screen text-white overflow-hidden font-mono relative">
        <section className="flex items-center justify-center py-4 md:py-12 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="px-4 max-w-4xl relative z-10"
          >
            <motion.h1
              className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-bold mb-4 text-white`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              PEDRO REASON
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
              className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>
        </section>

        <div className="relative z-10 container mx-auto px-2 md:px-4 pb-8 max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black p-3 md:p-6 rounded-xl border border-white/30 mx-auto backdrop-blur-sm bg-opacity-20"
          >
            <div className="text-center mb-3 md:mb-5">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold mb-3`}>The PEDRO Burn</h2>
            </div>

            <PedroBurnDiagram />

            <div className="mt-6 md:mt-12">
              <h3 className={`${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-center mb-3 md:mb-5`}>Price Reduction</h3>
              
              <div className={`w-full bg-black/50 p-2 md:p-4 rounded-xl border border-white/30 backdrop-blur-sm`}>
                <PriceReductionChart />
              </div>
            </div>

            <div className="mt-6 md:mt-12">
              <h3 className={`${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-center mb-3 md:mb-5`}>Burn Benefits</h3>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 lg:grid-cols-3 gap-3'} mt-3 md:mt-6`}>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: isMobile ? 0 : -5 }}
                    className="bg-black/50 p-3 md:p-4 rounded-xl border border-white/30 hover:border-white/50 transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 mx-auto rounded-lg bg-white/10">
                      {benefit.icon}
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-bold text-center mb-1 md:mb-2 text-white`}>{benefit.title}</h3>
                    <p className="text-white/80 text-center text-xs md:text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 md:mt-12">
              <h3 className={`${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-center mb-3 md:mb-5`}>Where Burn PEDRO</h3>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'} mt-3 md:mt-6`}>
                {burnPlatforms.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isMobile ? 0 : (index % 2 === 0 ? -20 : 20) }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    className="bg-black/50 p-3 md:p-4 rounded-xl border border-white/30 hover:border-white/50 transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/10">
                        {platform.icon}
                      </div>
                      <h4 className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-bold text-white`}>{platform.title}</h4>
                    </div>
                    <p className="text-white/80 text-xs md:text-sm mb-2 md:mb-4">{platform.description}</p>
                    <motion.a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: isMobile ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-white hover:bg-black text-black hover:text-white rounded-lg text-xs md:text-sm font-medium transition-colors border border-white"
                    >
                      {platform.linkText}
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};