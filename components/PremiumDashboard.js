import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Target, BarChart3, Shield, Clock, AlertCircle, ChevronRight, Activity } from 'lucide-react';
import TiltWrap from './TiltWrap';

const PremiumDashboard = ({ currentAttendance }) => {
  const [activeTab, setActiveTab] = useState('predictor');
  const [selectedPeriods, setSelectedPeriods] = useState(Array(8).fill(null));
  const [customDays, setCustomDays] = useState(1);
  const [customAttendance, setCustomAttendance] = useState(8);
  const [customGoal, setCustomGoal] = useState(75);
  const [goalDailyClasses, setGoalDailyClasses] = useState(8);

  const calculateDailyPrediction = (periods) => {
    if (!currentAttendance) return null;
    const selected = periods.filter(p => p !== null);
    const attendingToday = periods.filter(p => p === true).length;
    const totalSelectedToday = selected.length;
    if (totalSelectedToday === 0) return null;

    const newPresent = currentAttendance.totalPresent + attendingToday;
    const newTotal = currentAttendance.totalPeriods + totalSelectedToday;
    const newPercentage = ((newPresent / newTotal) * 100).toFixed(2);

    return {
      current: parseFloat(currentAttendance.percentage),
      predicted: parseFloat(newPercentage),
      attending: attendingToday,
      missing: totalSelectedToday - attendingToday,
      totalSelected: totalSelectedToday
    };
  };

  const calculateScenario = (days, periodsPerDay, attendPerDay) => {
    if (!currentAttendance) return null;
    const totalNewPeriods = days * periodsPerDay;
    const totalNewPresent = days * attendPerDay;
    const newPresent = currentAttendance.totalPresent + totalNewPresent;
    const newTotal = currentAttendance.totalPeriods + totalNewPeriods;
    const newPercentage = ((newPresent / newTotal) * 100).toFixed(2);
    return {
      percentage: parseFloat(newPercentage),
      change: parseFloat(newPercentage) - parseFloat(currentAttendance.percentage)
    };
  };

  const calculateClassesForGoal = (target) => {
    if (!currentAttendance) return null;
    const P = currentAttendance.totalPresent;
    const T = currentAttendance.totalPeriods;
    const goal = target / 100;

    if (P / T >= goal) return 0;

    // (P + x) / (T + x) = goal
    // P + x = goal * T + goal * x
    // x(1 - goal) = goal * T - P
    const x = Math.ceil((goal * T - P) / (1 - goal));
    return x;
  };

  const togglePeriod = (index) => {
    const newPeriods = [...selectedPeriods];
    if (newPeriods[index] === null) newPeriods[index] = true;
    else if (newPeriods[index] === true) newPeriods[index] = false;
    else newPeriods[index] = null;
    setSelectedPeriods(newPeriods);
  };

  const dailyPrediction = calculateDailyPrediction(selectedPeriods);

  return (
    <div className="space-y-8">
      {/* � Execution Hub */}
      <div className="aurora-border rounded-[2.5rem] p-[2px] shadow-2xl">
        <motion.div
          className="bg-card/40 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-10 premium-glass relative overflow-hidden border border-border shadow-2xl transition-all duration-500"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute top-0 right-0 p-8 text-foreground opacity-5 -rotate-12 pointer-events-none">
            <Zap size={240} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Activity size={12} />
                Strategic Simulator
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground italic tracking-tighter uppercase leading-none mb-2">
                Execution <span className="text-indigo-500">Hub</span>
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-tight max-w-sm italic">Simulate skipping or attending scenarios</p>
            </div>

            <div className="flex p-1.5 bg-background/50 backdrop-blur-xl rounded-2xl border border-border">
              {[
                { id: 'predictor', label: 'Today', icon: Clock },
                { id: 'scenarios', label: 'What-If', icon: Target },
                { id: 'goals', label: 'Goals', icon: BarChart3 }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transition-colors duration-500 ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-xl italic' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'predictor' && (
              <motion.div
                key="predictor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {selectedPeriods.map((status, i) => (
                    <button
                      key={i}
                      onClick={() => togglePeriod(i)}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${status === true ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' : status === false ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-background border-border text-muted-foreground'}`}
                    >
                      <span className="text-[10px] font-black mb-1">P{i + 1}</span>
                      {status === true ? <Shield size={16} /> : status === false ? <AlertCircle size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-border" />}
                    </button>
                  ))}
                </div>

                {dailyPrediction && (
                  <TiltWrap>
                    <div className="bg-card/80 border border-border rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-xl transition-all duration-500">
                      <div className="flex-1 text-center md:text-left">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Predicted Outcome</div>
                        <div className="flex items-center justify-center md:justify-start gap-5">
                          <div className="text-2xl md:text-4xl font-black italic opacity-50">{dailyPrediction.current}%</div>
                          <ChevronRight className="text-border" size={24} />
                          <div className="text-4xl md:text-6xl font-black text-indigo-500 italic drop-shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            {dailyPrediction.predicted}%
                          </div>
                        </div>
                      </div>
                      <div className={`w-full md:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic text-center ${dailyPrediction.predicted >= 75 ? 'bg-cyan-600 text-white' : 'bg-rose-500 text-white shadow-xl shadow-rose-500/20'}`}>
                        {dailyPrediction.predicted >= 75 ? 'Optimal Standing' : 'Critical Warning'}
                      </div>
                    </div>
                  </TiltWrap>
                )}
              </motion.div>
            )}

            {activeTab === 'scenarios' && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-foreground">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-2">Execution Period (Days)</label>
                    <input
                      type="range" min="1" max="30" value={customDays}
                      onChange={(e) => setCustomDays(parseInt(e.target.value))}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-black italic px-2">
                      <span>1 Day</span>
                      <span className="text-indigo-500">{customDays} Days</span>
                      <span>30 Days</span>
                    </div>
                  </div>
                  <div className="space-y-4 text-foreground">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-2">Classes per Day</label>
                    <input
                      type="range" min="1" max="8" value={customAttendance}
                      onChange={(e) => setCustomAttendance(parseInt(e.target.value))}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-black italic px-2">
                      <span>1 Class</span>
                      <span className="text-indigo-500 font-black underline decoration-indigo-500/30 underline-offset-4">{customAttendance} Periods/Day</span>
                      <span>8 Classes</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: 'Absolute Zero (Skip All)',
                      attend: 0,
                      icon: 'AlertCircle',
                      desc: 'What if you skip every class during this window?'
                    },
                    {
                      label: 'Full Extraction (Attend All)',
                      attend: customAttendance,
                      icon: 'Shield',
                      desc: 'Perfect attendance scenario for the selected window.'
                    }
                  ].map((scenario, i) => {
                    const result = calculateScenario(customDays, customAttendance, scenario.attend);
                    return (
                      <TiltWrap key={i}>
                        <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${scenario.attend === 0 ? 'bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/40' : 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-black uppercase tracking-tighter italic">{scenario.label}</h4>
                            <span className={`text-xl font-black italic tracking-tighter ${result.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}%
                            </span>
                          </div>
                          <div className="text-3xl font-black italic tracking-tighter mb-2">{result.percentage}%</div>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase italic leading-relaxed">{scenario.desc}</p>
                        </div>
                      </TiltWrap>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* 🎯 Custom Target Input */}
                <div className="bg-background/40 backdrop-blur-xl border border-border p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block ml-2">Define Custom Objective</label>
                      <div className="relative">
                        <input
                          type="range" min="1" max="100" value={customGoal}
                          onChange={(e) => setCustomGoal(parseInt(e.target.value))}
                          className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] font-black italic px-2 mt-2 text-muted-foreground uppercase">
                          <span className="text-indigo-400 text-sm">{customGoal}% Target</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block ml-2">Daily Class Load</label>
                      <div className="relative">
                        <input
                          type="range" min="1" max="12" value={goalDailyClasses}
                          onChange={(e) => setGoalDailyClasses(parseInt(e.target.value))}
                          className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] font-black italic px-2 mt-2 text-muted-foreground uppercase">
                          <span className="text-indigo-400 text-sm">{goalDailyClasses} Classes/Day</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const needed = calculateClassesForGoal(customGoal);
                    const days = Math.ceil(needed / goalDailyClasses);
                    return (
                      <div className="flex items-center gap-6">
                        <div className="text-center p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl min-w-[140px]">
                          <div className="text-4xl font-black italic tracking-tighter text-indigo-400">{needed}</div>
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Total Classes</div>
                        </div>
                        <div className="text-center p-6 bg-foreground/[0.03] border border-border rounded-3xl min-w-[140px]">
                          <div className="text-4xl font-black italic tracking-tighter">{days}</div>
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Days (@8/Day)</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 🛰️ Fixed Presets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[75, 80, 85].map((g) => (
                    <TiltWrap key={g}>
                      <div className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-700 shadow-xl">
                        <div className="absolute -right-8 -bottom-8 text-foreground opacity-[0.03] group-hover:opacity-10 transition-opacity">
                          <Target size={160} />
                        </div>
                        <div className="relative z-10 text-center">
                          <div className="text-4xl font-black italic tracking-tighter mb-2">{g}%</div>
                          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] italic mb-6">Objective</div>

                          <div className="space-y-4 pt-6 border-t border-border">
                            {(() => {
                              const needed = calculateClassesForGoal(g);
                              const days = Math.ceil(needed / goalDailyClasses);
                              return (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center">
                                    <div className="text-xl font-black italic text-indigo-300">{needed}</div>
                                    <div className="text-[7px] font-black text-muted-foreground uppercase opacity-70">Classes</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-black italic">{days}</div>
                                    <div className="text-[7px] font-black text-muted-foreground uppercase opacity-70">Days</div>
                                  </div>
                                </div>
                              );
                            })()}
                            <div className={`mt-4 py-2 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest italic ${parseFloat(currentAttendance.percentage) >= g ? 'bg-cyan-500/20 text-cyan-400' : 'bg-rose-500/20 text-rose-400'}`}>
                              {parseFloat(currentAttendance.percentage) >= g ? 'Objective Met' : 'Trajectory Required'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltWrap>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumDashboard;