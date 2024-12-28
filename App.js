import React, { useState, useEffect, useRef } from 'react';

// Replace the fixed dimensions with dynamic ones
const getGameDimensions = () => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Calculate game dimensions based on viewport
  // Use 70% of viewport height as reference
  const gameHeight = Math.min(800, viewportHeight * 0.7);
  // Maintain 3:2 aspect ratio
  const gameWidth = gameHeight * 1.5;
  
  // Scale other dimensions proportionally
  const paddleHeight = gameHeight * 0.125; // 12.5% of game height
  const paddleWidth = gameWidth * 0.0125; // 1.25% of game width
  const ballSize = gameHeight * 0.025; // 2.5% of game height
  
  return {
    GAME_HEIGHT: gameHeight,
    GAME_WIDTH: gameWidth,
    PADDLE_HEIGHT: paddleHeight,
    PADDLE_WIDTH: paddleWidth,
    BALL_SIZE: ballSize,
    BALL_SPEED: gameWidth * 0.007, // Scaled speed
    PADDLE_SPEED: gameHeight * 0.01 // Scaled speed
  };
};

// Add these constants
const GAME_LENGTHS = {
  SHORT: { points: 3, name: 'Quick Game (3 Points)' },
  MEDIUM: { points: 6, name: 'Medium Game (6 Points)' },
  LONG: { points: 11, name: 'Full Game (11 Points)' }
};

// Add these constants back at the top with the others
const MAX_BOUNCE_ANGLE = Math.PI / 4; // 45 degrees
const MIN_BOUNCE_ANGLE = -Math.PI / 4; // -45 degrees
const BALL_SPEED_INCREASE = 1.1; // 10% increase per hit
const MIN_WIN_MARGIN = 2;

// Add the bounce angle calculation function back
const calculateBounceAngle = (paddleY, ballY, paddleHeight) => {
  // Calculate relative intersection (-1 to 1)
  const relativeIntersectY = (paddleY + paddleHeight/2 - ballY) / (paddleHeight/2);
  
  // Add some randomness to the bounce
  const randomFactor = (Math.random() * 0.4) - 0.2; // Random value between -0.2 and 0.2
  
  // Calculate bounce angle
  const bounceAngle = relativeIntersectY * (MAX_BOUNCE_ANGLE - MIN_BOUNCE_ANGLE) / 2;
  
  // Return y component with added randomness
  return -bounceAngle + randomFactor;
};

// Move these constants outside the component
const GAME_MODES = {
  SINGLE: 'single',
  LOCAL_MULTI: 'local_multi',
  AI_SHOWMATCH: 'ai_showmatch'
};

const AI_DIFFICULTIES = {
  EASY: { name: 'Easy', reactionSpeed: 0.5, predictionFactor: 0 },
  MEDIUM: { name: 'Medium', reactionSpeed: 1, predictionFactor: 0 },
  HARD: { name: 'Hard', reactionSpeed: 1.2, predictionFactor: 1 }
};

// Add this before additionalStyles
const staticStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#2a2a2a',
    padding: '20px 20px 480px 20px',
    boxSizing: 'border-box',
    margin: 0,
  },
  title: {
    color: '#fff',
    marginBottom: '40px',
    fontSize: '3em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  startMenu: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#fff',
    minWidth: '400px',
  },
  startButton: {
    backgroundColor: '#000',
    border: '2px solid #fff',
    color: 'white',
    padding: '20px 40px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    width: '100%',
    fontSize: '18px',
    margin: '15px 0',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  gameWrapper: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  controls: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    width: '200px',
    alignSelf: 'center',
    color: '#000',
    fontSize: '18px',
  },
  instructions: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    width: '200px',
    alignSelf: 'center',
    color: '#000',
    fontSize: '18px',
  },
  scoreBoard: {
    position: 'absolute',
    top: '20px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    gap: '200px',
    zIndex: 1,
  },
  score: {
    color: '#fff',
    fontSize: '64px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  pauseMenu: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#fff',
  },
  gameOverMenu: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#fff',
    minWidth: '300px',
  },
  button: {
    backgroundColor: '#000',
    border: '2px solid #fff',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  subtitle: {
    color: '#fff',
    marginTop: '20px',
    marginBottom: '10px',
  },
  controlsDivider: {
    height: '1px',
    backgroundColor: '#000',
    margin: '15px 0',
  },
  overtime: {
    color: '#ff4444',
    fontSize: '32px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    animation: 'pulse 1s infinite',
  },
  gameOverScore: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  gameOverMessage: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px',
  },
  pauseScore: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  instructionText: {
    fontSize: '20px',
    marginBottom: '12px',
    color: '#000',
  },
  creditsMenu: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#fff',
    minWidth: '300px',
    zIndex: 1000,
    border: '2px solid #fff',
  },
  creditsTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#fff',
  },
  creditsContent: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  menuDivider: {
    height: '2px',
    backgroundColor: '#fff',
    margin: '30px 0',
    opacity: 0.3,
    width: '100%',
  },
};

