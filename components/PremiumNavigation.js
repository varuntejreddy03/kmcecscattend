import { motion } from 'framer-motion';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Users,
  RefreshCw,
  Zap,
  LayoutGrid
} from 'lucide-react';

const PremiumNavigation = ({ activeTab, setActiveTab, onRefresh, loading }) => {
  const tabs = [
    { id: 'overview', label: 'My Stats', icon: LayoutGrid },
    { id: 'simulator', label: 'Calculator', icon: Zap },
    { id: 'analysis', label: 'Check Targets', icon: TrendingUp },
    { id: 'class', label: 'Students', icon: Users }
  ];

  return (
    <nav className="relative z-50">
      {/* 💻 Desktop: Minimal Integrated Navbar */}
      <div className="hidden md:flex items-center justify-between bg-card/60 backdrop-blur-3xl border border-border p-2 rounded-[2rem] shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-500 overflow-hidden ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-glow"
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                  />
                )}
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className="text-xs font-black uppercase tracking-widest italic">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground/[0.03] border border-border text-muted-foreground hover:text-indigo-400 hover:border-indigo-500/30 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Update'}
        </button>
      </div>

      {/* 📱 Mobile: Sleek Floating Dock */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-[999]">
        <div className="bg-card/80 backdrop-blur-3xl border border-border p-2.5 rounded-[2.5rem] shadow-2xl flex items-center justify-around transition-all duration-500">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-4 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white translate-y-[-8px] shadow-xl shadow-indigo-500/40' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-ripple"
                    className="absolute inset-[-4px] border-2 border-indigo-500/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-indigo-400 uppercase tracking-widest"
                  >
                    {tab.label}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavigation;