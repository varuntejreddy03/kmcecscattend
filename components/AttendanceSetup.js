import { useState } from 'react';
import { findStudentByHallTicket, getAttendanceColor } from '../utils/attendanceUtils';
import SiteProtection from './SiteProtection';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <SiteProtection />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <span className="text-3xl md:text-4xl animate-bounce">🎓</span>
            <h1 className="gradient-text text-2xl md:text-4xl font-bold m-0 animate-slide-up">KMCE Attendance Tracker</h1>
            <span className="text-3xl md:text-4xl animate-pulse">📊</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            🏛️ Keshav Memorial College of Engineering
          </p>
          <p className="text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>Track your attendance easily and efficiently</p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-xl mb-1">📊</div>
              <div className="text-xs text-gray-400">Real-time</div>
            </div>
            <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-xl mb-1">🎯</div>
              <div className="text-xs text-gray-400">Goals</div>
            </div>
            <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-xl mb-1">👥</div>
              <div className="text-xs text-gray-400">Class View</div>
            </div>
            <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-xl mb-1">📈</div>
              <div className="text-xs text-gray-400">Insights</div>
            </div>
          </div>
        </div>

        <div className="glass-card max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="gradient-text text-2xl font-bold text-center mb-6">Initial Setup</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="hallTicket" className="block text-sm font-medium text-gray-300 mb-2">Hall Ticket Number</label>
              <input
                type="text"
                id="hallTicket"
                value={hallTicket}
                onChange={(e) => setHallTicket(e.target.value)}
                placeholder="Enter your hall ticket number (e.g., 24P85A6201)"
                disabled={loading}
                className="glass-input w-full"
              />
            </div>

            {error && <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">{error}</div>}

            <button 
              type="submit" 
              className="glass-button w-full" 
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Start Tracking'}
            </button>
          </form>

          {/* Class Overview Toggle */}
          <div className="mt-6 text-center">
            <button 
              className="glass-button w-full hover:scale-105 active:scale-95 transition-transform duration-200"
              onClick={() => setShowClassOverview(!showClassOverview)}
            >
              👥 {showClassOverview ? 'Hide' : 'View'} Class Attendance Overview
            </button>
          </div>

          {/* Class Attendance Overview */}
          {showClassOverview && (
            <div className="mt-6 glass-card-inner animate-slide-up">
              <h3 className="gradient-text text-xl font-semibold text-center mb-5">👥 Class Attendance Overview</h3>
              
              {/* Section-wise Stats */}
              <div className="mb-5">
                <h4 className="text-lg font-medium text-gray-200 mb-3">📊 Section-wise Overview</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                  {['CSE A', 'CSE B', 'CSC', 'CSD', 'CSM', 'CSO'].map(section => {
                    const sectionStudents = students.filter(s => s.section === section);
                    return (
                      <div key={section} className="glass-card-inner text-center p-3">
                        <div className="text-xl font-bold text-blue-400">{sectionStudents.length}</div>
                        <div className="text-xs text-gray-400">{section}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="glass-card-inner text-center">
                  <div className="text-2xl font-bold text-blue-400">{students.length}</div>
                  <div className="text-sm text-gray-400 mt-1">Total Students</div>
                </div>
                <div className="glass-card-inner text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {students.filter(s => parseFloat(s.percentage) >= 75).length}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Above 75%</div>
                </div>
                <div className="glass-card-inner text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {students.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">65% - 75%</div>
                </div>
                <div className="glass-card-inner text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {students.filter(s => parseFloat(s.percentage) < 65).length}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Below 65%</div>
                </div>
              </div>

              {/* Top Students */}
              <div className="mb-5">
                <h4 className="text-lg font-medium text-gray-200 mb-3">🏆 Top Performers</h4>
                <div className="space-y-2">
                  {students
                    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
                    .slice(0, 5)
                    .map((student, index) => {
                      const percentage = parseFloat(student.percentage);
                      const colorClass = getAttendanceColor(percentage);
                      return (
                        <div key={student.studentId} className="glass-card-inner flex items-center gap-3 p-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black ${
                            index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-400' : 'bg-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <img
                            src={student.hallticket.toUpperCase() === '23P81A6234' ? '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg' : `https://psapi.kmitonline.com/public/student_images/KMCE/${student.hallticket}.jpg`}
                            alt={student.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-600"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkM5Ljc5IDEyIDggMTAuMjEgOCA4UzkuNzkgNCA4IDRTMTIgNS43OSAxMiA4UzEwLjIxIDEyIDEyIDEyWk0xMiAxNEMxNC42NyAxNCAyMCAxNS4zNCAyMCAxOFYyMEg0VjE4QzQgMTUuMzQgOS4zMyAxNCAxMiAxNFoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-200">
                              {student.studentName.length > 25 ? student.studentName.substring(0, 25) + '...' : student.studentName}
                            </div>
                            <div className="text-xs text-gray-400">{student.hallticket}</div>
                          </div>
                          <div className={`text-sm font-bold percentage-${colorClass}`}>
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

          <div className="mt-8 glass-card-inner animate-fade-in">
            <h3 className="gradient-text text-lg font-semibold mb-4">📢 Important Notice</h3>
            <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg mb-5 hover:bg-yellow-500/15 transition-colors duration-200">
              <p className="text-yellow-300 font-medium mb-2">
                🕚 Attendance updates daily at 11:00 PM by admin
              </p>
              <p className="text-gray-400 text-sm">
                Please note: Data is automatically synced every night. Check back after 11 PM for the latest attendance records.
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Features Overview</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-gray-300">
                <span>📊</span>
                Real-time attendance tracking
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span>🎯</span>
                Multi-threshold analysis (55%, 65%, 75%)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span>👥</span>
                Class attendance overview
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span>📈</span>
                Detailed analysis and insights
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span>🔍</span>
                Student search and profiles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}