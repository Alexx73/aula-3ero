import React, { useEffect, useState } from 'react';
import useSpeech from '../hooks/useSpeech';
import Bart from '../assets/bart2.png';

export default function LearningGameScreen({
  items,
  introText,
  showSubText = true,
  gridClassName,
  totalRounds = 5,
  roundDuration = 10,
  speechPitch = 1.55,
  speechRate = 0.7,
  letterRate = 0.95,
  rowGap = '0.25rem',
  topSectionGap = '0.25rem',
  buttonsSectionBottom = '0.75rem',
  buttonWidth = '3.5rem',
  buttonHeight = '2.5rem',
  buttonFontSize = '0.9rem',
  itemFontSize = '1.25rem',
  subTextFontSize = '0.48rem',
}) {
  const [showBart, setShowBart] = useState(true);
  const [gameMode, setGameMode] = useState(false);
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [gameOver, setGameOver] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { playSound } = useSpeech({
    pitch: speechPitch,
    rate: speechRate,
    letterRate,
  });

  const colors = [
    'bg-red-500',
    'bg-blue-600',
    'bg-yellow-400',
    'bg-cyan-400',
    'bg-green-400',
    'bg-purple-600',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBart(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const speakItem = (item, isForce = false) => {
    playSound(item.speakText ?? item.label, Boolean(item.isLetter), isForce);
  };

  const startRound = () => {
    const random = Math.floor(Math.random() * items.length);
    const item = items[random];
    const announceText = item.announceText ?? item.speakText ?? item.label;
    setTarget(random);
    setMessage(`Find: ${item.label}`);
    setTimeLeft(roundDuration);
    setSelectedItem(null);
    playSound(`Find ${announceText}`, false, true);
  };

  useEffect(() => {
    if (!gameMode || gameOver) return;

    if (timeLeft === 0) {
      setRound((prev) => prev + 1);
      startRound();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameMode, gameOver]);

  const handleClick = (item, index) => {
    if (!gameMode) {
      speakItem(item);
      return;
    }

    setSelectedItem(item);

    if (index === target) {
      setScore((prev) => prev + 10);
      setMessage('Correct!');
      playSound('Correct', true);

      const isLastRound = round >= totalRounds - 1;
      setTimeout(() => {
        setRound((prev) => prev + 1);
        if (isLastRound) {
          setGameOver(true);
        } else {
          startRound();
        }
      }, 1000);
    } else {
      setMessage('Try Again!');
      playSound('Try again', true);
    }
  };

  const startGame = () => {
    setGameMode(true);
    setScore(0);
    setRound(0);
    setGameOver(false);
    startRound();
  };

  const endGame = () => {
    setGameOver(true);
    setMessage('Game Finished!');
  };

  const resetGame = () => {
    setGameMode(false);
    setGameOver(false);
    setScore(0);
    setRound(0);
    setMessage('');
  };

  const cancelGame = () => {
    setGameOver(false);
    setGameMode(false);
    setMessage('');
    setSelectedItem(null);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col px-2 pt-1 pb-0 sm:p-5 bg-gray-100 font-sans dark:bg-gray-800 overflow-hidden">
      {showBart && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-95 z-50">
          <div className="relative flex items-center justify-center">
            <img src={Bart} alt="Bart Simpson" className="w-60" />
            {introText ? (
              <div className="absolute -right-8 top-1/3 max-w-44 rounded-2xl border-4 border-black bg-white p-4 text-center text-sm font-bold text-black shadow-lg">
                {introText}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="mb-1 min-h-[1.75rem] text-center text-[11px] font-black leading-none whitespace-nowrap">
        {gameMode && !gameOver ? (
          <>
            <span className="find-rainbow">{message}</span>
            <span className="ml-2 text-white/90">
              ⭐ Score: {score} · 🔢 Round: {round + 1}/{totalRounds}
            </span>
          </>
        ) : null}
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-gray-900">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              🏆 Final Score: {score}
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetGame}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
              >
                🔄 Play Again
              </button>
              <button
                onClick={cancelGame}
                className="inline-flex items-center justify-center rounded-xl bg-gray-500 px-5 py-3 font-bold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`grid ${gridClassName} gap-x-1 sm:gap-2 flex-none content-start`}
        style={{ rowGap, marginTop: topSectionGap }}
      >
        {items.map((item, index) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleClick(item, index)}
              className={`flex flex-col justify-center items-center text-white rounded-xl cursor-pointer transition-transform duration-200 select-none hover:scale-105 active:scale-95 ${item.colorClass ?? colors[index % colors.length]}`}
              style={{ height: item.height ?? '3.7rem' }}
            >
              <span className="font-bold leading-none" style={{ fontSize: itemFontSize }}>
                {item.label}
              </span>

              {showSubText && (!gameMode || isSelected) && item.subText ? (
                <span className="font-semibold leading-none mt-1" style={{ fontSize: subTextFontSize }}>
                  {item.subText}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        className="fixed left-0 right-0 bottom-0 z-40 flex items-center justify-center gap-2 overflow-hidden px-2 pb-1 pt-1 bg-gray-100 dark:bg-gray-800"
        style={{ marginBottom: buttonsSectionBottom }}
      >
        <div className="flex items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setGameMode(false)}
            className={`rounded-lg font-bold whitespace-nowrap ${!gameMode ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            style={{ width: buttonWidth, height: buttonHeight, fontSize: buttonFontSize }}
          >
            📚
          </button>

          <button
            onClick={gameMode ? endGame : startGame}
            className={`rounded-lg font-bold whitespace-nowrap ${gameMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
            style={{ width: buttonWidth, height: buttonHeight, fontSize: buttonFontSize }}
          >
            {gameMode ? '🛑' : '🎮'}
          </button>
        </div>
      </div>

      <div className="h-14" aria-hidden="true" />
    </div>
  );
}
