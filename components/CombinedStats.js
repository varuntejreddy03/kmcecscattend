import { SUBJECTS } from '../utils/attendanceUtils';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, AlertTriangle, Award, BookOpen, BarChart3 } from 'lucide-react';

export default function CombinedStats({ student, students }) {
  const currentPercentage = parseFloat(student.percentage);
  const absent = student.totalPeriods - student.totalPresent;

  // Calculate rank
  const sortedStudents = [...students].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
  const rank = sortedStudents.findIndex(s => s.studentId === student.studentId) + 1;
  const totalStudents = students.length;

  // Find best and worst subjects
  const subjectPerformances = student.attendance.map(att => {
    const [present, total] = att.status.split('/').map(Number);
    const percentage = ((present / total) * 100).toFixed(2);
    return {
      subject: att.subjectName || SUBJECTS[att.subjectId] || `Subject ${att.subjectId}`,
      present,
      total,
      percentage: parseFloat(percentage)
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const bestSubject = subjectPerformances[0];
  const worstSubject = subjectPerformances[subjectPerformances.length - 1];

  // Calculate section performance
  const sectionStudents = students.filter(s => s.section === student.section);
  const sectionAvg = sectionStudents.length > 0 ?
    (sectionStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / sectionStudents.length).toFixed(2) : 0;
  const sectionRank = sectionStudents
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .findIndex(s => s.studentId === student.studentId) + 1;

  // Generate insights
  const insights = [];

  if (currentPercentage >= 85) {
    insights.push({
      type: 'success',
      icon: Trophy,
      title: 'Excellent Performance!',
      message: `You're in the top ${Math.round((rank / totalStudents) * 100)}% of all students. Keep up the great work!`
    });
  } else if (currentPercentage >= 75) {
    insights.push({
      type: 'success',
      icon: Award,
      title: 'Good Attendance',
      message: 'You\'re meeting the minimum requirement. Try to aim higher for better opportunities!'
    });
  } else if (currentPercentage >= 65) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Needs Improvement',
      message: 'You\'re close to the minimum requirement. Focus on attending more classes.'
    });
  } else {
    insights.push({
      type: 'danger',
      icon: AlertTriangle,
      title: 'Critical Attention Needed',
      message: 'Your attendance is below minimum requirements. Immediate action needed!'
    });
  }

  if (bestSubject.percentage >= 90) {
    insights.push({
      type: 'success',
      icon: Target,
      title: 'Subject Champion',
      message: `Outstanding performance in ${bestSubject.subject} (${bestSubject.percentage}%)!`
    });
  }

  if (worstSubject.percentage < 60) {
    insights.push({
      type: 'warning',
      icon: BookOpen,
      title: 'Focus Area',
      message: `${worstSubject.subject} needs attention (${worstSubject.percentage}%). Consider attending more classes.`
    });
  }

  if (currentPercentage > parseFloat(sectionAvg)) {
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: 'Above Section Average',
      message: `You're performing better than your section average (${sectionAvg}%)!`
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mobile-First Overview Cards */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="gradient-text text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
          Attendance Overview
        </h2>

        {/* Main Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            className="glass-card-inner text-center p-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${currentPercentage >= 75 ? 'text-green-400' :
                currentPercentage >= 65 ? 'text-yellow-400' : 'text-red-400'
              }`}>
              {student.percentage}%
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Overall Attendance</div>
          </motion.div>

          <motion.div
            className="glass-card-inner text-center p-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">#{rank}</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Overall Rank</div>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="glass-card-inner text-center p-2">
            <div className="text-lg md:text-xl font-bold text-green-400">{student.totalPresent}</div>
            <div className="text-xs text-gray-400">Present</div>
          </div>
          <div className="glass-card-inner text-center p-2">
            <div className="text-lg md:text-xl font-bold text-red-400">{absent}</div>
            <div className="text-xs text-gray-400">Absent</div>
          </div>
          <div className="glass-card-inner text-center p-2">
            <div className="text-lg md:text-xl font-bold text-blue-400">{student.totalPeriods}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="glass-card-inner text-center p-2">
            <div className="text-lg md:text-xl font-bold text-purple-400">#{sectionRank}</div>
            <div className="text-xs text-gray-400">Section</div>
          </div>
        </div>

        {/* Performance Comparison - Mobile Optimized */}
        <div className="glass-card-inner">
          <h3 className="text-sm md:text-base font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            vs Section Average
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">You</div>
              <div className="text-xl md:text-2xl font-bold text-white">{currentPercentage}%</div>
            </div>
            <div className="text-2xl md:text-3xl">
              {currentPercentage > parseFloat(sectionAvg) ? '📈' : currentPercentage < parseFloat(sectionAvg) ? '📉' : '➡️'}
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Section</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400">{sectionAvg}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subject Performance - Mobile First */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="gradient-text text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
          Subject Performance
        </h3>

        {/* Best/Worst Subjects - Mobile Stack */}
        <div className="space-y-3 mb-4">
          <motion.div
            className="glass-card-inner border-l-4 border-green-400 p-3"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Best Subject</span>
            </div>
            <div className="text-base md:text-lg font-bold text-white">{bestSubject.subject}</div>
            <div className="text-xs md:text-sm text-gray-400">{bestSubject.percentage}% ({bestSubject.present}/{bestSubject.total})</div>
          </motion.div>

          <motion.div
            className="glass-card-inner border-l-4 border-red-400 p-3"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Needs Focus</span>
            </div>
            <div className="text-base md:text-lg font-bold text-white">{worstSubject.subject}</div>
            <div className="text-xs md:text-sm text-gray-400">{worstSubject.percentage}% ({worstSubject.present}/{worstSubject.total})</div>
          </motion.div>
        </div>

        {/* All Subjects - Mobile Optimized */}
        <div className="glass-card-inner">
          <h4 className="text-sm md:text-base font-semibold text-gray-200 mb-3">All Subjects</h4>
          <div className="space-y-2">
            {subjectPerformances.slice(0, 6).map((subject, index) => (
              <motion.div
                key={subject.subject}
                className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-lg border border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-medium text-white truncate">{subject.subject}</div>
                  <div className="text-xs text-gray-400">{subject.present}/{subject.total}</div>
                </div>
                <div className="w-16 md:w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${subject.percentage >= 75 ? 'bg-green-400' :
                        subject.percentage >= 65 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(subject.percentage, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className={`text-xs md:text-sm font-bold min-w-8 text-right ${subject.percentage >= 75 ? 'text-green-400' :
                    subject.percentage >= 65 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                  {subject.percentage}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Insights - Mobile Optimized */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="gradient-text text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 md:w-5 md:h-5" />
          Smart Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                className={`glass-card-inner border-l-4 p-3 ${insight.type === 'success' ? 'border-green-400 bg-green-400/5' :
                    insight.type === 'warning' ? 'border-yellow-400 bg-yellow-400/5' :
                      insight.type === 'danger' ? 'border-red-400 bg-red-400/5' : 'border-blue-400 bg-blue-400/5'
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0 ${insight.type === 'success' ? 'text-green-400' :
                      insight.type === 'warning' ? 'text-yellow-400' :
                        insight.type === 'danger' ? 'text-red-400' : 'text-blue-400'
                    }`} />
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-white mb-1">{insight.title}</h4>
                    <p className="text-xs md:text-sm text-gray-300">{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}