// Data protection utilities
export const obfuscateData = (data) => {
  // Create a deep copy to avoid mutating original data
  const obfuscated = JSON.parse(JSON.stringify(data));
  
  // Add noise data to confuse scrapers
  const noise = Array.from({length: 50}, (_, i) => ({
    studentId: 9999 + i,
    hallticket: `FAKE${i.toString().padStart(4, '0')}`,
    studentName: `DUMMY_STUDENT_${i}`,
    attendance: [],
    totalPresent: Math.floor(Math.random() * 300),
    totalPeriods: 331,
    percentage: (Math.random() * 100).toFixed(2),
    _fake: true
  }));
  
  // Shuffle real data with fake data
  const mixed = [...obfuscated, ...noise].sort(() => Math.random() - 0.5);
  
  return mixed;
};

export const deobfuscateData = (data) => {
  // Filter out fake data
  return data.filter(item => !item._fake);
};

// Lazy loading for large datasets
export const paginateData = (data, page = 1, limit = 50) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: data.slice(startIndex, endIndex),
    totalPages: Math.ceil(data.length / limit),
    currentPage: page,
    hasMore: endIndex < data.length
  };
};

// Memory optimization
export const memoizeData = (() => {
  const cache = new Map();
  const maxCacheSize = 10;
  
  return (key, data) => {
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, data);
    return data;
  };
})();