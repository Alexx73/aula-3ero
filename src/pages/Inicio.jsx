import React, { useMemo, useState } from 'react';
import QuarterTabs from '../components/QuarterTabs';
import ActivityCard from '../components/ActivityCard';
import PdfViewer from '../modules/pdf-viewer';

const cuadernilloPdf = `${import.meta.env.BASE_URL}engage_tarter_students_units5_8.pdf`;

const quarterData = [
  {
    id: 'q1',
    label: '1er trimestre',
    subtitle: 'Letras y numeros para arrancar.',
    cards: [
      {
        to: '/alphabet',
        title: 'Alphabet',
        subtitle: 'Practicar letras con sonido y juego.',
        badge: 'Letters',
        accentClass: 'bg-red-500',
      },
      {
        to: '/number',
        title: 'Numbers',
        subtitle: 'Aprender numeros del 0 al 20.',
        badge: 'Numbers',
        accentClass: 'bg-blue-600',
      },
    ],
  },
  {
    id: 'q2',
    label: '2do trimestre',
    subtitle: 'Vocabulario de familia y profesiones.',
    cards: [
      {
        to: '/routine',
        title: 'Routine',
        subtitle: 'Practicar acciones diarias con imagen y audio.',
        badge: 'Daily',
        accentClass: 'bg-orange-500',
      },
    ],
  },
  {
    id: 'q3',
    label: '3er trimestre',
    subtitle: 'Preguntas y presentaciones personales.',
    cards: [
      {
        to: '/personal-information',
        title: 'Personal Info',
        subtitle: 'Datos personales y presentaciones.',
        badge: 'Profile',
        accentClass: 'bg-cyan-500',
      },
    ],
  },
  {
    id: 'cuadernillo',
    label: 'Cuadernillo',
    subtitle: 'Material para ver y descargar.',
    cards: [],
  },
];

export default function Inicio() {
  const [activeQuarter, setActiveQuarter] = useState('q1');

  const activeData = useMemo(
    () => quarterData.find((quarter) => quarter.id === activeQuarter) ?? quarterData[0],
    [activeQuarter]
  );

  const isCuadernillo = activeQuarter === 'cuadernillo';

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 px-3  dark:from-gray-900 dark:to-gray-800">

      <div className="mb-1">
        <QuarterTabs
          tabs={quarterData.map(({ id, label }) => ({ id, label }))}
          activeId={activeQuarter}
          onChange={setActiveQuarter}
        />
      </div>

      <div className="mb-1 flex items-end justify-between gap-3">
        <div>
          {/* <h2 className="text-sm font-black text-gray-900 dark:text-white">
            {activeData.label}
          </h2> */}
          {isCuadernillo ? (
            <div className="mt-1 inline-flex items-center gap-2 text-[10px] font-medium text-gray-700 dark:text-gray-300">
              <span>{activeData.subtitle}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
            </div>
          ) : (
            <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
              {activeData.subtitle}
            </p>
          )}
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-[9px] font-bold text-gray-800 shadow-sm dark:bg-white/10 dark:text-white">
          {isCuadernillo ? 'PDF' : `${activeData.cards.length} items`}
        </div>
      </div>

      {isCuadernillo ? (
        <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
          <PdfViewer
            src={cuadernilloPdf}
            loadingLabel="Cargando cuadernillo..."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 content-start items-start gap-2 overflow-hidden sm:grid-cols-2 md:grid-cols-3">
          {activeData.cards.map((card) => (
            <ActivityCard key={card.to ?? card.href ?? card.title} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}
