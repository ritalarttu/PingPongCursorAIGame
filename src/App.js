import React, { useState, useEffect, useRef } from 'react';
import { Firework } from './components/Firework';
import { GAME_MODES, GAME_LENGTHS, MIN_WIN_MARGIN, AI_DIFFICULTIES } from './constants/gameConstants';
import { staticStyles, getGameStyles, globalStyles } from './styles/styles';
import { getGameDimensions } from './utils/gameUtils';
import { useGameControls, useGameLoop, usePowerUps, useWindowResize, useFireworks } from './hooks';

// Add global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

export default function App() {
  const dimensions = useRef(getGameDimensions());
  const styles = { ...staticStyles, ...getGameStyles(dimensions.current) };

  // Set document title
  useEffect(() => {
    document.title = "PingPongGame";
  }, []);

  // Game state
  const [pointCooldown, setPointCooldown] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(dimensions.current.GAME_HEIGHT / 2);
  const [aiPosition, setAiPosition] = useState(dimensions.current.GAME_HEIGHT / 2);
  const [ballPosition, setBallPosition] = useState({
    x: dimensions.current.GAME_WIDTH / 2,
    y: dimensions.current.GAME_HEIGHT / 2
  });
  const [ballDirection, setBallDirection] = useState({ x: 1, y: 1 });
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [menuState, setMenuState] = useState('main');
  const [gameStarted, setGameStarted] = useState(false);
  const [winningScore, setWinningScore] = useState(GAME_LENGTHS.LONG.points);
  const [gameMode, setGameMode] = useState(GAME_MODES.SINGLE);
  const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTIES.MEDIUM);
  const [showCredits, setShowCredits] = useState(false);

  // Custom hooks
  const keysPressed = useGameControls(setIsPaused);
  const { fireworks } = useFireworks(showCredits);
  const { activePowerUps, visiblePowerUp, checkPowerUpCollision, getPowerUpEffects } = usePowerUps(
    gameStarted,
    gameMode,
    gameOver,
    isPaused,
    dimensions.current
  );

  const resetPositions = () => {
    setPlayerPosition(dimensions.current.GAME_HEIGHT / 2);
    setAiPosition(dimensions.current.GAME_HEIGHT / 2);
    setBallPosition({
      x: dimensions.current.GAME_WIDTH / 2,
      y: dimensions.current.GAME_HEIGHT / 2
    });
  };

  useWindowResize(dimensions, resetPositions);

  const resetBall = () => {
    if (gameOver) return;
    
    setPlayerPosition(dimensions.current.GAME_HEIGHT / 2);
    setAiPosition(dimensions.current.GAME_HEIGHT / 2);
    
    setPointCooldown(true);
    setTimeout(() => {
      if (!gameOver) {
        setPointCooldown(false);
        setBallPosition({
          x: dimensions.current.GAME_WIDTH / 2,
          y: dimensions.current.GAME_HEIGHT / 2
        });
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

  const startGame = (points, mode, difficulty = AI_DIFFICULTIES.MEDIUM) => {
    setWinningScore(points);
    setGameMode(mode);
    setAiDifficulty(difficulty);
    setGameStarted(true);
    setMenuState('main');
    resetPositions();
    resetBall();
  };

  useGameLoop({
    gameStarted,
    isPaused,
    gameOver,
    pointCooldown,
    dimensions: dimensions.current,
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
  });

  // Rest of the JSX remains the same...
  // ... (keep all the existing JSX from the original App.js)
}; 