// Add this function before the App component
const getStyles = (dimensions) => ({
  gameArea: {
    position: 'relative',
    width: dimensions.GAME_WIDTH,
    height: dimensions.GAME_HEIGHT,
    backgroundColor: '#000',
    overflow: 'hidden',
    border: '4px solid #333',
    borderRadius: '8px',
  },
  paddle: {
    position: 'absolute',
    width: dimensions.PADDLE_WIDTH,
    height: dimensions.PADDLE_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  ball: {
    position: 'absolute',
    width: dimensions.BALL_SIZE,
    height: dimensions.BALL_SIZE,
    backgroundColor: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

// Update the predictBallPosition function
const predictBallPosition = (ballPos, ballDir, speed, dimensions) => {
  // Calculate distance to target paddle
  const distanceToTarget = ballDir.x > 0 
    ? dimensions.GAME_WIDTH - ballPos.x 
    : ballPos.x;

  // Calculate time to reach paddle
  const timeToReach = distanceToTarget / (speed * Math.abs(ballDir.x));
  
  // Calculate final Y position without bounces
  const finalY = ballPos.y + (ballDir.y * speed * timeToReach);
  
  // Calculate number of bounces
  const totalDistance = Math.abs(finalY);
  const gameHeight = dimensions.GAME_HEIGHT;
  const numBounces = Math.floor(totalDistance / gameHeight);
  
  // Calculate final position after bounces
  let predictedY = finalY;
  if (numBounces > 0) {
    const remainder = totalDistance % gameHeight;
    if (numBounces % 2 === 0) {
      // Even number of bounces
      predictedY = remainder;
    } else {
      // Odd number of bounces
      predictedY = gameHeight - remainder;
    }
  }

  // Keep prediction within game bounds and add padding for corners
  const paddingFromEdge = dimensions.PADDLE_HEIGHT * 0.3;
  return Math.max(
    paddingFromEdge,
    Math.min(dimensions.GAME_HEIGHT - paddingFromEdge, predictedY)
  );
};

export default function App() {
  const dimensions = useRef(getGameDimensions());

  // Define getInitialBallPos first
  const getInitialBallPos = () => ({
    x: dimensions.current.GAME_WIDTH / 2,
    y: dimensions.current.GAME_HEIGHT / 2
  });

  // Then use it in state declarations
  const [pointCooldown, setPointCooldown] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(dimensions.current.GAME_HEIGHT / 2);
  const [aiPosition, setAiPosition] = useState(dimensions.current.GAME_HEIGHT / 2);
  const [ballPosition, setBallPosition] = useState(getInitialBallPos());
  const [ballDirection, setBallDirection] = useState({ x: 1, y: 1 });
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const keysPressed = useRef(new Set());
  const gameLoopRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [menuState, setMenuState] = useState('main');
  const [gameStarted, setGameStarted] = useState(false);
  const [winningScore, setWinningScore] = useState(GAME_LENGTHS.LONG.points);
  const [gameMode, setGameMode] = useState(GAME_MODES.SINGLE);
  const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTIES.MEDIUM);
  const [showCredits, setShowCredits] = useState(false);

  // Move this inside the component, after state declarations
  const styles = {
    ...staticStyles,
    ...getStyles(dimensions.current),
    ...additionalStyles,
  };

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      dimensions.current = getGameDimensions();
      resetPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetPositions = () => {
    setPlayerPosition(dimensions.current.GAME_HEIGHT / 2);
    setAiPosition(dimensions.current.GAME_HEIGHT / 2);
    setBallPosition({
      x: dimensions.current.GAME_WIDTH / 2,
      y: dimensions.current.GAME_HEIGHT / 2
    });
  };

  const resetBall = () => {
    if (gameOver) return; // Don't reset if game is over
    
    // Center both paddles
    setPlayerPosition(dimensions.current.GAME_HEIGHT / 2);
    setAiPosition(dimensions.current.GAME_HEIGHT / 2);
    
    // Set cooldown
    setPointCooldown(true);
    setTimeout(() => {
      if (!gameOver) { // Additional check in case game ends during cooldown
        setPointCooldown(false);
        setBallPosition(getInitialBallPos());
        setSpeedMultiplier(1);
        setBallDirection({
          x: Math.random() < 0.5 ? 1 : -1,
          y: Math.random() * 2 - 1
        });
      }
    }, 1000);
  };

  const resetGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    setMenuState('main');
    resetBall();
  };

  // Update the startGame function
  const startGame = (points, mode, difficulty = AI_DIFFICULTIES.MEDIUM) => {
    setWinningScore(points);
    setGameMode(mode);
    setAiDifficulty(difficulty);
    setGameStarted(true);
    setMenuState('main');
    resetPositions();
    resetBall();
  };

  // Combined game loop for ball movement, AI, and player movement
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver && !pointCooldown) {
      gameLoopRef.current = setInterval(() => {
        // AI movements
        if (gameMode === GAME_MODES.AI_SHOWMATCH) {
          // Left AI movement
          setPlayerPosition(current => {
            const ballY = ballPosition.y;
            let targetY = ballY;
            
            if (ballDirection.x < 0) {
              // Predict ball position with wall bounces
              targetY = predictBallPosition(
                ballPosition,
                ballDirection,
                dimensions.current.BALL_SPEED * speedMultiplier,
                dimensions.current
              );
            }

            const diff = targetY - current;
            const moveAmount = dimensions.current.BALL_SPEED * AI_DIFFICULTIES.HARD.reactionSpeed;

            if (Math.abs(diff) > dimensions.current.PADDLE_HEIGHT / 4) {
              return diff > 0 
                ? Math.min(current + moveAmount, dimensions.current.GAME_HEIGHT - dimensions.current.PADDLE_HEIGHT/2)
                : Math.max(current - moveAmount, dimensions.current.PADDLE_HEIGHT/2);
            }
            return current;
          });

          // Right AI movement
          setAiPosition(current => {
            const ballY = ballPosition.y;
            let targetY = ballY;
            
            if (ballDirection.x > 0) {
              // Predict ball position with wall bounces
              targetY = predictBallPosition(
                ballPosition,
                ballDirection,
                dimensions.current.BALL_SPEED * speedMultiplier,
                dimensions.current
              );
            }

            const diff = targetY - current;
            const moveAmount = dimensions.current.BALL_SPEED * AI_DIFFICULTIES.HARD.reactionSpeed;

            if (Math.abs(diff) > dimensions.current.PADDLE_HEIGHT / 4) {
              return diff > 0 
                ? Math.min(current + moveAmount, dimensions.current.GAME_HEIGHT - dimensions.current.PADDLE_HEIGHT/2)
                : Math.max(current - moveAmount, dimensions.current.PADDLE_HEIGHT/2);
            }
            return current;
          });
        } else {
          // Player 1 movement (W/S keys)
          if (keysPressed.current.has('w')) {
            setPlayerPosition(prev => 
              Math.max(dimensions.current.PADDLE_HEIGHT/2, 
                prev - dimensions.current.PADDLE_SPEED)
            );
          }
          if (keysPressed.current.has('s')) {
            setPlayerPosition(prev => 
              Math.min(dimensions.current.GAME_HEIGHT - dimensions.current.PADDLE_HEIGHT/2, 
                prev + dimensions.current.PADDLE_SPEED)
            );
          }

          // Player 2 / AI movement
          if (gameMode === GAME_MODES.LOCAL_MULTI) {
            // Player 2 movement (Arrow keys)
            if (keysPressed.current.has('arrowup')) {
              setAiPosition(prev => 
                Math.max(dimensions.current.PADDLE_HEIGHT/2, 
                  prev - dimensions.current.PADDLE_SPEED)
              );
            }
            if (keysPressed.current.has('arrowdown')) {
              setAiPosition(prev => 
                Math.min(dimensions.current.GAME_HEIGHT - dimensions.current.PADDLE_HEIGHT/2, 
                  prev + dimensions.current.PADDLE_SPEED)
              );
            }
          } else {
            // AI movement with improved prediction
            setAiPosition(current => {
              const ballY = ballPosition.y;
              let targetY = ballY;
              
              if (aiDifficulty.predictionFactor > 0 && ballDirection.x > 0) {
                // Use the new prediction function for hard AI
                targetY = predictBallPosition(
                  ballPosition,
                  ballDirection,
                  dimensions.current.BALL_SPEED * speedMultiplier,
                  dimensions.current
                );
              }

              const diff = targetY - current;
              const moveAmount = dimensions.current.BALL_SPEED * aiDifficulty.reactionSpeed;

              if (Math.abs(diff) > dimensions.current.PADDLE_HEIGHT / 4) {
                return diff > 0 
                  ? Math.min(current + moveAmount, dimensions.current.GAME_HEIGHT - dimensions.current.PADDLE_HEIGHT/2)
                  : Math.max(current - moveAmount, dimensions.current.PADDLE_HEIGHT/2);
              }
              return current;
            });
          }
        }

        setBallPosition(prevBall => {
          const nextX = prevBall.x + (dimensions.current.BALL_SPEED * speedMultiplier) * ballDirection.x;
          const nextY = prevBall.y + (dimensions.current.BALL_SPEED * speedMultiplier) * ballDirection.y;

          // Check for scoring
          if (nextX <= 0) {
            setScore(prev => {
              const newScore = { ...prev, ai: prev.ai + 1 };
              if (newScore.ai >= winningScore && 
                  (newScore.ai - newScore.player) >= MIN_WIN_MARGIN) {
                setGameOver(true);
                setIsPaused(true);
              }
              return newScore;
            });
            resetBall();
            return getInitialBallPos();
          }
          
          if (nextX >= dimensions.current.GAME_WIDTH) {
            setScore(prev => {
              const newScore = { ...prev, player: prev.player + 1 };
              if (newScore.player >= winningScore && 
                  (newScore.player - newScore.ai) >= MIN_WIN_MARGIN) {
                setGameOver(true);
                setIsPaused(true);
              }
              return newScore;
            });
            resetBall();
            return getInitialBallPos();
          }

          // Check for collisions with paddles
          const VERTICAL_HITBOX_BUFFER = 15; // pixels of extra hitbox above and below paddle
          if (nextX <= dimensions.current.PADDLE_WIDTH + dimensions.current.BALL_SIZE && 
              nextY >= playerPosition - dimensions.current.PADDLE_HEIGHT/2 - VERTICAL_HITBOX_BUFFER && 
              nextY <= playerPosition + dimensions.current.PADDLE_HEIGHT/2 + VERTICAL_HITBOX_BUFFER) {
            const newBounceAngle = calculateBounceAngle(
              playerPosition - dimensions.current.PADDLE_HEIGHT/2,
              nextY,
              dimensions.current.PADDLE_HEIGHT
            );
            setSpeedMultiplier(prev => prev * BALL_SPEED_INCREASE);
            setBallDirection({
              x: Math.abs(ballDirection.x),
              y: newBounceAngle
            });
          }
          
          if (nextX >= dimensions.current.GAME_WIDTH - dimensions.current.PADDLE_WIDTH - dimensions.current.BALL_SIZE && 
              nextY >= aiPosition - dimensions.current.PADDLE_HEIGHT/2 - VERTICAL_HITBOX_BUFFER && 
              nextY <= aiPosition + dimensions.current.PADDLE_HEIGHT/2 + VERTICAL_HITBOX_BUFFER) {
            const newBounceAngle = calculateBounceAngle(
              aiPosition - dimensions.current.PADDLE_HEIGHT/2,
              nextY,
              dimensions.current.PADDLE_HEIGHT
            );
            setSpeedMultiplier(prev => prev * BALL_SPEED_INCREASE);
            setBallDirection({
              x: -Math.abs(ballDirection.x),
              y: newBounceAngle
            });
          }

          // Check for collisions with top and bottom walls
          if (nextY <= 0 || nextY >= dimensions.current.GAME_HEIGHT) {
            setBallDirection(prev => ({ ...prev, y: -prev.y }));
          }

          return {
            x: nextX,
            y: nextY
          };
        });
      }, 16);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameStarted, isPaused, gameOver, ballDirection, playerPosition, aiPosition, ballPosition, speedMultiplier, gameMode, winningScore, aiDifficulty, pointCooldown]);

  // Handle keyboard controls
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
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pong Game</h1>
      
      {!gameStarted ? (
        <div style={styles.startMenu}>
          {menuState === 'main' && (
            <>
              <h2>Select Game Mode</h2>
              <button
                style={styles.startButton}
                onClick={() => setMenuState('mode_select')}
              >
                Single Player vs AI
              </button>
              <button
                style={styles.startButton}
                onClick={() => setMenuState('local_multi_select')}
              >
                Local Multiplayer
              </button>
              <button
                style={styles.startButton}
                onClick={() => {
                  startGame(GAME_LENGTHS.LONG.points, GAME_MODES.AI_SHOWMATCH);
                }}
              >
                Watch AI Showmatch
              </button>
              
              <div style={styles.menuDivider} />
              
              <button
                style={styles.startButton}
                onClick={() => setShowCredits(true)}
              >
                Credits
              </button>
            </>
          )}

          {menuState === 'mode_select' && (
            <>
              <h3 style={styles.subtitle}>Select AI Difficulty</h3>
              {Object.entries(AI_DIFFICULTIES).map(([key, difficulty]) => (
                <button
                  key={key}
                  style={styles.startButton}
                  onClick={() => {
                    setAiDifficulty(difficulty);
                    setMenuState('single_length_select');
                  }}
                >
                  {difficulty.name}
                </button>
              ))}
              <button
                style={{...styles.startButton, backgroundColor: '#f44336'}}
                onClick={() => setMenuState('main')}
              >
                Back
              </button>
            </>
          )}

          {menuState === 'single_length_select' && (
            <>
              <h3 style={styles.subtitle}>Select Game Length</h3>
              {Object.values(GAME_LENGTHS).map((option) => (
                <button
                  key={option.points}
                  style={styles.startButton}
                  onClick={() => startGame(option.points, GAME_MODES.SINGLE, aiDifficulty)}
                >
                  {option.name}
                </button>
              ))}
              <button
                style={{...styles.startButton, backgroundColor: '#f44336'}}
                onClick={() => setMenuState('mode_select')}
              >
                Back
              </button>
            </>
          )}

          {menuState === 'local_multi_select' && (
            <>
              <h3 style={styles.subtitle}>Select Game Length</h3>
              {Object.values(GAME_LENGTHS).map((option) => (
                <button
                  key={option.points}
                  style={styles.startButton}
                  onClick={() => startGame(option.points, GAME_MODES.LOCAL_MULTI)}
                >
                  {option.name}
                </button>
              ))}
              <button
                style={{...styles.startButton, backgroundColor: '#f44336'}}
                onClick={() => setMenuState('main')}
              >
                Back
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={styles.gameWrapper}>
          <div style={styles.controls}>
            <h2>Controls</h2>
            {gameMode === GAME_MODES.AI_SHOWMATCH ? (
              <>
                <p>AI Showmatch Mode</p>
                <p>Watch two AI players compete!</p>
                <div style={styles.controlsDivider} />
                <p>ESC - Pause Game</p>
              </>
            ) : (
              <>
                <h3>Player 1</h3>
                <ul>
                  <li>W - Move Up</li>
                  <li>S - Move Down</li>
                </ul>
                {gameMode === GAME_MODES.LOCAL_MULTI && (
                  <>
                    <h3>Player 2</h3>
                    <ul>
                      <li>↑ - Move Up</li>
                      <li>↓ - Move Down</li>
                    </ul>
                  </>
                )}
                <div style={styles.controlsDivider} />
                <p>ESC - Pause Game</p>
              </>
            )}
          </div>
          
          <div style={styles.gameArea}>
            {/* Score Display */}
            <div style={styles.scoreBoard}>
              <div style={styles.score}>
                {score.player}
              </div>
              {score.player >= winningScore - 1 && 
               score.ai >= winningScore - 1 && 
               Math.abs(score.player - score.ai) < MIN_WIN_MARGIN && (
                <div style={styles.overtime}>OVERTIME!</div>
              )}
              <div style={styles.score}>
                {score.ai}
              </div>
            </div>

            {/* Player Paddle */}
            <div
              style={{
                ...styles.paddle,
                left: 0,
                top: playerPosition - dimensions.current.PADDLE_HEIGHT / 2,
              }}
            />

            {/* AI Paddle */}
            <div
              style={{
                ...styles.paddle,
                right: 0,
                top: aiPosition - dimensions.current.PADDLE_HEIGHT / 2,
              }}
            />

            {/* Ball - only show when not game over */}
            {!gameOver && (
              <div
                style={{
                  ...styles.ball,
                  left: ballPosition.x,
                  top: ballPosition.y,
                }}
              />
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div style={styles.gameOverMenu}>
                <h2>Game Over!</h2>
                <div style={styles.gameOverScore}>
                  Final Score: {score.player} - {score.ai}
                </div>
                <div style={styles.gameOverMessage}>
                  {gameMode === GAME_MODES.LOCAL_MULTI ? (
                    score.player > score.ai 
                      ? `Player 1 Wins by ${score.player - score.ai}!`
                      : `Player 2 Wins by ${score.ai - score.player}!`
                  ) : (
                    score.player > score.ai 
                      ? `You Win by ${score.player - score.ai}!`
                      : `AI Wins by ${score.ai - score.player}!`
                  )}
                </div>
                <button 
                  style={styles.button}
                  onClick={resetGame}
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Update Pause Menu to include reset option */}
            {isPaused && !gameOver && (
              <div style={styles.pauseMenu}>
                <h2>Game Paused</h2>
                <div style={styles.pauseScore}>Score: {score.player} - {score.ai}</div>
                <button 
                  style={styles.button}
                  onClick={() => setIsPaused(false)}
                >
                  Resume Game
                </button>
                <button 
                  style={{...styles.button, backgroundColor: '#f44336', marginTop: '10px'}}
                  onClick={resetGame}
                >
                  Reset Game
                </button>
              </div>
            )}

            {/* Point Cooldown Indicator - only show when not game over */}
            {pointCooldown && !gameOver && (
              <div style={styles.cooldownIndicator}>
                Get Ready!
              </div>
            )}
          </div>

          <div style={styles.instructions}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>How to Play</h2>
            {gameMode === GAME_MODES.AI_SHOWMATCH ? (
              <>
                <p style={styles.instructionText}>Watch as two AI players compete!</p>
                <p style={styles.instructionText}>Both AIs use advanced prediction.</p>
                <p style={styles.instructionText}>First to {winningScore} points wins!</p>
                <p style={styles.instructionText}>Left AI vs Right AI</p>
              </>
            ) : (
              <>
                <p style={styles.instructionText}>Move your paddle to hit the ball.</p>
                <p style={styles.instructionText}>Don't let the ball pass your paddle!</p>
                <p style={styles.instructionText}>Score points by getting the ball past your opponent.</p>
                <p style={styles.instructionText}>First to {winningScore} points wins!</p>
                {gameMode === GAME_MODES.LOCAL_MULTI ? (
                  <p style={styles.instructionText}>Player 1 is on the left, Player 2 is on the right.</p>
                ) : (
                  <p style={styles.instructionText}>Try to beat the AI!</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Add the Credits Modal */}
      {showCredits && (
        <div style={styles.creditsMenu}>
          <h2 style={styles.creditsTitle}>Credits</h2>
          <div style={styles.creditsContent}>
            <p>Created by @ritalarttu</p>
            <p>AI Assistant by Cursor</p>
            <p>Inspired by the classic Pong game</p>
            <p>Built with React</p>
            <p>Version 2.1</p>
          </div>
          <button
            style={styles.button}
            onClick={() => setShowCredits(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// Keep this part
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  body, html {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: #2a2a2a;
  }

  button:hover {
    background-color: #fff !important;
    color: #000 !important;
    transform: scale(1.02);
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// Add cooldown indicator style
const additionalStyles = {
  cooldownIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '32px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  instructionText: {
    fontSize: '20px',
    marginBottom: '12px',
    color: '#000',
  },
};
