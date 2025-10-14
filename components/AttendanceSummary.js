import { useState } from 'react';
import { SUBJECTS, formatDate, parseAttendanceStatus, getAttendanceColor, calculatePercentage } from '../utils/attendanceUtils';

export default function AttendanceSummary({ student, attendanceRecords = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter records based on search term
  const filteredRecords = attendanceRecords.filter(record => {
    const dateStr = formatDate(record.date).toLowerCase();
    return dateStr.includes(searchTerm.toLowerCase());
  });

  const getAttendanceStats = () => {
    if (attendanceRecords.length === 0) return null;
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalClasses = 0;
    
    attendanceRecords.forEach(record => {
      const present = Object.values(record.attendance).filter(s => s === 'present').length;
      const absent = Object.values(record.attendance).filter(s => s === 'absent').length;
      
      totalPresent += present;
      totalAbsent += absent;
      totalClasses += present + absent;
    });
    
    return {
      totalPresent,
      totalAbsent,
      totalClasses,
      percentage: totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="glass-card">
      <h2 className="gradient-text mb-6">Attendance Summary</h2>
      


      {/* Overall Stats from JSON */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass-card-inner text-center">
          <div className="text-2xl font-bold text-green-400">{student.percentage}%</div>
          <div className="text-sm text-gray-400 mt-1">Current Attendance</div>
        </div>
        <div className="glass-card-inner text-center">
          <div className="text-2xl font-bold text-green-400">{student.totalPresent}</div>
          <div className="text-sm text-gray-400 mt-1">Classes Attended</div>
        </div>
        <div className="glass-card-inner text-center">
          <div className="text-2xl font-bold text-red-400">{student.totalPeriods - student.totalPresent}</div>
          <div className="text-sm text-gray-400 mt-1">Classes Missed</div>
        </div>
        <div className="glass-card-inner text-center">
          <div className="text-2xl font-bold text-blue-400">{student.totalPeriods}</div>
          <div className="text-sm text-gray-400 mt-1">Total Classes</div>
        </div>
        <div className="glass-card-inner text-center">
          <div className="text-2xl font-bold text-yellow-400">{Math.ceil((student.totalPeriods - student.totalPresent) / 8)}</div>
          <div className="text-sm text-gray-400 mt-1">Days Missed</div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="mb-6">
        <h3 className="gradient-text mb-4">📊 Performance Analytics</h3>
        
        {/* Attendance Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="glass-card-inner text-center">
            <div className="text-2xl font-bold text-green-400">75%+</div>
            <div className="text-sm text-gray-400 mt-1">Good Performance</div>
            <div className="text-xs text-gray-500 mt-2">
              {student.attendance.filter(s => {
                const { present, total } = parseAttendanceStatus(s.status);
                return parseFloat(calculatePercentage(present, total)) >= 75;
              }).length} subjects
            </div>
          </div>
          <div className="glass-card-inner text-center">
            <div className="text-2xl font-bold text-yellow-400">65-74%</div>
            <div className="text-sm text-gray-400 mt-1">Average Performance</div>
            <div className="text-xs text-gray-500 mt-2">
              {student.attendance.filter(s => {
                const { present, total } = parseAttendanceStatus(s.status);
                const perc = parseFloat(calculatePercentage(present, total));
                return perc >= 65 && perc < 75;
              }).length} subjects
            </div>
          </div>
          <div className="glass-card-inner text-center">
            <div className="text-2xl font-bold text-red-400">&lt;65%</div>
            <div className="text-sm text-gray-400 mt-1">Needs Attention</div>
            <div className="text-xs text-gray-500 mt-2">
              {student.attendance.filter(s => {
                const { present, total } = parseAttendanceStatus(s.status);
                return parseFloat(calculatePercentage(present, total)) < 65;
              }).length} subjects
            </div>
          </div>
        </div>
        
        {/* Progress Bars */}
        <div className="glass-card-inner">
          <h4 className="text-lg font-semibold text-gray-200 mb-4">Subject Progress Overview</h4>
          {student.attendance.slice(0, 8).map((subject) => {
            const { present, total } = parseAttendanceStatus(subject.status);
            const percentage = parseFloat(calculatePercentage(present, total));
            const colorClass = getAttendanceColor(percentage);
            const subjectName = SUBJECTS[subject.subjectId] || `Subject ${subject.subjectId}`;
            
            return (
              <div key={subject.subjectId} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">{subjectName}</span>
                  <span className={`text-sm font-bold percentage-${colorClass}`}>
                    {percentage}% ({present}/{total})
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full fill-${colorClass}`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Records - Mobile Friendly */}
      {filteredRecords.length > 0 ? (
        <div>
          {/* Mobile Cards View */}
          <div className="mobile-records" style={{ display: 'block' }}>
            {filteredRecords.map((record) => {
              const present = Object.values(record.attendance).filter(s => s === 'present').length;
              const absent = Object.values(record.attendance).filter(s => s === 'absent').length;
              const total = present + absent;
              const dayPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={record.date} style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                        {formatDate(record.date)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px' }}>
                        {total} classes
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: dayPercentage >= 75 ? '#28a745' : dayPercentage >= 50 ? '#ffc107' : '#dc3545'
                      }}>
                        {dayPercentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        <span style={{ color: '#28a745' }}>{present}P</span> / <span style={{ color: '#dc3545' }}>{absent}A</span>
                      </div>
                    </div>
                  </div>
                  
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      color: '#fff', 
                      fontSize: '0.85rem',
                      padding: '10px 16px',
                      background: 'linear-gradient(145deg, #444, #333)',
                      borderRadius: '8px',
                      border: '1px solid #555',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '500',
                      listStyle: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}>📋 View Subject Details</summary>
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px',
                      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                      {Object.entries(record.attendance).map(([subjectId, status]) => (
                        <div key={subjectId} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          padding: '8px 12px',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <span style={{ flex: 1 }}>
                            {SUBJECTS[subjectId] || `Subject ${subjectId}`}
                          </span>
                          <span style={{ 
                            color: status === 'present' ? '#28a745' : '#dc3545',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: status === 'present' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                            fontSize: '0.75rem'
                          }}>
                            {status === 'present' ? 'P' : 'A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
          
          {/* Desktop Table View - Hidden on mobile */}
          <div className="desktop-table" style={{ 
            overflowX: 'auto',
            display: 'none'
          }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const present = Object.values(record.attendance).filter(s => s === 'present').length;
                  const absent = Object.values(record.attendance).filter(s => s === 'absent').length;
                  const total = present + absent;
                  const dayPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={record.date}>
                      <td>{formatDate(record.date)}</td>
                      <td style={{ color: '#28a745' }}>{present}</td>
                      <td style={{ color: '#dc3545' }}>{absent}</td>
                      <td>
                        <span style={{ 
                          color: dayPercentage >= 75 ? '#28a745' : dayPercentage >= 50 ? '#ffc107' : '#dc3545' 
                        }}>
                          {dayPercentage}%
                        </span>
                      </td>
                      <td>
                        <details>
                          <summary style={{ cursor: 'pointer', color: '#aaa' }}>View</summary>
                          <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                            {Object.entries(record.attendance).map(([subjectId, status]) => (
                              <div key={subjectId} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                                padding: '2px 0'
                              }}>
                                <span>{SUBJECTS[subjectId] || `Subject ${subjectId}`}</span>
                                <span style={{ 
                                  color: status === 'present' ? '#28a745' : '#dc3545',
                                  textTransform: 'capitalize'
                                }}>
                                  {status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          {attendanceRecords.length === 0 
            ? ''
            : 'No records found matching your search.'
          }
        </div>
      )}
    </div>
  );
}