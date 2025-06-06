'use client';
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { JSX, useState, useEffect, useCallback } from 'react';
import WalletAuthGuard from "@/components/WalletAuthGuard";
import { useWalletAuth } from "@/components/WalletAuthGuard";
import { FaSearch, FaUserTie, FaCode, FaGlobe, FaCheck, FaPaintBrush, FaChartLine, FaLock, FaDev, FaDeaf } from "react-icons/fa";
import { ChainId } from '@injectivelabs/ts-types';
import { BaseAccount, BroadcastModeKeplr, ChainRestAuthApi, ChainRestTendermintApi, CosmosTxV1Beta1Tx, createTransaction, getTxRawFromTxRawOrDirectSignResponse, MsgSend, TxRaw } from '@injectivelabs/sdk-ts';
import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT, getStdFee } from '@injectivelabs/utils';
import { TransactionException } from '@injectivelabs/exceptions';

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
  'Telegram Admin': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">TG</div>,
  'Social Media': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">SMM</div>,
  'Content Creator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">CC</div>,
  'Influencer': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">INF</div>,
  'AMA Host': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">AMA</div>,
  'Memes': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">MEME</div>,
  'Event Coordinator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">EVT</div>,
  'Moderator': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">MOD</div>,
  'Engagement Specialist': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">ENG</div>,
  'Brand Ambassador': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">BA</div>,
  'Collab Manager': <div className="w-6 h-6 rounded-md bg-green-900/50 flex items-center justify-center text-green-300 font-mono text-xs">COL</div>,

  'NFT Creator': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">NFT</div>,
  'Pixel Art': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">PXL</div>,
  '3D Modeling': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">3D</div>,
  'Blender': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">BLE</div>,
  'NFT Marketing': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">NFT</div>,
  'NFT Collector': <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-200 font-mono text-xs">NFT</div>,
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

const allSkills = Object.keys(skillIcons);

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

