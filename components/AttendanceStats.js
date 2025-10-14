import { SUBJECTS, parseAttendanceStatus, getAttendanceColor } from '../utils/attendanceUtils';

export default function AttendanceStats({ student }) {
  const currentPercentage = parseFloat(student.percentage);
  const statusColor = getAttendanceColor(currentPercentage);
  const absent = student.totalPeriods - student.totalPresent;

  return (
    <div className="glass-card">
      <h2 className="gradient-text mb-6">📊 Attendance Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card-inner animate-fade-in">
          <div className={`text-2xl font-bold percentage-${statusColor}`}>
            {student.percentage}%
          </div>
          <div className="text-sm text-gray-400 mt-1">Overall Attendance</div>
        </div>
        
        <div className="glass-card-inner animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-2xl font-bold text-green-400">
            {student.totalPresent}
          </div>
          <div className="text-sm text-gray-400 mt-1">Classes Attended</div>
        </div>
        
        <div className="glass-card-inner animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-2xl font-bold text-red-400">
            {absent}
          </div>
          <div className="text-sm text-gray-400 mt-1">Classes Missed</div>
        </div>
        
        <div className="glass-card-inner animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-2xl font-bold text-blue-400">
            {student.totalPeriods}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Classes</div>
        </div>
      </div>
    </div>
  );
}