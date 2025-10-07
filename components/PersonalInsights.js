import { SUBJECTS } from '../utils/attendanceUtils';

export default function PersonalInsights({ student, students }) {
  const currentPercentage = parseFloat(student.percentage);
  
  // Calculate rank
  const sortedStudents = [...students].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
  const rank = sortedStudents.findIndex(s => s.studentId === student.studentId) + 1;
  const totalStudents = students.length;
  
  // Find best and worst subjects
  const subjectPerformances = student.attendance.map(att => {
    const [present, total] = att.status.split('/').map(Number);
    const percentage = ((present / total) * 100).toFixed(2);
    return {
      subject: SUBJECTS[att.subjectId] || `Subject ${att.subjectId}`,
      present,
      total,
      percentage: parseFloat(percentage)
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const bestSubject = subjectPerformances[0];
  const worstSubject = subjectPerformances[subjectPerformances.length - 1];
  
  // Calculate section performance
  const sectionStudents = students.filter(s => s.section === student.section);
  const sectionAvg = sectionStudents.length > 0 ? 
    (sectionStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / sectionStudents.length).toFixed(2) : 0;
  const sectionRank = sectionStudents
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .findIndex(s => s.studentId === student.studentId) + 1;

  // Generate insights
  const insights = [];
  
  if (currentPercentage >= 85) {
    insights.push({
      type: 'success',
      icon: '🌟',
      title: 'Excellent Performance!',
      message: `You're in the top ${Math.round((rank/totalStudents)*100)}% of all students. Keep up the great work!`
    });
  } else if (currentPercentage >= 75) {
    insights.push({
      type: 'success',
      icon: '👍',
      title: 'Good Attendance',
      message: 'You\'re meeting the minimum requirement. Try to aim higher for better opportunities!'
    });
  } else if (currentPercentage >= 65) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Needs Improvement',
      message: 'You\'re close to the minimum requirement. Focus on attending more classes.'
    });
  } else {
    insights.push({
      type: 'danger',
      icon: '🚨',
      title: 'Critical Attention Needed',
      message: 'Your attendance is below minimum requirements. Immediate action needed!'
    });
  }

  if (bestSubject.percentage >= 90) {
    insights.push({
      type: 'success',
      icon: '🎯',
      title: 'Subject Champion',
      message: `Outstanding performance in ${bestSubject.subject} (${bestSubject.percentage}%)!`
    });
  }

  if (worstSubject.percentage < 60) {
    insights.push({
      type: 'warning',
      icon: '📚',
      title: 'Focus Area',
      message: `${worstSubject.subject} needs attention (${worstSubject.percentage}%). Consider attending more classes.`
    });
  }

  if (currentPercentage > parseFloat(sectionAvg)) {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Above Section Average',
      message: `You're performing better than your section average (${sectionAvg}%)!`
    });
  }

  return (
    <div className="animate-fade-in">
      {/* Personal Stats Overview */}
      <div className="card">
        <h2>💡 Personal Insights</h2>
        
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-value">#{rank}</div>
            <div className="stat-label">Overall Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">#{sectionRank}</div>
            <div className="stat-label">Section Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{student.section}</div>
            <div className="stat-label">Your Section</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sectionAvg}%</div>
            <div className="stat-label">Section Average</div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div style={{ marginBottom: '24px' }}>
          <h3>📈 Performance Comparison</h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '16px',
            background: '#111',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '4px' }}>Your Performance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{currentPercentage}%</div>
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              {currentPercentage > parseFloat(sectionAvg) ? '📈' : currentPercentage < parseFloat(sectionAvg) ? '📉' : '➡️'}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '4px' }}>Section Average</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#aaa' }}>{sectionAvg}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="card">
        <h3>📚 Subject Performance Analysis</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(40, 167, 69, 0.1)', 
            border: '1px solid #28a745',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <span style={{ fontWeight: 'bold' }}>Best Subject</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#28a745' }}>{bestSubject.subject}</div>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{bestSubject.percentage}% ({bestSubject.present}/{bestSubject.total})</div>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(220, 53, 69, 0.1)', 
            border: '1px solid #dc3545',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>📖</span>
              <span style={{ fontWeight: 'bold' }}>Needs Focus</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#dc3545' }}>{worstSubject.subject}</div>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{worstSubject.percentage}% ({worstSubject.present}/{worstSubject.total})</div>
          </div>
        </div>

        {/* Subject-wise breakdown */}
        <div>
          <h4>All Subjects Breakdown</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {subjectPerformances.map(subject => (
              <div 
                key={subject.subject}
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
                  <div style={{ fontWeight: '500' }}>{subject.subject}</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{subject.present}/{subject.total} classes</div>
                </div>
                <div style={{ 
                  background: '#333', 
                  borderRadius: '4px', 
                  height: '8px',
                  width: '100px',
                  position: 'relative'
                }}>
                  <div 
                    style={{
                      background: subject.percentage >= 75 ? '#28a745' : 
                                 subject.percentage >= 65 ? '#ffc107' : '#dc3545',
                      height: '100%',
                      borderRadius: '4px',
                      width: `${Math.min(subject.percentage, 100)}%`
                    }}
                  />
                </div>
                <div style={{ 
                  minWidth: '50px', 
                  textAlign: 'right',
                  color: subject.percentage >= 75 ? '#28a745' : 
                         subject.percentage >= 65 ? '#ffc107' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {subject.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card">
        <h3>🎯 Personalized Insights</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {insights.map((insight, index) => (
            <div 
              key={index}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: `1px solid ${
                  insight.type === 'success' ? '#28a745' : 
                  insight.type === 'warning' ? '#ffc107' : 
                  insight.type === 'danger' ? '#dc3545' : '#17a2b8'
                }`,
                background: `${
                  insight.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 
                  insight.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 
                  insight.type === 'danger' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(23, 162, 184, 0.1)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{insight.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}