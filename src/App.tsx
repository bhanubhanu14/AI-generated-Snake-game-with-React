/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-cyan/30 font-sans overflow-hidden">
      {/* Recipe 7: Atmospheric Background */}
      <div className="atmosphere" />

      {/* Recipe 5: Marquee Track */}
      <div className="fixed top-0 left-0 w-full overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-md z-50 h-10 flex items-center">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-[10px] font-mono uppercase tracking-[0.4em] opacity-50">
              NEON ARCADE // SYSTEM ACTIVE // HIGH SCORE: 9999 // NOW PLAYING: SYNTHWAVE DREAMS // 
            </span>
          ))}
        </div>
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-screen pt-10">
        {/* Left Pane: Snake Game (Brutalist Influence) */}
        <section className="relative flex flex-col items-center justify-center border-r border-white/10 p-12 overflow-hidden">
          {/* Recipe 11: Vertical Rail Text */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 vertical-text">
            Arcade Terminal 01 // Game Mode: Snake
          </div>

          {/* Recipe 5: Massive Typography Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
            <h1 className="font-display text-[40vw] leading-none uppercase">SNAKE</h1>
          </div>

          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Right Pane: Music Player (Atmospheric/Luxury Influence) */}
        <section className="relative flex flex-col items-center justify-center p-12 bg-white/[0.02]">
          {/* Recipe 11: Vertical Rail Text */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 vertical-text rotate-180">
            Audio Interface 02 // Mode: Atmospheric
          </div>

          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full max-w-md"
          >
            <MusicPlayer />
          </motion.div>

          {/* Recipe 12: Mixed-size typography */}
          <div className="absolute bottom-12 left-12 right-12 text-center lg:text-left pointer-events-none">
            <h2 className="font-serif text-4xl font-black italic leading-none opacity-20">
              Sonic <span className="text-xl font-sans not-italic uppercase tracking-[0.2em] opacity-50 ml-2">Experience</span>
            </h2>
          </div>
        </section>
      </main>

      {/* Recipe 11: Floating Feature Bubbles (Decorative) */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none hidden xl:block">
        <motion.div 
          animate={{ rotate: -6, y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="rounded-full bg-black border border-white/20 px-6 py-3 shadow-2xl"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">System Status: Optimal</span>
        </motion.div>
      </div>
    </div>
  );
}
