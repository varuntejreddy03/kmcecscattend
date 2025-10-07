// Subject mapping
export const SUBJECTS = {
  105: 'SKILLING',
  103: 'PS',
  104: 'FS', 
  110: 'SDC',
  136: 'EH',
  112: 'DBMS',
  124: 'FLAT',
  116: 'AI',
  123: 'NSC',
  115: 'ACS-LAB',
  117: 'IPR',
  119: 'IDS'
};

// Load attendance data from JSON
export const loadAttendanceData = async () => {
  try {
    // Add cache-busting parameter to ensure fresh data
    const response = await fetch(`/attend.json?t=${Date.now()}`);
    const data = await response.json();
    return data.studentsAttendance || data;
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return [];
  }
};

// Find student by hall ticket
export const findStudentByHallTicket = (students, hallTicket) => {
  return students.find(student => 
    student.hallticket?.toLowerCase() === hallTicket.toLowerCase()
  );
};

// Calculate attendance percentage
export const calculatePercentage = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(2);
};

// Parse attendance status (e.g., "45/49" -> {present: 45, total: 49})
export const parseAttendanceStatus = (status) => {
  const [present, total] = status.split('/').map(Number);
  return { present, total };
};

// Calculate classes needed for target percentage
export const calculateClassesNeeded = (currentPresent, currentTotal, targetPercentage) => {
  const target = targetPercentage / 100;
  
  // If already above target
  if (currentPresent / currentTotal >= target) {
    return 0;
  }
  
  // Calculate classes needed: (present + x) / (total + x) = target
  // Solving: present + x = target * (total + x)
  // present + x = target * total + target * x
  // x - target * x = target * total - present
  // x(1 - target) = target * total - present
  // x = (target * total - present) / (1 - target)
  
  const classesNeeded = Math.ceil((target * currentTotal - currentPresent) / (1 - target));
  return Math.max(0, classesNeeded);
};

// Calculate classes that can be missed while maintaining percentage
export const calculateClassesCanMiss = (currentPresent, currentTotal, minPercentage) => {
  const minPercent = minPercentage / 100;
  
  // If already below minimum
  if (currentPresent / currentTotal < minPercent) {
    return 0;
  }
  
  // Calculate maximum classes that can be missed
  // (present) / (total + x) = minPercent
  // present = minPercent * (total + x)
  // present = minPercent * total + minPercent * x
  // present - minPercent * total = minPercent * x
  // x = (present - minPercent * total) / minPercent
  
  const canMiss = Math.floor((currentPresent - minPercent * currentTotal) / minPercent);
  return Math.max(0, canMiss);
};

// Get attendance status color
export const getAttendanceColor = (percentage) => {
  if (percentage >= 75) return 'good';
  if (percentage >= 65) return 'warning';
  return 'danger';
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check if date is valid for attendance (not future, not Sunday, after start date)
export const isValidAttendanceDate = (date, startDate) => {
  const today = new Date();
  const checkDate = new Date(date);
  const start = new Date(startDate);
  
  // Reset time to compare dates only
  today.setHours(23, 59, 59, 999);
  checkDate.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  
  // Check if date is not in future
  if (checkDate > today) return false;
  
  // Check if date is not Sunday (0 = Sunday)
  if (checkDate.getDay() === 0) return false;
  
  // Check if date is on or after start date
  if (checkDate < start) return false;
  
  return true;
};

// Generate analysis for different thresholds
export const generateAnalysis = (student) => {
  const thresholds = [55, 65, 75];
  const analysis = {};
  
  thresholds.forEach(threshold => {
    const classesNeeded = calculateClassesNeeded(
      student.totalPresent, 
      student.totalPeriods, 
      threshold
    );
    
    const classesCanMiss = calculateClassesCanMiss(
      student.totalPresent, 
      student.totalPeriods, 
      threshold
    );
    
    analysis[threshold] = {
      classesNeeded,
      classesCanMiss,
      currentStatus: parseFloat(student.percentage) >= threshold ? 'Safe' : 'At Risk'
    };
  });
  
  return analysis;
};