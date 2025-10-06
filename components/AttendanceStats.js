import { SUBJECTS, parseAttendanceStatus, getAttendanceColor } from '../utils/attendanceUtils';

export default function AttendanceStats({ student }) {
  const currentPercentage = parseFloat(student.percentage);
  const statusColor = getAttendanceColor(currentPercentage);
  const absent = student.totalPeriods - student.totalPresent;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px' }}>📊 Attendance Overview</h2>
      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <div className={`stat-value percentage-${statusColor}`}>
            {student.percentage}%
          </div>
          <div className="stat-label">Overall Attendance</div>
        </div>
        
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-value" style={{ color: '#28a745' }}>
            {student.totalPresent}
          </div>
          <div className="stat-label">Classes Attended</div>
        </div>
        
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-value" style={{ color: '#dc3545' }}>
            {absent}
          </div>
          <div className="stat-label">Classes Missed</div>
        </div>
        
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-value">
            {student.totalPeriods}
          </div>
          <div className="stat-label">Total Classes</div>
        </div>
      </div>
    </div>
  );
}