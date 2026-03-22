import React, { useState } from 'react';
import { useOsusu } from '../context/OsusuContext';
import { Users, Coins, X, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCircleModal({ isOpen, onClose }: CreateCircleModalProps) {
  const { createCircle } = useOsusu();
  const [participants, setParticipants] = useState(3);
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCircle(amount, participants, duration);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold">Deploy New AutoOsusu</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Agent Participants
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="2"
                        max="10"
                        value={participants}
                        onChange={(e) => setParticipants(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                      <div className="mt-2 text-right font-mono text-green-400 font-bold text-lg">
                        {participants} Total (1 You + {participants - 1} AI)
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Coins className="w-4 h-4" /> Round Contribution (USDT)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        step="5"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-lg"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        USDT
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Round Duration (Seconds)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="mt-2 text-right font-mono text-blue-400 font-bold text-lg">
                        {duration} Seconds
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Rounds:</span>
                    <span className="font-mono">{participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Pool per Round:</span>
                    <span className="font-mono text-green-400">{(participants * amount).toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total required commitment:</span>
                    <span className="font-mono text-red-400">{(participants * amount).toLocaleString()} USDT</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                >
                  Deploy Circle
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
