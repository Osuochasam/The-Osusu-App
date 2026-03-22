
import { useOsusu } from '../context/OsusuContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Bot } from 'lucide-react';

export default function Landing() {
  const { connectWallet } = useOsusu();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center mx-auto relative z-10 shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-green-400" />
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
      >
        Automate Trust. <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Build Wealth Together.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
      >
        AutoOsusu is an AI-powered cooperative savings platform. Let autonomous agents manage your rotating savings circle securely, transparently, and automatically.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          onClick={connectWallet}
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.3)] shadow-green-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out skew-x-12" />
          <Bot className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Connect Agent Wallet</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full border-t border-gray-800 pt-16"
      >
        <div>
          <div className="bg-gray-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
            <Bot className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Agent Wallets</h3>
          <p className="text-gray-400 text-sm">Each participant is represented by an autonomous AI agent that automatically manages their balance and executes contributions.</p>
        </div>
        <div>
          <div className="bg-gray-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Programmable Rules</h3>
          <p className="text-gray-400 text-sm">No manual action needed. The protocol enforces fixed contributions, rotating payouts, and verifies every round.</p>
        </div>
        <div>
          <div className="bg-gray-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Trustless Execution</h3>
          <p className="text-gray-400 text-sm">Coordinator agents automatically verify pool balances and distribute payouts to the rightful recipient.</p>
        </div>
      </motion.div>
    </div>
  );
}
