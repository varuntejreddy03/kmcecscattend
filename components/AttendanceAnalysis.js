import { generateAnalysis } from '../utils/attendanceUtils';

export default function AttendanceAnalysis({ student }) {
  const analysis = generateAnalysis(student);
  const currentPercentage = parseFloat(student.percentage);

  return (
    <div className="space-y-6">
      <div className="glass-card animate-slide-up">
        <h2 className="gradient-text mb-6">📊 Attendance Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analysis).map(([threshold, data], index) => (
            <div key={threshold} className="glass-card-inner animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-200">{threshold}% Threshold</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.currentStatus === 'Safe' 
                    ? 'bg-green-500/20 text-green-300 border border-green-400' 
                    : 'bg-red-500/20 text-red-300 border border-red-400'
                }`}>
                  {data.currentStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{data.classesNeeded}</div>
                  <div className="text-sm text-gray-400">Classes Needed</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({Math.ceil(data.classesNeeded / 8)} days)
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{data.classesCanMiss}</div>
                  <div className="text-sm text-gray-400">Can Miss</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({Math.floor(data.classesCanMiss / 8)} days)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="gradient-text mb-6">🎯 Performance Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-inner">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">Current Status</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPercentage >= 75 
                  ? 'bg-green-500/20 text-green-300 border border-green-400' 
                  : currentPercentage >= 65 
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400' 
                  : 'bg-red-500/20 text-red-300 border border-red-400'
              }`}>
                {currentPercentage >= 75 ? 'Excellent' : currentPercentage >= 65 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Attendance</span>
                <strong className={currentPercentage >= 75 ? 'text-green-400' : currentPercentage >= 65 ? 'text-yellow-400' : 'text-red-400'}>
                  {student.percentage}%
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Classes Attended</span>
                <strong className="text-gray-200">{student.totalPresent}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Classes</span>
                <strong className="text-gray-200">{student.totalPeriods}</strong>
              </div>
            </div>
          </div>
          
          <div className="glass-card-inner">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Insights</h3>
            <div className="space-y-3">
              {currentPercentage >= 75 ? (
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                  <span className="text-xl">✅</span>
                  <span className="text-green-300">Great attendance! Keep it up!</span>
                </div>
              ) : currentPercentage >= 65 ? (
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <span className="text-xl">⚠️</span>
                  <span className="text-yellow-300">Good progress, aim for 75%+</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                  <span className="text-xl">🚨</span>
                  <span className="text-red-300">Attendance needs improvement</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <span className="text-xl">📈</span>
                <span className="text-blue-300">Check thresholds above for targets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}