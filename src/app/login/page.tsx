'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { JSX, useState, useEffect, useCallback } from 'react';
import { FaSearch, FaUserTie, FaCode, FaGlobe, FaCheck, FaPaintBrush, FaChartLine, FaLock, FaDev, FaDeaf, FaEdit, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import WalletAuthGuard2 from "@/components/WalletAuthGuard2";

interface SkillPillProps {
  skill: string;
  selected: boolean;
  onClick: () => void;
  icon: JSX.Element;
  colorClass: string;
}

interface FormData {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  bio: string;
  telegram: string;
  x: string;
  github: string;
  email: string;
  phone: string;
  portfolio: string;
  cv: string;
  profilePicture: string;
  injectiveRole: string;
  languages: string[];
  available: boolean;
  monthlyRate: string;
  discord: string;
}

interface SkillCategoryProps {
  category: keyof typeof skillCategories;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  skillIcons: Record<string, React.ReactNode>;
  handleSkillToggle: (skill: string) => void;
}

interface SubmissionStatus {
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  lastUpdated: string;
}

const skillCategories: Record<string, string[]> = {
  security: [
    'Cryptography',
    'Multi-Sig',
    'MPC',
    'TEEs',
    'HSMs',
    'Bug Bounty',
    'Smart Contract Audits'
  ],
  community: [
    'Community Manager', 
    'Social Media',
    'Content Creator', 
    'Influencer', 
    'AMA Host', 
    'Memes',
    'Event Coordinator',
    'Moderator',
    'Engagement Specialist',
    'Brand Ambassador',
    'Community Analytics',
    'Collab Manager',
  ],
  creative: [
    'NFT Creator',
    'Pixel Art',
    '3D Modeling',
    'Blender',
    'NFT Marketing',
    'AI Art Generation',
    'Motion Graphics',
    'Concept Art',
    'Illustration',
    'Graphic Design',
    'Animation',
    'Augmented Reality (AR) Art',
    'Virtual Reality (VR) Art',
    'Game Asset Design',
    'Metaverse Content Creation',
  ],
  management: [
    'DAO Contributor', 
    'Governance Expert', 
    'Event Organizer',
    'Grant Writer', 
    'KOL Outreach', 
    'Project Manager', 
    'Crypto Educator', 
    'Whitepaper',
    'Strategic Planning',
    'Operations Management',
    'Risk Assessment',
    'Budgeting & Financial Planning',
    'Stakeholder Relations',
    'Team Leadership',
    'Negotiation & Conflict Resolution',
    'Process Optimization',
    'Tokenomics Strategy',
    'Web3 Business Development'
  ],
  blockchain: [
    'Solidity', 'Rust', 'Move', 'Golang', 'Substrate',
    'CosmWasm', 'ZK Circuits', 'EVM', 'SVM'
  ],
  defi: [
    'AMMs', 'Lending Protocols', 'Derivatives', 'Yield Farming',
    'Liquid Staking', 'RWA Tokenization',
    'MEV Protection', 'Perpetuals', 'Portfolio Management',
    'Treasury Management', 'Cross-Margin'
  ]
};

const skillIcons: Record<string, JSX.Element> = {
  'Cryptography': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">CRY</div>,
  'Multi-Sig': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">MS</div>,
  'MPC': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">MPC</div>,
  'TEEs': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">TEE</div>,
  'HSMs': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">HSM</div>,
  'Bug Bounty': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">BUG</div>,
  'Smart Contract Audits': <div className="w-6 h-6 rounded-md bg-red-900/50 flex items-center justify-center text-red-200 font-mono text-xs">AUD</div>,
  'Community Manager': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">CM</div>,
  'Social Media': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">SMM</div>,
  'Content Creator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">CC</div>,
  'Influencer': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">INF</div>,
  'AMA Host': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">AMA</div>,
  'Memes': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">MEME</div>,
  'Event Coordinator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">EVT</div>,
  'Moderator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">MOD</div>,
  'Engagement Specialist': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">ENG</div>,
  'Brand Ambassador': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">BA</div>,
  'Community Analytics': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">CA</div>,
  'Collab Manager': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">COL</div>,
  'NFT Creator': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">NFT</div>,
  'Pixel Art': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">PXL</div>,
  '3D Modeling': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">3D</div>,
  'Blender': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">BLE</div>,
  'NFT Marketing': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">NFT</div>,
  'AI Art Generation': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">ART</div>,
  'Motion Graphics': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">GRP</div>,
  'Concept Art': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">ART</div>,
  'Illustration': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">ILL</div>,
  'Graphic Design': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">GD</div>,
  'Animation': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">ANI</div>,
  'Augmented Reality (AR) Art': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">AR</div>,
  'Virtual Reality (VR) Art': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">VR</div>,
  'Game Asset Design': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">GAD</div>,
  'Metaverse Content Creation': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">MCC</div>,
  'DAO Contributor': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">DAO</div>,
  'Governance Expert': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">GOV</div>,
  'Event Organizer': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">EVT</div>,
  'Grant Writer': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">GRNT</div>,
  'KOL Outreach': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">KOL</div>,
  'Project Manager': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">PM</div>,
  'Crypto Educator': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">EDU</div>,
  'Whitepaper': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">WP</div>,
  'Strategic Planning': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">STRAT</div>,
  'Operations Management': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">OPS</div>,
  'Risk Assessment': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">RISK</div>,
  'Budgeting & Financial Planning': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">BUDG</div>,
  'Stakeholder Relations': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">STKH</div>,
  'Team Leadership': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">LEAD</div>,
  'Negotiation & Conflict Resolution': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">NEG</div>,
  'Process Optimization': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">OPT</div>,
  'Tokenomics Strategy': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">TOK</div>,
  'Web3 Business Development': <div className="w-6 h-6 rounded-md bg-pink-900/50 flex items-center justify-center text-pink-200 font-mono text-xs">W3BD</div>,
  'Solidity': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">SOL</div>,
  'Rust': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">RST</div>,
  'Move': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">MOV</div>,
  'Golang': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">GO</div>,
  'Substrate': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">SUB</div>,
  'CosmWasm': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">CW</div>,
  'EVM': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">EVM</div>,
  'SVM': <div className="w-6 h-6 rounded-md bg-cyan-900/50 flex items-center justify-center text-cyan-200 font-mono text-xs">SVM</div>,
  'AMMs': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">AMM</div>,
  'Lending Protocols': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">LND</div>,
  'Derivatives': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">DRV</div>,
  'Yield Farming': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">YLD</div>,
  'Liquid Staking': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">LST</div>,
  'RWA Tokenization': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">RWA</div>,
  'MEV Protection': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">MEV</div>,
  'Perpetuals': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">PERP</div>,
  'Portfolio Management': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">PM</div>,
  'Treasury Management': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">TRSY</div>,
  'Cross-Margin': <div className="w-6 h-6 rounded-md bg-amber-900/50 flex items-center justify-center text-amber-200 font-mono text-xs">XM</div>,
};

const educationLevels = [
  'High School',
  'Vocational School',
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Self-Taught',
  'Other'
];

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Democratic Republic)', 'Congo (Republic)', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const languages = [
  'English', 'Mandarin', 'Hindi', 'Spanish', 'French', 'Arabic', 'Bengali',
  'Russian', 'Portuguese', 'Indonesian', 'Urdu', 'German', 'Japanese',
  'Swahili', 'Marathi', 'Telugu', 'Turkish', 'Tamil', 'Vietnamese', 'Korean',
  'Punjabi', 'Persian', 'Malay', 'Italian', 'Thai', 'Dutch',
  'Hausa', 'Tagalog', 'Burmese', 'Polish', 'Ukrainian', 'Greek', 'Hungarian'
];

