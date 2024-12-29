export const getGameDimensions = () => {
  const viewportHeight = window.innerHeight;
  
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

export const calculateBounceAngle = (paddleY, ballY, paddleHeight) => {
  // Calculate relative intersection (-1 to 1)
  const relativeIntersectY = (paddleY + paddleHeight/2 - ballY) / (paddleHeight/2);
  
  // Calculate bounce angle (more pronounced angle based on hit position)
  // Using 75 degrees (5π/12) as max angle for more dynamic gameplay
  const maxAngle = (5 * Math.PI) / 12;
  const bounceAngle = relativeIntersectY * maxAngle;
  
  // Return y component (negative because canvas Y is inverted)
  return -bounceAngle;
};

export const predictBallPosition = (ballPos, ballDir, speed, dimensions) => {
  const distanceToTarget = ballDir.x > 0 
    ? dimensions.GAME_WIDTH - ballPos.x 
    : ballPos.x;

  const timeToReach = distanceToTarget / (speed * Math.abs(ballDir.x));
  const finalY = ballPos.y + (ballDir.y * speed * timeToReach);
  
  const totalDistance = Math.abs(finalY);
  const gameHeight = dimensions.GAME_HEIGHT;
  const numBounces = Math.floor(totalDistance / gameHeight);
  
  let predictedY = finalY;
  if (numBounces > 0) {
    const remainder = totalDistance % gameHeight;
    if (numBounces % 2 === 0) {
      predictedY = remainder;
    } else {
      predictedY = gameHeight - remainder;
    }
  }

  const paddingFromEdge = dimensions.PADDLE_HEIGHT * 0.3;
  return Math.max(
    paddingFromEdge,
    Math.min(dimensions.GAME_HEIGHT - paddingFromEdge, predictedY)
  );
}; 