import React, { useEffect, useState } from 'react';
import Bart from '../assets/bart2.png';
import useSpeech from '../hooks/useSpeech';

/* =========================================
   📚 LISTA DE PALABRAS
========================================= */
const numberWords = [
  "ZERO","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE",
  "TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN",
  "SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN","TWENTY"
];

const Numbers = () => {

  /* =========================================
     🎛 ESTADOS
  ========================================= */
  const [showBart, setShowBart] = useState(true);
  const [gameMode, setGameMode] = useState(false);
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);

  /* =========================================
   🎮 CONFIGURACIÓN DEL JUEGO
   Podés cambiar el valor inicial (10)
========================================= */
const [totalRounds, setTotalRounds] = useState(5);

  const { playSound } = useSpeech();

  const numbers = Array.from({ length: 21 }, (_, i) => i);

  const colors = [
    'bg-red-500',
    'bg-blue-600',
    'bg-yellow-400',
    'bg-cyan-400',
    'bg-green-400',
    'bg-purple-600'
  ];

  /* =========================================
     👋 INTRO BART
  ========================================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBart(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  /* =========================================
     🔊 PRONUNCIAR NÚMERO
  ========================================= */
  const speakNumber = (number) => {
    playSound(numberWords[number], true);
  };

  /* =========================================
     🎮 INICIAR RONDA
  ========================================= */
  const startRound = () => {
    const random = Math.floor(Math.random() * 21);
    setTarget(random);
    setMessage("Find: " + numberWords[random]);
    setTimeLeft(10);
    setSelectedNumber(null);
    playSound(numberWords[random], true);
  };

  /* =========================================
     ⏱ TEMPORIZADOR
  ========================================= */
  useEffect(() => {
    if (!gameMode || gameOver) return;

    if (timeLeft === 0) {
      setRound(prev => prev + 1);
      startRound();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameMode, gameOver]);

  /* =========================================
     🎯 CLICK EN NÚMERO
  ========================================= */
  const handleClick = (number) => {

    if (!gameMode) {
      speakNumber(number);
      return;
    }

    setSelectedNumber(number); // 👈 ahora muestra palabra solo del tocado

    if (number === target) {
      setScore(prev => prev + 10);
      setMessage("🎉 Correct!");
      playSound("Correct", true);

      setTimeout(() => {
        setRound(prev => prev + 1);

       if (round >= totalRounds - 1) {
          setGameOver(true);
        } else {
          startRound();
        }
      }, 1000);

    } else {
      setMessage("❌ Try Again!");
      playSound("Try again", true);
    }
  };

  /* =========================================
     🚀 INICIAR JUEGO
  ========================================= */
  const startGame = () => {
    setGameMode(true);
    setScore(0);
    setRound(0);
    setGameOver(false);
    startRound();
  };

  /* =========================================
     🛑 TERMINAR JUEGO
  ========================================= */
  const endGame = () => {
    setGameOver(true);
    setMessage("Game Finished!");
  };

  /* =========================================
     🔄 REINICIAR TODO
  ========================================= */
  const resetGame = () => {
    setGameMode(false);
    setGameOver(false);
    setScore(0);
    setRound(0);
    setMessage("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-2 sm:p-5 bg-gray-100 font-sans dark:bg-gray-800">

      {showBart && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-95 z-50">
          <img src={Bart} alt="Bart Simpson" className="w-60" />
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setGameMode(false)}
          className={`px-4 py-2 rounded-lg font-bold ${!gameMode ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          📚 Learn Mode
        </button>

        <button
          onClick={startGame}
          className="px-4 py-2 rounded-lg font-bold bg-green-600 text-white"
        >
          🎮 Start Game
        </button>

        {gameMode && !gameOver && (
          <button
            onClick={endGame}
            className="px-4 py-2 rounded-lg font-bold bg-red-600 text-white"
          >
            🛑 End Game
          </button>
        )}
      </div>

      {/* INFO JUEGO */}
      {gameMode && !gameOver && (
        <div className="text-center mb-4">
          <div className="text-xl font-bold">{message}</div>
          <div className="text-lg">⏱ {timeLeft}s | ⭐ Score: {score} | 🔢 Round: {round+1}/{totalRounds}</div>
        </div>
      )}

      {/* PANTALLA FINAL */}
      {gameOver && (
        <div className="text-center text-3xl font-bold text-green-600 mb-4">
          🏆 Final Score: {score}
          <div className="mt-4">
            <button onClick={resetGame} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 flex-grow">
        {numbers.map((number, index) => (
          <div
            key={number}
            onClick={() => handleClick(number)}
            className={`flex flex-col justify-center items-center text-white rounded-xl cursor-pointer transition-transform duration-200 select-none h-32 hover:scale-110 active:scale-95 ${colors[index % colors.length]}`}
          >
            <span className="text-4xl font-bold">{number}</span>

            {/* 👇 Solo mostrar palabra si:
                - NO es modo juego
                - O si es el número seleccionado */}
            {(!gameMode || selectedNumber === number) && (
              <span className="text-sm font-semibold">
                {numberWords[number]}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Numbers;