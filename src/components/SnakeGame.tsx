import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center">
      {/* Recipe 5: Brutalist Score Display */}
      <div className="grid grid-cols-2 gap-12 mb-8 w-full">
        <div className="border-l-4 border-neon-cyan pl-4">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-1">Score</span>
          <h3 className="font-display text-6xl leading-none text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            {score.toString().padStart(2, '0')}
          </h3>
        </div>
        <div className="border-l-4 border-neon-pink pl-4">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-1">Best</span>
          <h3 className="font-display text-6xl leading-none text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            {highScore.toString().padStart(2, '0')}
          </h3>
        </div>
      </div>

      {/* Recipe 3: Hardware-like Game Area */}
      <div 
        className="relative bg-black border-[1px] border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Recipe 1: Visible Grid */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] pointer-events-none">
          {[...Array(400)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/[0.03]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
            }}
            className={`z-10 ${
              i === 0 
                ? 'bg-neon-cyan shadow-[0_0_15px_rgba(0,255,255,1)]' 
                : 'bg-neon-cyan/40 border border-neon-cyan/20'
            }`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
          className="bg-neon-pink shadow-[0_0_15px_rgba(255,0,255,1)] z-10"
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="font-display text-5xl text-neon-pink mb-6 uppercase tracking-tighter italic">Terminated</h2>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 bg-transparent border-2 border-neon-pink text-neon-pink font-display text-xl uppercase tracking-widest hover:bg-neon-pink hover:text-black transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <RotateCcw size={20} /> Reboot
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="font-display text-5xl text-neon-cyan mb-6 uppercase tracking-tighter italic">Standby</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="group relative px-8 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan font-display text-xl uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Play size={20} /> Resume
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipe 3: Micro-labels for status */}
      <div className="mt-8 flex gap-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 bg-neon-cyan shadow-[0_0_5px_rgba(0,255,255,1)]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Link Active</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 bg-neon-pink shadow-[0_0_5px_rgba(255,0,255,1)]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Core Sync</span>
        </div>
      </div>
    </div>
  );
}
