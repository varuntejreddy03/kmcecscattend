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
    <div className="glass-card">
      <h2 className="gradient-text mb-6">Daily Attendance</h2>
      
      <div className="mb-6">
        <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
        <input
          type="date"
          id="attendanceDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min={startDate}
          className="glass-input w-full"
        />
        {!isValidDate && (
          <div className="text-red-400 text-sm mt-2">
            {new Date(selectedDate) > new Date() 
              ? 'Cannot mark attendance for future dates'
              : new Date(selectedDate).getDay() === 0
              ? 'Cannot mark attendance on Sundays'
              : 'Cannot mark attendance before start date'
            }
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <button 
          className="glass-button flex-1" 
          onClick={markAllPresent}
          disabled={!isValidDate}
        >
          Mark All Present
        </button>
        <button 
          className="glass-button flex-1" 
          onClick={markAllAbsent}
          disabled={!isValidDate}
        >
          Mark All Absent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {subjects.map(([subjectId, subjectName]) => (
          <div key={subjectId} className="glass-card-inner">
            <div className="text-sm font-medium text-gray-200 mb-3">
              {subjectName}
            </div>
            
            <div className="flex gap-2">
              <button
                className={`glass-button flex-1 text-sm ${
                  dailyAttendance[subjectId] === 'present' 
                    ? 'bg-green-500/20 border-green-400 text-green-300' 
                    : ''
                }`}
                onClick={() => handleAttendanceChange(subjectId, 'present')}
                disabled={!isValidDate}
              >
                Present
              </button>
              <button
                className={`glass-button flex-1 text-sm ${
                  dailyAttendance[subjectId] === 'absent' 
                    ? 'bg-red-500/20 border-red-400 text-red-300' 
                    : ''
                }`}
                onClick={() => handleAttendanceChange(subjectId, 'absent')}
                disabled={!isValidDate}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="glass-button w-full" 
        onClick={saveAttendance}
        disabled={!isValidDate || Object.keys(dailyAttendance).length === 0}
      >
        Save Attendance
      </button>

      {attendanceRecords.length > 0 && (
        <div className="mt-8">
          <h3 className="gradient-text mb-4">Recent Records</h3>
          <div className="glass-card-inner max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-gray-300">Date</th>
                  <th className="text-left py-2 text-gray-300">Present</th>
                  <th className="text-left py-2 text-gray-300">Absent</th>
                  <th className="text-left py-2 text-gray-300">Not Marked</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(0, 10).map((record) => {
                  const present = Object.values(record.attendance).filter(s => s === 'present').length;
                  const absent = Object.values(record.attendance).filter(s => s === 'absent').length;
                  const notMarked = subjects.length - present - absent;
                  
                  return (
                    <tr key={record.date} className="border-b border-gray-700">
                      <td className="py-2 text-gray-200">{formatDate(record.date)}</td>
                      <td className="py-2 text-green-400">{present}</td>
                      <td className="py-2 text-red-400">{absent}</td>
                      <td className="py-2 text-gray-400">{notMarked}</td>
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