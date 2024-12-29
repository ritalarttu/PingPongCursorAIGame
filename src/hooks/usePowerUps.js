import { useState, useEffect } from 'react';
import { POWER_UPS } from '../constants/gameConstants';

export const usePowerUps = (gameStarted, gameMode, gameOver, isPaused, dimensions) => {
  const [activePowerUps, setActivePowerUps] = useState({ player: [], ai: [] });
  const [visiblePowerUp, setVisiblePowerUp] = useState(null);

  // Power-up spawn timer
  useEffect(() => {
    if (gameStarted && gameMode === 'power_up' && !gameOver && !isPaused) {
      const spawnInterval = setInterval(() => {
        if (!visiblePowerUp) {
          const powerUpTypes = Object.keys(POWER_UPS);
          const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          setVisiblePowerUp({
            type: randomType,
            x: dimensions.GAME_WIDTH * (0.25 + Math.random() * 0.5),
            y: dimensions.GAME_HEIGHT * (0.25 + Math.random() * 0.5)
          });
        }
      }, 5000);

      return () => clearInterval(spawnInterval);
    }
  }, [gameStarted, gameMode, gameOver, isPaused, visiblePowerUp, dimensions]);

  const checkPowerUpCollision = (ballX, ballY, ballDirection) => {
    if (visiblePowerUp && 
        Math.abs(ballX - visiblePowerUp.x) < dimensions.BALL_SIZE * 2 &&
        Math.abs(ballY - visiblePowerUp.y) < dimensions.BALL_SIZE * 2) {
      const collector = ballDirection.x > 0 ? 'player' : 'ai';
      activatePowerUp(visiblePowerUp.type, collector);
      setVisiblePowerUp(null);
    }
  };

  const activatePowerUp = (type, collector) => {
    const powerUp = {
      type,
      id: Date.now()
    };

    setActivePowerUps(prev => ({
      ...prev,
      [collector]: [...prev[collector], powerUp]
    }));

    setTimeout(() => {
      setActivePowerUps(prev => ({
        ...prev,
        [collector]: prev[collector].filter(p => p.id !== powerUp.id)
      }));
    }, POWER_UPS[type].duration);
  };

  const getPowerUpEffects = (side) => {
    const effects = { paddleHeight: 1, speed: 1 };
    const opponent = side === 'player' ? 'ai' : 'player';
    
    // Apply own power-ups
    activePowerUps[side].forEach(powerUp => {
      switch (powerUp.type) {
        case 'GIANT_PADDLE':
          effects.paddleHeight *= 2;
          break;
        case 'SPEED_UP':
          effects.speed *= 1.5;
          break;
        case 'SLOW_MOTION':
          // Now affects opponent instead of self
          break;
        case 'TINY_OPPONENT':
          break;
        default:
          break;
      }
    });

    // Apply opponent's effects
    activePowerUps[opponent].forEach(powerUp => {
      switch (powerUp.type) {
        case 'SLOW_MOTION':
          effects.speed *= 0.5;
          break;
        case 'TINY_OPPONENT':
          effects.paddleHeight *= 0.5;
          break;
        default:
          break;
      }
    });

    return effects;
  };

  return {
    activePowerUps,
    visiblePowerUp,
    checkPowerUpCollision,
    getPowerUpEffects
  };
}; 