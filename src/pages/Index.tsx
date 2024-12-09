import PongGame from '@/components/Game/PongGame';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-8 font-mono">PONG</h1>
      <div className="mb-8 text-white text-center font-mono">
        <p>Player 1: W/S keys</p>
        <p>Player 2: ↑/↓ arrow keys</p>
      </div>
      <PongGame />
    </div>
  );
};

export default Index;