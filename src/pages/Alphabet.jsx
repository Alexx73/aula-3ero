import React from 'react';
import LearningGameScreen from '../components/LearningGameScreen';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const colors = [
  'bg-red-500',
  'bg-blue-600',
  'bg-yellow-400',
  'bg-cyan-400',
  'bg-green-400',
  'bg-purple-600',
];

const letterItems = letters.map((letter, index) => ({
  id: letter,
  label: letter,
  speakText: letter.toLowerCase(),
  announceText: letter,
  isLetter: true,
  colorClass: colors[index % colors.length],
  height: '3.7rem',
}));

export default function Alphabet() {
  return (
    <LearningGameScreen
      items={letterItems}
      introText="Let's practice the alphabet in English!"
      gridClassName="grid-cols-4 sm:grid-cols-3 md:grid-cols-4"
      showSubText={false}
      totalRounds={5}
      roundDuration={10}
      speechPitch={1.55}
      speechRate={0.7}
      letterRate={0.95}
      rowGap="0.25rem"
      topSectionGap="0.25rem"
      buttonsSectionBottom="0.75rem"
      buttonWidth="3.5rem"
      buttonHeight="2.5rem"
      buttonFontSize="0.9rem"
      itemFontSize="1.25rem"
    />
  );
}
