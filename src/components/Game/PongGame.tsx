import React, { useEffect, useRef, useState } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import Score from './Score';

const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;
const SPEED_INCREASE = 0.2;

const PongGame: React.FC = () => {
  const [leftPaddle, setLeftPaddle] = useState({ x: 50, y: 300 });
  const [rightPaddle, setRightPaddle] = useState({ x: 750, y: 300 });
  const [ball, setBall] = useState({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED });
  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();
  const ballSpeedRef = useRef(INITIAL_BALL_SPEED);

  const resetBall = () => {
    setBall({ x: 400, y: 300 });
    ballSpeedRef.current = INITIAL_BALL_SPEED;
    const newVelocity = {
      x: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      y: INITIAL_BALL_SPEED * (Math.random() * 2 - 1),
    };
    setBallVelocity(newVelocity);
    
    // Cancel the current game loop and start a new one
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const handleCollisions = () => {
    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y >= 600) {
      setBallVelocity(prev => ({ ...prev, y: -prev.y }));
    }

    // Ball collision with paddles
    const checkPaddleCollision = (paddleX: number, paddleY: number) => {
      return (
        ball.x >= paddleX - 10 &&
        ball.x <= paddleX + 10 &&
        ball.y >= paddleY - 40 &&
        ball.y <= paddleY + 40
      );
    };

    if (checkPaddleCollision(leftPaddle.x, leftPaddle.y) || checkPaddleCollision(rightPaddle.x, rightPaddle.y)) {
      ballSpeedRef.current += SPEED_INCREASE;
      setBallVelocity(prev => ({
        x: -prev.x * (ballSpeedRef.current / Math.abs(prev.x)),
        y: prev.y * (ballSpeedRef.current / Math.abs(prev.x)),
      }));
    }

    // Scoring
    if (ball.x <= 0) {
      setScores(prev => ({ ...prev, right: prev.right + 1 }));
      resetBall();
    } else if (ball.x >= 800) {
      setScores(prev => ({ ...prev, left: prev.left + 1 }));
      resetBall();
    }
  };

  const gameLoop = () => {
    // Update paddle positions
    setLeftPaddle(prev => ({
      ...prev,
      y: Math.max(40, Math.min(560, prev.y + (keysPressed.current.has('w') ? -PADDLE_SPEED : keysPressed.current.has('s') ? PADDLE_SPEED : 0))),
    }));

    setRightPaddle(prev => ({
      ...prev,
      y: Math.max(40, Math.min(560, prev.y + (keysPressed.current.has('arrowup') ? -PADDLE_SPEED : keysPressed.current.has('arrowdown') ? PADDLE_SPEED : 0))),
    }));

    // Update ball position
    setBall(prev => ({
      x: prev.x + ballVelocity.x,
      y: prev.y + ballVelocity.y,
    }));

    handleCollisions();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (!gameStarted && e.key === ' ') {
        setGameStarted(true);
        resetBall();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted]);

  // Add back the game loop initialization when game starts
  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameStarted]);

  return (
    <div className="relative w-[800px] h-[600px] bg-black border-2 border-white mx-auto overflow-hidden">
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-mono">
          Press SPACE to start
        </div>
      )}
      <Score leftScore={scores.left} rightScore={scores.right} />
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white opacity-20" />
      <Paddle position={leftPaddle} side="left" />
      <Paddle position={rightPaddle} side="right" />
      <Ball position={ball} />
    </div>
  );
};

export default PongGame;