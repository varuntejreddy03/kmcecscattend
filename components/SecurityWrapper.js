import { useEffect, useState } from 'react';

const SecurityWrapper = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Temporarily allow right-click for testing
    const handleContextMenu = (e) => {
      // Allow right-click for now
      return true;
    };

    // Temporarily disable dev tools blocking for testing
    const handleKeyDown = (e) => {
      // Only block screenshot shortcuts, allow dev tools for now
      if (
        (e.key === 'PrintScreen' || e.keyCode === 44 || e.which === 44) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 3000);
        return false;
      }
    };

    // Disable text selection and copy
    const handleSelectStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 2000);
      return false;
    };

    // Disable screenshot API
    const disableScreenshot = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = () => {
          setIsBlocked(true);
          setTimeout(() => setIsBlocked(false), 2000);
          return Promise.reject(new Error('Screen capture blocked'));
        };
      }
    };

    // Detect iOS Chrome and block access
    const isIOSChrome = () => {
      const userAgent = navigator.userAgent;
      return /CriOS/.test(userAgent) && /iPhone|iPad|iPod/.test(userAgent);
    };

    // Block iOS Chrome
    if (isIOSChrome()) {
      document.body.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f44336;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1>🚫 Access Denied</h1>
            <p>This application is not supported on iOS Chrome.</p>
            <p>Please use Safari or another browser.</p>
          </div>
        </div>
      `;
      return;
    }

    // Disable screenshot API
    disableScreenshot();

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
    document.addEventListener('keyup', handleKeyDown, { passive: false, capture: true });
    document.addEventListener('selectstart', handleSelectStart, { passive: false });
    document.addEventListener('copy', handleCopy, { passive: false });
    document.addEventListener('cut', handleCopy, { passive: false });
    document.addEventListener('paste', handleCopy, { passive: false });

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, { passive: false });
    
    // Disable image saving and right click on images
    document.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'IMG' || e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });

    // Block screenshot attempts
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setTimeout(() => {
          if (document.hidden) {
            setIsBlocked(true);
            setTimeout(() => setIsBlocked(false), 2000);
          }
        }, 100);
      }
    });

    // Disable print
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 2000);
      return false;
    });

    // Blur detection for screen recording prevention
    let blurTimeout;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurTimeout = setTimeout(() => {
          // Optional: Clear sensitive data when tab is hidden
          console.log('Tab hidden - potential screen recording');
        }, 1000);
      } else {
        clearTimeout(blurTimeout);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {children}
      {isBlocked && (
        <div className="security-warning">
          🚫 Action blocked for security reasons
        </div>
      )}
      
      <style jsx>{`
        .security-warning {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #f44336;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          z-index: 99999;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
          border: 1px solid #d32f2f;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        :global(body) {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          pointer-events: auto !important;
        }

        :global(*) {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
        }

        :global(input), :global(textarea) {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        :global(img) {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
        }
      `}</style>
    </>
  );
};

export default SecurityWrapper;