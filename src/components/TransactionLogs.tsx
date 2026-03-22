import { useEffect, useRef } from 'react';
import { useOsusu } from '../context/OsusuContext';
import { Activity, CheckCircle2, XCircle, Info, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionLogs() {
  const { logs } = useOsusu();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'neutral': return <Activity className="w-4 h-4 text-gray-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/5 text-green-100';
      case 'error': return 'border-red-500/30 bg-red-500/5 text-red-100';
      case 'info': return 'border-blue-500/30 bg-blue-500/5 text-blue-100';
      default: return 'border-gray-700 bg-gray-800/50 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-[500px] flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" /> System Logs
        </h3>
        <span className="text-xs bg-gray-800 px-2 py-1 rounded-md text-gray-400 border border-gray-700 font-mono">
          Live Feed
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${getLogColor(log.type)} flex gap-3 shadow-sm`}
            >
              <div className="mt-0.5">{getLogIcon(log.type)}</div>
              <div>
                <p className="text-sm font-mono leading-relaxed">{log.text}</p>
                <div className="text-[10px] text-gray-500 mt-1 uppercase">
                  {log.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
