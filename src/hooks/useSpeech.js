import { useState, useEffect } from 'react';

export default function useSpeech () {
  const [playingItems, setPlayingItems] = useState(new Set());
  const [voices, setVoices] = useState([]);
  const synth = window.speechSynthesis;

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Function to play sound (letter or word)
  const playSound = (item, isLetter = false) => {
    if (playingItems.size > 0) {
      console.log('Playback in progress, ignoring request');
      return;
    }

    const itemKey = isLetter ? item.toLowerCase() : item;
    console.log('Playing:', itemKey);
    setPlayingItems(new Set(playingItems.add(itemKey)));

    // Handle letter-specific pronunciation
    let textToSpeak = item;
    if (isLetter) {
      if (item.toLowerCase() === 'z') textToSpeak = 'zi';
      else if (item.toLowerCase() === 'y') textToSpeak = 'why';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 0.7;

    // Find a female voice if available
    const femaleVoice = voices.find(voice =>
      voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    // Handle playback end
    utterance.onend = () => {
      setPlayingItems(new Set([...playingItems].filter(i => i !== itemKey)));
      // Restore visual feedback for all items
      document.querySelectorAll('.letter').forEach(l => {
        l.style.opacity = '1';
        l.style.cursor = 'pointer';
      });
    };

    try {
      // Play the utterance
      synth.speak(utterance);
      // Visual feedback: dim all letters except the clicked one
      document.querySelectorAll('.letter').forEach(l => {
        l.style.opacity = '0.6';
        l.style.cursor = 'default';
      });
      const currentItem = document.querySelector(`[data-item="${item}"]`);
      if (currentItem) currentItem.style.opacity = '1';
    } catch (error) {
      console.error('Error playing sound:', error);
      setPlayingItems(new Set([...playingItems].filter(i => i !== itemKey)));
    }
  };

  return { playSound };
};

