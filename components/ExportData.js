import { useState } from 'react';

export default function ExportData({ students }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('all');

  const exportToCSV = (data, filename) => {
    const headers = ['Hall Ticket', 'Name', 'Section', 'Present', 'Total', 'Percentage', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(student => [
        student.hallticket,
        `"${student.studentName}"`,
        student.section || 'N/A',
        student.totalPresent,
        student.totalPeriods,
        student.percentage,
        parseFloat(student.percentage) >= 75 ? 'Good' : parseFloat(student.percentage) >= 65 ? 'Average' : 'Poor'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    let dataToExport = students;
    
    if (exportType === 'good') {
      dataToExport = students.filter(s => parseFloat(s.percentage) >= 75);
    } else if (exportType === 'average') {
      dataToExport = students.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75);
    } else if (exportType === 'poor') {
      dataToExport = students.filter(s => parseFloat(s.percentage) < 65);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `attendance_${exportType}_${timestamp}.${exportFormat}`;
    
    exportToCSV(dataToExport, filename);
  };

  return (
    <div className="card">
      <h3>📊 Export Data</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label>Export Type:</label>
          <select 
            value={exportType} 
            onChange={(e) => setExportType(e.target.value)}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <option value="all">All Students</option>
            <option value="good">Good Attendance (≥75%)</option>
            <option value="average">Average Attendance (65-75%)</option>
            <option value="poor">Poor Attendance (&lt;65%)</option>
          </select>
        </div>
        
        <div>
          <label>Format:</label>
          <select 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      <button 
        className="btn" 
        onClick={handleExport}
        style={{ width: '100%' }}
      >
        📥 Export Data
      </button>
    </div>
  );
}