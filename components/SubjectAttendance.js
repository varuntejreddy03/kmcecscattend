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
    <div className="glass-card animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="gradient-text m-0">📚 Subject-wise Attendance</h2>
        
        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input text-sm"
          >
            <option value="percentage">Sort by Percentage</option>
            <option value="name">Sort by Subject</option>
            <option value="present">Sort by Present</option>
            <option value="total">Sort by Total Classes</option>
          </select>
          
          <button
            className="glass-button px-3 py-2"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSubjects.map((subject, index) => {
          const { present, total } = parseAttendanceStatus(subject.status);
          const percentage = parseFloat(calculatePercentage(present, total));
          const colorClass = getAttendanceColor(percentage);
          const subjectName = SUBJECT_NAMES[subject.subjectId] || SUBJECTS[subject.subjectId] || `Subject ${subject.subjectId}`;

          return (
            <div 
              key={subject.subjectId} 
              className="glass-card-inner animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium text-gray-200 truncate pr-2" title={subjectName}>
                  {subjectName}
                </div>
                <div className={`text-lg font-bold percentage-${colorClass}`}>
                  {percentage}%
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full fill-${colorClass}`}
                  style={{ 
                    width: `${percentage}%`,
                    animation: `fillBar 1s ease-out ${index * 0.05}s forwards`
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Present: <strong className="text-green-400">{present}</strong> / {total}</span>
                <span>Absent: {total - present}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}