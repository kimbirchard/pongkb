import React from 'react';

interface PaddleProps {
  position: { x: number; y: number };
  side: 'left' | 'right';
}

const Paddle: React.FC<PaddleProps> = ({ position, side }) => {
  return (
    <div
      className="absolute w-3 h-20 bg-white"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-50%)',
      }}
    />
  );
};

export default Paddle;