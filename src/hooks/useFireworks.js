import { useState, useEffect, useRef } from 'react';

export const useFireworks = (showCredits) => {
  const [fireworks, setFireworks] = useState([]);
  const fireworksTimeoutRef = useRef(null);

  useEffect(() => {
    if (showCredits) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds duration
      
      const createRandomFirework = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          createFirework();
          fireworksTimeoutRef.current = setTimeout(createRandomFirework, 500 + Math.random() * 1000);
        }
      };
      createRandomFirework();
    }
    return () => {
      if (fireworksTimeoutRef.current) {
        clearTimeout(fireworksTimeoutRef.current);
      }
      setFireworks([]);
    };
  }, [showCredits]);

  const createFirework = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2); // Keep fireworks in top half
    const id = Date.now() + Math.random();
    setFireworks(prev => [...prev, { id, x, y }]);
    
    // Remove firework after animation
    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => fw.id !== id));
    }, 2000);
  };

  return { fireworks };
}; 