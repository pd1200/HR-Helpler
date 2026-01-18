
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

import { playTickSound, playWinSound } from '../services/audioEffects';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [remainingPool, setRemainingPool] = useState<Participant[]>([...participants]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [reelName, setReelName] = useState<string>('???');
  const [history, setHistory] = useState<Participant[]>([]);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingPool([...participants]);
    setHistory([]);
    setWinner(null);
  }, [participants]);

  const startDraw = () => {
    if (remainingPool.length === 0) {
      alert("名單已空！");
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const maxTries = 25;
    const interval = 80;

    const tick = () => {
      // Play tick sound
      playTickSound();

      const randomIndex = Math.floor(Math.random() * remainingPool.length);
      setReelName(remainingPool[randomIndex].name);
      counter++;

      if (counter < maxTries) {
        timeoutRef.current = window.setTimeout(tick, interval);
      } else {
        finishDraw();
      }
    };

    tick();
  };

  const finishDraw = () => {
    const finalIndex = Math.floor(Math.random() * remainingPool.length);
    const finalWinner = remainingPool[finalIndex];

    setWinner(finalWinner);
    setReelName(finalWinner.name);
    setHistory(prev => [finalWinner, ...prev]);
    setIsDrawing(false);

    // Play win sound
    playWinSound();

    // Confetti effect
    if ((window as any).confetti) {
      (window as any).confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (!allowRepeat) {
      setRemainingPool(prev => prev.filter(p => p.id !== finalWinner.id));
    }
  };

  const reset = () => {
    setRemainingPool([...participants]);
    setWinner(null);
    setReelName('???');
    setHistory([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Left Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <i className="fa-solid fa-gear mr-2 text-indigo-500"></i> 設定
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">重複抽取</span>
            <button
              onClick={() => setAllowRepeat(!allowRepeat)}
              className={`w-12 h-6 rounded-full transition-colors relative ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${allowRepeat ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">目前剩餘人數</p>
            <p className="text-2xl font-bold text-indigo-600">{remainingPool.length}</p>
          </div>
          <button
            onClick={reset}
            className="w-full py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            重設抽籤
          </button>
        </div>
      </div>

      {/* Center Reel */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
              Lucky Draw
            </span>
          </div>

          <div className={`text-6xl md:text-8xl font-black mb-12 text-center h-24 flex items-center transition-all duration-75 ${isDrawing ? 'scale-110 text-indigo-500 blur-[1px]' : winner ? 'text-indigo-600 scale-100' : 'text-slate-300'}`}>
            {reelName}
          </div>

          <button
            disabled={isDrawing || remainingPool.length === 0}
            onClick={startDraw}
            className={`px-12 py-4 rounded-full text-xl font-bold shadow-xl transform active:scale-95 transition-all
              ${isDrawing || remainingPool.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-200'}`}
          >
            {isDrawing ? '正在抽取...' : remainingPool.length === 0 ? '抽取完畢' : '開始抽取'}
          </button>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <i className="fa-solid fa-list-ul mr-2 text-indigo-500"></i> 中獎紀錄
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.length === 0 ? (
              <p className="text-slate-400 italic text-sm">尚無紀錄</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 flex items-center">
                  <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full mr-2">
                    {history.length - i}
                  </span>
                  {h.name}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
