import { useState, useEffect } from 'react';

const DailyPredictor = ({ currentAttendance }) => {
  const [selectedPeriods, setSelectedPeriods] = useState(Array(8).fill(false));
  const [prediction, setPrediction] = useState(null);

  // Calculate predicted attendance
  const calculatePrediction = (periods) => {
    if (!currentAttendance) return null;
    
    const attendingToday = periods.filter(p => p).length;
    const totalToday = 8;
    
    const newPresent = currentAttendance.totalPresent + attendingToday;
    const newTotal = currentAttendance.totalPeriods + totalToday;
    const newPercentage = ((newPresent / newTotal) * 100).toFixed(2);
    
    return {
      current: parseFloat(currentAttendance.percentage),
      predicted: parseFloat(newPercentage),
      attending: attendingToday,
      missing: totalToday - attendingToday
    };
  };

  useEffect(() => {
    setPrediction(calculatePrediction(selectedPeriods));
  }, [selectedPeriods, currentAttendance]);

  const togglePeriod = (index) => {
    const newPeriods = [...selectedPeriods];
    newPeriods[index] = !newPeriods[index];
    setSelectedPeriods(newPeriods);
  };

  const markAll = (present) => {
    setSelectedPeriods(Array(8).fill(present));
  };

  const getStatusMessage = () => {
    if (!prediction) return '';
    
    if (prediction.predicted >= 75) {
      return { text: '✅ Safe to skip today!', color: '#4CAF50' };
    } else if (prediction.predicted >= 70) {
      return { text: '⚠️ Better attend! You\'re close to shortage.', color: '#FF9800' };
    } else {
      return { text: '🚨 Critical! Must attend to avoid shortage.', color: '#F44336' };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="daily-predictor">
      <h3>Daily Attendance Predictor</h3>
      
      <div className="period-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="period-item">
            <label>
              <input
                type="checkbox"
                checked={selectedPeriods[i]}
                onChange={() => togglePeriod(i)}
              />
              Period {i + 1}
            </label>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button onClick={() => markAll(true)} className="btn-present">
          Mark All Present
        </button>
        <button onClick={() => markAll(false)} className="btn-absent">
          Mark All Absent
        </button>
      </div>

      {prediction && (
        <div className="prediction-results">
          <div className="percentage-display">
            <div className="current">
              Current: <span>{prediction.current}%</span>
            </div>
            <div className="predicted">
              Predicted: <span>{prediction.predicted}%</span>
            </div>
          </div>
          
          <div className="attendance-summary">
            Attending: {prediction.attending}/8 | Missing: {prediction.missing}/8
          </div>
          
          {status && (
            <div className="status-message" style={{ color: status.color }}>
              {status.text}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .daily-predictor {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .period-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin: 20px 0;
        }

        .period-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .period-item label:hover {
          background-color: #f5f5f5;
        }

        .period-item input[type="checkbox"]:checked + span {
          font-weight: bold;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .btn-present, .btn-absent {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-present {
          background-color: #4CAF50;
          color: white;
        }

        .btn-absent {
          background-color: #F44336;
          color: white;
        }

        .prediction-results {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
        }

        .percentage-display {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .current span, .predicted span {
          font-weight: bold;
          font-size: 1.2em;
        }

        .attendance-summary {
          text-align: center;
          margin: 10px 0;
          font-weight: bold;
        }

        .status-message {
          text-align: center;
          font-weight: bold;
          font-size: 1.1em;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .period-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .percentage-display {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default DailyPredictor;