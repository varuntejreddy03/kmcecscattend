import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBJECTS, parseAttendanceStatus, getAttendanceColor, calculatePercentage } from '../utils/attendanceUtils';
import { Users, Search, Filter, TrendingUp, Award, AlertTriangle } from 'lucide-react';

export default function ClassAttendance({ students }) {
  const [sortBy, setSortBy] = useState('percentage');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.hallticket.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      return matchesSearch && matchesSection;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.studentName;
          bValue = b.studentName;
          break;
        case 'hallticket':
          aValue = a.hallticket;
          bValue = b.hallticket;
          break;
        case 'percentage':
          aValue = parseFloat(a.percentage);
          bValue = parseFloat(b.percentage);
          break;
        case 'present':
          aValue = a.totalPresent;
          bValue = b.totalPresent;
          break;
        default:
          aValue = parseFloat(a.percentage);
          bValue = parseFloat(b.percentage);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStudentImage = (hallticket) => {
    if (hallticket.toUpperCase() === '23P81A6234') {
      return '/WhatsApp Image 2025-10-06 at 00.52.03_d69d9760.jpg';
    }
    return `https://psapi.kmitonline.com/public/student_images/KMCE/${hallticket}.jpg`;
  };

  const sections = ['CSE A', 'CSE B', 'CSC', 'CSD', 'CSM', 'CSO'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="gradient-text text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Class Attendance Overview
        </h2>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or hall ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
            >
              <option value="percentage">Sort by Percentage</option>
              <option value="name">Sort by Name</option>
              <option value="hallticket">Sort by Hall Ticket</option>
              <option value="present">Sort by Classes Present</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="glass-button px-3"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Section Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <motion.button
            onClick={() => setSelectedSection('all')}
            className={`glass-button text-sm ${selectedSection === 'all' ? 'bg-blue-400/20 border-blue-400/40 text-blue-300' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Sections
          </motion.button>
          {sections.map(section => (
            <motion.button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`glass-button text-sm ${selectedSection === section ? 'bg-blue-400/20 border-blue-400/40 text-blue-300' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {section}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Overall Statistics */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="gradient-text text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Overall Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="glass-card-inner text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-blue-400">{students.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Students</div>
          </motion.div>
          <motion.div 
            className="glass-card-inner text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-green-400">
              {students.filter(s => parseFloat(s.percentage) >= 75).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Above 75%</div>
          </motion.div>
          <motion.div 
            className="glass-card-inner text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-yellow-400">
              {students.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">65% - 75%</div>
          </motion.div>
          <motion.div 
            className="glass-card-inner text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-red-400">
              {students.filter(s => parseFloat(s.percentage) < 65).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Below 65%</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section-wise Statistics */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="gradient-text text-xl font-bold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Section-wise Statistics
        </h3>
        <div className="space-y-3">
          {sections.map((section, index) => {
            const sectionStudents = students.filter(s => s.section === section);
            const sectionAvg = sectionStudents.length > 0 ? 
              (sectionStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / sectionStudents.length).toFixed(2) : 0;
            const good = sectionStudents.filter(s => parseFloat(s.percentage) >= 75).length;
            const average = sectionStudents.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length;
            const poor = sectionStudents.filter(s => parseFloat(s.percentage) < 65).length;
            
            return (
              <motion.div 
                key={section}
                className="glass-card-inner"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white text-lg">{section}</div>
                  <div className="font-bold text-white">{sectionAvg}%</div>
                </div>
                
                <div className="w-full h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${
                      parseFloat(sectionAvg) >= 75 ? 'bg-green-400' : 
                      parseFloat(sectionAvg) >= 65 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(parseFloat(sectionAvg), 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-green-400 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {good} Good
                  </span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {average} Average
                  </span>
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {poor} Poor
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Students List */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="gradient-text text-xl font-bold mb-6">
          Students ({filteredStudents.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredStudents.slice(0, 50).map((student, index) => {
              const percentage = parseFloat(student.percentage);
              const colorClass = getAttendanceColor(percentage);
              
              return (
                <motion.div 
                  key={student.studentId}
                  className="glass-card-inner"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={getStudentImage(student.hallticket)}
                        alt={student.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzkuNzkgMTIgOCAxMC4yMSA4IDhTOS43OSA0IDggNFMxMiA1Ljc5IDEyIDhTMTAuMjEgMTIgMTIgMTJaTTEyIDE0QzE0LjY3IDE0IDIwIDE1LjM0IDIwIDE4VjIwSDRWMThDNCAxNS4zNCA5LjMzIDE0IDEyIDE0WiIgZmlsbD0iIzY2NiIvPgo8L3N2Zz4KPC9zdmc+Cg==';
                        }}
                      />
                      <div className="absolute -top-1 -right-1 bg-blue-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate" title={student.studentName}>
                        {student.studentName}
                      </div>
                      <div className="text-sm text-gray-400">{student.hallticket}</div>
                      <div className="text-xs text-yellow-400 font-medium">{student.section || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className={`text-center p-2 rounded-lg mb-3 ${
                    percentage >= 75 ? 'bg-green-400/20 border border-green-400/30' : 
                    percentage >= 65 ? 'bg-yellow-400/20 border border-yellow-400/30' : 
                    'bg-red-400/20 border border-red-400/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      percentage >= 75 ? 'text-green-400' : 
                      percentage >= 65 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {student.percentage}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">{student.totalPresent}</div>
                      <div className="text-gray-400">Present</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">{student.totalPeriods}</div>
                      <div className="text-gray-400">Total</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">{student.totalPeriods - student.totalPresent}</div>
                      <div className="text-gray-400">Absent</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        percentage >= 75 ? 'bg-green-400' : 
                        percentage >= 65 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No students found matching your search criteria.</p>
          </div>
        )}
        
        {filteredStudents.length > 50 && (
          <div className="text-center mt-4 text-gray-400 text-sm">
            Showing first 50 students. Use search to find specific students.
          </div>
        )}
      </motion.div>
    </div>
  );
}