import React from 'react';

interface BallProps {
  position: { x: number; y: number };
}

const Ball: React.FC<BallProps> = ({ position }) => {
  return (
    <div
      className="absolute w-4 h-4 bg-white rounded-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Ball;