import { useEffect } from 'react';
import { getGameDimensions } from '../utils/gameUtils';

export const useWindowResize = (dimensions, resetPositions) => {
  useEffect(() => {
    const handleResize = () => {
      dimensions.current = getGameDimensions();
      resetPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions, resetPositions]);
}; 