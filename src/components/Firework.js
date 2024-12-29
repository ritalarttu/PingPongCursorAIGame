import React, { useState, useEffect, useRef } from 'react';

const Firework = ({ x, y }) => {
  const [particles, setParticles] = useState([]);
  const requestRef = useRef();

  useEffect(() => {
    const particleCount = 30;
    const initialParticles = Array.from({ length: particleCount }, () => ({
      x: x,
      y: y,
      angle: Math.random() * Math.PI * 2,
      velocity: 3 + Math.random() * 3,
      alpha: 1,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`
    }));
    setParticles(initialParticles);

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle) * particle.velocity,
          y: particle.y + Math.sin(particle.angle) * particle.velocity,
          velocity: particle.velocity * 0.98,
          alpha: particle.alpha * 0.96
        })).filter(particle => particle.alpha > 0.01)
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [x, y]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: '16px',
            height: '16px',
            backgroundColor: particle.color,
            opacity: particle.alpha,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px 6px rgba(255,255,255,0.3)'
          }}
        />
      ))}
    </div>
  );
};

export default Firework; 