import { generateAnalysis } from '../utils/attendanceUtils';
import { motion } from 'framer-motion';
import { Target, AlertCircle, CheckCircle2, TrendingUp, BarChart3, Activity, Shield } from 'lucide-react';
import TiltWrap from './TiltWrap';

export default function AttendanceAnalysis({ student }) {
  const analysis = generateAnalysis(student);

  return (
    <div className="space-y-8">

      {/* 🚀 Detailed Report */}
      <motion.div
        className="aurora-border rounded-[2.5rem] p-[2px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-card/40 backdrop-blur-3xl rounded-[2.5rem] p-5 md:p-12 relative overflow-hidden premium-glass border border-border shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 text-foreground opacity-[0.02] -rotate-12 pointer-events-none">
            <TrendingUp size={240} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Activity size={12} />
                Advice
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-foreground italic tracking-tighter uppercase leading-[1.1]">
                Attendance <br />
                <span className="text-indigo-500">Check</span>
              </h2>
              <p className="text-muted-foreground text-sm font-bold leading-relaxed max-w-md uppercase tracking-tight">
                AI-generated simulation of your current trajectory. Monitor these thresholds to ensure your academic node remains active.
              </p>
            </div>

            <div className="w-full md:w-auto grid grid-cols-1 gap-4">
              <div className="p-4 md:p-6 rounded-3xl bg-foreground/[0.03] border border-border flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Percentage</div>
                  <div className="text-xl md:text-2xl font-black italic">{student.percentage}%</div>
                </div>
                <div className="w-[1px] h-10 bg-border" />
                <div className="text-left">
                  <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                  <div className={`text-xl md:text-2xl font-black italic ${parseFloat(student.percentage) >= 75 ? 'text-cyan-500' : 'text-rose-500'}`}>
                    {parseFloat(student.percentage) >= 75 ? 'SECURED' : 'CHALLENGED'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 📊 Threshold Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(analysis).map(([threshold, data], index) => {
          const isSafe = data.currentStatus === 'Safe';
          return (
            <TiltWrap key={threshold}>
              <motion.div
                className={`group glass-card-inner !p-6 md:!p-8 border-2 transition-all duration-500 rounded-[2rem] shadow-xl ${isSafe ? 'border-cyan-500/30 bg-cyan-500/[0.02]' : 'border-rose-500/30 bg-rose-500/[0.02]'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* ... existing content inside motion.div ... */}
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <div className="text-3xl md:text-4xl font-black italic tracking-tighter mb-1">{threshold}%</div>
                    <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Target</div>
                  </div>
                  <div className={`p-2 rounded-xl ${isSafe ? 'text-cyan-500' : 'text-rose-500'}`}>
                    {isSafe ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /> : <AlertCircle className="w-6 h-6 md:w-8 md:h-8" />}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border relative overflow-hidden transition-all duration-500">
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Need to Attend</div>
                        <div className={`text-2xl font-black italic tracking-tighter ${isSafe ? 'text-cyan-500' : 'text-rose-500'}`}>
                          {data.classesNeeded} <span className="text-xs opacity-50">CLS</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-black italic opacity-40">~{Math.ceil(data.classesNeeded / 8)} Days</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border relative overflow-hidden transition-all duration-500">
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Can Skip</div>
                        <div className="text-2xl font-black italic tracking-tighter">
                          {data.classesCanMiss} <span className="text-xs opacity-50">CLS</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-black italic opacity-40">~{Math.floor(data.classesCanMiss / 8)} Days</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 py-3 px-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.3em] italic ${isSafe ? 'bg-cyan-600 text-white' : 'bg-rose-500 text-white'}`}>
                  {isSafe ? 'Status Optimal' : 'Action Required'}
                </div>
              </motion.div>
            </TiltWrap>
          );
        })}
      </div>

    </div>
  );
}