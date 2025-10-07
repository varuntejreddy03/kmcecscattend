import { useState } from 'react';
import { SUBJECTS, calculateClassesCanMiss } from '../utils/attendanceUtils';

export default function PredictionEngine({ student }) {
  const [futureClasses, setFutureClasses] = useState(10);
  const [attendClasses, setAttendClasses] = useState(8);

  const currentPercentage = parseFloat(student.percentage);
  
  // Calculate predictions
  const predictFuturePercentage = (attend, total) => {
    const newPresent = student.totalPresent + attend;
    const newTotal = student.totalPeriods + total;
    return ((newPresent / newTotal) * 100).toFixed(2);
  };

  // Personalized scenarios based on current performance
  const getPersonalizedScenarios = () => {
    const scenarios = [];
    
    // Always include perfect attendance
    scenarios.push({ attend: futureClasses, total: futureClasses, label: 'Perfect Attendance', icon: '🌟' });
    
    // Add scenarios based on current performance
    if (currentPercentage < 65) {
      // Critical - focus on improvement
      scenarios.push(
        { attend: Math.floor(futureClasses * 0.95), total: futureClasses, label: 'Excellent Recovery (95%)', icon: '💪' },
        { attend: Math.floor(futureClasses * 0.85), total: futureClasses, label: 'Good Recovery (85%)', icon: '📈' },
        { attend: Math.floor(futureClasses * 0.75), total: futureClasses, label: 'Minimum Effort (75%)', icon: '⚠️' }
      );
    } else if (currentPercentage < 75) {
      // Needs improvement
      scenarios.push(
        { attend: Math.floor(futureClasses * 0.9), total: futureClasses, label: 'Strong Improvement (90%)', icon: '⭐' },
        { attend: Math.floor(futureClasses * 0.8), total: futureClasses, label: 'Steady Progress (80%)', icon: '👍' },
        { attend: Math.floor(futureClasses * 0.7), total: futureClasses, label: 'Maintain Current (70%)', icon: '➡️' }
      );
    } else {
      // Good performance - maintain or improve
      scenarios.push(
        { attend: Math.floor(futureClasses * 0.95), total: futureClasses, label: 'Excellence (95%)', icon: '⭐' },
        { attend: Math.floor(futureClasses * 0.85), total: futureClasses, label: 'Maintain Good (85%)', icon: '👍' },
        { attend: Math.floor(futureClasses * 0.75), total: futureClasses, label: 'Minimum Safe (75%)', icon: '⚠️' }
      );
    }
    
    // Always include worst case
    scenarios.push({ attend: 0, total: futureClasses, label: 'Skip All Classes', icon: '❌' });
    
    return scenarios;
  };
  
  const scenarios = getPersonalizedScenarios();

  // Subject-wise predictions
  const subjectPredictions = student.attendance.map(att => {
    const [present, total] = att.status.split('/').map(Number);
    const currentSubjectPercentage = ((present / total) * 100).toFixed(2);
    
    // Assume equal distribution of future classes
    const futureSubjectClasses = Math.ceil(futureClasses / student.attendance.length);
    const attendSubjectClasses = Math.ceil(attendClasses / student.attendance.length);
    
    const newPresent = present + attendSubjectClasses;
    const newTotal = total + futureSubjectClasses;
    const predictedPercentage = ((newPresent / newTotal) * 100).toFixed(2);
    
    return {
      subject: SUBJECTS[att.subjectId] || `Subject ${att.subjectId}`,
      current: parseFloat(currentSubjectPercentage),
      predicted: parseFloat(predictedPercentage),
      change: (parseFloat(predictedPercentage) - parseFloat(currentSubjectPercentage)).toFixed(2)
    };
  });

  // Goal achievement predictions
  const goalPredictions = [65, 70, 75, 80, 85].map(goal => {
    // Calculate classes needed to reach goal
    const classesNeeded = Math.ceil((goal * student.totalPeriods - student.totalPresent * 100) / (100 - goal));
    const canAchieve = classesNeeded <= futureClasses && classesNeeded > 0;
    
    return {
      goal,
      classesNeeded: Math.max(0, classesNeeded),
      canAchieve: currentPercentage >= goal || canAchieve,
      status: currentPercentage >= goal ? 'achieved' : canAchieve ? 'possible' : 'difficult'
    };
  });

  return (
    <div className="card">
      <h2>🔮 Prediction Engine</h2>
      
      {/* Input Controls */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#111', borderRadius: '8px' }}>
        <h3>📊 What-If Scenarios</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label>Future Classes Expected:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={futureClasses}
              onChange={(e) => setFutureClasses(parseInt(e.target.value) || 10)}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Classes You'll Attend:</label>
            <input
              type="number"
              min="0"
              max={futureClasses}
              value={attendClasses}
              onChange={(e) => setAttendClasses(Math.min(parseInt(e.target.value) || 0, futureClasses))}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>
        
        <div style={{ 
          padding: '12px', 
          background: 'rgba(23, 162, 184, 0.1)', 
          border: '1px solid #17a2b8',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <strong>Your Predicted Percentage: {predictFuturePercentage(attendClasses, futureClasses)}%</strong>
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>
            Change: {(predictFuturePercentage(attendClasses, futureClasses) - currentPercentage).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <h3>🎯 Scenario Analysis</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {scenarios.map((scenario, index) => {
            const predicted = parseFloat(predictFuturePercentage(scenario.attend, scenario.total));
            const change = predicted - currentPercentage;
            
            return (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#111',
                  borderRadius: '6px',
                  border: predicted >= 75 ? '1px solid #28a745' : 
                         predicted >= 65 ? '1px solid #ffc107' : '1px solid #dc3545'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{scenario.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{scenario.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    Attend {scenario.attend}/{scenario.total} classes
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: predicted >= 75 ? '#28a745' : 
                           predicted >= 65 ? '#ffc107' : '#dc3545'
                  }}>
                    {predicted}%
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem',
                    color: change >= 0 ? '#28a745' : '#dc3545'
                  }}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Achievement Tracker */}
      <div style={{ marginBottom: '24px' }}>
        <h3>🏆 Goal Achievement Predictions</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {goalPredictions.map(goal => {
            const daysNeeded = Math.ceil(goal.classesNeeded / 8); // Convert classes to days
            return (
              <div 
                key={goal.goal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#111',
                  borderRadius: '6px',
                  border: `1px solid ${
                    goal.status === 'achieved' ? '#28a745' :
                    goal.status === 'possible' ? '#ffc107' : '#dc3545'
                  }`
                }}
              >
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: goal.status === 'achieved' ? '#28a745' :
                             goal.status === 'possible' ? '#ffc107' : '#dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  {goal.goal}%
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>
                    {goal.status === 'achieved' ? '✅ Already Achieved!' :
                     goal.status === 'possible' ? `🎯 Achievable in ${daysNeeded} days` :
                     '❌ Very Difficult to Achieve'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {goal.status === 'achieved' ? 'Keep maintaining this level' :
                     goal.status === 'possible' ? `Need ${goal.classesNeeded} classes (${daysNeeded} days)` :
                     'Focus on not missing any classes'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem' }}>
                  {goal.status === 'achieved' ? '🏆' :
                   goal.status === 'possible' ? '💪' : '⚠️'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-wise Predictions */}
      <div style={{ marginBottom: '24px' }}>
        <h3>📚 Subject-wise Predictions</h3>
        <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '12px' }}>
          Based on attending {attendClasses} out of {futureClasses} future classes
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {subjectPredictions.map(pred => (
            <div 
              key={pred.subject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#111',
                borderRadius: '6px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{pred.subject}</div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  Current: {pred.current}%
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem' }}>
                  {parseFloat(pred.change) > 0 ? '📈' : 
                   parseFloat(pred.change) < 0 ? '📉' : '➡️'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontWeight: 'bold',
                  color: pred.predicted >= 75 ? '#28a745' : 
                         pred.predicted >= 65 ? '#ffc107' : '#dc3545'
                }}>
                  {pred.predicted}%
                </div>
                <div style={{ 
                  fontSize: '0.8rem',
                  color: parseFloat(pred.change) >= 0 ? '#28a745' : '#dc3545'
                }}>
                  {parseFloat(pred.change) >= 0 ? '+' : ''}{pred.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Planning Analytics */}
      <div>
        <h3>📅 Future Planning Analytics</h3>
        
        {/* Monthly Projection */}
        <div style={{ marginBottom: '16px', padding: '16px', background: '#111', borderRadius: '8px' }}>
          <h4>📆 Monthly Projection</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '4px' }}>If you attend 20 days (160 classes)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                {predictFuturePercentage(160, 160)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '4px' }}>If you attend 15 days (120 classes)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {predictFuturePercentage(120, 160)}%
              </div>
            </div>
          </div>
        </div>

        {/* Semester End Projection */}
        <div style={{ marginBottom: '16px', padding: '16px', background: '#111', borderRadius: '8px' }}>
          <h4>🎓 Semester End Projection</h4>
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '8px' }}>Estimated remaining classes: ~100</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { attend: 95, label: '95% Attendance', color: '#28a745' },
              { attend: 85, label: '85% Attendance', color: '#17a2b8' },
              { attend: 75, label: '75% Attendance', color: '#ffc107' },
              { attend: 65, label: '65% Attendance', color: '#dc3545' }
            ].map(scenario => (
              <div key={scenario.attend} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{scenario.label}</span>
                <span style={{ fontWeight: 'bold', color: scenario.color }}>
                  {predictFuturePercentage(scenario.attend, 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div style={{ padding: '16px', background: currentPercentage < 65 ? 'rgba(220, 53, 69, 0.1)' : 'rgba(23, 162, 184, 0.1)', border: `1px solid ${currentPercentage < 65 ? '#dc3545' : '#17a2b8'}`, borderRadius: '8px' }}>
          <h4>⚠️ Risk Assessment</h4>
          <div style={{ fontSize: '0.9rem' }}>
            {currentPercentage < 65 ? (
              <div>
                <div style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '4px' }}>🚨 High Risk</div>
                <div>You need to attend at least 90% of remaining classes to reach 75%</div>
              </div>
            ) : currentPercentage < 75 ? (
              <div>
                <div style={{ color: '#ffc107', fontWeight: 'bold', marginBottom: '4px' }}>⚠️ Medium Risk</div>
                <div>Maintain 80%+ attendance in remaining classes to stay safe</div>
              </div>
            ) : (
              <div>
                <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '4px' }}>✅ Low Risk</div>
                <div>You can miss up to {calculateClassesCanMiss(student.totalPresent, student.totalPeriods, 75)} classes and still maintain 75%</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}