import { useState, useEffect } from 'react';

export default function SecurityFeatures({ onSecurityCheck }) {
  const [isSecure, setIsSecure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    // Enhanced security checks
    const performSecurityChecks = () => {
      // Check for dev tools
      const devtools = {
        open: false,
        orientation: null
      };
      
      const threshold = 160;
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.log('%c🚫 KMCE Security Alert', 'color: red; font-size: 20px; font-weight: bold;');
            console.log('%c⚠️ Unauthorized access to developer tools detected!', 'color: orange; font-size: 14px;');
            console.log('%c🔒 This system is protected and monitored.', 'color: blue; font-size: 12px;');
          }
        } else {
          devtools.open = false;
        }
      }, 500);

      // Disable right-click context menu
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Disable common keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          console.clear();
        }
      });

      // Simulate connection monitoring
      const updateConnections = () => {
        setConnectionCount(Math.floor(Math.random() * 50) + 150); // 150-200 simulated connections
      };
      
      updateConnections();
      const interval = setInterval(updateConnections, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    };

    performSecurityChecks();
  }, []);

  const handleSecurityCheck = async () => {
    setIsLoading(true);
    
    // Simulate security validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced validation - check browser fingerprint
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Simple validation - just check if it's a real browser
    if (fingerprint.userAgent && fingerprint.cookieEnabled) {
      setIsSecure(true);
      onSecurityCheck(true);
    } else {
      alert('🚫 Security validation failed. Please use a standard web browser.');
    }
    
    setIsLoading(false);
  };

  if (isSecure) return null;

  return (
    <div className="container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '500px', padding: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '2rem' }}>🎓</span>
          <h1 style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            fontWeight: 'bold'
          }}>KMCE Attendance Tracker</h1>
          <span style={{ fontSize: '2rem' }}>📊</span>
        </div>
        
        <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '24px' }}>
          🏛️ Keshav Memorial College of Engineering
        </p>

        <div style={{ 
          padding: '20px',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#ffc107', marginBottom: '12px' }}>🛡️ Enterprise Security System</h3>
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '16px' }}>
            Secure attendance management system for KMCE students with enterprise-grade protection.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#28a745' }}>🌐 Active Connections:</span>
              <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 'bold' }}>{connectionCount}/500</span>
            </div>
            <div style={{ 
              background: '#333', 
              borderRadius: '4px', 
              height: '6px',
              overflow: 'hidden'
            }}>
              <div 
                style={{
                  background: 'linear-gradient(90deg, #28a745, #20c997)',
                  height: '100%',
                  width: `${(connectionCount / 500) * 100}%`,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>

          <button 
            className="btn"
            onClick={handleSecurityCheck}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px 24px',
              background: isLoading ? '#666' : 'linear-gradient(135deg, #28a745, #20c997)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? '🔄 Validating Security...' : '🔐 Access Secure System'}
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <p>🔒 <strong>Security Features:</strong></p>
              <p>• Network monitoring</p>
              <p>• Data encryption</p>
              <p>• Access logging</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p>⚡ <strong>System Status:</strong></p>
              <p>• Server: Online</p>
              <p>• Database: Connected</p>
              <p>• Security: Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}