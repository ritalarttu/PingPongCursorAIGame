import { useEffect, useRef } from 'react';

export const useGameControls = (setIsPaused) => {
  const keysPressed = useRef(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      // Handle pause
      if (key === 'escape') {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIsPaused]);

  return keysPressed;
}; 