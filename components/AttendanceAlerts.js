import { useState, useEffect } from 'react';

export default function AttendanceAlerts({ students }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts = [];
      
      // Critical attendance alerts
      const criticalStudents = students.filter(s => parseFloat(s.percentage) < 55);
      if (criticalStudents.length > 0) {
        newAlerts.push({
          type: 'critical',
          title: 'Critical Attendance Alert',
          message: `${criticalStudents.length} students have attendance below 55%`,
          students: criticalStudents.slice(0, 5),
          icon: '🚨'
        });
      }

      // Warning alerts
      const warningStudents = students.filter(s => parseFloat(s.percentage) >= 55 && parseFloat(s.percentage) < 65);
      if (warningStudents.length > 0) {
        newAlerts.push({
          type: 'warning',
          title: 'Low Attendance Warning',
          message: `${warningStudents.length} students have attendance between 55-65%`,
          students: warningStudents.slice(0, 5),
          icon: '⚠️'
        });
      }

      // Achievement alerts
      const excellentStudents = students.filter(s => parseFloat(s.percentage) >= 90);
      if (excellentStudents.length > 0) {
        newAlerts.push({
          type: 'success',
          title: 'Excellent Attendance',
          message: `${excellentStudents.length} students have attendance above 90%`,
          students: excellentStudents.slice(0, 5),
          icon: '🏆'
        });
      }

      setAlerts(newAlerts);
    };

    generateAlerts();
  }, [students]);

  if (alerts.length === 0) return null;

  return (
    <div className="card">
      <h3>🔔 Attendance Alerts</h3>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className={`alert alert-${alert.type}`}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${
                alert.type === 'critical' ? '#dc3545' : 
                alert.type === 'warning' ? '#ffc107' : '#28a745'
              }`,
              background: `${
                alert.type === 'critical' ? 'rgba(220, 53, 69, 0.1)' : 
                alert.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(40, 167, 69, 0.1)'
              }`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>{alert.icon}</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{alert.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{alert.message}</p>
              </div>
            </div>
            
            {alert.students.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0', opacity: 0.7 }}>
                  {alert.students.length > 5 ? 'Top 5 students:' : 'Students:'}
                </p>
                <div style={{ display: 'grid', gap: '4px' }}>
                  {alert.students.map(student => (
                    <div 
                      key={student.studentId}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        background: 'rgba(0,0,0,0.1)',
                        borderRadius: '4px'
                      }}
                    >
                      <span>{student.studentName.substring(0, 25)}</span>
                      <span>{student.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}