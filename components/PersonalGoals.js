import { useState, useEffect } from 'react';
import { calculateClassesNeeded, calculateClassesCanMiss } from '../utils/attendanceUtils';

export default function PersonalGoals({ student }) {
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [customTarget, setCustomTarget] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const currentPercentage = parseFloat(student.percentage);
  const classesNeeded = calculateClassesNeeded(student.totalPresent, student.totalPeriods, targetPercentage);
  const classesCanMiss = calculateClassesCanMiss(student.totalPresent, student.totalPeriods, targetPercentage);

  const getMotivationalMessage = () => {
    if (currentPercentage >= targetPercentage) {
      return {
        type: 'success',
        icon: '🎉',
        title: 'Goal Achieved!',
        message: `You've reached your ${targetPercentage}% target! Keep it up!`
      };
    } else if (classesNeeded <= 5) {
      return {
        type: 'warning',
        icon: '💪',
        title: 'Almost There!',
        message: `Just ${classesNeeded} more classes to reach your goal!`
      };
    } else {
      return {
        type: 'info',
        icon: '🎯',
        title: 'Stay Focused!',
        message: `Attend ${classesNeeded} classes to reach ${targetPercentage}%`
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="animate-fade-in">
      {/* Goal Setting */}
      <div className="card">
        <h2>🎯 My Attendance Goals</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>Set Your Target</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', marginBottom: '16px' }}>
            {[65, 70, 75, 80, 85, 90].map(percent => (
              <button
                key={percent}
                className={`btn ${targetPercentage === percent ? '' : 'btn-secondary'}`}
                onClick={() => {
                  setTargetPercentage(percent);
                  setShowCustom(false);
                }}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              >
                {percent}%
              </button>
            ))}
            <button
              className={`btn ${showCustom ? '' : 'btn-secondary'}`}
              onClick={() => setShowCustom(!showCustom)}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            >
              Custom
            </button>
          </div>
          
          {showCustom && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                min="50"
                max="100"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="Enter %"
                style={{ width: '100px' }}
              />
              <button
                className="btn"
                onClick={() => {
                  if (customTarget >= 50 && customTarget <= 100) {
                    setTargetPercentage(parseInt(customTarget));
                  }
                }}
              >
                Set Goal
              </button>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div 
          className={`card`}
          style={{
            background: motivation.type === 'success' ? 'rgba(40, 167, 69, 0.1)' :
                       motivation.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(23, 162, 184, 0.1)',
            border: `1px solid ${
              motivation.type === 'success' ? '#28a745' :
              motivation.type === 'warning' ? '#ffc107' : '#17a2b8'
            }`,
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{motivation.icon}</div>
          <h3 style={{ margin: '0 0 8px 0' }}>{motivation.title}</h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>{motivation.message}</p>
        </div>

        {/* Progress Visualization */}
        <div style={{ marginBottom: '24px' }}>
          <h3>Progress to Goal</h3>
          <div style={{ 
            background: '#333', 
            borderRadius: '10px', 
            height: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                background: currentPercentage >= targetPercentage ? '#28a745' : '#17a2b8',
                height: '100%',
                borderRadius: '10px',
                width: `${Math.min((currentPercentage / targetPercentage) * 100, 100)}%`,
                transition: 'width 0.5s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {currentPercentage}% / {targetPercentage}%
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: currentPercentage >= targetPercentage ? '#28a745' : '#17a2b8' }}>
              {currentPercentage >= targetPercentage ? '✅' : classesNeeded}
            </div>
            <div className="stat-label">
              {currentPercentage >= targetPercentage ? 'Goal Achieved!' : 'Classes Needed'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#28a745' }}>
              {classesCanMiss}
            </div>
            <div className="stat-label">Classes You Can Miss</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ffc107' }}>
              {targetPercentage - currentPercentage > 0 ? `+${(targetPercentage - currentPercentage).toFixed(1)}%` : '0%'}
            </div>
            <div className="stat-label">Points to Gain</div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card">
        <h3>🏆 Your Achievements</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { threshold: 60, icon: '🌱', title: 'Getting Started', desc: '60% Attendance' },
            { threshold: 70, icon: '📈', title: 'On Track', desc: '70% Attendance' },
            { threshold: 75, icon: '⭐', title: 'Good Student', desc: '75% Attendance' },
            { threshold: 80, icon: '🎖️', title: 'Excellent', desc: '80% Attendance' },
            { threshold: 85, icon: '🏅', title: 'Outstanding', desc: '85% Attendance' },
            { threshold: 90, icon: '👑', title: 'Perfect', desc: '90% Attendance' }
          ].map(badge => (
            <div 
              key={badge.threshold}
              className="stat-card"
              style={{
                opacity: currentPercentage >= badge.threshold ? 1 : 0.3,
                border: currentPercentage >= badge.threshold ? '2px solid #ffc107' : '1px solid #333',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{badge.icon}</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{badge.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{badge.desc}</div>
              {currentPercentage >= badge.threshold && (
                <div style={{ fontSize: '0.7rem', color: '#28a745', marginTop: '4px' }}>✓ Unlocked</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}