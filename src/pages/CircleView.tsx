
import { useOsusu } from '../context/OsusuContext';
import { ArrowLeft, Play, Coins, ShieldCheck, CheckCircle2, Clock, Bot, Activity, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import TransactionLogs from '../components/TransactionLogs';

export default function CircleView() {
  const { circle, agents, startRound, isSimulating } = useOsusu();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(circle?.roundDuration || 10);

  useEffect(() => {
    if (!circle) return;
    setTimeLeft(circle.roundDuration);
  }, [circle?.currentRound, circle?.roundDuration]);

  useEffect(() => {
    if (!circle || isSimulating || circle.status === 'completed') return;

    if (timeLeft <= 0) {
      startRound();
      setTimeLeft(circle.roundDuration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSimulating, circle?.status, startRound, circle?.roundDuration]);

  if (!circle) {
    navigate('/dashboard');
    return null;
  }

  const getStatusBadge = (status: string, hasReceivedPayout?: boolean) => {
    if (status === 'received' || hasReceivedPayout) {
       return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20"><CheckCircle2 className="w-3 h-3"/> Received Payout</span>;
    }
    switch (status) {
      case 'contributed':
        return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20"><CheckCircle2 className="w-3 h-3"/> Contributed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"><Clock className="w-3 h-3"/> Pending</span>;
      default:
        return null;
    }
  };

  const completed = circle.status === 'completed';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            {circle.name} 
            {completed && <span className="text-sm font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">Completed</span>}
          </h1>
          <p className="text-gray-400 flex items-center gap-4">
            <span>Round <strong className="text-white">{Math.min(circle.currentRound, circle.targetRounds)}/{circle.targetRounds}</strong></span>
            <span>•</span>
            <span>Contribution: <strong className="text-green-400">{circle.contributionAmount} USDT</strong></span>
          </p>
        </div>
        
        {!completed && (
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={startRound}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg ${
                isSimulating 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                  : 'bg-green-500 hover:bg-green-400 text-gray-900 shadow-green-500/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isSimulating ? (
                <><Activity className="w-5 h-5 animate-pulse" /> Protocol Running...</>
              ) : (
                <><Play className="w-5 h-5 fill-current" /> Manual Execute</>
              )}
            </button>
            {!isSimulating && <div className="text-sm text-gray-400 font-mono">Auto-starts in: <span className="text-blue-400 font-bold">{timeLeft}s</span></div>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Rotation Visibility */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4 text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Payout Rotation Order
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {agents.map((ag, idx) => {
                const isActive = (circle.currentRound - 1) % agents.length === idx && circle.status !== 'completed';
                const isPast = circle.status === 'completed' || circle.currentRound > idx + 1;
                
                return (
                  <div key={'rot-'+ag.id} className={`flex-shrink-0 px-4 py-2 rounded-lg border min-w-[120px] ${
                    isActive ? 'bg-blue-500/20 border-blue-500 text-blue-100 ring-2 ring-blue-500/50' :
                    isPast ? 'bg-green-500/10 border-green-500/30 text-green-400 opacity-60' :
                    'bg-gray-800 border-gray-700 text-gray-500'
                  }`}>
                    <div className="text-[10px] uppercase font-bold mb-1 opacity-80">Round {idx + 1}</div>
                    <div className="font-mono text-sm truncate">{ag.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Pot Card */}
          <motion.div 
            className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/5 pointer-events-none" />
            <Coins className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-sm">Escrow Pot</h3>
            <div className="text-5xl font-mono font-bold text-white mb-2 tracking-tight">
              {circle.pot} <span className="text-2xl text-green-400">USDT</span>
            </div>
            <p className="text-gray-500 text-sm">Automatically distributed upon successful coordination.</p>
          </motion.div>

          {/* Agents List */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" /> Active Agents
            </h3>
            
            <div className="space-y-3">
              {agents.map((agent, index) => {
                const isCurrentRecipient = (circle.currentRound - 1) % agents.length === index && circle.status !== 'completed';
                
                return (
                  <motion.div 
                    key={agent.id}
                    layout
                    className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      isCurrentRecipient && !completed 
                        ? 'bg-blue-900/10 border-blue-500/30 ring-1 ring-blue-500/50' 
                        : agent.isUser 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        agent.isUser ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-gray-700 border border-gray-600'
                      }`}>
                        {agent.isUser ? <ShieldCheck className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2 text-white">
                          {agent.name}
                          {isCurrentRecipient && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">Current Recipient</span>}
                        </div>
                        <div className="text-xs font-mono text-gray-500">{agent.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-mono font-bold">{agent.balance.toLocaleString()} USDT</div>
                      {getStatusBadge(agent.status, agent.hasReceivedPayout)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logs Panel */}
        <div className="lg:col-span-1">
          <TransactionLogs />
        </div>
      </div>
    </div>
  );
}
