import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import AttendanceSetup from '../components/AttendanceSetup';
import AttendanceAnalysis from '../components/AttendanceAnalysis';
import ClassAttendance from '../components/ClassAttendance';
import SiteProtection from '../components/SiteProtection';
import PremiumDashboard from '../components/PremiumDashboard';
import SecurityWrapper from '../components/SecurityWrapper';
import PremiumNavigation from '../components/PremiumNavigation';
import CombinedStats from '../components/CombinedStats';
import PersonalizedDashboard from '../components/PersonalizedDashboard';
import EnhancedSecurity from '../components/EnhancedSecurity';
import ErrorBoundary from '../components/ErrorBoundary';
import CinematicBackground from '../components/CinematicBackground';
import { Sparkles, Activity, Clock, LogOut, RefreshCw } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

import { loadAttendanceData, findStudentByHallTicket } from '../utils/attendanceUtils';
import { deobfuscateData, memoizeData } from '../utils/dataProtection';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load attendance data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        localStorage.removeItem('attendanceData');
        localStorage.removeItem('attendanceDataTime');

        const rawData = await loadAttendanceData();
        const cleanData = deobfuscateData(rawData);
        const memoizedData = memoizeData('students', cleanData);
        setStudents(memoizedData);

        const updateRes = await fetch('/last-update.json');
        if (updateRes.ok) {
          const updateData = await updateRes.json();
          setLastUpdate(updateData);
        }
      } catch (error) {
        console.error('Failed to load attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSetupComplete = (setupData) => {
    setCurrentStudent(setupData.student);
  };

  const handleReset = () => {
    setCurrentStudent(null);
    setActiveTab('overview');
    localStorage.removeItem('attendanceData');
    localStorage.removeItem('attendanceDataTime');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      localStorage.removeItem('attendanceData');
      localStorage.removeItem('attendanceDataTime');

      const rawData = await loadAttendanceData();
      const cleanData = deobfuscateData(rawData);
      const memoizedData = memoizeData('students_refresh', cleanData);
      setStudents(memoizedData);

      if (currentStudent) {
        const updatedStudent = findStudentByHallTicket(memoizedData, currentStudent.hallticket);
        if (updatedStudent) {
          setCurrentStudent(updatedStudent);
        }
      }

      const updateRes = await fetch('/last-update.json');
      if (updateRes.ok) {
        const updateData = await updateRes.json();
        setLastUpdate(updateData);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const formattedUpdateDate = useMemo(() => {
    if (!lastUpdate || !lastUpdate.timestamp) return 'Scheduling Sync...';
    const date = new Date(lastUpdate.timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
    });
  }, [lastUpdate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-fuchsia-500/20 blur-3xl animate-pulse rounded-full" />
          <div className="relative glass-card-inner p-8 text-center border border-border bg-card/50 backdrop-blur-xl rounded-[2rem]">
            <div className="animate-spin w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
            <h2 className="text-foreground text-2xl font-black tracking-tighter uppercase italic">Loading...</h2>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] mt-2 italic">Getting Attendance Data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <AttendanceSetup
        students={students}
        onSetupComplete={handleSetupComplete}
        lastUpdate={lastUpdate}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>{currentStudent.studentName} | Dashboard</title>
        <meta name="theme-color" content="#020617" />
      </Head>
      <SecurityWrapper>
        <div className="min-h-screen bg-background text-foreground selection:bg-fuchsia-500/30 overflow-x-hidden pb-24 transition-colors duration-500">
          <SiteProtection />

          {/* 📡 Global Status Bar */}
          <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Last Updated:</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{formattedUpdateDate}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em]">KMCE Attendance v3.0</div>
                <div className="w-[1px] h-3 bg-border" />
                <div className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">System Ready</div>
              </div>
            </div>
          </div>

          {/* 🌌 Cinematic Background */}
          <CinematicBackground />

          <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 md:pt-20">

            {/* 🔝 Premium Top Header */}
            <header className="flex items-center justify-between mb-4 md:mb-8 bg-card/40 backdrop-blur-3xl border border-border p-3 md:p-4 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                  <Activity size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xs md:text-sm font-black uppercase tracking-tight italic">My Dashboard</h1>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-1 md:w-1.5 md:h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    <span className="text-[8px] md:text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Connection</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-2xl bg-foreground/[0.02] border border-border">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Global Status Update</span>
                  <span className="text-xs font-bold">{formattedUpdateDate}</span>
                </div>
                <div className="w-[1px] h-6 bg-border" />
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`p-2 rounded-xl hover:bg-foreground/5 transition-colors ${refreshing ? 'animate-spin text-indigo-500' : 'text-muted-foreground'}`}
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2.5 md:p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </header>

            {/* 🛰️ Mobile Sync Info Bar */}
            <div className="md:hidden flex items-center justify-between mb-4 px-4 py-2 bg-foreground/[0.02] border border-border rounded-2xl italic tracking-tighter">
              <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase">
                <Clock size={10} className="text-indigo-500" />
                Updated: <span className="">{formattedUpdateDate}</span>
              </div>
              <button onClick={handleRefresh} className={refreshing ? 'animate-spin' : ''}>
                <RefreshCw size={12} className="text-muted-foreground" />
              </button>
            </div>

            {/* 🕹️ Navigation System */}
            <PremiumNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onRefresh={handleRefresh}
              loading={refreshing}
            />

            <EnhancedSecurity />

            {/* 📺 Content Stage */}
            <main className="mt-4 md:mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {activeTab === 'overview' && (
                    <PersonalizedDashboard student={currentStudent} allStudents={students} onTabChange={setActiveTab} />
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
              </AnimatePresence>
            </main>

            {/* 🏁 Footer */}
            <footer className="mt-16 text-center border-t border-border pt-8 italic">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/5 border border-fuchsia-500/10 text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase mb-4">
                <Sparkles size={12} /> Live Student Portal
              </div>
              <p className="text-muted-foreground text-xs font-medium tracking-tight">
                KMCE Smart Attendance Portal &bull; Managed Securely &bull; 2024-25
              </p>
              <a href="/member" className="inline-block mt-4 text-[10px] text-muted-foreground hover:text-indigo-500 transition-colors uppercase font-black tracking-widest opacity-20 hover:opacity-100">Portal v2.4.0</a>
            </footer>
          </div>
        </div>
      </SecurityWrapper>
    </ErrorBoundary>
  );
}