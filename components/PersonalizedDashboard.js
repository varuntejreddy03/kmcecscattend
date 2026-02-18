import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Zap, Calendar, User, Trophy, Star, ChevronRight, BarChart2, Award, Crown } from 'lucide-react';
import { useState, useMemo } from 'react';
import TiltWrap from './TiltWrap';

export default function PersonalizedDashboard({ student, allStudents = [], onTabChange }) {
  const currentPercentage = parseFloat(student.percentage);
  const target = 75;
  const isSafe = currentPercentage >= target;

  // 🛰️ Ranking Intelligence Engine
  const rankingData = useMemo(() => {
    if (!allStudents.length) return { yearRank: '-', sectionRank: '-', yearTotal: '-', sectionTotal: '-' };

    // 1. Filter Year Cohort
    const yearStudents = allStudents
      .filter(s => s.year === student.year)
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    // 2. Filter Section Cohort
    const sectionStudents = yearStudents
      .filter(s => s.section === student.section)
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    const yRank = yearStudents.findIndex(s => s.hallticket === student.hallticket) + 1;
    const sRank = sectionStudents.findIndex(s => s.hallticket === student.hallticket) + 1;

    return {
      yearRank: yRank,
      sectionRank: sRank,
      yearTotal: yearStudents.length,
      sectionTotal: sectionStudents.length
    };
  }, [allStudents, student]);

  const classesNeeded = Math.max(0, Math.ceil((target / 100 * student.totalPeriods - student.totalPresent) / (1 - target / 100)));
  const classesCanMiss = Math.max(0, Math.floor(student.totalPresent / (target / 100)) - student.totalPeriods);
  const daysNeeded = Math.ceil(classesNeeded / 8);
  const daysCanMiss = Math.floor(classesCanMiss / 8);
  const healthRating = Math.min(100, (currentPercentage / target) * 100);

  const [imgError, setImgError] = useState(false);

  const getStudentImage = (ht, year) => {
    if (year === '2' || year === '2nd') return null;
    if (ht?.toUpperCase() === '23P81A6234') return '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg';
    return `https://psapi.kmitonline.com/public/student_images/KMCE/${ht?.toUpperCase()}.jpg`;
  };

  const studentImg = getStudentImage(student.hallticket, student.year);

  return (
    <div className="space-y-8">

      {/* 💳 Student Profile */}
      <TiltWrap>
        <motion.div
          className="relative group p-[2px] rounded-[1.5rem] md:rounded-[2.5rem] aurora-border transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-card/80 shadow-2xl rounded-[1.4rem] md:rounded-[2.5rem] p-5 md:p-8 relative overflow-hidden premium-glass transition-all duration-500 border border-border">
            {/* Background Branding */}
            <div className="absolute -top-10 -right-10 text-foreground/[0.02] rotate-12 select-none pointer-events-none">
              <User size={300} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative">
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] p-1 bg-gradient-to-br ${isSafe ? 'from-emerald-400 to-teal-600' : 'from-rose-400 to-orange-600'} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                  <div className="w-full h-full rounded-[1.4rem] md:rounded-[2.3rem] overflow-hidden bg-background border-2 border-border">
                    {studentImg && !imgError ? (
                      <img
                        src={studentImg}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black text-foreground italic tracking-tighter">
                        {student.studentName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <motion.div
                  className={`absolute -bottom-2 -right-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 ${isSafe ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isSafe ? 'SAFE' : 'CRITICAL'}
                </motion.div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  <Star size={12} fill="currentColor" />
                  Student Profile
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic leading-[1.1]">
                  {student.studentName}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <div className="px-4 py-2 rounded-2xl bg-foreground/[0.03] border border-border flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Roll</span>
                    <span className="text-sm font-bold font-mono tracking-tight uppercase">{student.hallticket}</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-foreground/[0.03] border border-border flex items-center gap-2 transition-all">
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Node</span>
                    <span className="text-sm font-bold font-mono tracking-tight uppercase">{student.section}</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 transition-all group/rank">
                    <Award size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Section Rank</span>
                    <span className="text-sm font-black text-indigo-400 italic">#{rankingData.sectionRank} <span className="text-[8px] opacity-40">/ {rankingData.sectionTotal}</span></span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 transition-all group/rank">
                    <Crown size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Year Rank</span>
                    <span className="text-sm font-black text-amber-400 italic">#{rankingData.yearRank} <span className="text-[8px] opacity-40">/ {rankingData.yearTotal}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </TiltWrap>

      {/* 🚀 Main Progress Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Advanced Gauge */}
        <motion.div
          className="lg:col-span-1 bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-xl transition-all duration-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] -z-10" />

          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <circle
                cx="96" cy="96" r="84"
                stroke="currentColor" strokeWidth="8"
                fill="transparent"
                className="text-white/[0.03]"
              />
              <motion.circle
                cx="96" cy="96" r="84"
                stroke="currentColor" strokeWidth="8"
                fill="transparent"
                strokeDasharray={528}
                initial={{ strokeDashoffset: 528 }}
                animate={{ strokeDashoffset: 528 - (528 * currentPercentage) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={isSafe ? 'text-indigo-500' : 'text-rose-500'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black italic tracking-tighter ${isSafe ? 'text-foreground' : 'text-rose-500'}`}>
                {currentPercentage}%
              </span>
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">My Attendance</span>
            </div>
          </div>

          <div className="mt-8 w-full space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-muted-foreground italic">Target 75.0%</span>
              <span className={isSafe ? 'text-cyan-500' : 'text-rose-500'}>
                {isSafe ? 'GOOD' : 'WARNING'}
              </span>
            </div>
            <div className="h-2 w-full bg-foreground/[0.03] rounded-full overflow-hidden p-[1px] border border-border">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${isSafe ? 'from-indigo-500 to-violet-600' : 'from-rose-600 to-orange-600'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (currentPercentage / 75) * 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Action Intelligence Card */}
        <motion.div
          className="lg:col-span-2 bg-card/50 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl transition-all duration-500"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-[1.5rem] ${isSafe ? 'bg-cyan-500/10 text-cyan-500' : 'bg-rose-500/10 text-rose-500'} border border-border shadow-xl`}>
                {isSafe ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
              </div>
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">My Progress</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                  {isSafe ? 'You are safe for now' : 'You must attend more classes'}
                </p>
              </div>
            </div>
            <div className="p-3 text-muted-foreground hover:text-indigo-400 cursor-help transition-colors">
              <BarChart2 size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] bg-foreground/[0.03] border border-border group hover:bg-foreground/[0.05] transition-all">
              <Zap className="text-amber-500 mb-3" size={24} />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Strategic Insight</p>
              <p className="text-lg font-black italic">
                {isSafe
                  ? `Maintain your lead. You can skip ${classesCanMiss} classes (~${daysCanMiss} days) safely.`
                  : `Force recovery. Complete next ${classesNeeded} classes (~${daysNeeded} days) to hit target.`}
              </p>
            </div>

            <button
              onClick={() => onTabChange('simulator')}
              className="p-5 md:p-6 rounded-[2rem] bg-indigo-600 text-white flex flex-col items-center justify-center gap-2 group relative overflow-hidden shadow-xl shadow-indigo-500/20 active:scale-95 transition-all w-full"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              <TrendingUp size={28} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-[0.2em] opacity-80">Check Future</span>
                <span className="block text-sm font-black uppercase italic">Try Calculator</span>
              </div>
              <ChevronRight className="absolute right-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 📊 Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Attended', val: student.totalPresent, color: 'emerald', icon: Trophy },
          { label: 'Total Classes', val: student.totalPeriods, color: 'blue', icon: Calendar },
          { label: 'Can Skip', val: classesCanMiss, color: 'purple', icon: BarChart2 },
          { label: 'Need to Attend', val: classesNeeded, color: 'rose', icon: BarChart2 },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="group glass-card-inner !p-6 border border-border hover:bg-card/80 transition-all relative overflow-hidden bg-card/60"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
          >
            <div className={`absolute -right-4 -bottom-4 opacity-5 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
              <item.icon size={80} />
            </div>
            <div className={`text-[10px] font-black text-indigo-500/70 border-l-2 border-indigo-500/30 pl-3 uppercase tracking-widest mb-3`}>
              {item.label}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic tracking-tighter">{item.val}</span>
              {(item.label === 'Can Skip' || item.label === 'Need to Attend') && (
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic animate-pulse">
                  ~{Math[item.label === 'Can Skip' ? 'floor' : 'ceil'](item.val / 8)} Days
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}