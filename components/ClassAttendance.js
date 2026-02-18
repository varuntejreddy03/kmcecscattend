import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, Shield, Target, AlertCircle, ChevronDown, UserCircle, SearchX, Layers } from 'lucide-react';
import TiltWrap from './TiltWrap';

const StudentCard = ({ student, getStudentImage }) => {
  const [imgError, setImgError] = useState(false);
  const percentage = parseFloat(student.percentage);
  const isSafe = percentage >= 75;

  const studentImg = getStudentImage(student.hallticket, student.year);

  return (
    <TiltWrap>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative"
      >
        <div className={`h-full bg-card/40 backdrop-blur-xl border border-border p-3 md:p-4 rounded-3xl hover:bg-foreground/[0.05] hover:border-border transition-all duration-300 premium-glass ${!isSafe ? 'ring-1 ring-rose-500/20' : ''} shadow-xl`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden border-2 p-[2px] ${isSafe ? 'border-cyan-500/30' : 'border-rose-500/30'} group-hover:scale-105 transition-transform`}>
                <div className="w-full h-full rounded-xl overflow-hidden bg-background">
                  {studentImg && !imgError ? (
                    <img
                      src={studentImg}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xl font-black text-white ${isSafe ? 'bg-gradient-to-br from-cyan-600 to-teal-800' : 'bg-gradient-to-br from-rose-600 to-orange-800'}`}>
                      {student.studentName?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-foreground text-sm font-black truncate uppercase tracking-tight italic">{student.studentName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-muted-foreground font-mono tracking-tighter uppercase">{student.hallticket}</span>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest italic">{student.section?.split(' - ')[0] || 'N/A'}</span>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-xl font-black italic tracking-tighter ${isSafe ? 'text-cyan-600' : 'text-rose-500'}`}>
                {student.percentage}%
              </div>
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em]">{isSafe ? 'SAFE' : 'RISKY'}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-foreground/[0.03] p-2 rounded-xl border border-border text-center">
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Present</p>
              <p className="text-xs font-bold">{student.totalPresent}</p>
            </div>
            <div className="bg-foreground/[0.03] p-2 rounded-xl border border-border text-center">
              <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Total</p>
              <p className="text-xs font-bold">{student.totalPeriods}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltWrap>
  );
};

export default function ClassAttendance({ students }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('3');

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.hallticket.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = s.year === yearFilter || (yearFilter === '3' && !s.year);
      const matchesFilter = activeFilter === 'all' ? true :
        activeFilter === 'safe' ? parseFloat(s.percentage) >= 75 :
          activeFilter === 'at-risk' ? parseFloat(s.percentage) < 75 && parseFloat(s.percentage) >= 65 :
            parseFloat(s.percentage) < 65;
      return matchesSearch && matchesYear && matchesFilter;
    });
  }, [students, searchTerm, activeFilter, yearFilter]);

  const stats = useMemo(() => {
    const yearStudents = students.filter(s => s.year === yearFilter || (yearFilter === '3' && !s.year));
    return {
      total: yearStudents.length,
      safe: yearStudents.filter(s => parseFloat(s.percentage) >= 75).length,
      critical: yearStudents.filter(s => parseFloat(s.percentage) < 65).length
    };
  }, [students, yearFilter]);

  const getStudentImage = (hallticket, year) => {
    if (year === '2' || year === '2nd') return null;
    return `https://psapi.kmitonline.com/public/student_images/KMCE/${hallticket?.toUpperCase()}.jpg`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 🧩 Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card/40 backdrop-blur-3xl border border-border rounded-[2.5rem] p-5 md:p-8 premium-glass shadow-2xl transition-all duration-500">
          <div className="flex flex-col md:flex-row gap-5 md:gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest w-fit">
                <Layers size={12} />
                Pick Year
              </div>
              <h3 className="text-xl md:text-3xl font-black text-foreground italic tracking-tighter uppercase">Student List</h3>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by Name or ID..."
                  className="w-full bg-background border-2 border-border rounded-2xl py-3 md:py-4 pl-12 pr-6 text-xs md:text-sm font-bold placeholder:text-muted-foreground border-indigo-500/50 outline-none transition-all dark:text-white light:text-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="md:w-48 space-y-4">
              <div className="flex gap-2 p-1 bg-background rounded-2xl border border-border">
                <button
                  onClick={() => setYearFilter('2')}
                  className={`flex-1 px-3 py-2.5 md:px-4 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${yearFilter === '2' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  2nd Year
                </button>
                <button
                  onClick={() => setYearFilter('3')}
                  className={`flex-1 px-3 py-2.5 md:px-4 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${yearFilter === '3' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  3rd Year
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'safe', 'at-risk', 'critical'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'text-muted-foreground border-transparent hover:text-foreground'} border`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="aurora-border rounded-[2.5rem] p-[2px] shadow-2xl shadow-indigo-500/20">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden premium-glass h-full">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Users size={160} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2 italic">Year Stats</p>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="text-5xl font-black italic tracking-tighter">{stats.total}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Students</div>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-black italic tracking-tighter text-cyan-200">{stats.safe}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Safe Students</div>
                </div>
                <div>
                  <div className="text-2xl font-black italic tracking-tighter text-rose-200">{stats.critical}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Risky Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📂 Results Grid */}
      <AnimatePresence mode="popLayout">
        {filteredStudents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredStudents.map(student => (
              <StudentCard key={student.hallticket} student={student} getStudentImage={getStudentImage} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20 bg-card/40 rounded-[2.5rem] border border-dashed border-border transition-all duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SearchX size={64} className="mx-auto text-muted-foreground opacity-20 mb-6" />
            <h3 className="text-2xl font-black text-muted-foreground italic uppercase tracking-tighter">No Nodes Found</h3>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2 italic px-10">Try adjusting your directory scan parameters</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
