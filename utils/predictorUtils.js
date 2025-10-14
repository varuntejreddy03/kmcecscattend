// Attendance prediction utilities

export const calculatePredictedAttendance = (currentPresent, currentTotal, newPresent, newTotal) => {
  const totalPresent = currentPresent + newPresent;
  const totalPeriods = currentTotal + newTotal;
  return ((totalPresent / totalPeriods) * 100).toFixed(2);
};

export const getAttendanceStatus = (percentage, threshold = 75) => {
  if (percentage >= threshold + 5) {
    return { 
      status: 'safe', 
      message: '✅ Safe to skip today!', 
      color: '#4CAF50' 
    };
  } else if (percentage >= threshold) {
    return { 
      status: 'warning', 
      message: '⚠️ Better attend! You\'re close to shortage.', 
      color: '#FF9800' 
    };
  } else {
    return { 
      status: 'critical', 
      message: '🚨 Critical! Must attend to avoid shortage.', 
      color: '#F44336' 
    };
  }
};

export const calculateClassesNeeded = (currentPresent, currentTotal, targetPercentage) => {
  const target = targetPercentage / 100;
  
  // If already above target
  if ((currentPresent / currentTotal) >= target) {
    return 0;
  }
  
  // Calculate classes needed: (currentPresent + x) / (currentTotal + x) = target
  // Solving: currentPresent + x = target * (currentTotal + x)
  // x = (target * currentTotal - currentPresent) / (1 - target)
  
  const classesNeeded = Math.ceil((target * currentTotal - currentPresent) / (1 - target));
  return Math.max(0, classesNeeded);
};

export const calculateClassesCanMiss = (currentPresent, currentTotal, minPercentage) => {
  const minTarget = minPercentage / 100;
  
  // If already below minimum
  if ((currentPresent / currentTotal) <= minTarget) {
    return 0;
  }
  
  // Calculate maximum classes that can be missed while staying above minimum
  // (currentPresent) / (currentTotal + x) = minTarget
  // Solving: currentPresent = minTarget * (currentTotal + x)
  // x = (currentPresent / minTarget) - currentTotal
  
  const maxTotal = Math.floor(currentPresent / minTarget);
  const canMiss = Math.max(0, maxTotal - currentTotal);
  
  return canMiss;
};

export const simulateAttendanceScenarios = (currentPresent, currentTotal, scenarios) => {
  return scenarios.map(scenario => {
    const { days, periodsPerDay, attendPerDay, name } = scenario;
    const totalNewPeriods = days * periodsPerDay;
    const totalNewPresent = days * attendPerDay;
    
    const newPresent = currentPresent + totalNewPresent;
    const newTotal = currentTotal + totalNewPeriods;
    const newPercentage = parseFloat(calculatePredictedAttendance(currentPresent, currentTotal, totalNewPresent, totalNewPeriods));
    const change = newPercentage - ((currentPresent / currentTotal) * 100);
    
    return {
      ...scenario,
      result: {
        percentage: newPercentage,
        change: parseFloat(change.toFixed(2)),
        newPresent,
        newTotal
      }
    };
  });
};

export const getRecommendations = (currentPresent, currentTotal, targetPercentage = 75) => {
  const currentPercentage = (currentPresent / currentTotal) * 100;
  const recommendations = [];
  
  if (currentPercentage >= targetPercentage + 10) {
    recommendations.push({
      type: 'success',
      message: `Excellent! You're ${(currentPercentage - targetPercentage).toFixed(1)}% above target.`,
      action: 'You can afford to miss a few classes if needed.'
    });
  } else if (currentPercentage >= targetPercentage + 5) {
    recommendations.push({
      type: 'success',
      message: `Good! You're ${(currentPercentage - targetPercentage).toFixed(1)}% above target.`,
      action: 'Maintain regular attendance to stay safe.'
    });
  } else if (currentPercentage >= targetPercentage) {
    recommendations.push({
      type: 'warning',
      message: `Close to target! Only ${(currentPercentage - targetPercentage).toFixed(1)}% buffer.`,
      action: 'Attend regularly to maintain your percentage.'
    });
  } else {
    const classesNeeded = calculateClassesNeeded(currentPresent, currentTotal, targetPercentage);
    recommendations.push({
      type: 'danger',
      message: `Below target by ${(targetPercentage - currentPercentage).toFixed(1)}%!`,
      action: `Need to attend ${classesNeeded} more classes to reach ${targetPercentage}%.`
    });
  }
  
  return recommendations;
};

export const formatAttendanceData = (present, total) => {
  const percentage = ((present / total) * 100).toFixed(2);
  return {
    present,
    total,
    percentage: parseFloat(percentage),
    status: getAttendanceStatus(parseFloat(percentage))
  };
};