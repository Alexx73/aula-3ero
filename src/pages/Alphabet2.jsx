import React, { useEffect, useState } from 'react';
import Bart from '../assets/bart2.png';


export default function Alphabet2() {
   const [showBart, setShowBart] = useState(true);
  const [playingLetters, setPlayingLetters] = useState(new Set());

  // Bart greeting effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBart(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize speech synthesis
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState([]);

  const loadVoices = () => {
    const availableVoices = synth.getVoices();
    setVoices(availableVoices);
    console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
  };

  useEffect(() => {
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleLetterClick = (letter) => {
    const letterSound = letter.toLowerCase();

    if (playingLetters.size > 0) {
      console.log('Playback in progress, ignoring click');
      return;
    }

    console.log('Playing letter:', letterSound);
    setPlayingLetters(new Set(playingLetters.add(letterSound)));

    document.querySelectorAll('.letter').forEach(l => {
      l.style.opacity = '0.6';
      l.style.cursor = 'default';
    });
    const currentLetter = document.querySelector(`[data-letter="${letter}"]`);
    if (currentLetter) currentLetter.style.opacity = '1';

    let textToSpeak = letter;
    if (letterSound === 'z') textToSpeak = 'zi';
    else if (letterSound === 'y') textToSpeak = 'why';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 0.8;

    utterance.onend = () => {
      setPlayingLetters(new Set([...playingLetters].filter(l => l !== letterSound)));
      document.querySelectorAll('.letter').forEach(l => {
        l.style.opacity = '1';
        l.style.cursor = 'pointer';
      });
    };

    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    try {
      synth.speak(utterance);
      const audio = new Audio(`/sounds/${letterSound}.mp3`);
      audio.onerror = (e) => {
        console.log('Error loading audio:', e);
        setPlayingLetters(new Set([...playingLetters].filter(l => l !== letterSound)));
      };
      audio.onended = () => {
        setPlayingLetters(new Set([...playingLetters].filter(l => l !== letterSound)));
      };
      audio.play().catch(e => {
        console.log('Error playing audio:', e);
        setPlayingLetters(new Set([...playingLetters].filter(l => l !== letterSound)));
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setPlayingLetters(new Set([...playingLetters].filter(l => l !== letterSound)));
    }
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const colors = [
    'bg-red-500',    // #FF1744
    'bg-blue-600',   // ~#2979FF
    'bg-yellow-400', // ~#FFD600
    'bg-cyan-400',   // ~#00E5FF
    'bg-green-400',  // ~#00E676
    'bg-purple-600'  // ~#D500F9
  ];

  return (
    <div className="min-h-screen w-full flex flex-col p-2 sm:p-5 bg-gray-100 font-sans overflow-hidden dark:bg-gray-800">
      {showBart && (
        <div className={`fixed inset-0 flex justify-center items-center bg-white bg-opacity-95 z-50 transition-opacity duration-700 ${showBart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative flex items-center justify-center ml-20 sm:ml-50">
            <img src={Bart} alt="Bart Simpson" className="w-60 sm:w-75 mt-30 h-auto mb-5 ml-10 sm:ml-25" />
            <div className="absolute top-1/5 -left-4/5 transform translate-x-1/2 text-lg sm:text-xl font-bold text-center p-6 rounded-2xl bg-white text-black border-4 border-black shadow-lg max-w-xs">
              ¡Practiquemos las letras en inglés !!
            </div>
          </div>
        </div>
      )}
      <div>
        {/* <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-2.5 text-gray-800">😉 The Alphabet 😍</h2> */}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 flex-grow p-1 sm:p-1.5 h-[calc(100%-60px)]">
        {letters.map((letter, index) => (
          <div
            key={letter}
            className={`letter flex justify-center items-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white rounded-xl cursor-pointer transition-transform duration-200 select-none h-full w-full hover:scale-110 active:scale-95 ${colors[index % colors.length]}`}
            data-letter={letter}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};