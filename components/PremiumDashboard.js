import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumDashboard = ({ currentAttendance }) => {
  const [activeTab, setActiveTab] = useState('predictor');
  const [selectedPeriods, setSelectedPeriods] = useState(Array(8).fill(null));
  const [customDays, setCustomDays] = useState(1);
  const [customAttendance, setCustomAttendance] = useState(8);
  const [targetPercentage, setTargetPercentage] = useState(75);

  const calculateDailyPrediction = (periods) => {
    if (!currentAttendance) return null;
    
    const selectedPeriods = periods.filter(p => p !== null);
    const attendingToday = periods.filter(p => p === true).length;
    const totalSelectedToday = selectedPeriods.length;
    
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

  const scenarios = [
    { name: 'Skip Tomorrow', days: 1, periods: 8, attend: 0, icon: '🚫', color: 'from-red-400/60 to-pink-400/60' },
    { name: 'Attend All Week', days: 6, periods: 8, attend: 8, icon: '✨', color: 'from-green-400/60 to-emerald-400/60' },
    { name: 'Half Day Tomorrow', days: 1, periods: 8, attend: 4, icon: '⚡', color: 'from-yellow-400/60 to-orange-400/60' },
    { name: 'Perfect Month', days: 24, periods: 8, attend: 8, icon: '🏆', color: 'from-purple-400/60 to-violet-400/60' },
  ];

  const togglePeriod = (index) => {
    const newPeriods = [...selectedPeriods];
    if (newPeriods[index] === null) {
      newPeriods[index] = true;
    } else if (newPeriods[index] === true) {
      newPeriods[index] = false;
    } else {
      newPeriods[index] = null;
    }
    setSelectedPeriods(newPeriods);
  };

  const dailyPrediction = calculateDailyPrediction(selectedPeriods);
  const customResult = calculateScenario(customDays, 8, customAttendance);

  const getStatusColor = (percentage) => {
    if (percentage >= 85) return 'from-green-400/70 to-emerald-400/70';
    if (percentage >= 75) return 'from-blue-400/70 to-cyan-400/70';
    if (percentage >= 65) return 'from-yellow-400/70 to-orange-400/70';
    return 'from-red-400/70 to-pink-400/70';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mobile-First Header */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-blue-400/70 to-purple-400/70 flex items-center justify-center">
              <span className="text-white text-sm md:text-lg">🤖</span>
            </div>
            <div>
              <h1 className="gradient-text text-lg md:text-2xl font-bold">
                AI Predictor
              </h1>
              <p className="text-xs md:text-sm text-gray-400">Smart attendance insights</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full bg-gradient-to-r ${getStatusColor(currentAttendance?.percentage)} text-white text-sm font-bold`}>
            {currentAttendance?.percentage}%
          </div>
        </div>
      </motion.div>

      {/* Mobile-Optimized Navigation */}
      <motion.div 
        className="glass-card p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'predictor', label: 'Daily', icon: '📅' },
            { id: 'scenarios', label: 'What-If', icon: '📈' },
            { id: 'goals', label: 'Goals', icon: '🎯' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-400/20 border border-blue-400/40 text-blue-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg md:text-xl">{tab.icon}</span>
              <span className="text-xs md:text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'predictor' && (
          <motion.div 
            key="predictor"
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Current Status - Mobile Compact */}
            <div className="glass-card">
              <h3 className="gradient-text text-base md:text-lg font-bold mb-3">Current Status</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="glass-card-inner text-center p-2 md:p-4">
                  <div className="text-lg md:text-2xl font-bold text-green-400">{currentAttendance?.totalPresent}</div>
                  <div className="text-xs text-gray-400">Present</div>
                </div>
                <div className="glass-card-inner text-center p-2 md:p-4">
                  <div className="text-lg md:text-2xl font-bold text-blue-400">{currentAttendance?.totalPeriods}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
                <div className="glass-card-inner text-center p-2 md:p-4">
                  <div className="text-lg md:text-2xl font-bold text-purple-400">{currentAttendance?.percentage}%</div>
                  <div className="text-xs text-gray-400">Rate</div>
                </div>
              </div>
            </div>

            {/* Period Selection - Mobile Grid */}
            <div className="glass-card">
              <h3 className="gradient-text text-base md:text-lg font-bold mb-3">Today's Periods</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({ length: 8 }, (_, i) => {
                  const status = selectedPeriods[i];
                  let className = 'glass-card-inner p-2 cursor-pointer transition-all duration-300 text-center';
                  let statusIcon = '⚪';
                  
                  if (status === true) {
                    className += ' bg-green-400/20 border-green-400/40';
                    statusIcon = '✅';
                  } else if (status === false) {
                    className += ' bg-red-400/20 border-red-400/40';
                    statusIcon = '❌';
                  }
                  
                  return (
                    <motion.div
                      key={i}
                      onClick={() => togglePeriod(i)}
                      className={className}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-lg md:text-xl">{statusIcon}</div>
                      <div className="text-xs font-medium">P{i + 1}</div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedPeriods(Array(8).fill(true))}
                  className="glass-button text-xs md:text-sm bg-green-400/20 border-green-400/40 text-green-300"
                >
                  ✅ All
                </button>
                <button
                  onClick={() => setSelectedPeriods(Array(8).fill(false))}
                  className="glass-button text-xs md:text-sm bg-red-400/20 border-red-400/40 text-red-300"
                >
                  ❌ None
                </button>
                <button
                  onClick={() => setSelectedPeriods(Array(8).fill(null))}
                  className="glass-button text-xs md:text-sm"
                >
                  ⚪ Clear
                </button>
              </div>
            </div>

            {/* Prediction Results - Mobile Compact */}
            {dailyPrediction && (
              <motion.div 
                className="glass-card border-l-4 border-blue-400"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="gradient-text text-base md:text-lg font-bold mb-3">Prediction</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Current</div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{dailyPrediction.current}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Predicted</div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-400">{dailyPrediction.predicted}%</div>
                  </div>
                </div>
                
                <div className="glass-card-inner text-center p-3">
                  <div className="text-xs text-gray-400 mb-1">Today's Plan</div>
                  <div className="text-sm font-medium">
                    {dailyPrediction.attending} Present • {dailyPrediction.missing} Absent • {dailyPrediction.totalSelected} Total
                  </div>
                </div>

                <div className="mt-3 text-center text-sm">
                  {dailyPrediction.predicted >= targetPercentage + 5 ? (
                    <div className="text-green-400 font-medium">✅ Safe to skip today!</div>
                  ) : dailyPrediction.predicted >= targetPercentage ? (
                    <div className="text-yellow-400 font-medium">⚠️ Better attend!</div>
                  ) : (
                    <div className="text-red-400 font-medium">🚨 Must attend!</div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'scenarios' && (
          <motion.div 
            key="scenarios"
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((scenario, index) => {
                const result = calculateScenario(scenario.days, scenario.periods, scenario.attend);
                return (
                  <motion.div
                    key={index}
                    className="glass-card-inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{scenario.icon}</div>
                      <h3 className="font-bold text-sm mb-1">{scenario.name}</h3>
                      <div className="text-xs text-gray-400 mb-3">
                        {scenario.days}d • {scenario.attend}/{scenario.periods}
                      </div>
                      {result && (
                        <div>
                          <div className={`text-xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                            {result.percentage}%
                          </div>
                          <div className={`text-xs font-medium ${result.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {result.change >= 0 ? '↗️' : '↘️'} {result.change > 0 ? '+' : ''}{result.change.toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom Scenario - Mobile Optimized */}
            <div className="glass-card">
              <h3 className="gradient-text text-base md:text-lg font-bold mb-4">Custom Scenario</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Days: {customDays}</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCustomDays(Math.max(1, customDays - 1))}
                      className="glass-button w-8 h-8 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <div className="glass-card-inner flex-1 text-center py-2 font-bold">
                      {customDays}
                    </div>
                    <button
                      onClick={() => setCustomDays(Math.min(30, customDays + 1))}
                      className="glass-button w-8 h-8 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Attend per day: {customAttendance}/8</label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={customAttendance}
                    onChange={(e) => setCustomAttendance(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {customResult && (
                <motion.div 
                  className="mt-4 glass-card-inner border-l-4 border-blue-400"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Custom Result</div>
                    <div className="text-xl font-bold text-blue-400">{customResult.percentage}%</div>
                    <div className={`text-xs font-medium ${customResult.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {customResult.change >= 0 ? '↗️' : '↘️'} {customResult.change > 0 ? '+' : ''}{customResult.change.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div 
            key="goals"
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="gradient-text text-base md:text-lg font-bold">Goal Tracker</h3>
                <select
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(parseInt(e.target.value))}
                  className="glass-input text-sm"
                >
                  <option value={55}>55%</option>
                  <option value={65}>65%</option>
                  <option value={75}>75%</option>
                  <option value={80}>80%</option>
                  <option value={85}>85%</option>
                  <option value={90}>90%</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card-inner text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-xs text-gray-400 mb-1">Classes Needed</div>
                  <div className="text-lg font-bold text-blue-400">
                    {Math.max(0, Math.ceil((targetPercentage/100 * currentAttendance?.totalPeriods - currentAttendance?.totalPresent) / (1 - targetPercentage/100)))}
                  </div>
                  <div className="text-xs text-gray-400">to reach {targetPercentage}%</div>
                </div>

                <div className="glass-card-inner text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-xs text-gray-400 mb-1">Current Status</div>
                  <div className="text-lg font-bold text-purple-400">{currentAttendance?.percentage}%</div>
                  <div className="text-xs text-gray-400">
                    {parseFloat(currentAttendance?.percentage) >= targetPercentage ? 'Above target' : 'Below target'}
                  </div>
                </div>

                <div className="glass-card-inner text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-xs text-gray-400 mb-1">Can Miss</div>
                  <div className="text-lg font-bold text-orange-400">
                    {Math.max(0, Math.floor(currentAttendance?.totalPresent / (targetPercentage/100)) - currentAttendance?.totalPeriods)}
                  </div>
                  <div className="text-xs text-gray-400">classes safely</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumDashboard;