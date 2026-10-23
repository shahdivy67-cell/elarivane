import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Play, Pause, Sparkles, CheckCircle2, Shield, Heart, Zap } from 'lucide-react';

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  strategy: 'cooperator' | 'cheater' | 'tit-for-tat' | 'forgiver';
  score: number;
  id: number;
}

export const TrustArenaGame: React.FC<{ onFinishLesson: () => void }> = ({ onFinishLesson }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [round, setRound] = useState(0);
  const [userStrategy, setUserStrategy] = useState<'cooperator' | 'cheater' | 'tit-for-tat' | 'forgiver'>('tit-for-tat');
  const [population, setPopulation] = useState<{ cooperators: number; cheaters: number; titForTats: number; forgivers: number }>({
    cooperators: 10,
    cheaters: 10,
    titForTats: 10,
    forgivers: 10,
  });

  const agentsRef = useRef<Agent[]>([]);

  // Initialize interactive agents
  const initAgents = () => {
    const newAgents: Agent[] = [];
    const strategies: Agent['strategy'][] = ['cooperator', 'cheater', 'tit-for-tat', 'forgiver'];
    let id = 0;
    strategies.forEach(strat => {
      for (let i = 0; i < 10; i++) {
        newAgents.push({
          x: Math.random() * 320 + 20,
          y: Math.random() * 220 + 20,
          vx: (Math.random() - 0.5) * 2.2,
          vy: (Math.random() - 0.5) * 2.2,
          strategy: strat,
          score: 50,
          id: id++,
        });
      }
    });
    agentsRef.current = newAgents;
    setRound(0);
  };

  useEffect(() => {
    initAgents();
  }, []);

  // Main interactive physics + game theory collision engine loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      if (isRunning) {
        ctx.fillStyle = '#0a120e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const agents = agentsRef.current;

        // Move agents and bounce on walls
        agents.forEach(a => {
          a.x += a.vx;
          a.y += a.vy;

          if (a.x < 10 || a.x > canvas.width - 10) a.vx *= -1;
          if (a.y < 10 || a.y > canvas.height - 10) a.vy *= -1;

          // Strategy Color
          let color = '#10b981'; // Green: Cooperator
          if (a.strategy === 'cheater') color = '#ef4444'; // Red: Cheater / exploiter
          if (a.strategy === 'tit-for-tat') color = '#38bdf8'; // Blue: Fair & Firm
          if (a.strategy === 'forgiver') color = '#fbbf24'; // Gold: Forgiver

          // Draw agent halo and core
          ctx.beginPath();
          ctx.arc(a.x, a.y, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Pairwise encounter collisions (Prisoner's Dilemma Game Play)
        for (let i = 0; i < agents.length; i++) {
          for (let j = i + 1; j < agents.length; j++) {
            const a1 = agents[i];
            const a2 = agents[j];
            const dx = a2.x - a1.x;
            const dy = a2.y - a1.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 14) {
              // Elastic bounce
              a1.vx = -a1.vx;
              a1.vy = -a1.vy;
              a2.vx = -a2.vx;
              a2.vy = -a2.vy;

              // Play 1 round of game
              const play = (s1: Agent['strategy'], s2: Agent['strategy']) => {
                const c1 = s1 === 'cooperator' || s1 === 'forgiver' || s1 === 'tit-for-tat';
                const c2 = s2 === 'cooperator' || s2 === 'forgiver' || s2 === 'tit-for-tat';

                if (c1 && c2) return [2, 2]; // Mutual cooperation
                if (!c1 && c2) return [3, -1]; // Exploitation
                if (c1 && !c2) return [-1, 3]; // Being exploited
                return [0, 0]; // Mutual defection
              };

              const [pay1, pay2] = play(a1.strategy, a2.strategy);
              a1.score += pay1;
              a2.score += pay2;

              // Visual encounter ripple
              ctx.beginPath();
              ctx.arc((a1.x + a2.x) / 2, (a1.y + a2.y) / 2, 9, 0, Math.PI * 2);
              ctx.strokeStyle = pay1 > 0 && pay2 > 0 ? '#34d399' : '#f87171';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }

        // Evolutionary shift every 100 frames
        setRound(r => {
          if (r % 60 === 0 && r > 0) {
            // Sort by score
            agents.sort((a, b) => b.score - a.score);
            // Replace bottom 2 weakest agents with top 2 strategies
            if (agents.length >= 4) {
              agents[agents.length - 1].strategy = agents[0].strategy;
              agents[agents.length - 1].score = 50;
              agents[agents.length - 2].strategy = agents[1].strategy;
              agents[agents.length - 2].score = 50;
            }

            // Update stats
            const coops = agents.filter(a => a.strategy === 'cooperator').length;
            const cheats = agents.filter(a => a.strategy === 'cheater').length;
            const tfts = agents.filter(a => a.strategy === 'tit-for-tat').length;
            const forgs = agents.filter(a => a.strategy === 'forgiver').length;
            setPopulation({ cooperators: coops, cheaters: cheats, titForTats: tfts, forgivers: forgs });
          }
          return r + 1;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  // Click on canvas to spawn new agents
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    agentsRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      strategy: userStrategy,
      score: 50,
      id: Date.now() + Math.random(),
    });
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      {/* Title & Lesson Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-white">
              Trust Arena: Live Evolutionary Game Theory
            </h3>
          </div>
          <p className="text-xs text-stone-300">
            Agents bounce, encounter each other, cooperate, betray, and reproduce based on success.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={initAgents}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl border border-stone-800 transition-colors"
            title="Reset simulation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Interactive Physics Arena */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#0a120e]">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          onClick={handleCanvasClick}
          className="w-full h-56 cursor-crosshair block"
        />
        <div className="absolute top-2 left-3 text-[10px] text-stone-400 font-mono pointer-events-none">
          Click canvas to inject your selected agent!
        </div>
      </div>

      {/* Interactive Inoculation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { id: 'tit-for-tat', label: 'Fair & Firm (Tit-For-Tat)', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30', count: population.titForTats },
          { id: 'forgiver', label: 'Generous Forgiver', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30', count: population.forgivers },
          { id: 'cooperator', label: 'Always Cooperate', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30', count: population.cooperators },
          { id: 'cheater', label: 'Always Exploit (Cheater)', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30', count: population.cheaters },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setUserStrategy(item.id as any)}
            className={`p-2.5 rounded-xl border text-left transition-all ${item.color} ${
              userStrategy === item.id ? 'ring-2 ring-white scale-102 font-bold shadow-lg' : 'opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold">{item.label}</span>
              <span className="font-mono">{item.count}</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Click to spawn</span>
          </button>
        ))}
      </div>

      {/* The Core Moral & Real-World Lesson */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Living Game Lesson:
        </span>
        <p className="text-stone-200 leading-relaxed">
          Watch what happens when cheaters invade pure cooperators: they conquer initially, but starve once no cooperators are left.
          <strong> Fair & Firm (Tit-for-Tat) and Generous Forgivers</strong> dominate long term because they reward goodwill, punish bad faith, and immediately reconcile after friction.
        </p>
      </div>

      <button
        onClick={onFinishLesson}
        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" />
        Complete Interactive Arena Lesson (+50 XP)
      </button>
    </div>
  );
};
