# Attendance Tracker

A comprehensive Next.js application for tracking student attendance with advanced analytics and insights.

## Features

### 📊 CSV Data Import
- Import attendance data from JSON file
- Automatic calculation of attendance percentages
- Real-time data processing

### 🎯 Attendance Goals
- Set target attendance percentage (55%, 65%, 75%, 80%, 85%, 90%)
- Track progress towards goals
- Analysis for different thresholds

### 📅 Daily Attendance
- Mark attendance for current day only
- Quick "Mark All Present/Absent" buttons
- Individual subject marking
- Date restrictions (no future dates, no Sundays)

### 📈 Advanced Analysis
- Classes needed to reach target percentage
- Classes you can miss while maintaining minimum attendance
- Multi-threshold analysis (55%, 65%, 75%)
- Goal tracking and recommendations

### 🔍 Search & Summary
- Search attendance records by date
- Detailed daily attendance breakdown
- Subject-wise attendance visualization
- Progress tracking over time

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Initial Setup**: Enter your hall ticket number to load your attendance data
2. **Set Goals**: Choose your target attendance percentage
3. **Daily Tracking**: Mark your daily attendance for each subject
4. **View Analytics**: Check insights and recommendations
5. **Monitor Progress**: Use the summary tab to track your progress

## Data Format

The application expects attendance data in the following JSON format:

```json
[
  {
    "studentId": 246,
    "hallticket": "24P85A6200",
    "studentName": "STUDENT NAME",
    "attendance": [
      {
        "subjectId": 105,
        "status": "45/49"
      }
    ],
    "totalPresent": 269,
    "totalPeriods": 324,
    "percentage": "83.02"
  }
]
```

## Subject Mapping

- 105: SKILLING
- 103: PS (Problem Solving)
- 104: FS (Full Stack)
- 110: SDC (Software Development)
- 136: EH (English & Humanities)
- 112: DBMS (Database Management)
- 124: FLAT (Formal Languages)
- 116: AI (Artificial Intelligence)
- 123: NSC (Network Security)
- 115: ACS-LAB (Advanced Computing Lab)
- 117: IPR (Intellectual Property Rights)
- 119: IDS (Information & Data Science)

## Date Restrictions

- ✅ Can mark attendance for current day
- ❌ Cannot mark attendance for future dates
- ❌ Cannot mark attendance on Sundays
- ❌ Cannot mark attendance before start date (April 29, 2025)

## Technologies Used

- **Frontend**: Next.js, React
- **Styling**: CSS (Black & White theme)
- **Data**: JSON file storage
- **Analytics**: Custom calculation utilities

## File Structure

```
attendance-tracker/
├── components/
│   ├── AttendanceSetup.js
│   ├── AttendanceStats.js
│   ├── SubjectAttendance.js
│   ├── DailyAttendance.js
│   ├── AttendanceAnalysis.js
│   └── AttendanceSummary.js
├── pages/
│   ├── _app.js
│   └── index.js
├── public/
│   └── attend.json
├── styles/
│   └── globals.css
├── utils/
│   └── attendanceUtils.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.