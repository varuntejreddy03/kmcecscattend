import { useState } from 'react';
import { SUBJECTS, isValidAttendanceDate, formatDate } from '../utils/attendanceUtils';

export default function DailyAttendance({ student, startDate, onAttendanceUpdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyAttendance, setDailyAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const subjects = Object.entries(SUBJECTS);
  const isValidDate = isValidAttendanceDate(selectedDate, startDate);

  const handleAttendanceChange = (subjectId, status) => {
    setDailyAttendance(prev => ({
      ...prev,
      [subjectId]: status
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    subjects.forEach(([id]) => {
      allPresent[id] = 'present';
    });
    setDailyAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    subjects.forEach(([id]) => {
      allAbsent[id] = 'absent';
    });
    setDailyAttendance(allAbsent);
  };

  const saveAttendance = () => {
    if (!isValidDate) {
      alert('Cannot mark attendance for this date');
      return;
    }

    const record = {
      date: selectedDate,
      attendance: { ...dailyAttendance },
      timestamp: new Date().toISOString()
    };

    setAttendanceRecords(prev => {
      const updated = prev.filter(r => r.date !== selectedDate);
      return [...updated, record].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // Clear form
    setDailyAttendance({});
    
    // Notify parent component
    if (onAttendanceUpdate) {
      onAttendanceUpdate(record);
    }

    alert('Attendance saved successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#28a745';
      case 'absent': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px' }}>Daily Attendance</h2>
      
      <div className="input-group">
        <label htmlFor="attendanceDate">Select Date</label>
        <input
          type="date"
          id="attendanceDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min={startDate}
        />
        {!isValidDate && (
          <div className="error">
            {new Date(selectedDate) > new Date() 
              ? 'Cannot mark attendance for future dates'
              : new Date(selectedDate).getDay() === 0
              ? 'Cannot mark attendance on Sundays'
              : 'Cannot mark attendance before start date'
            }
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn" 
          onClick={markAllPresent}
          disabled={!isValidDate}
        >
          Mark All Present
        </button>
        <button 
          className="btn btn-danger" 
          onClick={markAllAbsent}
          disabled={!isValidDate}
        >
          Mark All Absent
        </button>
      </div>

      <div className="subject-grid">
        {subjects.map(([subjectId, subjectName]) => (
          <div key={subjectId} className="subject-card">
            <div className="subject-name" style={{ marginBottom: '12px' }}>
              {subjectName}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${dailyAttendance[subjectId] === 'present' ? '' : 'btn-secondary'}`}
                onClick={() => handleAttendanceChange(subjectId, 'present')}
                disabled={!isValidDate}
                style={{ 
                  flex: 1, 
                  fontSize: '0.9rem',
                  backgroundColor: dailyAttendance[subjectId] === 'present' ? '#28a745' : undefined,
                  color: dailyAttendance[subjectId] === 'present' ? '#fff' : undefined
                }}
              >
                Present
              </button>
              <button
                className={`btn ${dailyAttendance[subjectId] === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => handleAttendanceChange(subjectId, 'absent')}
                disabled={!isValidDate}
                style={{ 
                  flex: 1, 
                  fontSize: '0.9rem',
                  backgroundColor: dailyAttendance[subjectId] === 'absent' ? '#dc3545' : undefined
                }}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="btn" 
        onClick={saveAttendance}
        disabled={!isValidDate || Object.keys(dailyAttendance).length === 0}
        style={{ width: '100%', marginTop: '20px' }}
      >
        Save Attendance
      </button>

      {attendanceRecords.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Recent Records</h3>
          <div className="table" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Not Marked</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(0, 10).map((record) => {
                  const present = Object.values(record.attendance).filter(s => s === 'present').length;
                  const absent = Object.values(record.attendance).filter(s => s === 'absent').length;
                  const notMarked = subjects.length - present - absent;
                  
                  return (
                    <tr key={record.date}>
                      <td>{formatDate(record.date)}</td>
                      <td style={{ color: '#28a745' }}>{present}</td>
                      <td style={{ color: '#dc3545' }}>{absent}</td>
                      <td style={{ color: '#6c757d' }}>{notMarked}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}