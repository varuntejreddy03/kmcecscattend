import { generateAnalysis } from '../utils/attendanceUtils';

export default function AttendanceAnalysis({ student }) {
  const analysis = generateAnalysis(student);
  const currentPercentage = parseFloat(student.percentage);

  return (
    <div className="analysis-section">
      <div className="card animate-slide-up">
        <h2 style={{ marginBottom: '20px' }}>📊 Attendance Analysis</h2>
        
        <div className="analysis-grid">
          {Object.entries(analysis).map(([threshold, data], index) => (
            <div key={threshold} className="analysis-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="analysis-title">
                {threshold}% Threshold
                <span className={`status-badge ${data.currentStatus === 'Safe' ? 'status-safe' : 'status-risk'}`}>
                  {data.currentStatus}
                </span>
              </div>
              
              <div className="analysis-metrics">
                <div className="metric">
                  <div className="metric-value">{data.classesNeeded}</div>
                  <div className="metric-label">Classes Needed</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '2px' }}>
                    ({Math.ceil(data.classesNeeded / 8)} days)
                  </div>
                </div>
                
                <div className="metric">
                  <div className="metric-value">{data.classesCanMiss}</div>
                  <div className="metric-label">Can Miss</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '2px' }}>
                    ({Math.floor(data.classesCanMiss / 8)} days)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 style={{ marginBottom: '20px' }}>🎯 Performance Overview</h2>
        
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-header">
              <h3>Current Status</h3>
              <div className={`performance-badge ${currentPercentage >= 75 ? 'badge-success' : currentPercentage >= 65 ? 'badge-warning' : 'badge-danger'}`}>
                {currentPercentage >= 75 ? 'Excellent' : currentPercentage >= 65 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="performance-stats">
              <div className="stat-row">
                <span>Current Attendance</span>
                <strong className={currentPercentage >= 75 ? 'text-success' : currentPercentage >= 65 ? 'text-warning' : 'text-danger'}>
                  {student.percentage}%
                </strong>
              </div>
              <div className="stat-row">
                <span>Classes Attended</span>
                <strong>{student.totalPresent}</strong>
              </div>
              <div className="stat-row">
                <span>Total Classes</span>
                <strong>{student.totalPeriods}</strong>
              </div>
            </div>
          </div>
          
          <div className="performance-card">
            <h3 style={{ marginBottom: '16px' }}>Quick Insights</h3>
            <div className="insights">
              {currentPercentage >= 75 ? (
                <div className="insight success">
                  <span className="insight-icon">✅</span>
                  <span>Great attendance! Keep it up!</span>
                </div>
              ) : currentPercentage >= 65 ? (
                <div className="insight warning">
                  <span className="insight-icon">⚠️</span>
                  <span>Good progress, aim for 75%+</span>
                </div>
              ) : (
                <div className="insight danger">
                  <span className="insight-icon">🚨</span>
                  <span>Attendance needs improvement</span>
                </div>
              )}
              
              <div className="insight info">
                <span className="insight-icon">📈</span>
                <span>Check thresholds above for targets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}