import React from 'react';

interface ScoreProps {
  leftScore: number;
  rightScore: number;
}

const Score: React.FC<ScoreProps> = ({ leftScore, rightScore }) => {
  return (
    <div className="absolute top-8 left-0 right-0 flex justify-center gap-20 text-4xl font-bold text-white font-mono">
      <span>{leftScore}</span>
      <span>{rightScore}</span>
    </div>
  );
};

export default Score;