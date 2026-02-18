import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { findStudentByHallTicket, getAttendanceColor } from '../utils/attendanceUtils';
import { GraduationCap, Search, TrendingUp, Users, Trophy, ChevronRight, Hash, Building2, Sparkles, BarChart3, AlertCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function AttendanceSetup({ students, onSetupComplete, lastUpdate }) {
  const [hallTicket, setHallTicket] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
        setError('Hall ticket not found. Please double check.');
        return;
      }

      onSetupComplete({
        student,
        startDate: '2025-04-29'
      });

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: students.length,
      safe: students.filter(s => parseFloat(s.percentage) >= 75).length,
      topPerformers: students
        .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
        .slice(0, 4)
    };
  }, [students]);

  const sections = ['CSE A', 'CSE B', 'CSC', 'CSD', 'CSM', 'CSO'];

  const formattedUpdateDate = useMemo(() => {
    if (!lastUpdate || !lastUpdate.timestamp) return 'Tonight @ 11:00 PM';
    const date = new Date(lastUpdate.timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, [lastUpdate]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">
      {/* 🌌 Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-violet-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* 🌓 Theme Toggle */}
      <div className="fixed top-6 right-6 z-[100]">
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col lg:flex-row gap-12 items-center justify-center">

        {/* 🚀 Left Side: Branding & Input */}
        <div className="w-full lg:w-1/2 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} />
              The Smart Student Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Track Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">Attendance</span> <br />
              Like a Pro.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-md font-medium leading-relaxed">
              Experience the next generation of attendance tracking. Smart insights, predictive goals, and real-time updates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                <div className={`absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-indigo-400 transition-colors">
                    <Hash size={24} />
                  </div>
                  <input
                    type="text"
                    value={hallTicket}
                    onChange={(e) => setHallTicket(e.target.value.toUpperCase())}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter Hall Ticket Number..."
                    className="w-full bg-card/50 backdrop-blur-xl border-2 border-border focus:border-indigo-500/50 rounded-3xl py-6 pl-16 pr-6 text-xl font-bold placeholder:text-muted-foreground outline-none transition-all dark:text-white light:text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ChevronRight size={24} strokeWidth={3} />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-rose-400 text-sm font-bold bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-8 items-center"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center text-xs font-bold text-muted-foreground transition-all">
                  <Users size={14} />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                +{stats.total}
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
              Join students tracking daily
            </p>
          </motion.div>
        </div>

        {/* 📊 Right Side: Real-time Data Visuals */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Quick Stats Grid */}
            <div className="space-y-6">
              <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[2rem] p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="font-black text-xl tracking-tight">Overview</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.03] border border-border">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Active</span>
                    <span className="text-xl font-black">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                    <span className="text-xs text-cyan-500 font-bold uppercase tracking-wider">Above 75%</span>
                    <span className="text-xl font-black text-cyan-400">{stats.safe}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/10">
                <Building2 className="mb-4 opacity-50" size={32} />
                <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Institution</p>
                <h4 className="text-2xl font-black leading-none">KMCE</h4>
                <p className="mt-4 text-xs font-medium opacity-80 leading-relaxed">
                  Keshav Memorial College of Engineering <br />
                  Attendance Managed & Verified
                </p>
              </div>
            </div>

            {/* Top Performers Card */}
            <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500">
                    <Trophy size={24} />
                  </div>
                  <h3 className="font-black text-xl tracking-tight">Top Scorers</h3>
                </div>
                <div className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg uppercase tracking-widest">Live</div>
              </div>

              <div className="space-y-4">
                {stats.topPerformers.map((student, idx) => {
                  const showPic = student.year !== '2';
                  return (
                    <div key={student.hallticket} className="flex items-center gap-4 group cursor-default">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-colors ${idx === 0 ? 'border-yellow-500' : 'border-slate-800 group-hover:border-slate-700'}`}>
                          {showPic ? (
                            <>
                              <img
                                src={`https://psapi.kmitonline.com/public/student_images/KMCE/${student.hallticket.toUpperCase()}.jpg`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="bg-slate-800 w-full h-full hidden items-center justify-center text-sm font-black text-slate-500 uppercase">
                                {student.studentName.charAt(0)}
                              </div>
                            </>
                          ) : (
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center text-sm font-black text-white uppercase">
                              {student.studentName.charAt(0)}
                            </div>
                          )}
                        </div>
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-slate-950 p-1 rounded-full shadow-lg">
                            <Sparkles size={10} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-indigo-500 transition-colors uppercase">{student.studentName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono tracking-tighter">{student.hallticket}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${parseFloat(student.percentage) >= 75 ? 'text-cyan-500' : 'text-muted-foreground'}`}>
                          {student.percentage}%
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800">
                <div className="flex flex-wrap gap-2">
                  {sections.map(s => (
                    <div key={s} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-indigo-500/30 hover:text-indigo-400 transition-all cursor-default">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 📍 Notice Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-0 left-0 right-0 p-6 z-20 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-card/80 backdrop-blur-3xl border border-border px-6 py-4 rounded-3xl pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              <p className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
                Last Sync: <span className="font-black">{formattedUpdateDate}</span>
              </p>
              <div className="w-[1px] h-4 bg-border mx-2" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">Secure Node</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}