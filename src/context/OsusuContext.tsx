import { createContext, useContext, useState } from 'react';

// Types
export type LogType = 'success' | 'error' | 'neutral' | 'info';
export interface Log {
  id: string;
  text: string;
  type: LogType;
  timestamp: Date;
}

export interface Agent {
  id: string;
  name: string;
  address: string;
  balance: number;
  status: 'pending' | 'contributed' | 'received';
  isUser?: boolean;
  hasReceivedPayout?: boolean;
}

export interface Circle {
  name: string;
  contributionAmount: number;
  currentRound: number;
  targetRounds: number;
  roundDuration: number;
  pot: number;
  status: 'idle' | 'active' | 'completed';
}

export interface User {
  address: string;
  balance: number;
}

interface OsusuContextType {
  user: User | null;
  circle: Circle | null;
  agents: Agent[];
  logs: Log[];
  connectWallet: () => void;
  createCircle: (amount: number, participantCount: number, roundDuration: number) => void;
  startRound: () => Promise<void>;
  addLog: (text: string, type: LogType) => void;
  isSimulating: boolean;
}

const OsusuContext = createContext<OsusuContextType | undefined>(undefined);

export const OsusuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [circle, setCircle] = useState<Circle | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const addLog = (text: string, type: LogType) => {
    setLogs((prev) => [...prev, { id: Math.random().toString(36).substring(7), text, type, timestamp: new Date() }]);
  };

  const connectWallet = () => {
    setUser({
      address: '0x' + Math.random().toString(16).substring(2, 10).toUpperCase(),
      balance: 1000,
    });
    addLog('Wallet connected successfully.', 'success');
  };

  const createCircle = (amount: number, participantCount: number, roundDuration: number) => {
    if (!user) return;
    
    const newAgents: Agent[] = [
      { id: 'user', name: 'You (User)', address: user.address, balance: user.balance, status: 'pending', isUser: true, hasReceivedPayout: false }
    ];

    for (let i = 1; i < participantCount; i++) {
      newAgents.push({
        id: `agent-${i}`,
        name: `Agent ${String.fromCharCode(64 + i + 1)}`,
        address: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...`,
        balance: amount * participantCount + 50, 
        status: 'pending',
        hasReceivedPayout: false
      });
    }

    setAgents(newAgents);
    setCircle({
      name: `AutoOsusu #${Math.floor(Math.random() * 1000)}`,
      contributionAmount: amount,
      currentRound: 1,
      targetRounds: participantCount,
      roundDuration: roundDuration,
      pot: 0,
      status: 'active'
    });
    
    addLog(`Circle created. Contribution: ${amount} USDT | Round duration: ${roundDuration}s`, 'info');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startRound = async () => {
    if (!circle || circle.status !== 'active' || isSimulating) return;
    
    setIsSimulating(true);
    addLog(`--- Agent: Coordinator initiating Round ${circle.currentRound} ---`, 'info');
    
    let currentPot = 0;
    
    // Reset agent statuses for the round
    setAgents(prev => prev.map(a => ({ ...a, status: 'pending' })));
    
    const updatedAgents = [...agents]; // To keep track of states synchronously within loop
    
    for (let i = 0; i < updatedAgents.length; i++) {
      const agent = updatedAgents[i];
      addLog(`Agent [${agent.name}]: Checking balance...`, 'neutral');
      await sleep(800);
      
      if (agent.balance >= circle.contributionAmount) {
        agent.balance -= circle.contributionAmount;
        agent.status = 'contributed';
        currentPot += circle.contributionAmount;
        addLog(`Agent [${agent.name}]: Sent exact fixed contribution of ${circle.contributionAmount} USDT.`, 'success');
        
        // Update state to trigger re-render
        setAgents([...updatedAgents]);
        setCircle(prev => prev ? { ...prev, pot: currentPot } : null);
        
        if (agent.isUser && user) {
           setUser(prev => prev ? { ...prev, balance: prev.balance - circle.contributionAmount } : null);
        }
      } else {
        addLog(`Agent [${agent.name}]: Insufficient balance! Transaction failed.`, 'error');
        updatedAgents[i].status = 'pending';
        setAgents([...updatedAgents]);
      }
      await sleep(800);
    }

    // Coordinator Verification
    const expectedPot = circle.contributionAmount * agents.length;
    addLog(`Agent [Coordinator]: Verifying pool... Expected: ${expectedPot} USDT, Actual: ${currentPot} USDT`, 'neutral');
    await sleep(1000);

    if (currentPot === expectedPot) {
      addLog(`Agent [Coordinator]: Pool verified. Initiating automatic payout.`, 'success');
      
      // Determine recipient based on rotation (Round 1 -> idx 0, Round 2 -> idx 1)
      const recipientIndex = (circle.currentRound - 1) % agents.length;
      const recipient = updatedAgents[recipientIndex];

      await sleep(1000);
      recipient.balance += currentPot;
      recipient.status = 'received';
      recipient.hasReceivedPayout = true;
      addLog(`Agent [Coordinator]: Payout of ${currentPot} USDT sent to ${recipient.name}`, 'success');
      
      if (recipient.isUser && user) {
         setUser(prev => prev ? { ...prev, balance: prev.balance + currentPot } : null);
      }

      setAgents([...updatedAgents]);
      setCircle(prev => prev ? { ...prev, pot: 0 } : null);
      
      await sleep(1500);
      
      // End of round state refresh
      if (circle.currentRound >= circle.targetRounds) {
        setCircle(prev => prev ? { ...prev, status: 'completed' } : null);
        addLog(`AutoOsusu completed! All participants have received their payouts.`, 'success');
      } else {
        setCircle(prev => prev ? { ...prev, currentRound: prev.currentRound + 1 } : null);
        addLog(`Round ${circle.currentRound} finished. Preparation for Round ${circle.currentRound + 1} is complete.`, 'info');
      }
    } else {
      addLog(`Agent [Coordinator]: Pool mismatch! Reverting transactions.`, 'error');
      // Simple revert simulation
      await sleep(1000);
      for(let i=0; i<updatedAgents.length; i++) {
         if (updatedAgents[i].status === 'contributed') {
            updatedAgents[i].balance += circle.contributionAmount;
            if (updatedAgents[i].isUser) {
               setUser(prev => prev ? { ...prev, balance: prev.balance + circle.contributionAmount } : null);
            }
         }
         updatedAgents[i].status = 'pending';
      }
      setAgents([...updatedAgents]);
      setCircle(prev => prev ? { ...prev, pot: 0 } : null);
      addLog(`Agent [Coordinator]: Round failed and halted.`, 'error');
    }
    
    setIsSimulating(false);
  };

  return (
    <OsusuContext.Provider value={{ user, circle, agents, logs, connectWallet, createCircle, startRound, addLog, isSimulating }}>
      {children}
    </OsusuContext.Provider>
  );
};

export const useOsusu = () => {
  const context = useContext(OsusuContext);
  if (context === undefined) {
    throw new Error('useOsusu must be used within an OsusuProvider');
  }
  return context;
};
