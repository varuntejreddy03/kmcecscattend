import { useState, useEffect } from 'react';

const AttendanceSimulator = ({ currentAttendance }) => {
  const [scenarios, setScenarios] = useState([]);
  const [customDays, setCustomDays] = useState(1);
  const [customAttendance, setCustomAttendance] = useState(8);
  const [selectedPeriods, setSelectedPeriods] = useState(Array(8).fill(null)); // null = not selected, true = present, false = absent
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [activeSection, setActiveSection] = useState('daily');
  const [stressTestPlan, setStressTestPlan] = useState('');

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

  const calculateDailyPrediction = (periods) => {
    if (!currentAttendance) return null;
    
    const selectedPeriods = periods.filter(p => p !== null); // Only count selected periods
    const attendingToday = periods.filter(p => p === true).length;
    const totalSelectedToday = selectedPeriods.length;
    
    if (totalSelectedToday === 0) return null; // No periods selected
    
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

  const calculateClassesNeeded = () => {
    if (!currentAttendance) return 0;
    const target = targetPercentage / 100;
    const current = currentAttendance.totalPresent / currentAttendance.totalPeriods;
    
    if (current >= target) return 0;
    
    const classesNeeded = Math.ceil((target * currentAttendance.totalPeriods - currentAttendance.totalPresent) / (1 - target));
    return Math.max(0, classesNeeded);
  };

  const calculateClassesCanMiss = () => {
    if (!currentAttendance) return 0;
    const minTarget = targetPercentage / 100;
    const current = currentAttendance.totalPresent / currentAttendance.totalPeriods;
    
    if (current <= minTarget) return 0;
    
    const maxTotal = Math.floor(currentAttendance.totalPresent / minTarget);
    return Math.max(0, maxTotal - currentAttendance.totalPeriods);
  };

  const predefinedScenarios = [
    { name: 'Skip Tomorrow', days: 1, periods: 8, attend: 0, icon: '❌' },
    { name: 'Attend All Week', days: 6, periods: 8, attend: 8, icon: '✅' },
    { name: 'Half Day Tomorrow', days: 1, periods: 8, attend: 4, icon: '⚡' },
    { name: 'Skip This Week', days: 6, periods: 8, attend: 0, icon: '🚫' },
    { name: 'Perfect Month', days: 24, periods: 8, attend: 8, icon: '🏆' },
    { name: 'Minimal Attendance', days: 7, periods: 8, attend: 6, icon: '⚖️' }
  ];

  useEffect(() => {
    const results = predefinedScenarios.map(scenario => ({
      ...scenario,
      result: calculateScenario(scenario.days, scenario.periods, scenario.attend)
    }));
    setScenarios(results);
  }, [currentAttendance]);

  const customResult = calculateScenario(customDays, 8, customAttendance);
  const dailyPrediction = calculateDailyPrediction(selectedPeriods);
  const classesNeeded = calculateClassesNeeded();
  const classesCanMiss = calculateClassesCanMiss();

  const getChangeColor = (change) => {
    if (change > 0) return '#4CAF50';
    if (change < 0) return '#F44336';
    return '#666';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  };

  const getStatusMessage = () => {
    if (!dailyPrediction) return '';
    
    if (dailyPrediction.predicted >= targetPercentage + 5) {
      return { text: '✅ Safe to skip today!', color: '#4CAF50' };
    } else if (dailyPrediction.predicted >= targetPercentage) {
      return { text: '⚠️ Better attend! You\'re close to shortage.', color: '#FF9800' };
    } else {
      return { text: '🚨 Critical! Must attend to avoid shortage.', color: '#F44336' };
    }
  };

  const togglePeriod = (index) => {
    const newPeriods = [...selectedPeriods];
    if (newPeriods[index] === null) {
      newPeriods[index] = true; // First click: Present
    } else if (newPeriods[index] === true) {
      newPeriods[index] = false; // Second click: Absent
    } else {
      newPeriods[index] = null; // Third click: Not selected
    }
    setSelectedPeriods(newPeriods);
  };

  const markAll = (present) => {
    setSelectedPeriods(Array(8).fill(present));
  };

  const clearAll = () => {
    setSelectedPeriods(Array(8).fill(null));
  };

  const status = getStatusMessage();

  return (
    <div className="attendance-simulator">
      <div className="simulator-header">
        <h2>🎯 Smart Attendance Predictor</h2>
        <p>Plan your attendance strategy with real-time predictions</p>
      </div>

      <div className="section-tabs">
        <button 
          className={`section-tab ${activeSection === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveSection('daily')}
        >
          📅 Daily Predictor
        </button>
        <button 
          className={`section-tab ${activeSection === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveSection('scenarios')}
        >
          🔮 What-If Scenarios
        </button>
        <button 
          className={`section-tab ${activeSection === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveSection('goals')}
        >
          🎯 Goal Tracker
        </button>

      </div>

      {activeSection === 'daily' && (
        <div className="daily-section">
          <h3>Today's Attendance Predictor</h3>
          
          <div className="period-grid">
            {Array.from({ length: 8 }, (_, i) => {
              const status = selectedPeriods[i];
              let className = 'period-item';
              let statusText = 'Not Selected';
              let statusIcon = '⚪';
              
              if (status === true) {
                className += ' present';
                statusText = 'Present';
                statusIcon = '✅';
              } else if (status === false) {
                className += ' absent';
                statusText = 'Absent';
                statusIcon = '❌';
              }
              
              return (
                <div key={i} className={className} onClick={() => togglePeriod(i)}>
                  <div className="period-header">
                    <span className="period-number">Period {i + 1}</span>
                    <span className="status-icon">{statusIcon}</span>
                  </div>
                  <div className="period-status">{statusText}</div>
                </div>
              );
            })}
          </div>

          <div className="quick-actions">
            <button onClick={() => markAll(true)} className="btn-present">
              ✅ All Present
            </button>
            <button onClick={() => markAll(false)} className="btn-absent">
              ❌ All Absent
            </button>
            <button onClick={clearAll} className="btn-clear">
              ⚪ Clear All
            </button>
          </div>

          {dailyPrediction && (
            <div className="prediction-results">
              <div className="percentage-display">
                <div className="current">
                  Current
                  <span>{dailyPrediction.current}%</span>
                </div>
                <div className="predicted">
                  Predicted
                  <span>{dailyPrediction.predicted}%</span>
                </div>
              </div>
              
              <div className="attendance-summary">
                Selected: {dailyPrediction.totalSelected}/8 | Present: {dailyPrediction.attending} | Absent: {dailyPrediction.missing}
              </div>
              
              {status && (
                <div className="status-message" style={{ color: status.color }}>
                  {status.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === 'goals' && (
        <div className="goals-section">
          <h3>Goal Tracker & Analysis</h3>
          
          <div className="target-selector">
            <label>Target Percentage:</label>
            <select 
              value={targetPercentage} 
              onChange={(e) => setTargetPercentage(parseInt(e.target.value))}
              className="target-select"
            >
              <option value={55}>55%</option>
              <option value={65}>65%</option>
              <option value={75}>75%</option>
              <option value={80}>80%</option>
              <option value={85}>85%</option>
              <option value={90}>90%</option>
            </select>
          </div>

          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-icon">📈</div>
              <div className="goal-title">Classes Needed</div>
              <div className="goal-value">{classesNeeded}</div>
              <div className="goal-desc">to reach {targetPercentage}%</div>
            </div>
            
            <div className="goal-card">
              <div className="goal-icon">🎯</div>
              <div className="goal-title">Current Status</div>
              <div className="goal-value">{currentAttendance?.percentage}%</div>
              <div className="goal-desc">
                {parseFloat(currentAttendance?.percentage) >= targetPercentage ? 'Above target' : 'Below target'}
              </div>
            </div>
            
            <div className="goal-card">
              <div className="goal-icon">⚡</div>
              <div className="goal-title">Can Miss</div>
              <div className="goal-value">{classesCanMiss}</div>
              <div className="goal-desc">classes safely</div>
            </div>
          </div>
        </div>
      )}



      {activeSection === 'scenarios' && (
        <div className="scenarios-section">
          <h3>What-If Scenarios</h3>
          
          <div className="scenarios-grid">
            {scenarios.map((scenario, index) => (
              <div key={index} className="scenario-card">
                <div className="scenario-icon">{scenario.icon}</div>
                <h4>{scenario.name}</h4>
                <div className="scenario-details">
                  {scenario.days} day(s) • {scenario.attend}/{scenario.periods} periods
                </div>
                {scenario.result && (
                  <div className="scenario-result">
                    <div className="percentage">{scenario.result.percentage}%</div>
                    <div 
                      className="change"
                      style={{ color: getChangeColor(scenario.result.change) }}
                    >
                      {getChangeIcon(scenario.result.change)} {scenario.result.change > 0 ? '+' : ''}{scenario.result.change.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="custom-simulator">
            <h4>🛠️ Custom Scenario Builder</h4>
            <div className="custom-inputs">
              <div className="input-group">
                <label>📅 Days:</label>
                <div className="number-input-wrapper">
                  <button 
                    className="number-btn"
                    onClick={() => setCustomDays(Math.max(1, customDays - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="number-input"
                    value={customDays}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= 30) setCustomDays(val);
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setCustomDays(Math.min(30, Math.max(1, val)));
                    }}
                  />
                  <button 
                    className="number-btn"
                    onClick={() => setCustomDays(Math.min(30, customDays + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label>📚 Attend per day:</label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={customAttendance}
                  onChange={(e) => setCustomAttendance(parseInt(e.target.value))}
                />
                <span className="range-value">{customAttendance}/8</span>
              </div>
            </div>
            
            {customResult && (
              <div className="custom-result">
                <div className="result-text">
                  📊 Predicted: <strong>{customResult.percentage}%</strong>
                  <span 
                    className="change-indicator"
                    style={{ color: getChangeColor(customResult.change) }}
                  >
                    {getChangeIcon(customResult.change)} {customResult.change > 0 ? '+' : ''}{customResult.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .attendance-simulator {
          background: linear-gradient(135deg, #000 0%, #111 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          color: #fff;
        }

        .simulator-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .simulator-header h2 {
          font-size: 2rem;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .simulator-header p {
          color: #aaa;
          font-size: 1.1rem;
        }

        .section-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .section-tab {
          padding: 12px 20px;
          background: #222;
          color: #fff;
          border: 1px solid #444;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .section-tab:hover {
          background: #333;
          border-color: #555;
        }

        .section-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: #fff;
        }

        .daily-section, .goals-section, .scenarios-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
        }

        .period-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 24px 0;
        }

        .period-item {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #444;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .period-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .period-item.present {
          background: rgba(76, 175, 80, 0.2);
          border-color: #4CAF50;
        }

        .period-item.absent {
          background: rgba(244, 67, 54, 0.2);
          border-color: #f44336;
        }

        .period-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .period-number {
          font-weight: 600;
          font-size: 0.9rem;
          color: #fff;
        }

        .status-icon {
          font-size: 1.2rem;
        }

        .period-status {
          font-size: 0.8rem;
          color: #ccc;
          font-weight: 500;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 24px 0;
        }

        .btn-present, .btn-absent, .btn-clear {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .btn-present {
          background: #4CAF50;
          color: white;
        }

        .btn-present:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        .btn-absent {
          background: #f44336;
          color: white;
        }

        .btn-absent:hover {
          background: #da190b;
          transform: translateY(-2px);
        }

        .btn-clear {
          background: #666;
          color: white;
        }

        .btn-clear:hover {
          background: #555;
          transform: translateY(-2px);
        }

        .prediction-results {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }

        .percentage-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 16px;
        }

        .current, .predicted {
          text-align: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .current span, .predicted span {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          margin-top: 8px;
        }

        .attendance-summary {
          text-align: center;
          font-size: 1.1rem;
          font-weight: bold;
          margin: 16px 0;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .status-message {
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          margin-top: 16px;
        }

        .target-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          justify-content: center;
        }

        .target-select {
          background: #222;
          color: #fff;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 1rem;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .goal-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .goal-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .goal-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .goal-title {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 8px;
        }

        .goal-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .goal-desc {
          font-size: 0.8rem;
          color: #ccc;
        }



        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .scenario-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #444;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .scenario-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          border-color: #667eea;
        }

        .scenario-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .scenario-card h4 {
          margin: 0 0 12px 0;
          color: #fff;
          font-size: 1.1rem;
        }

        .scenario-details {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 16px;
        }

        .scenario-result {
          border-top: 1px solid #444;
          padding-top: 16px;
        }

        .percentage {
          font-size: 1.4rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 8px;
        }

        .change {
          font-size: 1rem;
          font-weight: bold;
        }

        .custom-simulator {
          border-top: 1px solid #444;
          padding-top: 24px;
          margin-top: 24px;
        }

        .custom-inputs {
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .input-group label {
          font-weight: bold;
          min-width: 100px;
          color: #fff;
        }

        .number-input-wrapper {
          display: flex;
          align-items: center;
          background: #222;
          border: 1px solid #444;
          border-radius: 8px;
          overflow: hidden;
        }

        .number-btn {
          background: #333;
          color: #fff;
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.2s ease;
          min-width: 44px;
        }

        .number-btn:hover {
          background: #444;
        }

        .number-btn:active {
          background: #555;
        }

        .number-input {
          background: transparent;
          border: none;
          color: #fff;
          text-align: center;
          font-size: 1.1rem;
          font-weight: bold;
          padding: 12px 16px;
          width: 60px;
          outline: none;
        }

        .number-input:focus {
          background: rgba(255, 255, 255, 0.1);
        }

        .input-group input[type="range"] {
          width: 150px;
          height: 8px;
          background: #444;
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .input-group input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
        }

        .input-group input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .range-value {
          font-weight: bold;
          color: #667eea;
          min-width: 40px;
        }

        .custom-result {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .result-text {
          font-size: 1.2rem;
        }

        .change-indicator {
          margin-left: 12px;
          font-weight: bold;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .period-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .percentage-display {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .scenarios-grid {
            grid-template-columns: 1fr;
          }
          
          .custom-inputs {
            flex-direction: column;
            align-items: stretch;
          }
          
          .quick-actions {
            flex-direction: column;
            gap: 8px;
          }
          
          .btn-present, .btn-absent, .btn-clear {
            min-width: auto;
            width: 100%;
          }
          
          .section-tabs {
            flex-direction: column;
            gap: 8px;
          }
          
          .goals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceSimulator;