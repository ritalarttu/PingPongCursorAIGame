export const staticStyles = {
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
  powerUp: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 1s infinite',
    border: '2px solid white',
    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
    zIndex: 1,
  },
  powerUpIndicator: {
    position: 'absolute',
    top: '60px',
    padding: '5px 10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    zIndex: 2,
  },
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
};

export const getGameStyles = (dimensions) => ({
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

export const globalStyles = `
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