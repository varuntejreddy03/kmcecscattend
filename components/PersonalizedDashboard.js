import { useState, useEffect } from 'react';
import { SUBJECTS } from '../utils/attendanceUtils';

export default function PersonalizedDashboard({ student, students }) {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    const quotes = [
      "Success is the sum of small efforts repeated day in and day out.",
      "Your attendance today shapes your future tomorrow.",
      "Every class attended is a step closer to your dreams.",
      "Consistency in attendance leads to excellence in academics.",
      "Show up, stay focused, and make it count!"
    ];
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const currentPercentage = parseFloat(student.percentage);
  const totalStudents = students.length;
  const rank = students.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .findIndex(s => s.studentId === student.studentId) + 1;

  // Calculate streaks and patterns
  const getAttendancePattern = () => {
    const subjects = student.attendance.map(att => {
      const [present, total] = att.status.split('/').map(Number);
      return { 
        subject: SUBJECTS[att.subjectId] || `Subject ${att.subjectId}`,
        percentage: ((present / total) * 100).toFixed(1),
        present,
        total
      };
    });

    const excellent = subjects.filter(s => parseFloat(s.percentage) >= 85).length;
    const good = subjects.filter(s => parseFloat(s.percentage) >= 75 && parseFloat(s.percentage) < 85).length;
    const average = subjects.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length;
    const poor = subjects.filter(s => parseFloat(s.percentage) < 65).length;

    return { excellent, good, average, poor, subjects };
  };

  const pattern = getAttendancePattern();

  // Personal recommendations
  const getPersonalRecommendations = () => {
    const recommendations = [];
    
    if (currentPercentage < 65) {
      recommendations.push({
        type: 'urgent',
        icon: '🚨',
        title: 'Urgent Action Required',
        message: 'Your attendance is critically low. Attend all upcoming classes immediately.',
        priority: 'high'
      });
    } else if (currentPercentage < 75) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Improvement Needed',
        message: 'Focus on attending more classes to reach the minimum 75% requirement.',
        priority: 'medium'
      });
    }

    if (pattern.poor > 0) {
      const poorSubjects = pattern.subjects.filter(s => parseFloat(s.percentage) < 65);
      recommendations.push({
        type: 'focus',
        icon: '🎯',
        title: 'Subject Focus Required',
        message: `Pay special attention to: ${poorSubjects.map(s => s.subject).join(', ')}`,
        priority: 'medium'
      });
    }

    if (currentPercentage >= 85) {
      recommendations.push({
        type: 'excellent',
        icon: '🌟',
        title: 'Excellent Performance!',
        message: 'You\'re doing great! Maintain this consistency for academic success.',
        priority: 'low'
      });
    }

    return recommendations;
  };

  const recommendations = getPersonalRecommendations();

  // Weekly goal suggestion (1 day = 8 classes) - Personalized based on current performance
  const getWeeklyGoal = () => {
    if (currentPercentage < 50) {
      return { target: Math.min(currentPercentage + 10, 65), days: 5, classes: 40, message: 'Critical: Attend 5 days this week (40 classes)' };
    } else if (currentPercentage < 65) {
      return { target: Math.min(currentPercentage + 8, 75), days: 5, classes: 40, message: 'Recovery: Attend 5 days this week (40 classes)' };
    } else if (currentPercentage < 75) {
      return { target: Math.min(currentPercentage + 5, 80), days: 4, classes: 32, message: 'Improvement: Attend 4 days this week (32 classes)' };
    } else if (currentPercentage < 85) {
      return { target: Math.min(currentPercentage + 3, 87), days: 3, classes: 24, message: 'Maintain: Attend 3 days this week (24 classes)' };
    } else {
      return { target: Math.min(currentPercentage + 2, 95), days: 2, classes: 16, message: 'Excellence: Attend 2 days this week (16 classes)' };
    }
  };

  const weeklyGoal = getWeeklyGoal();

  return (
    <div className="animate-fade-in">
      {/* Personalized Greeting */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h2>Good {timeOfDay}, {student.studentName}! 👋</h2>
        <p style={{ fontSize: '1.1rem', margin: '16px 0', fontStyle: 'italic' }}>
          "{motivationalQuote}"
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{currentPercentage}%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Your Attendance</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>#{rank}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Your Rank</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h3>📊 Your Performance Snapshot</h3>
        <div className="stats-grid">
          <div className="stat-card" style={{ border: '2px solid #28a745' }}>
            <div className="stat-value" style={{ color: '#28a745' }}>{pattern.excellent}</div>
            <div className="stat-label">Excellent Subjects (≥85%)</div>
          </div>
          <div className="stat-card" style={{ border: '2px solid #17a2b8' }}>
            <div className="stat-value" style={{ color: '#17a2b8' }}>{pattern.good}</div>
            <div className="stat-label">Good Subjects (75-84%)</div>
          </div>
          <div className="stat-card" style={{ border: '2px solid #ffc107' }}>
            <div className="stat-value" style={{ color: '#ffc107' }}>{pattern.average}</div>
            <div className="stat-label">Average Subjects (65-74%)</div>
          </div>
          <div className="stat-card" style={{ border: '2px solid #dc3545' }}>
            <div className="stat-value" style={{ color: '#dc3545' }}>{pattern.poor}</div>
            <div className="stat-label">Needs Focus (&lt;65%)</div>
          </div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="card">
        <h3>🎯 This Week's Goal</h3>
        <div style={{ 
          padding: '20px',
          background: 'rgba(23, 162, 184, 0.1)',
          border: '2px solid #17a2b8',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎯</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#17a2b8' }}>Target: {weeklyGoal.target}%</h4>
          <p style={{ margin: '0', fontSize: '1.1rem' }}>{weeklyGoal.message}</p>
        </div>
      </div>

      {/* Personal Recommendations */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3>💡 Personalized Recommendations</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: `2px solid ${
                    rec.type === 'urgent' ? '#dc3545' :
                    rec.type === 'warning' ? '#ffc107' :
                    rec.type === 'focus' ? '#17a2b8' : '#28a745'
                  }`,
                  background: `${
                    rec.type === 'urgent' ? 'rgba(220, 53, 69, 0.1)' :
                    rec.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' :
                    rec.type === 'focus' ? 'rgba(23, 162, 184, 0.1)' : 'rgba(40, 167, 69, 0.1)'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{rec.icon}</span>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0' }}>{rec.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Performance Radar */}
      <div className="card">
        <h3>📈 Subject Performance Overview</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {pattern.subjects
            .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
            .map(subject => (
            <div 
              key={subject.subject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#111',
                borderRadius: '8px'
              }}
            >
              <div style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: parseFloat(subject.percentage) >= 85 ? '#28a745' :
                           parseFloat(subject.percentage) >= 75 ? '#17a2b8' :
                           parseFloat(subject.percentage) >= 65 ? '#ffc107' : '#dc3545',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}>
                {subject.percentage}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>{subject.subject}</div>
                <div style={{ 
                  background: '#333',
                  borderRadius: '4px',
                  height: '6px',
                  position: 'relative'
                }}>
                  <div 
                    style={{
                      background: parseFloat(subject.percentage) >= 85 ? '#28a745' :
                                 parseFloat(subject.percentage) >= 75 ? '#17a2b8' :
                                 parseFloat(subject.percentage) >= 65 ? '#ffc107' : '#dc3545',
                      height: '100%',
                      borderRadius: '4px',
                      width: `${Math.min(parseFloat(subject.percentage), 100)}%`
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                {subject.present}/{subject.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}