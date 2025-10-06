import { useState } from 'react';
import { SUBJECTS, parseAttendanceStatus, getAttendanceColor, calculatePercentage } from '../utils/attendanceUtils';

export default function ClassAttendance({ students }) {
  const [sortBy, setSortBy] = useState('percentage');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort students
  const filteredStudents = students
    .filter(student => 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.hallticket.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.studentName;
          bValue = b.studentName;
          break;
        case 'hallticket':
          aValue = a.hallticket;
          bValue = b.hallticket;
          break;
        case 'percentage':
          aValue = parseFloat(a.percentage);
          bValue = parseFloat(b.percentage);
          break;
        case 'present':
          aValue = a.totalPresent;
          bValue = b.totalPresent;
          break;
        default:
          aValue = parseFloat(a.percentage);
          bValue = parseFloat(b.percentage);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStudentImage = (hallticket) => {
    if (hallticket.toUpperCase() === '23P81A6234') {
      return '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg';
    }
    return `https://psapi.kmitonline.com/public/student_images/KMCE/${hallticket}.jpg`;
  };

  const getStudentRank = (students, currentStudent) => {
    const sorted = [...students].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    return sorted.findIndex(s => s.studentId === currentStudent.studentId) + 1;
  };

  return (
    <div className="card animate-slide-up">
      <h2 style={{ marginBottom: '20px' }}>👥 Class Attendance Overview</h2>
      
      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div className="input-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
          <input
            type="text"
            placeholder="Search by name or hall ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="modern-select"
          >
            <option value="percentage">Sort by Percentage</option>
            <option value="name">Sort by Name</option>
            <option value="hallticket">Sort by Hall Ticket</option>
            <option value="present">Sort by Classes Present</option>
          </select>
          
          <button
            className="btn btn-secondary sort-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value percentage-good">
            {students.filter(s => parseFloat(s.percentage) >= 75).length}
          </div>
          <div className="stat-label">Above 75%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value percentage-warning">
            {students.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length}
          </div>
          <div className="stat-label">65% - 75%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value percentage-danger">
            {students.filter(s => parseFloat(s.percentage) < 65).length}
          </div>
          <div className="stat-label">Below 65%</div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.map((student, index) => {
          const percentage = parseFloat(student.percentage);
          const colorClass = getAttendanceColor(percentage);
          
          return (
            <div 
              key={student.studentId} 
              className="student-card animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="student-header">
                <div className="student-avatar">
                  <img
                    src={getStudentImage(student.hallticket)}
                    alt={student.studentName}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzkuNzkgMTIgOCAxMC4yMSA4IDhTOS43OSA0IDggNFMxMiA1Ljc5IDEyIDhTMTAuMjEgMTIgMTIgMTJaTTEyIDE0QzE0LjY3IDE0IDIwIDE1LjM0IDIwIDE4VjIwSDRWMThDNCAxNS4zNCA5LjMzIDE0IDEyIDE0WiIgZmlsbD0iIzY2NiIvPgo8L3N2Zz4KPC9zdmc+Cg==';
                    }}
                  />
                  <div className="student-rank">
                    #{index + 1}
                  </div>
                </div>
                <div className="student-info">
                  <div className="student-name" title={student.studentName}>
                    {student.studentName.length > 20 ? student.studentName.substring(0, 20) + '...' : student.studentName}
                  </div>
                  <div className="student-hallticket">{student.hallticket}</div>
                  <div className="student-id">ID: {student.studentId}</div>
                </div>
                <div className={`attendance-badge badge-${colorClass}`}>
                  {student.percentage}%
                </div>
              </div>
              
              <div className="student-stats">
                <div className="stat-item">
                  <span>Present</span>
                  <strong>{student.totalPresent}</strong>
                </div>
                <div className="stat-item">
                  <span>Total</span>
                  <strong>{student.totalPeriods}</strong>
                </div>
                <div className="stat-item">
                  <span>Absent</span>
                  <strong className="text-danger">{student.totalPeriods - student.totalPresent}</strong>
                </div>
                <div className="stat-item" style={{ gridColumn: 'span 3' }}>
                  <span>Status</span>
                  <strong className={`text-${colorClass === 'good' ? 'success' : colorClass === 'warning' ? 'warning' : 'danger'}`}>
                    {percentage >= 75 ? '✅ Good' : percentage >= 65 ? '⚠️ Average' : '❌ Poor'}
                  </strong>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ marginTop: '12px' }}>
                <div className="attendance-bar">
                  <div 
                    className={`attendance-fill fill-${colorClass}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.8rem', 
                  color: '#aaa',
                  marginTop: '4px'
                }}>
                  <span>0%</span>
                  <span>{percentage}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#aaa' 
        }}>
          No students found matching your search criteria.
        </div>
      )}
    </div>
  );
}