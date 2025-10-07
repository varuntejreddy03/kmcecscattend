import { useState, useEffect } from 'react';
import AttendanceSetup from '../components/AttendanceSetup';
import AttendanceStats from '../components/AttendanceStats';
import SubjectAttendance from '../components/SubjectAttendance';
import AttendanceAnalysis from '../components/AttendanceAnalysis';
import AttendanceSummary from '../components/AttendanceSummary';
import ClassAttendance from '../components/ClassAttendance';
import { loadAttendanceData, findStudentByHallTicket } from '../utils/attendanceUtils';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [startDate, setStartDate] = useState('2025-04-29');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Load attendance data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Clear any existing localStorage data
        localStorage.removeItem('attendanceData');
        localStorage.removeItem('attendanceDataTime');
        
        // Always load fresh data - no caching
        const data = await loadAttendanceData();
        setStudents(data);
      } catch (error) {
        console.error('Failed to load attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle setup completion
  const handleSetupComplete = (setupData) => {
    setCurrentStudent(setupData.student);
    setStartDate(setupData.startDate);
  };

  // Handle attendance update
  const handleAttendanceUpdate = (record) => {
    setAttendanceRecords(prev => {
      const updated = prev.filter(r => r.date !== record.date);
      return [...updated, record].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  };

  // Reset to setup
  const handleReset = () => {
    setCurrentStudent(null);
    setAttendanceRecords([]);
    setActiveTab('overview');
    // Clear any localStorage data
    localStorage.removeItem('attendanceData');
    localStorage.removeItem('attendanceDataTime');
  };

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Clear localStorage
      localStorage.removeItem('attendanceData');
      localStorage.removeItem('attendanceDataTime');
      
      // Load fresh data
      const data = await loadAttendanceData();
      setStudents(data);
      
      // Update current student if exists
      if (currentStudent) {
        const updatedStudent = findStudentByHallTicket(data, currentStudent.hallticket);
        if (updatedStudent) {
          setCurrentStudent(updatedStudent);
        }
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>Loading attendance data...</h2>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <AttendanceSetup 
        students={students} 
        onSetupComplete={handleSetupComplete} 
      />
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analysis', label: 'Analysis', icon: '📈' },
    { id: 'class', label: 'Class', icon: '👥' },
    { id: 'summary', label: 'Summary', icon: '📋' }
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Attendance Tracker</h1>
        <div style={{ 
          background: 'rgba(255, 193, 7, 0.1)', 
          border: '1px solid #ffc107', 
          borderRadius: '8px', 
          padding: '6px 12px', 
          marginBottom: '16px',
          display: 'inline-block'
        }}>
          <span style={{ color: '#ffc107', fontSize: '0.8rem' }}>
            📅 Tracked till today
          </span>
        </div>
        
        {/* Mobile-friendly user info */}
        <div className="mobile-user-info" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px', 
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '0 auto 16px auto'
        }}>
          <img
            className="mobile-user-avatar"
            src={currentStudent.hallticket.toUpperCase() === '23P81A6234' ? '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg' : `https://psapi.kmitonline.com/public/student_images/KMCE/${currentStudent.hallticket}.jpg`}
            alt={currentStudent.studentName}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #333',
              flexShrink: 0
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzkuNzkgMTIgOCAxMC4yMSA4IDhTOS43OSA0IDggNFMxMiA1Ljc5IDEyIDhTMTAuMjEgMTIgMTIgMTJaTTEyIDE0QzE0LjY3IDE0IDIwIDE1LjM0IDIwIDE4VjIwSDRWMThDNCAxNS4zNCA5LjMzIDE0IDEyIDE0WiIgZmlsbD0iIzY2NiIvPgo8L3N2Zz4KPC9zdmc+Cg==';
            }}
          />
          <div className="mobile-user-details" style={{ flex: 1, minWidth: 0 }}>
            <p className="mobile-user-name" style={{ 
              margin: 0, 
              fontSize: '0.9rem', 
              fontWeight: '600',
              lineHeight: '1.2'
            }}>Welcome, {currentStudent.studentName}!</p>
            <p className="mobile-user-id" style={{ 
              margin: 0, 
              color: '#aaa', 
              fontSize: '0.8rem' 
            }}>{currentStudent.hallticket}</p>
          </div>
        </div>
        
        <div className="mobile-actions" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px', 
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            style={{ 
              fontSize: '0.8rem', 
              padding: '10px 16px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Switch
          </button>
          <button 
            className="btn" 
            onClick={handleRefresh}
            disabled={loading}
            style={{ 
              fontSize: '0.8rem', 
              padding: '10px 16px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: loading ? '#666' : '#28a745',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⟳' : '🔄'} Refresh
          </button>
          <button 
            className="btn" 
            onClick={() => setActiveTab('class')}
            style={{ 
              fontSize: '0.8rem', 
              padding: '10px 16px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            👥 Class
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs" style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px', 
        marginBottom: '20px',
        borderBottom: '1px solid #333',
        paddingBottom: '12px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              backgroundColor: activeTab === tab.id ? '#fff' : '#333',
              color: activeTab === tab.id ? '#000' : '#fff',
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.85rem',
              fontWeight: '500',
              textAlign: 'center',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <AttendanceStats student={currentStudent} />
          <SubjectAttendance student={currentStudent} />
        </div>
      )}

      {activeTab === 'analysis' && (
        <AttendanceAnalysis student={currentStudent} />
      )}

      {activeTab === 'class' && (
        <ClassAttendance students={students} />
      )}

      {activeTab === 'summary' && (
        <AttendanceSummary 
          student={currentStudent}
          attendanceRecords={attendanceRecords}
        />
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '32px', 
        padding: '20px 16px', 
        textAlign: 'center', 
        borderTop: '1px solid #333',
        color: '#666'
      }}>
        <p style={{ fontSize: '0.9rem', margin: '0 0 12px 0' }}>Attendance Tracker - Track your progress efficiently</p>
        <div style={{ 
          marginTop: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          display: 'inline-block',
          maxWidth: '100%'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#ffc107', margin: 0 }}>
            🕚 Attendance updates daily at 11:00 PM by admin
          </p>
        </div>
      </div>
    </div>
  );
}