import { useState } from 'react';
import { SUBJECTS, parseAttendanceStatus, getAttendanceColor, calculatePercentage } from '../utils/attendanceUtils';

const SUBJECT_NAMES = {
  105: 'Skilling',
  103: 'Problem Solving',
  104: 'Full Stack Development',
  110: 'Software Development',
  136: 'English & Humanities',
  112: 'Database Management',
  124: 'Formal Languages',
  116: 'Artificial Intelligence',
  123: 'Network Security',
  115: 'Advanced Computing Lab',
  117: 'Intellectual Property Rights',
  119: 'Information & Data Science'
};

export default function SubjectAttendance({ student }) {
  const [sortBy, setSortBy] = useState('percentage');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedSubjects = [...student.attendance].sort((a, b) => {
    const aData = parseAttendanceStatus(a.status);
    const bData = parseAttendanceStatus(b.status);
    const aPercentage = parseFloat(calculatePercentage(aData.present, aData.total));
    const bPercentage = parseFloat(calculatePercentage(bData.present, bData.total));
    
    let aValue, bValue;
    switch (sortBy) {
      case 'name':
        aValue = SUBJECT_NAMES[a.subjectId] || SUBJECTS[a.subjectId];
        bValue = SUBJECT_NAMES[b.subjectId] || SUBJECTS[b.subjectId];
        break;
      case 'present':
        aValue = aData.present;
        bValue = bData.present;
        break;
      case 'total':
        aValue = aData.total;
        bValue = bData.total;
        break;
      default:
        aValue = aPercentage;
        bValue = bPercentage;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="card animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>📚 Subject-wise Attendance</h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="modern-select"
          >
            <option value="percentage">Sort by Percentage</option>
            <option value="name">Sort by Subject</option>
            <option value="present">Sort by Present</option>
            <option value="total">Sort by Total Classes</option>
          </select>
          
          <button
            className="btn btn-secondary sort-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      <div className="subject-grid">
        {sortedSubjects.map((subject, index) => {
          const { present, total } = parseAttendanceStatus(subject.status);
          const percentage = parseFloat(calculatePercentage(present, total));
          const colorClass = getAttendanceColor(percentage);
          const subjectName = SUBJECT_NAMES[subject.subjectId] || SUBJECTS[subject.subjectId] || `Subject ${subject.subjectId}`;

          return (
            <div 
              key={subject.subjectId} 
              className="subject-card animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="subject-header">
                <div className="subject-name" title={subjectName}>
                  {subjectName}
                </div>
                <div className={`attendance-percentage percentage-${colorClass}`}>
                  {percentage}%
                </div>
              </div>
              
              <div className="attendance-bar">
                <div 
                  className={`attendance-fill fill-${colorClass}`}
                  style={{ 
                    width: `${percentage}%`,
                    animation: `fillBar 1s ease-out ${index * 0.05}s forwards`
                  }}
                ></div>
              </div>
              
              <div className="attendance-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Present: <strong style={{ color: '#28a745' }}>{present}</strong> / {total}</span>
                  <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Absent: {total - present}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}