const SkillCategory: React.FC<SkillCategoryProps> = ({ 
  category, 
  title, 
  icon, 
  colorClass,
  searchTerm,
  setSearchTerm,
  formData,
  setFormData,
  skillIcons,
  handleSkillToggle
}) => {
  const skills = skillCategories[category];
  
  return (
    <div className={`bg-gray-950 p-4 rounded-xl border border-gray-800 hover:border-${colorClass}-500/30 transition-colors`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-${colorClass}-900/20`}>
          {icon}
        </div>
        <h4 className={`font-medium text-${colorClass}-100`}>{title}</h4>
      </div>

      <div className="relative mb-2">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()} skills...`}
          className={`w-full bg-white/5 border border-gray-700 rounded-lg p-2 pl-8 text-gray-200 focus:outline-none focus:ring-1 focus:ring-${colorClass}-500`}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-2 top-3 text-gray-400" />
      </div>

      <div className="relative">
        <select
          multiple
          value={formData.skills.filter(skill => skills.includes(skill))}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            const otherSkills = formData.skills.filter(skill => !skills.includes(skill));
            setFormData({
              ...formData,
              skills: [...otherSkills, ...selectedOptions]
            });
          }}
          className={`w-full bg-white/5 border border-${colorClass}-700/30 rounded-lg p-2 text-gray-200 h-auto min-h-[40px] max-h-[200px] overflow-y-auto appearance-none`}
        >
          {skills
            .filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(skill => (
              <option
                key={skill}
                value={skill}
                className="p-2 hover:bg-gray-700"
              >
                {skill}
              </option>
            ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {formData.skills
          .filter(skill => skills.includes(skill))
          .map(skill => (
            <div key={skill} className={`bg-${colorClass}-500/20 text-${colorClass}-100 px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
              {skillIcons[skill] && (
                <span className="text-xs">
                  {skillIcons[skill]}
                </span>
              )}
              {skill}
              <button 
                onClick={() => handleSkillToggle(skill)}
                className={`text-${colorClass}-300 hover:text-white`}
              >
                ×
              </button>
            </div>
          ))}
      </div>

      <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
    </div>
  );
};

const injectiveRoles = ['Ninja', 'Warrior', 'Knight', 'Ronin', 'Leader'];

const experienceYears = ['<1', '1-2', '2-3', '3-5', '5-7', '7-10', '10+'];

type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

export default function TalentForm() {
  const { logout } = useWalletAuth();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    skills: [] as string[],
    experience: '',
    education: '',
    location: '',
    bio: '',
    telegram: '',
    x: '',
    github: '',
    email: '',
    phone: '',
    portfolio: '',
    cv: '',
    profilePicture: '',
    injectiveRole: '',
    languages: [] as string[],
    available: true,
    monthlyRate: '',
    discord: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [storedAddress, setStoredAddress] = useState<string>('None');
  const [walletType, setStoredWallet] = useState<string>('None');
  const [nft_hold, setNftHold] = useState<string>('None');
  const [token_hold, setTokenHold] = useState<string>('None');
  const [searchTerm, setSearchTerm] = useState('');

  const SkillPill = ({ skill, selected, onClick, icon, colorClass }: SkillPillProps) => (
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border transition-all ${
          selected 
            ? `${colorClass} border-opacity-80 shadow-[0_0_8px_rgba(255,255,255,0.1)]` 
            : `${colorClass.replace('bg-', 'bg-opacity-10 bg-')} border-opacity-30 hover:shadow-[0_0_8px_rgba(255,255,255,0.05)]`
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate max-w-[120px]">{skill}</span>
        {selected && <FaCheck className="ml-auto text-xs flex-shrink-0" />}
      </motion.button>
  );

  useEffect(() => {
    const checkAddress = () => {
      const currentAddress = localStorage.getItem("connectedWalletAddress");
      const currentWalletType = localStorage.getItem("connectedWalletType");
      const currentNFT_Hold = localStorage.getItem("nft_hold")
      const currentToken_Hold = localStorage.getItem("token_hold")

      if (currentAddress && currentAddress !== storedAddress) {
        setStoredAddress(currentAddress);
      }

      if (currentWalletType && currentWalletType !== walletType) {
        setStoredWallet(currentWalletType);
      }

      if (currentNFT_Hold && currentNFT_Hold !== nft_hold) {
        setNftHold(currentNFT_Hold);
      }

      if (currentToken_Hold && currentToken_Hold !== token_hold) {
        setTokenHold(currentToken_Hold);
      }
    };

    const interval = setInterval(checkAddress, 1000);
    return () => clearInterval(interval);
  }, []);

  const baseAmount = nft_hold === "0" ? "100000" : "1";

  const handleLogout = useCallback(() => {
    if (logout) {
      logout();
    }
    window.location.href = '/login';
  }, [logout]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.discord.trim()) newErrors.name = 'Discord Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.bio.trim() || formData.bio.length < 50) newErrors.bio = 'Bio should be at least 50 characters';
    if (!formData.profilePicture) newErrors.profilePicture = 'Profile picture is required';
    if (!formData.injectiveRole) newErrors.injectiveRole = 'Injective role is required';

    if (formData.skills.length === 0) newErrors.skills = 'Select at least one skill';
    if (formData.languages.length === 0) newErrors.languages = 'Select at least one language';    
    
    if (!formData.profilePicture) newErrors.profilePicture = 'Profile Picture is required';
    if (!formData.cv) newErrors.cv = 'CV is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => {
      const newLanguages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      
      return {
        ...prev,
        languages: newLanguages
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    
    try {
      if (!hasPaid) {
        await handlePayment(formData);
      }
      
      setTimeout(() => {
        setIsUploading(false);
      }, 1500);
      
    } catch (error) {
      setIsUploading(false);
      setModalMessage("");
      setPaymentState('failed');
    }
  };

  const handlePayment = useCallback(async (currentFormData: FormData) => {
    if (!storedAddress) {
      throw new Error("Wallet not connected");
    }

    setPaymentState('processing');

    const submissionData = {
      ...currentFormData,
      walletAddress: storedAddress,
      walletType: walletType,
      nftHold: nft_hold,
      tokenHold: token_hold
    };

    try {
      const wallet = walletType === 'leap' ? window.leap : window.keplr;
      if (!wallet) {
        throw new Error(`${walletType} extension not installed`);
      }

      const chainId = ChainId.Mainnet;
      await wallet.enable(chainId);
      const [account] = await wallet.getOfflineSigner(chainId).getAccounts();
      const injectiveAddress = account.address;
  
      const restEndpoint = "https://sentry.lcd.injective.network:443";
      const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
      const accountDetailsResponse = await chainRestAuthApi.fetchAccount(injectiveAddress);
      if (!accountDetailsResponse) {
        throw new Error("Failed to fetch account details");
      }
      const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
  
      const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
      const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
      const latestHeight = latestBlock.header.height;
      const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);
      
      const msg = MsgSend.fromJSON({
        amount: {
          amount: new BigNumberInBase(baseAmount).times(new BigNumberInBase(10).pow(18)).toFixed(),
          denom: "factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1c6lxety9hqn9q4khwqvjcfa24c2qeqvvfsg4fm",
        },
        srcInjectiveAddress: storedAddress,
        dstInjectiveAddress: "inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49",
      });

      const pubKey = await wallet.getKey(chainId);
      if (!pubKey || !pubKey.pubKey) {
        throw new Error("Failed to retrieve public key from wallet");
      }
  
      const { txRaw: finalTxRaw, signDoc } = createTransaction({
        pubKey: Buffer.from(pubKey.pubKey).toString('base64'),
        chainId,
        fee: getStdFee(),
        message: msg,
        sequence: baseAccount.sequence,
        timeoutHeight: timeoutHeight.toNumber(),
        accountNumber: baseAccount.accountNumber,
        memo: "Send to burn wallet",
      });
  
      const offlineSigner = wallet.getOfflineSigner(chainId);
      const directSignResponse = await offlineSigner.signDirect(injectiveAddress, signDoc);
  
      const txRawSigned = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
  
      const broadcastTx = async (chainId: string, txRaw: TxRaw) => {
        const result = await wallet.sendTx(
          chainId,
          CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
          BroadcastModeKeplr.Sync,
        );
  
        if (!result || result.length === 0) {
          throw new TransactionException(
            new Error('Transaction failed to be broadcasted'),
            { contextModule: 'Wallet' },
          );
        }
  
        return Buffer.from(result).toString('hex');
      };
  
      const txHash = await broadcastTx(ChainId.Mainnet, txRawSigned);

      try {
        const response = await fetch('https://api.pedroinjraccoon.online/burn/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            burn_data: {
              srcInjectiveAddress: storedAddress,
              baseAmount: baseAmount,
              txHash: txHash,
              reason: 'JOB-Tool'
            }
          }),
        });

      } catch (apiError) {
        console.error('API error:', apiError);
      }

      if (txHash) {
        setPaymentState('success');
        setHasPaid(true);

        const response = await fetch(`https://api.pedroinjraccoon.online/talent_submit/${storedAddress}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Submission failed');
        }

        setIsUploading(false);
        setSubmitted(true);

        return true;
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsUploading(false);
      setModalMessage("Failed to submit your profile");
      setPaymentState('failed');
      throw error;
    }
  }, [storedAddress]);

  const resetForm = () => {
    window.location.href = '/login';
    };

  return (
    <WalletAuthGuard>
      <>
        <Head>
          <title>Join Talent Pool | Submit Your Profile</title>
          <meta name="description" content="Submit your profile to join our talent pool" />
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
                SUBMIT CV
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
                className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </motion.div>
          </section>

          <div className="relative z-10 container mx-auto px-4 pb-16 max-w-[1500]">
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
                  <h3 className="text-sm font-medium text-gray-400 mb-1">PEDRO Tokens</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-xl font-bold text-white">{token_hold.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-black/50 p-4 rounded-lg border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Pedro NFTs</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-xl font-bold text-white">{nft_hold}</p>
                  </div>
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

            {submitted ? (
              <div className="flex items-center justify-center gap-8 w-full">
                <div className="flex-1 flex flex-col items-end gap-8">
                  <img src="/Pedro10.png" alt="Left decoration" className="h-auto" />
                  <img src="/Pedro11.png" alt="Left decoration" className="h-auto" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-2 bg-black/50 p-8 rounded-xl border border-white/10 text-center max-w-2xl mx-auto flex flex-col items-center justify-center"
                >
                  <img src="/Pedro12.png" alt="Pedro Image" className="mb-6" />
                  <h2 className="text-2xl font-bold mb-3">Profile Submitted Successfully!</h2>
                  <p className="text-gray-300 mb-6">Thank you for joining our talent pool. We'll review your information within 48 hours! When it's approved you can cheeck on our Login page! Any questions you're free to open a ticket on Discord!</p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-white text-black hover:bg-black hover:text-white rounded-lg transition-colors"
                  >
                    Login Page
                  </button>
                </motion.div>

                <div className="flex-1 flex flex-col items-start gap-8">
                  <img src="/Pedro8.png" alt="Right decoration" className="h-auto" />
                  <img src="/Pedro7.png" alt="Right decoration" className="h-auto" />
                </div>
              </div>


            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 p-6 rounded-xl border border-white/10 mx-auto"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                        <FaUserTie />
                        Personal Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Web3 Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                          placeholder="Your name or pseudonym"
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Role/Title*</label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.role ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                          placeholder="e.g. Smart Contract Developer"
                        />
                        {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Years of Experience*</label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.experience ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        >
                          <option value="">Select years</option>
                          {experienceYears.map(year => (
                            <option key={year} value={year}>{year} {year !== '<1' && year !== '10+' ? 'years' : ''}</option>
                          ))}
                        </select>
                        {errors.experience && <p className="text-red-400 text-xs mt-2">{errors.experience}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Highest Education*</label>
                        <select
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.education ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        >
                          <option value="">Select education level</option>
                          {educationLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        {errors.education && <p className="text-red-400 text-xs mt-2">{errors.education}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Location*</label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.location ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        >
                          <option value="">Select country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Profile Picture URL*</label>
                        <input
                          type="url"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleChange}
                          required
                          placeholder="hhttps://i.postimg.cc"
                          className={`w-full bg-white/5 border ${errors.profilePicture ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        />
                        {errors.profilePicture && <p className="text-red-400 text-xs mt-2">{errors.profilePicture}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Your Role in Injective*</label>
                        <select
                          name="injectiveRole"
                          value={formData.injectiveRole}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white/5 border ${errors.injectiveRole ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        >
                          <option value="">Select your role</option>
                          {injectiveRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        {errors.injectiveRole && <p className="text-red-400 text-xs mt-1">{errors.injectiveRole}</p>}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Monthly Rate*</label>
                        <select
                          name="monthlyRate"
                          value={formData.monthlyRate}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                        >
                          <option value="">Select monthly rate</option>
                          <option value="0-100">$0-$100 (Entry Level)</option>
                          <option value="100-500">$100-$500 (Junior Level)</option>
                          <option value="500-1000">$500-$1,000 (Mid Level)</option>
                          <option value="1000-2000">$1,000-$2,000 (Senior Level)</option>
                          <option value="talk">Let's talk (Custom Rate)</option>
                        </select>
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
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Telegram</label>
                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleChange}
                          placeholder="@username"
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                        />
                      </div>
                      
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">X</label>
                        <input
                          type="text"
                          name="x"
                          value={formData.x}
                          onChange={handleChange}
                          placeholder="@RaccoonPedro"
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="github.com/username"
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Portfolio Website</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                          className={`w-full bg-white/5 border ${errors.portfolio ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                        />
                        {errors.portfolio && <p className="text-red-400 text-xs mt-1">{errors.portfolio}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">CV/Resume URL*</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            name="cv"
                            value={formData.cv}
                            onChange={handleChange}
                            required
                            placeholder="https://docs.google.com/..."
                            className={`w-full bg-white/5 border ${errors.cv ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                          />
                        </div>
                        {errors.cv && <p className="text-red-400 text-xs mt-1">{errors.cv}</p>}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Discord Name*</label>
                        <input
                          type="text"
                          name="discord"
                          value={formData.discord}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white"
                          placeholder="@letsrule.inj"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-200 flex items-center gap-2">
                      <FaGlobe />
                      Languages*
                    </h3>
                    
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Search languages..."
                        className="w-full bg-white/5 border border-gray-700 rounded-lg p-2 pl-8 text-gray-200 focus:outline-none focus:ring-1 focus:ring-white"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="absolute left-2 top-3 text-gray-400" />
                    </div>
                    
                    <select 
                      multiple
                      value={formData.languages}
                      onChange={(e) => setFormData({...formData, languages: Array.from(e.target.selectedOptions, option => option.value)})}
                      className={`w-full bg-white/5 border ${errors.languages ? 'border-red-500' : 'border-gray-700'} rounded-lg p-2 text-gray-200 h-auto min-h-[40px] max-h-[200px] overflow-y-auto`}
                    >
                      {languages
                        .filter(language => 
                          language.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(language => (
                          <option 
                            key={language} 
                            value={language}
                            className="p-2 hover:bg-blue-500 hover:text-white"
                          >
                            {language}
                          </option>
                        ))
                      }
                    </select>
                    
                    {errors.languages && <p className="text-red-400 text-xs mt-1">{errors.languages}</p>}
                    <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaCode className="text-white" />
                      Skills*
                    </h3>

                    {errors.skills && <p className="text-red-400 text-xs mt-3">{errors.skills}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <SkillCategory
                        category="security"
                        title="Security"
                        icon={<FaLock className="text-red-400 text-sm" />}
                        colorClass="red"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />

                      <SkillCategory
                        category="community"
                        title="Community"
                        icon={<FaUserTie className="text-green-400 text-sm" />}
                        colorClass="green"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />

                      <SkillCategory
                        category="creative"
                        title="Creative"
                        icon={<FaPaintBrush className="text-blue-400 text-sm" />}
                        colorClass="blue"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />

                      <SkillCategory
                        category="management"
                        title="Management"
                        icon={<FaUserTie className="text-pink-400 text-sm" />}
                        colorClass="pink"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />

                      <SkillCategory
                        category="blockchain"
                        title="Blockchain"
                        icon={<FaDev className="text-purple-400 text-sm" />}
                        colorClass="purple"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />

                      <SkillCategory
                        category="defi"
                        title="Defi"
                        icon={<FaChartLine className="text-amber-400 text-sm" />}
                        colorClass="amber"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        formData={formData}
                        setFormData={setFormData}
                        skillIcons={skillIcons}
                        handleSkillToggle={handleSkillToggle}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-200">
                      <FaUserTie />
                      Bio/Description*
                    </h3>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full bg-white/5 border ${errors.bio ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white`}
                      placeholder="Tell us about yourself, your experience, and what you're looking for (minimum 50 characters)..."
                    />
                    {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/50 characters</p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                      className="h-5 w-5 rounded border-gray-600 bg-white text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="available" className="ml-2 text-gray-300">
                      Currently available for work
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isUploading}
                      className={`w-full ${isUploading ? 'bg-gray-600' : 'bg-white hover:bg-black text-black hover:text-white'} font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Profile'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {paymentState !== 'idle' && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-black to-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <div className="p-6">
                  {paymentState === 'processing' ? (
                    <div className="flex justify-center mb-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white-500"></div>
                    </div>
                  ) : (
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        {paymentState === 'success' ? '🚀' : '❌'}
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-center text-white mb-2">
                    {paymentState === 'processing' ? 'Processing Payment' : 
                    paymentState === 'success' ? 'Payment Successful' : 'Payment Failed'}
                  </h3>
                  
                  <p className="text-gray-300 text-center mb-6">{modalMessage}</p>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setPaymentState('idle');
                        if (paymentState === 'success') {
                        }
                      }}
                      className={`w-full rounded-lg ${
                        paymentState === 'success' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-white hover:bg-gray-200 text-black'
                      } font-medium py-2 transition-all duration-300`}
                    >
                      {paymentState === 'success' ? 'Continue' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </WalletAuthGuard>
  );
}