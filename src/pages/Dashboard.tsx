import { useState } from 'react';
import { useOsusu } from '../context/OsusuContext';
import { motion } from 'framer-motion';
import { Plus, Users, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import CreateCircleModal from '../components/CreateCircleModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, circle } = useOsusu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Agent Dashboard</h1>
          <p className="text-gray-400">Manage your autonomous savings protocols.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 relative overflow-hidden shadow-xl"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Agent Wallet
            </h3>
            <div className="text-3xl font-mono font-bold text-white mb-6">
              {user?.balance.toLocaleString()} <span className="text-green-400 text-xl">USDT</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-950/50 rounded-lg p-3 border border-gray-800">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active & Ready
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action / Active Circle Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group hover:border-gray-600 transition-colors"
        >
          {circle ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold uppercase mb-4">
                  <Activity className="w-3 h-3" /> Active Protocol
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{circle.name}</h3>
                <p className="text-gray-400 mb-6 flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {circle.targetRounds} Agents</span>
                  <span className="flex items-center gap-1.5"><span className="text-green-400">{circle.contributionAmount} USDT</span> / Round</span>
                </p>
                <button
                  onClick={() => navigate('/circle')}
                  className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full font-semibold transition-colors"
                >
                  View Activity <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden md:flex w-24 h-24 rounded-full border-4 border-gray-700 items-center justify-center relative">
                 <svg className="w-full h-full transform -rotate-90 absolute">
                   <circle cx="44" cy="44" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                   <circle 
                     cx="44" cy="44" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                     className="text-green-500 transition-all duration-1000 ease-in-out" 
                     strokeDasharray={`${2 * Math.PI * 40}`} 
                     strokeDashoffset={`${2 * Math.PI * 40 * (1 - (circle.currentRound - 1) / circle.targetRounds)}`} 
                   />
                 </svg>
                 <span className="font-bold text-lg font-mono">{circle.currentRound - 1}/{circle.targetRounds}</span>
              </div>
            </div>
          ) : (
             <div className="text-center py-8">
               <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                 <Users className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-xl font-bold mb-2">No Active Circles</h3>
               <p className="text-gray-400 mb-6 max-w-md mx-auto">Deploy a new autonomous savings framework. Program the contribution amount and let AI agents handle the rest.</p>
               <button
                 onClick={() => setIsModalOpen(true)}
                 className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/20"
               >
                 <Plus className="w-5 h-5" /> Deploy New Circle
               </button>
             </div>
          )}
        </motion.div>
      </div>
      
      <CreateCircleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
