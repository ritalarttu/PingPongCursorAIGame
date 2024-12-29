import { useEffect } from 'react';
import { GAME_MODES, BALL_SPEED_INCREASE, AI_DIFFICULTIES } from '../constants/gameConstants';
import { calculateBounceAngle, predictBallPosition } from '../utils/gameUtils';

export const useGameLoop = ({
  gameStarted,
  isPaused,
  gameOver,
  pointCooldown,
  dimensions,
  gameMode,
  aiDifficulty,
  keysPressed,
  playerPosition,
  setPlayerPosition,
  aiPosition,
  setAiPosition,
  ballPosition,
  setBallPosition,
  ballDirection,
  setBallDirection,
  speedMultiplier,
  setSpeedMultiplier,
  score,
  setScore,
  winningScore,
  setGameOver,
  resetBall,
  getPowerUpEffects,
  checkPowerUpCollision
}) => {
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver && !pointCooldown) {
      const gameLoopRef = setInterval(() => {
        // Get current power-up effects
        const playerEffects = getPowerUpEffects('player');
        const aiEffects = getPowerUpEffects('ai');

        // AI movements with power-up effects
        if (gameMode === GAME_MODES.AI_SHOWMATCH) {
          // Left AI movement
          setPlayerPosition(current => {
            const ballY = ballPosition.y;
            let targetY = ballY;
            
            if (ballDirection.x < 0) {
              targetY = predictBallPosition(
                ballPosition,
                ballDirection,
                dimensions.BALL_SPEED * speedMultiplier,
                dimensions
              );
            }

            const diff = targetY - current;
            const moveAmount = dimensions.BALL_SPEED * AI_DIFFICULTIES.HARD.reactionSpeed;

            if (Math.abs(diff) > dimensions.PADDLE_HEIGHT / 4) {
              return diff > 0 
                ? Math.min(current + moveAmount, dimensions.GAME_HEIGHT - dimensions.PADDLE_HEIGHT/2)
                : Math.max(current - moveAmount, dimensions.PADDLE_HEIGHT/2);
            }
            return current;
          });

          // Right AI movement
          setAiPosition(current => {
            const ballY = ballPosition.y;
            let targetY = ballY;
            
            if (ballDirection.x > 0) {
              targetY = predictBallPosition(
                ballPosition,
                ballDirection,
                dimensions.BALL_SPEED * speedMultiplier,
                dimensions
              );
            }

            const diff = targetY - current;
            const moveAmount = dimensions.BALL_SPEED * AI_DIFFICULTIES.HARD.reactionSpeed;

            if (Math.abs(diff) > dimensions.PADDLE_HEIGHT / 4) {
              return diff > 0 
                ? Math.min(current + moveAmount, dimensions.GAME_HEIGHT - dimensions.PADDLE_HEIGHT/2)
                : Math.max(current - moveAmount, dimensions.PADDLE_HEIGHT/2);
            }
            return current;
          });
        } else {
          // Player 1 movement (W/S keys) with power-up effects
          if (keysPressed.current.has('w')) {
            setPlayerPosition(prev => 
              Math.max(dimensions.PADDLE_HEIGHT * playerEffects.paddleHeight/2, 
                prev - dimensions.PADDLE_SPEED * playerEffects.speed)
            );
          }
          if (keysPressed.current.has('s')) {
            setPlayerPosition(prev => 
              Math.min(dimensions.GAME_HEIGHT - dimensions.PADDLE_HEIGHT * playerEffects.paddleHeight/2, 
                prev + dimensions.PADDLE_SPEED * playerEffects.speed)
            );
          }

          // Player 2 / AI movement with power-up effects
          if (gameMode === GAME_MODES.LOCAL_MULTI) {
            if (keysPressed.current.has('arrowup')) {
              setAiPosition(prev => 
                Math.max(dimensions.PADDLE_HEIGHT * aiEffects.paddleHeight/2, 
                  prev - dimensions.PADDLE_SPEED * aiEffects.speed)
              );
            }
            if (keysPressed.current.has('arrowdown')) {
              setAiPosition(prev => 
                Math.min(dimensions.GAME_HEIGHT - dimensions.PADDLE_HEIGHT * aiEffects.paddleHeight/2, 
                  prev + dimensions.PADDLE_SPEED * aiEffects.speed)
              );
            }
          } else {
            // AI movement with power-up effects
            setAiPosition(current => {
              const ballY = ballPosition.y;
              let targetY = ballY;
              
              if (aiDifficulty.predictionFactor > 0 && ballDirection.x > 0) {
                targetY = predictBallPosition(
                  ballPosition,
                  ballDirection,
                  dimensions.BALL_SPEED * speedMultiplier,
                  dimensions
                );
              }

              const diff = targetY - current;
              const moveAmount = dimensions.BALL_SPEED * aiDifficulty.reactionSpeed * aiEffects.speed;

              if (Math.abs(diff) > dimensions.PADDLE_HEIGHT * aiEffects.paddleHeight / 4) {
                return diff > 0 
                  ? Math.min(current + moveAmount, dimensions.GAME_HEIGHT - dimensions.PADDLE_HEIGHT * aiEffects.paddleHeight/2)
                  : Math.max(current - moveAmount, dimensions.PADDLE_HEIGHT * aiEffects.paddleHeight/2);
              }
              return current;
            });
          }
        }

        setBallPosition(prevBall => {
          const nextX = prevBall.x + (dimensions.BALL_SPEED * speedMultiplier) * ballDirection.x;
          const nextY = prevBall.y + (dimensions.BALL_SPEED * speedMultiplier) * ballDirection.y;

          // Check for power-up collision
          if (gameMode === GAME_MODES.POWER_UP) {
            checkPowerUpCollision(nextX, nextY, ballDirection);
          }

          // Check for scoring
          if (nextX <= 0) {
            setScore(prev => {
              const newScore = { ...prev, ai: prev.ai + 1 };
              if (newScore.ai >= winningScore && 
                  (newScore.ai - newScore.player) >= 2) {
                setGameOver(true);
                setIsPaused(true);
              }
              return newScore;
            });
            resetBall();
            return ballPosition;
          }
          
          if (nextX >= dimensions.GAME_WIDTH) {
            setScore(prev => {
              const newScore = { ...prev, player: prev.player + 1 };
              if (newScore.player >= winningScore && 
                  (newScore.player - newScore.ai) >= 2) {
                setGameOver(true);
                setIsPaused(true);
              }
              return newScore;
            });
            resetBall();
            return ballPosition;
          }

          // Check for collisions with paddles
          const VERTICAL_HITBOX_BUFFER = 15; // pixels of extra hitbox above and below paddle
          if (nextX <= dimensions.PADDLE_WIDTH + dimensions.BALL_SIZE && 
              nextY >= playerPosition - dimensions.PADDLE_HEIGHT/2 - VERTICAL_HITBOX_BUFFER && 
              nextY <= playerPosition + dimensions.PADDLE_HEIGHT/2 + VERTICAL_HITBOX_BUFFER) {
            const newBounceAngle = calculateBounceAngle(
              playerPosition - dimensions.PADDLE_HEIGHT/2,
              nextY,
              dimensions.PADDLE_HEIGHT
            );
            setSpeedMultiplier(prev => prev * BALL_SPEED_INCREASE);
            setBallDirection({
              x: Math.abs(ballDirection.x),
              y: newBounceAngle
            });
          }
          
          if (nextX >= dimensions.GAME_WIDTH - dimensions.PADDLE_WIDTH - dimensions.BALL_SIZE && 
              nextY >= aiPosition - dimensions.PADDLE_HEIGHT/2 - VERTICAL_HITBOX_BUFFER && 
              nextY <= aiPosition + dimensions.PADDLE_HEIGHT/2 + VERTICAL_HITBOX_BUFFER) {
            const newBounceAngle = calculateBounceAngle(
              aiPosition - dimensions.PADDLE_HEIGHT/2,
              nextY,
              dimensions.PADDLE_HEIGHT
            );
            setSpeedMultiplier(prev => prev * BALL_SPEED_INCREASE);
            setBallDirection({
              x: -Math.abs(ballDirection.x),
              y: newBounceAngle
            });
          }

          // Check for collisions with top and bottom walls
          if (nextY <= 0 || nextY >= dimensions.GAME_HEIGHT) {
            setBallDirection(prev => ({ ...prev, y: -prev.y }));
          }

          return {
            x: nextX,
            y: nextY
          };
        });
      }, 16);

      return () => clearInterval(gameLoopRef);
    }
  }, [
    gameStarted,
    isPaused,
    gameOver,
    ballDirection,
    playerPosition,
    aiPosition,
    ballPosition,
    speedMultiplier,
    gameMode,
    winningScore,
    aiDifficulty,
    pointCooldown,
    dimensions,
    getPowerUpEffects,
    checkPowerUpCollision,
    resetBall,
    setBallDirection,
    setSpeedMultiplier,
    setScore,
    setGameOver,
    setPlayerPosition,
    setAiPosition,
    setBallPosition,
    keysPressed
  ]);
}; 