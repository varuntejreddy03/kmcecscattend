export default function QuickStats({ students }) {
  const totalStudents = students.length;
  const avgAttendance = totalStudents > 0 ? 
    (students.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / totalStudents).toFixed(2) : 0;
  
  const sections = ['CSE A', 'CSE B', 'CSC', 'CSD', 'CSM', 'CSO'];
  const sectionStats = sections.map(section => {
    const sectionStudents = students.filter(s => s.section === section);
    const sectionAvg = sectionStudents.length > 0 ? 
      (sectionStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / sectionStudents.length).toFixed(2) : 0;
    return {
      section,
      count: sectionStudents.length,
      average: sectionAvg,
      good: sectionStudents.filter(s => parseFloat(s.percentage) >= 75).length,
      poor: sectionStudents.filter(s => parseFloat(s.percentage) < 65).length
    };
  });

  const topPerformers = [...students]
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .slice(0, 3);

  const needsAttention = [...students]
    .filter(s => parseFloat(s.percentage) < 65)
    .sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage))
    .slice(0, 3);

  return (
    <div className="card">
      <h3>📈 Quick Statistics</h3>
      
      {/* Overall Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgAttendance}%</div>
          <div className="stat-label">Average Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value percentage-good">
            {students.filter(s => parseFloat(s.percentage) >= 75).length}
          </div>
          <div className="stat-label">Good (≥75%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value percentage-danger">
            {students.filter(s => parseFloat(s.percentage) < 65).length}
          </div>
          <div className="stat-label">Needs Help (&lt;65%)</div>
        </div>
      </div>

      {/* Section Performance */}
      <div style={{ marginBottom: '24px' }}>
        <h4>📊 Section Performance</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {sectionStats.map(stat => (
            <div 
              key={stat.section}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 60px 40px 40px',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                background: '#111',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            >
              <span style={{ fontWeight: '500' }}>{stat.section}</span>
              <div style={{ 
                background: '#333', 
                borderRadius: '4px', 
                height: '8px',
                position: 'relative'
              }}>
                <div 
                  style={{
                    background: parseFloat(stat.average) >= 75 ? '#28a745' : 
                               parseFloat(stat.average) >= 65 ? '#ffc107' : '#dc3545',
                    height: '100%',
                    borderRadius: '4px',
                    width: `${Math.min(parseFloat(stat.average), 100)}%`
                  }}
                />
              </div>
              <span>{stat.average}%</span>
              <span style={{ color: '#28a745' }}>✓{stat.good}</span>
              <span style={{ color: '#dc3545' }}>✗{stat.poor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4>🏆 Top Performers</h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {topPerformers.map((student, index) => (
              <div 
                key={student.studentId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  background: '#111',
                  borderRadius: '6px'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    {student.studentName.substring(0, 20)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {student.section} • {student.hallticket}
                  </div>
                </div>
                <div className="attendance-badge badge-good">
                  {student.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <div>
          <h4>⚠️ Needs Attention</h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {needsAttention.map(student => (
              <div 
                key={student.studentId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  background: 'rgba(220, 53, 69, 0.1)',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '6px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    {student.studentName.substring(0, 20)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {student.section} • {student.hallticket}
                  </div>
                </div>
                <div className="attendance-badge badge-danger">
                  {student.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}