import { useState, useEffect } from 'react';

export default function useSpeech (options = {}) {
  const [playingItems, setPlayingItems] = useState(new Set());
  const [voices, setVoices] = useState([]);
  const synth = window.speechSynthesis;
  const {
    pitch = 1.35,
    rate = 1.08,
    letterRate = 0.95
  } = options;

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
  const playSound = (item, isLetter = false, force = false) => {
    if (force) {
      synth.cancel();
      setPlayingItems(new Set());
    } else if (playingItems.size > 0) {
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
    utterance.rate = isLetter ? letterRate : rate;
    utterance.pitch = pitch;

    // Prefer a lighter, more youthful English voice if the device has one.
    const preferredVoice = voices.find(voice => {
      const name = voice.name.toLowerCase();
      return voice.lang.includes('en') && (
        name.includes('child') ||
        name.includes('kid') ||
        name.includes('boy') ||
        name.includes('junior') ||
        name.includes('young') ||
        name.includes('female')
      );
    });
    if (preferredVoice) utterance.voice = preferredVoice;

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

