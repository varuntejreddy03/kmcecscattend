import { useEffect } from 'react';

export default function SiteProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable copy/paste/cut
    const disableCopyPaste = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 's')) {
        e.preventDefault();
        return false;
      }
    };

    // Disable developer tools shortcuts
    const disableDevTools = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U, Ctrl+Shift+J
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    };

    // Disable drag and drop
    const disableDragDrop = (e) => {
      e.preventDefault();
      return false;
    };

    // Advanced protection features
    const clearConsole = () => {
      console.clear();
      console.log('%c🛡️ KMCE Security Protection Active', 'color: red; font-size: 16px; font-weight: bold;');
    };

    // Detect dev tools opening
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;color:red;">🚫 Unauthorized Access Detected</div>';
      }
    };

    // Disable print screen
    const disablePrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('');
      }
    };

    // Blur content when window loses focus
    const blurOnFocusLoss = () => {
      document.body.style.filter = 'blur(5px)';
    };

    const unblurOnFocus = () => {
      document.body.style.filter = 'none';
    };

    // Disable zoom
    const disableZoom = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    };



    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableCopyPaste);
    document.addEventListener('keydown', disableDevTools);
    document.addEventListener('keydown', disablePrintScreen);
    document.addEventListener('keydown', disableZoom);
    document.addEventListener('dragstart', disableDragDrop);
    document.addEventListener('drop', disableDragDrop);
    document.addEventListener('selectstart', disableRightClick);
    window.addEventListener('blur', blurOnFocusLoss);
    window.addEventListener('focus', unblurOnFocus);
    window.addEventListener('resize', detectDevTools);

    // Apply styles and protections
    disableSelection();

    // Clear console every 3 seconds
    const consoleInterval = setInterval(clearConsole, 3000);
    const devToolsInterval = setInterval(detectDevTools, 1000);
    clearConsole();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableCopyPaste);
      document.removeEventListener('keydown', disableDevTools);
      document.removeEventListener('keydown', disablePrintScreen);
      document.removeEventListener('keydown', disableZoom);
      document.removeEventListener('dragstart', disableDragDrop);
      document.removeEventListener('drop', disableDragDrop);
      document.removeEventListener('selectstart', disableRightClick);
      window.removeEventListener('blur', blurOnFocusLoss);
      window.removeEventListener('focus', unblurOnFocus);
      window.removeEventListener('resize', detectDevTools);
      clearInterval(consoleInterval);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null;
}