const injectiveRoles = ['Ninja', 'Warrior', 'Knight', 'Ronin', 'Leader'];

export default function ViewSubmission() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storedAddress, setStoredAddress] = useState<string>('None');
  const [walletType, setStoredWallet] = useState<string>('None');
  const [originalFormData, setOriginalFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const checkAddress = () => {
      const currentAddress = localStorage.getItem("connectedWalletAddress");
      const currentWalletType = localStorage.getItem("connectedWalletType");

      if (currentAddress && currentAddress !== storedAddress) {
        setStoredAddress(currentAddress);
      }

      if (currentWalletType && currentWalletType !== walletType) {
        setStoredWallet(currentWalletType);
      }
    };

    const interval = setInterval(checkAddress, 1000);
    return () => clearInterval(interval);
  }, [storedAddress, walletType]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/talent_retrieve/${storedAddress}/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }

        const data = await response.json();
        
        if (data.info === "no") {
          setFormData(null);
          setSubmissionStatus(null);
          return;
        }

        const mappedData: FormData = {
          name: data.Name || '',
          role: data.Role || '',
          skills: data.Skills ? data.Skills.split(', ').map((s: string) => s.trim()) : [],
          experience: data.Experience || '',
          education: data.Education || '',
          location: data.Location || '',
          bio: data.Bio || '',
          telegram: data.Telegram || '',
          x: data.X || '',
          github: data.Github || '',
          email: data.Email || '',
          phone: data.Phone || '',
          portfolio: data.Portfolio || '',
          cv: data.CV || '',
          profilePicture: data['Image url'] || '',
          injectiveRole: data['Injective Role'] || '',
          languages: data.Languages ? data.Languages.split(', ').map((l: string) => l.trim()) : [],
          available: data.Availability === 'Yes',
          monthlyRate: data['Monthly Rate'] || '',
          discord: data.Discord || ''
        };

        setFormData(mappedData);
        setOriginalFormData(mappedData);
        setSubmissionStatus({
          status: data.Status.toLowerCase() as 'pending' | 'approved' | 'rejected',
          feedback: '',
          lastUpdated: data['Submission date'] || new Date().toISOString()
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (storedAddress && storedAddress !== 'None') {
      fetchSubmission();
    }
  }, [storedAddress]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("connectedWalletAddress");
    localStorage.removeItem("connectedWalletType");
    window.location.href = '/login';
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      if (originalFormData) {
        setFormData(originalFormData);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!formData) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://127.0.0.1:8000/talent_update/${storedAddress}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update submission');
      }
      
      setIsEditing(false);
      const updatedData = await response.json();

      setSubmissionStatus({
        status: updatedData.Status.toLowerCase() as 'pending' | 'approved' | 'rejected',
        feedback: '',
        lastUpdated: updatedData['Submission date'] || new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update submission');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = () => {
    if (!submissionStatus) return null;

    const statusConfig = {
      pending: {
        color: 'bg-yellow-500/20 text-yellow-400',
        icon: <FaClock className="mr-1" />,
        text: 'Pending Review'
      },
      approved: {
        color: 'bg-green-500/20 text-green-400',
        icon: <FaCheckCircle className="mr-1" />,
        text: 'Approved'
      },
      rejected: {
        color: 'bg-red-500/20 text-red-400',
        icon: <FaTimesCircle className="mr-1" />,
        text: 'Rejected'
      }
    };

    const config = statusConfig[submissionStatus.status];

    return (
      <div className={`${config.color} px-4 py-2 rounded-full flex items-center justify-center mb-6`}>
        {config.icon}
        <span className="font-medium">{config.text}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <WalletAuthGuard2>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </WalletAuthGuard2>
    );
  }

  if (error) {
    return (
      <WalletAuthGuard2>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-red-500/30 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Error Loading Submission</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black hover:bg-black hover:text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </WalletAuthGuard2>
    );
  }

  if (!formData) {
    return (
      <WalletAuthGuard2>
        <div className="min-h-screen bg-black text-white overflow-hidden font-mono relative">
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

          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center p-6 bg-gray-950 rounded-xl border border-white/10 max-w-md backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">No Submission Found</h2>
              <p className="text-gray-300 mb-6">You haven't submitted your CV yet.</p>
              <button
                onClick={() => window.location.href = '/uploadcv'}
                className="px-6 py-2 bg-white text-black hover:bg-black hover:text-white rounded-lg transition-colors"
              >
                Submit CV
              </button>
            </div>
          </div>
        </div>
      </WalletAuthGuard2>
    );
  }

  return (
    <WalletAuthGuard2>
      <>
        <Head>
          <title>View Submission | Talent Pool</title>
          <meta name="description" content="View your talent pool submission status" />
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
                SUBMISSION STATUS
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-center w-full">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Wallet Address</h3>
                    <p className="text-xl font-mono text-white truncate px-2" title={storedAddress || ''}>
                      {storedAddress ? `${storedAddress.slice(0, 6)}...${storedAddress.slice(-4)}` : 'Not connected'}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Submission Status</h3>
                  <p className="text-xl font-bold text-white capitalize">
                    {submissionStatus?.status || 'Unknown'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
                  <p className="text-sm font-mono text-white">
                    {submissionStatus?.lastUpdated ? new Date(submissionStatus.lastUpdated).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="text-center w-full">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Wallet Disconnect</h3>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 text-black bg-white hover:bg-black hover:text-white px-4 py-2 rounded-full transition-colors w-full mx-auto max-w-[180px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm font-medium">Disconnect</span>
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 p-6 rounded-xl border border-white/10 mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                {renderStatusBadge()}
                {submissionStatus?.status !== 'pending' && (
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? 'bg-gray-700' : 'bg-white hover text-black'}`}
                  >
                    <FaEdit />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>

              {submissionStatus?.status === 'rejected' && submissionStatus.feedback && (
                <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-red-300 mb-2">Feedback from Reviewers:</h4>
                  <p className="text-gray-300">{submissionStatus.feedback}</p>
                </div>
              )}

              {submissionStatus?.status === 'approved' && submissionStatus.feedback && (
                <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-green-300 mb-2">Feedback from Reviewers:</h4>
                  <p className="text-gray-300">{submissionStatus.feedback}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                      <FaUserTie />
                      Personal Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Web3 Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => isEditing && setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Role/Title</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={(e) => isEditing && setFormData({...formData, role: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={(e) => isEditing && setFormData({...formData, experience: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Highest Education</label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={(e) => isEditing && setFormData({...formData, education: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={(e) => isEditing && setFormData({...formData, location: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Profile Picture URL</label>
                      <input
                        type="url"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={(e) => isEditing && setFormData({...formData, profilePicture: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Your Role in Injective</label>
                      <input
                        type="text"
                        name="injectiveRole"
                        value={formData.injectiveRole}
                        onChange={(e) => isEditing && setFormData({...formData, injectiveRole: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Monthly Rate</label>
                      <input
                        type="text"
                        name="monthlyRate"
                        value={formData.monthlyRate}
                        onChange={(e) => isEditing && setFormData({...formData, monthlyRate: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                      <FaGlobe />
                      Contact Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => isEditing && setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => isEditing && setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Telegram</label>
                      <input
                        type="text"
                        name="telegram"
                        value={formData.telegram}
                        onChange={(e) => isEditing && setFormData({...formData, telegram: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">X (Twitter)</label>
                      <input
                        type="text"
                        name="x"
                        value={formData.x}
                        onChange={(e) => isEditing && setFormData({...formData, x: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={(e) => isEditing && setFormData({...formData, github: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Portfolio Website</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={(e) => isEditing && setFormData({...formData, portfolio: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">CV/Resume URL</label>
                      <input
                        type="url"
                        name="cv"
                        value={formData.cv}
                        onChange={(e) => isEditing && setFormData({...formData, cv: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Discord Name</label>
                      <input
                        type="text"
                        name="discord"
                        value={formData.discord}
                        onChange={(e) => isEditing && setFormData({...formData, discord: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                    <FaGlobe />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.languages.map(language => (
                      <span 
                        key={language} 
                        className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                    <FaCode />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                    <FaUserTie />
                    Bio/Description
                  </h3>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => isEditing && setFormData({...formData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={5}
                    className={`w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={(e) => isEditing && setFormData({...formData, available: e.target.checked})}
                    disabled={!isEditing}
                    className={`h-5 w-5 rounded border-gray-600 bg-white text-purple-600 focus:ring-purple-500 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                  <label htmlFor="available" className="ml-2 text-gray-300">
                    Currently available for work
                  </label>
                </div>
                
                {isEditing && (
                  <div className="pt-4">
                    <motion.button
                      type="button"
                      onClick={handleSaveChanges}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className={`w-full ${isLoading ? 'bg-gray-600' : 'bg-white hover:bg-black text-black hover:text-white'} font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </>
    </WalletAuthGuard2>
  );
}