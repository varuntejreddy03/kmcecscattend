// Subject mapping for 3rd year (Legacy support)
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

// Load attendance data from all section JSON files for both years
export const loadAttendanceData = async () => {
  try {
    const years = ['2', '3'];
    const sectionsByYear = {
      '2': ['CSE A', 'CSE B', 'CSE C', 'CSM A', 'CSM B', 'CSM C', 'ECE'],
      '3': ['csea', 'cseb', 'csc', 'csd', 'csm', 'cso']
    };
    const allStudents = [];

    for (const year of years) {
      const yearSections = sectionsByYear[year];
      for (const section of yearSections) {
        try {
          // Handle legacy naming for 3rd year
          let filename;
          const cleanSection = section.toLowerCase().replace(/\s+/g, '');
          if (year === '3') {
            filename = cleanSection === 'csd' ? 'csdattedn.json' : `${cleanSection}attend.json`;
          } else {
            // 2nd year uses underscores: "cse_a"
            const underSection = section.toLowerCase().replace(/\s+/g, '_');
            filename = `${year}nd_${underSection}attend.json`;
          }

          const response = await fetch(`/${filename}?t=${Date.now()}`);
          if (!response.ok) continue; // Skip if file doesn't exist yet

          const data = await response.json();
          const students = data.studentsAttendance || data;

          // Add section & year info to each student
          const formattedSection = section.toUpperCase();

          students.forEach(student => {
            student.section = `${formattedSection} - ${year}nd Year`;
            student.year = year;
            // Ensure studentName is always present
            if (!student.studentName && student.name) student.studentName = student.name;
          });

          allStudents.push(...students);
        } catch (sectionError) {
          // Silent fail for individual missing files
          console.debug(`Could not load ${section} for Year ${year}`);
        }
      }
    }

    // Add obfuscation for data protection
    const { obfuscateData } = await import('./dataProtection');
    return obfuscateData(allStudents);
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return [];
  }
};

// Find student by hall ticket
export const findStudentByHallTicket = (students, hallTicket) => {
  if (!students) return null;
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
  if (!status) return { present: 0, total: 0 };
  const [present, total] = status.split('/').map(Number);
  return { present: present || 0, total: total || 0 };
};

// Calculate classes needed for target percentage
export const calculateClassesNeeded = (currentPresent, currentTotal, targetPercentage) => {
  const target = targetPercentage / 100;
  if (currentPresent / currentTotal >= target) return 0;
  const classesNeeded = Math.ceil((target * currentTotal - currentPresent) / (1 - target));
  return Math.max(0, classesNeeded);
};

// Calculate classes that can be missed while maintaining percentage
export const calculateClassesCanMiss = (currentPresent, currentTotal, minPercentage) => {
  const minPercent = minPercentage / 100;
  if (currentPresent / currentTotal < minPercent) return 0;
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

// Check if date is valid
export const isValidAttendanceDate = (date, startDate) => {
  const today = new Date();
  const checkDate = new Date(date);
  const start = new Date(startDate);
  today.setHours(23, 59, 59, 999);
  checkDate.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  if (checkDate > today) return false;
  if (checkDate.getDay() === 0) return false;
  if (checkDate < start) return false;
  return true;
};

// Generate analysis
export const generateAnalysis = (student) => {
  const thresholds = [55, 65, 75];
  const analysis = {};
  thresholds.forEach(threshold => {
    const classesNeeded = calculateClassesNeeded(student.totalPresent, student.totalPeriods, threshold);
    const classesCanMiss = calculateClassesCanMiss(student.totalPresent, student.totalPeriods, threshold);
    analysis[threshold] = {
      classesNeeded,
      classesCanMiss,
      currentStatus: parseFloat(student.percentage) >= threshold ? 'Safe' : 'At Risk'
    };
  });
  return analysis;
};