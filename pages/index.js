import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import AttendanceSetup from '../components/AttendanceSetup';
import AttendanceAnalysis from '../components/AttendanceAnalysis';
import ClassAttendance from '../components/ClassAttendance';
import SiteProtection from '../components/SiteProtection';
import PremiumDashboard from '../components/PremiumDashboard';
import SecurityWrapper from '../components/SecurityWrapper';
import PremiumNavigation from '../components/PremiumNavigation';
import CombinedStats from '../components/CombinedStats';
import EnhancedSecurity from '../components/EnhancedSecurity';
import ErrorBoundary from '../components/ErrorBoundary';

import { loadAttendanceData, findStudentByHallTicket } from '../utils/attendanceUtils';
import { deobfuscateData, memoizeData } from '../utils/dataProtection';

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
        
        // Load and protect data
        const rawData = await loadAttendanceData();
        const cleanData = deobfuscateData(rawData);
        const memoizedData = memoizeData('students', cleanData);
        setStudents(memoizedData);
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
      
      // Load and protect fresh data
      const rawData = await loadAttendanceData();
      const cleanData = deobfuscateData(rawData);
      const memoizedData = memoizeData('students_refresh', cleanData);
      setStudents(memoizedData);
      
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="glass-card text-center p-8">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="gradient-text text-xl font-bold">Loading attendance data...</h2>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
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



  return (
    <ErrorBoundary>
      <Head>
        <title>
          {currentStudent 
            ? `${currentStudent.studentName} - KMCE Attendance Tracker`
            : 'KMCE Attendance Tracker - Smart Student Portal'
          }
        </title>
        <meta 
          name="description" 
          content={currentStudent 
            ? `Attendance dashboard for ${currentStudent.studentName} (${currentStudent.hallticket}) - Current attendance: ${currentStudent.percentage}%`
            : 'KMCE Attendance Tracker - Smart attendance management system for Keshav Memorial College of Engineering students'
          } 
        />
      </Head>
      <SecurityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 mobile-scroll-container">
        <SiteProtection />
        <div className="max-w-7xl mx-auto mobile-scroll-container">
          {/* Floating Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-float" style={{ top: '10%', left: '10%' }} />
            <div className="absolute w-48 h-48 bg-purple-400/5 rounded-full blur-3xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '2s' }} />
            <div className="absolute w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl animate-float" style={{ bottom: '20%', left: '50%', animationDelay: '4s' }} />
          </div>

          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <span className="text-3xl md:text-4xl animate-bounce">🎓</span>
              <h1 className="gradient-text text-2xl md:text-4xl font-bold m-0 animate-slide-up">
                KMCE Attendance Tracker
              </h1>
              <span className="text-3xl md:text-4xl animate-pulse">📊</span>
            </div>
            
            <p className="text-gray-400 text-base md:text-lg mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              🏛️ Keshav Memorial College of Engineering
            </p>
            
            {/* User Info Card */}
            <div className="glass-card max-w-md mx-auto mb-6 animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentStudent.hallticket.toUpperCase() === '23P81A6234' ? '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg' : `https://psapi.kmitonline.com/public/student_images/KMCE/${currentStudent.hallticket}.jpg`}
                    alt={currentStudent.studentName}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white/20 hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzkuNzkgMTIgOCAxMC4yMSA4IDhTOS43OSA0IDggNFMxMiA1Ljc5IDEyIDhTMTAuMjEgMTIgMTIgMTJaTTEyIDE0QzE0LjY3IDE0IDIwIDE1LjM0IDIwIDE4VjIwSDRWMThDNCAxNS4zNCA5LjMzIDE0IDEyIDE0WiIgZmlsbD0iIzY2NiIvPgo8L3N2Zz4KPC9zdmc+Cg==';
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    Welcome, {currentStudent.studentName.split(' ')[0]}!
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm animate-fade-in" style={{ animationDelay: '0.7s' }}>
                    {currentStudent.hallticket} • {currentStudent.section}
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="glass-button text-xs md:text-sm px-3 py-2 hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  Switch
                </button>
              </div>
            </div>
            
            {/* Quick Stats Preview */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto mb-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="glass-card-inner text-center p-2 md:p-3 hover:scale-105 hover:-translate-y-1 transition-all duration-200">
                <div className="text-lg md:text-xl font-bold text-green-400">{currentStudent.percentage}%</div>
                <div className="text-xs text-gray-400">Attendance</div>
              </div>
              <div className="glass-card-inner text-center p-2 md:p-3 hover:scale-105 hover:-translate-y-1 transition-all duration-200">
                <div className="text-lg md:text-xl font-bold text-blue-400">{currentStudent.totalPresent}</div>
                <div className="text-xs text-gray-400">Present</div>
              </div>
              <div className="glass-card-inner text-center p-2 md:p-3 hover:scale-105 hover:-translate-y-1 transition-all duration-200">
                <div className="text-lg md:text-xl font-bold text-purple-400">{currentStudent.totalPeriods}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-xs font-medium text-gray-300">AI Predictor</div>
              </div>
              <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-xs font-medium text-gray-300">Analytics</div>
              </div>
              <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-xs font-medium text-gray-300">Goals</div>
              </div>
              <div className="glass-card-inner text-center p-3 hover:scale-105 transition-transform duration-200">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-xs font-medium text-gray-300">Class View</div>
              </div>
            </div>
          </div>

          {/* Premium Navigation */}
          <PremiumNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onRefresh={handleRefresh} 
            loading={loading} 
          />

          {/* Enhanced Security */}
          <EnhancedSecurity />

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="mobile-scroll-container"
          >
            {activeTab === 'overview' && (
              <CombinedStats student={currentStudent} students={students} />
            )}

            {activeTab === 'simulator' && (
              <PremiumDashboard currentAttendance={currentStudent} />
            )}

            {activeTab === 'analysis' && (
              <AttendanceAnalysis student={currentStudent} />
            )}

            {activeTab === 'class' && (
              <ClassAttendance students={students} />
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-12 text-center border-t border-white/10 pt-8">
            <p className="text-gray-400 mb-4">🎓 KMCE Attendance Tracker - Track your progress efficiently</p>
            <div className="glass-card-inner max-w-md mx-auto">
              <p className="text-yellow-400 text-sm">
                🕚 Attendance updates daily at 11:00 PM by admin
              </p>
            </div>
          </div>
        </div>
      </div>
      </SecurityWrapper>
    </ErrorBoundary>
  );
}