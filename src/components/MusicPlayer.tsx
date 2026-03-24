import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '2',
    title: 'Cyber City',
    artist: 'AI Lo-fi',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'AI Retrowave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/drive/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full glass-morphism rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Recipe 7: Atmospheric Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-50 pointer-events-none" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Recipe 12: Oval Image Mask */}
        <div className="relative w-full aspect-square mb-8 overflow-hidden rounded-[60px] border border-white/10 shadow-2xl">
          <motion.img 
            key={currentTrack.id}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Recipe 3: Hardware Status Label */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-neon-green animate-pulse' : 'bg-white/20'}`} />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/60">Live Feed</span>
          </div>
        </div>

        {/* Recipe 7: Serif Typography for Content */}
        <div className="w-full mb-8">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif text-4xl font-black italic leading-tight text-white mb-1"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">
            {currentTrack.artist}
          </p>
        </div>

        {/* Recipe 3: Monospace Timecodes & Hardware Slider */}
        <div className="w-full space-y-4 mb-8">
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-white"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/30">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full px-4">
          <button 
            onClick={skipBackward}
            className="p-3 text-white/40 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="p-3 text-white/40 hover:text-white transition-colors active:scale-90"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Recipe 7: Gradient Mask for Scroll/Visualizer */}
        <div className="mt-12 w-full h-12 flex items-end justify-center gap-1.5 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? [10, 40, 15, 35, 12] : 4 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.4 + Math.random() * 0.4,
                delay: i * 0.03
              }}
              className="w-1 bg-white rounded-t-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
