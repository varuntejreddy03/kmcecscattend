import { useState } from 'react';
import { findStudentByHallTicket, getAttendanceColor } from '../utils/attendanceUtils';

export default function AttendanceSetup({ students, onSetupComplete }) {
  const [hallTicket, setHallTicket] = useState('');
  const [startDate] = useState('2025-04-29');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClassOverview, setShowClassOverview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!hallTicket.trim()) {
        setError('Please enter your hall ticket number');
        return;
      }

      const student = findStudentByHallTicket(students, hallTicket.trim());
      
      if (!student) {
        setError('Student not found. Please check your hall ticket number.');
        return;
      }

      // Setup complete - pass data to parent
      onSetupComplete({
        student,
        startDate
      });

    } catch (err) {
      setError('An error occurred while setting up your attendance tracker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Attendance Tracker</h1>
        <p>Track your attendance easily and efficiently</p>
      </div>

      <div className="card setup-form">
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Initial Setup</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="hallTicket">Hall Ticket Number</label>
            <input
              type="text"
              id="hallTicket"
              value={hallTicket}
              onChange={(e) => setHallTicket(e.target.value)}
              placeholder="Enter your hall ticket number (e.g., 24P85A6201)"
              disabled={loading}
            />
          </div>





          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? 'Setting up...' : 'Start Tracking'}
          </button>
        </form>

        {/* Class Overview Toggle */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowClassOverview(!showClassOverview)}
            style={{ width: '100%' }}
          >
            👥 {showClassOverview ? 'Hide' : 'View'} Class Attendance Overview
          </button>
        </div>

        {/* Class Attendance Overview */}
        {showClassOverview && (
          <div style={{ marginTop: '24px', padding: '20px', background: '#0a0a0a', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>👥 Class Attendance Overview</h3>
            
            {/* Class Stats */}
            <div className="stats-grid" style={{ marginBottom: '20px' }}>
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

            {/* Top Students */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '12px' }}>🏆 Top Performers</h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {students
                  .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
                  .slice(0, 5)
                  .map((student, index) => {
                    const percentage = parseFloat(student.percentage);
                    const colorClass = getAttendanceColor(percentage);
                    return (
                      <div key={student.studentId} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        background: '#111',
                        borderRadius: '8px',
                        border: '1px solid #333'
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: '#000'
                        }}>
                          {index + 1}
                        </div>
                        <img
                          src={student.hallticket.toUpperCase() === '23P81A6234' ? '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg' : `https://psapi.kmitonline.com/public/student_images/KMCE/${student.hallticket}.jpg`}
                          alt={student.studentName}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #333'
                          }}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkM5Ljc5IDEyIDggMTAuMjEgOCA4UzkuNzkgNCA4IDRTMTIgNS43OSAxMiA4UzEwLjIxIDEyIDEyIDEyWk0xMiAxNEMxNC42NyAxNCAyMCAxNS4zNCAyMCAxOFYyMEg0VjE4QzQgMTUuMzQgOS4zMyAxNCAxMiAxNFoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                            {student.studentName.length > 25 ? student.studentName.substring(0, 25) + '...' : student.studentName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{student.hallticket}</div>
                        </div>
                        <div className={`attendance-badge badge-${colorClass}`} style={{ fontSize: '0.8rem' }}>
                          {student.percentage}%
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '32px', padding: '20px', background: '#0a0a0a', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '16px' }}>📢 Important Notice</h3>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(255, 193, 7, 0.1)', 
            border: '1px solid #ffc107', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#ffc107', fontWeight: '500', marginBottom: '8px' }}>
              🕚 Attendance updates daily at 11:00 PM by admin
            </p>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Please note: Data is automatically synced every night. Check back after 11 PM for the latest attendance records.
            </p>
          </div>
          
          <h3 style={{ marginBottom: '16px' }}>Features Overview</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>📊</span>
              Real-time attendance tracking
            </li>
            <li style={{ marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>🎯</span>
              Multi-threshold analysis (55%, 65%, 75%)
            </li>
            <li style={{ marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>👥</span>
              Class attendance overview
            </li>
            <li style={{ marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>📈</span>
              Detailed analysis and insights
            </li>
            <li style={{ marginBottom: '8px', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>🔍</span>
              Student search and profiles
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}