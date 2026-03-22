import React from 'react';
import { useOsusu } from '../context/OsusuContext';
import { Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, connectWallet } = useOsusu();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoOsusu</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-gray-800 rounded-full pl-4 cursor-default border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="text-sm">
                  <span className="text-gray-400">Balance: </span>
                  <span className="font-semibold text-green-400">{user.balance} USDT</span>
                </div>
                <div className="bg-gray-700 px-4 py-2 rounded-full text-sm font-mono text-gray-300 border-l border-gray-800">
                  {user.address}
                </div>
              </motion.div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)] shadow-green-500/20"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
