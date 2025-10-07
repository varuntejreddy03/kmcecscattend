export default function PrintReport({ students, selectedSection = 'all' }) {
  const handlePrint = () => {
    const filteredStudents = selectedSection === 'all' ? 
      students : students.filter(s => s.section === selectedSection);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report - ${selectedSection === 'all' ? 'All Sections' : selectedSection}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .stat { text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .good { color: #28a745; }
          .warning { color: #ffc107; }
          .danger { color: #dc3545; }
          @media print { 
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Attendance Report</h1>
          <h2>${selectedSection === 'all' ? 'All Sections' : selectedSection}</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${filteredStudents.length}</h3>
            <p>Total Students</p>
          </div>
          <div class="stat">
            <h3>${filteredStudents.filter(s => parseFloat(s.percentage) >= 75).length}</h3>
            <p>Good (≥75%)</p>
          </div>
          <div class="stat">
            <h3>${filteredStudents.filter(s => parseFloat(s.percentage) >= 65 && parseFloat(s.percentage) < 75).length}</h3>
            <p>Average (65-75%)</p>
          </div>
          <div class="stat">
            <h3>${filteredStudents.filter(s => parseFloat(s.percentage) < 65).length}</h3>
            <p>Poor (<65%)</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Hall Ticket</th>
              <th>Student Name</th>
              <th>Section</th>
              <th>Present</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents
              .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
              .map((student, index) => {
                const percentage = parseFloat(student.percentage);
                const statusClass = percentage >= 75 ? 'good' : percentage >= 65 ? 'warning' : 'danger';
                const status = percentage >= 75 ? 'Good' : percentage >= 65 ? 'Average' : 'Poor';
                
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${student.hallticket}</td>
                    <td>${student.studentName}</td>
                    <td>${student.section || 'N/A'}</td>
                    <td>${student.totalPresent}</td>
                    <td>${student.totalPeriods}</td>
                    <td class="${statusClass}">${student.percentage}%</td>
                    <td class="${statusClass}">${status}</td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <button 
      className="btn btn-secondary" 
      onClick={handlePrint}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '10px 16px'
      }}
    >
      🖨️ Print Report
    </button>
  );
}