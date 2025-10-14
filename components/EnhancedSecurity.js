import { useEffect } from 'react';

export default function EnhancedSecurity() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+P
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+A (Select All)
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag and drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection on mobile
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Screenshot detection (basic)
    const handleKeyUp = (e) => {
      // Print Screen
      if (e.keyCode === 44) {
        console.warn('Screenshot attempt detected');
      }
    };

    // Disable developer tools detection (disabled for production)
    // let devtools = { open: false, orientation: null };
    // const threshold = 160;
    // setInterval(() => {
    //   if (window.outerHeight - window.innerHeight > threshold || 
    //       window.outerWidth - window.innerWidth > threshold) {
    //     if (!devtools.open) {
    //       devtools.open = true;
    //       console.warn('Developer tools detected');
    //     }
    //   } else {
    //     devtools.open = false;
    //   }
    // }, 500);

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Disable copy paste
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', (e) => e.preventDefault());
      document.removeEventListener('paste', (e) => e.preventDefault());
      document.removeEventListener('cut', (e) => e.preventDefault());
    };
  }, []);

  return null;
}