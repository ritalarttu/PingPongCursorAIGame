export const GAME_LENGTHS = {
  SHORT: { points: 3, name: 'Quick Game (3 Points)' },
  MEDIUM: { points: 6, name: 'Medium Game (6 Points)' },
  LONG: { points: 11, name: 'Full Game (11 Points)' }
};

export const BALL_SPEED_INCREASE = 1.1; // 10% increase per hit
export const MIN_WIN_MARGIN = 2;

export const POWER_UPS = {
  SPEED_UP: { name: 'Speed Up', color: '#ff4444', duration: 5000 },
  GIANT_PADDLE: { name: 'Giant Paddle', color: '#44ff44', duration: 5000 },
  SLOW_MOTION: { name: 'Slow Opponent', color: '#4444ff', duration: 5000 },
  TINY_OPPONENT: { name: 'Shrink Opponent', color: '#ff44ff', duration: 5000 }
};

export const GAME_MODES = {
  SINGLE: 'single',
  LOCAL_MULTI: 'local_multi',
  AI_SHOWMATCH: 'ai_showmatch',
  POWER_UP: 'power_up'
};

export const AI_DIFFICULTIES = {
  EASY: { name: 'Easy', reactionSpeed: 0.5, predictionFactor: 0 },
  MEDIUM: { name: 'Medium', reactionSpeed: 1, predictionFactor: 0 },
  HARD: { name: 'Hard', reactionSpeed: 1.2, predictionFactor: 1 }
}; 