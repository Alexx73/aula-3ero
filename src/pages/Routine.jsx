import React, { useEffect, useMemo, useState } from "react";

const routineItems = [
  { key: "1", label: "Get up" },
  { key: "2", label: "Have breakfast" },
  { key: "3", label: "Brush my teeth" },
  { key: "4", label: "Go to school" }, 
  { key: "5", label: "Start classes" },
  { key: "6", label: "Have lunch" },
  { key: "7", label: "Finish classes" },
  { key: "8", label: "Do my homework" },
  { key: "9", label: "Play video games" },
  { key: "10", label: "Have dinner" },
  { key: "11", label: "Watch TV" },
  { key: "12", label: "Go to bed" },
];

const colors = [
  "bg-red-500",
  "bg-blue-600",
  "bg-yellow-400",
  "bg-cyan-400",
  "bg-green-400",
  "bg-purple-600",
];

// Cambia esta constante para regular el color del texto traducido.
// Opciones sugeridas: "text-fuchsia-300", "text-amber-300", "text-emerald-300", "text-sky-300"
const TRANSLATION_TEXT_COLOR_CLASS = "text-fuchsia-300";

const routineTranslations = {
  "1": "Levantarse",
  "2": "Desayunar",
  "3": "Cepillarme los dientes",
  "4": "Ir a la escuela",
  "5": "Empezar las clases",
  "6": "Almorzar",
  "7": "Terminar las clases",
  "8": "Hacer la tarea",
  "9": "Jugar videojuegos",
  "10": "Cenar",
  "11": "Mirar TV",
  "12": "Ir a la cama",
};

export default function Routine() {
  const [activeItem, setActiveItem] = useState(null);
  const [voices, setVoices] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDirection, setPageDirection] = useState("next");
  const [showTranslation, setShowTranslation] = useState(false);
  const [revealedTranslationKey, setRevealedTranslationKey] = useState(null);

  const images = useMemo(() => import.meta.glob("../assets/daily_routine/*.png", { eager: true }), []);

  useEffect(() => {
    const loadVoices = () => {
      if (!("speechSynthesis" in window)) return;
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    if ("speechSynthesis" in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const routineCards = useMemo(() => {
    return routineItems.map((item) => {
      const imagePath = `../assets/daily_routine/${item.key}.png`;
      return {
        ...item,
        img: images[imagePath]?.default,
      };
    });
  }, [images]);

  const pages = useMemo(() => {
    const groupedPages = [];
    for (let i = 0; i < routineCards.length; i += 4) {
      groupedPages.push(routineCards.slice(i, i + 4));
    }
    return groupedPages;
  }, [routineCards]);

  const speakLabel = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    // Ajusta este valor para cambiar la velocidad de pronunciacion.
    // 1 = normal, menor que 1 = mas lento, mayor que 1 = mas rapido.
    const SPEECH_RATE = 1;
    utterance.rate = SPEECH_RATE;
    utterance.pitch = 1.75;
    utterance.volume = 1;

    const preferredVoice =
      voices.find((voice) => /zira|samantha|victoria|karen|susan|female|girl|child|kid/i.test(voice.name)) ||
      voices.find((voice) => voice.lang === "en-US" && /female|girl|child|kid/i.test(voice.name)) ||
      voices.find((voice) => voice.lang === "en-US") ||
      voices.find((voice) => voice.lang.startsWith("en-")) ||
      voices.find((voice) => voice.default);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = (item) => {
    setActiveItem(item.key);
    if (showTranslation) {
      setRevealedTranslationKey(item.key);
    }
    speakLabel(item.label);
  };

  const currentPage = pages[pageIndex] ?? [];
  const pageCount = pages.length;

  const goToPreviousPage = () => {
    setPageDirection("prev");
    setPageIndex((current) => Math.max(0, current - 1));
    setRevealedTranslationKey(null);
  };

  const goToNextPage = () => {
    setPageDirection("next");
    setPageIndex((current) => Math.min(pageCount - 1, current + 1));
    setRevealedTranslationKey(null);
  };

  const handleToggleTranslation = () => {
    setShowTranslation((current) => {
      const next = !current;
      if (!next) {
        setRevealedTranslationKey(null);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 p-2 pb-20 font-sans overflow-hidden dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow-md">
        <div>
          <h1 className="text-sm font-bold sm:text-base">Routine</h1>
          <p className="text-[10px] font-medium text-white/70 sm:text-xs">
            Tap an image to hear the phrase.
          </p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
          {pageIndex + 1}/{pageCount}
        </div>
      </div>

      <div
        key={`${pageIndex}-${pageDirection}`}
        className={`grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 flex-1 content-start items-start ${
          pageDirection === "next" ? "fx-slide-left-right" : "fx-slide-right-left"
        }`}
      >
        {currentPage.map((item, index) => {
          const absoluteIndex = pageIndex * 4 + index;
          const isActive = activeItem === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleClick(item)}
              className={`relative flex min-h-[14.5rem] flex-col items-center justify-between overflow-hidden rounded-2xl p-3 text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${colors[absoluteIndex % colors.length]} ${
                isActive ? "ring-4 ring-white ring-offset-2 ring-offset-slate-900" : ""
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="rounded-lg bg-black/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide">
                  {absoluteIndex + 1}
                </span>
                {isActive && (
                  <span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide">
                    Playing
                  </span>
                )}
              </div>

              <img
                src={item.img}
                alt={item.label}
                className="h-36 w-36 object-contain drop-shadow-md sm:h-40 sm:w-40"
              />

              <div className="flex min-h-[3.75rem] w-full flex-col justify-center rounded-xl bg-black/10 px-2 py-2 text-center">
                <p className="text-sm font-extrabold leading-snug sm:text-[15px] line-clamp-2">
                  {item.label}
                </p>
                {showTranslation && revealedTranslationKey === item.key && (
                  <p className={`fx-pop-scale mt-1 text-[11px] font-black leading-tight sm:text-xs ${TRANSLATION_TEXT_COLOR_CLASS}`}>
                    {routineTranslations[item.key]}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-2 left-2 right-2 z-50">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-2xl bg-slate-900 px-3 py-3 text-white shadow-xl shadow-black/20 ring-1 ring-white/10">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={pageIndex === 0}
            className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleToggleTranslation}
            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
              showTranslation ? "bg-white text-slate-900" : "bg-white/10 text-white"
            }`}
          >
            {showTranslation ? "Hide translation" : "Show translation"}
          </button>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={pageIndex === pageCount - 1}
            className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
