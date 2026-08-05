import React, { useEffect, useMemo, useRef, useState } from "react";

const routineItems = [
  { key: "1", label: "Get up" },
  { key: "2", label: "Have breakfast" },
  { key: "3", label: "Brush my teeth" },
  { key: "4", label: "Go to school" }, 
  { key: "5", label: "Start classes" },
  { key: "6", label: "Have lunch" },
  { key: "7", label: "Finish classes" },
  { key: "8", label: " Play video games" },
  { key: "9", label: "Do my homework|" },
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
const TRANSLATION_TEXT_COLOR_CLASS = "text-slate-950";
const TRANSLATION_SIZE_CLASSES = ["text-[12px]", "text-[14px]", "text-[16px]", "text-[18px]", "text-[22px]", "text-[26px]", "text-[30px]", "text-[34px]"];

const routineTranslations = {
  "1": "Levantarse",
  "2": "Desayunar",
  "3": "Cepillarme los dientes",
  "4": "Ir a la escuela",
  "5": "Empezar las clases",
  "6": "Almorzar",
  "7": "Terminar las clases",
  "8": "Jugar videojuegos",
  "9": "Hacer la tarea", 
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
  const [translationPhase, setTranslationPhase] = useState("idle");
  const [speechRate, setSpeechRate] = useState(1);
  const [translationSizeIndex, setTranslationSizeIndex] = useState(3);
  const translationTimerRef = useRef(null);
  const translationHideTimerRef = useRef(null);
  const speechRateOptions = [1, 0.85, 0.6, 0.4];

  const images = useMemo(() => import.meta.glob("../assets/daily_routine/*.png", { eager: true }), []);

  const imageNameByKey = useMemo(
    () => ({
      "1": "1_get_up.png",
      "2": "2_have_breakfast.png",
      "3": "3_brush_my_teeth.png",
      "4": "4_go_to_school.png",
      "5": "5_start_classes.png",
      "6": "6_have_lunch.png",
      "7": "7_finish_classes.png",
      "8": "8_play_video_games.png",
      "9": "9_do_my_homework.png",
      "10": "10_have_dinner.png",
      "11": "11_watch_tv.png",
      "12": "12_go_to_bed.png",
    }),
    []
  );

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
      const imagePath = `../assets/daily_routine/${imageNameByKey[item.key]}`;
      return {
        ...item,
        img: images[imagePath]?.default,
      };
    });
  }, [images, imageNameByKey]);

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
    // Ajusta este valor para cambiar la velocidad de pronunciacion.
    // 1 = normal, menor que 1 = mas lento, mayor que 1 = mas rapido.
    const SPEECH_RATE = speechRate;
    const normalizedSpeechRate = Math.max(0.1, Math.min(10, Number(SPEECH_RATE) || 1));

    window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = normalizedSpeechRate;
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
        console.log("Routine voice:", preferredVoice.name, preferredVoice.lang, "rate:", normalizedSpeechRate);
      } else {
        console.log("Routine voice: default browser voice", "rate:", normalizedSpeechRate);
      }

      window.speechSynthesis.speak(utterance);
    }, 60);
  };

  const handleClick = (item) => {
    setActiveItem(item.key);
    if (translationTimerRef.current) {
      window.clearTimeout(translationTimerRef.current);
      translationTimerRef.current = null;
    }
    if (translationHideTimerRef.current) {
      window.clearTimeout(translationHideTimerRef.current);
      translationHideTimerRef.current = null;
    }

    if (showTranslation) {
      setRevealedTranslationKey(item.key);
      setTranslationPhase("enter");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
        setTranslationPhase("visible");
        });
      });
      translationTimerRef.current = window.setTimeout(() => {
        setTranslationPhase("exit");
        translationHideTimerRef.current = window.setTimeout(() => {
          setRevealedTranslationKey(null);
          setTranslationPhase("idle");
          translationTimerRef.current = null;
          translationHideTimerRef.current = null;
        }, 520);
      }, 4200);
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
        setTranslationPhase("idle");
        if (translationTimerRef.current) {
          window.clearTimeout(translationTimerRef.current);
          translationTimerRef.current = null;
        }
        if (translationHideTimerRef.current) {
          window.clearTimeout(translationHideTimerRef.current);
          translationHideTimerRef.current = null;
        }
      }
      return next;
    });
  };

  const increaseTranslationSize = () => {
    setTranslationSizeIndex((current) => Math.min(TRANSLATION_SIZE_CLASSES.length - 1, current + 1));
  };

  const decreaseTranslationSize = () => {
    setTranslationSizeIndex((current) => Math.max(0, current - 1));
  };

  useEffect(() => {
    return () => {
      if (translationTimerRef.current) {
        window.clearTimeout(translationTimerRef.current);
      }
      if (translationHideTimerRef.current) {
        window.clearTimeout(translationHideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-[100svh] w-full flex-col overflow-hidden bg-gray-100 p-2 font-sans dark:bg-gray-800">
      <div className="mx-auto flex w-full flex-1 min-h-0 flex-col lg:max-w-[1200px]">
        <div className="mb-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-md">
          <div className="flex items-center justify-between">
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
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden pb-[7.5rem]">
          <div
            key={`${pageIndex}-${pageDirection}`}
            className={`grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 gap-3 content-stretch items-stretch ${
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
                  className={`relative flex h-full min-h-0 flex-col items-stretch justify-between overflow-hidden rounded-2xl p-2 text-white shadow-lg transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] ${colors[absoluteIndex % colors.length]} ${
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

                  <div className="relative flex min-h-0 w-full flex-[2.35] items-center justify-center px-0">
                    <img
                      src={item.img}
                      alt={item.label}
                      className={`h-full max-h-none w-full rounded-[1rem] object-contain object-center shadow-md transition-all duration-300 ${
                        showTranslation && revealedTranslationKey === item.key
                          ? "bg-fuchsia-100/25 ring-4 ring-fuchsia-300/90 shadow-fuchsia-300/30 scale-[1.015]"
                          : "bg-white/5"
                      }`}
                    />
                    {showTranslation && revealedTranslationKey === item.key && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-end justify-start overflow-hidden px-2">
                        <p
                          className={`inline-flex max-w-[90%] items-center justify-center rounded-full bg-amber-200 px-5 py-2.5 font-black leading-tight shadow-lg shadow-black/15 ${TRANSLATION_TEXT_COLOR_CLASS} ${TRANSLATION_SIZE_CLASSES[translationSizeIndex]}`}
                          style={{
                            opacity: translationPhase === "enter" ? 0 : translationPhase === "exit" ? 0 : 1,
                            transform:
                              translationPhase === "enter"
                                ? "translateX(-36px)"
                                : translationPhase === "exit"
                                  ? "translateX(10px)"
                                  : "translateX(0)",
                            transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms cubic-bezier(0.22, 1, 0.36, 1)",
                            willChange: "transform, opacity",
                          }}
                        >
                          {routineTranslations[item.key]}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex min-h-[4rem] w-full flex-none flex-col justify-center rounded-xl bg-black/10 px-3 py-2 text-center">
                    <p className="text-base font-extrabold leading-tight sm:text-[17px] line-clamp-2">
                      {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[42%] z-20 -translate-y-1/2">
            <div className="mx-auto flex w-full items-center justify-between px-0.5 sm:px-1 lg:px-3">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={pageIndex === 0}
                aria-label="Go to previous page"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-xl font-black text-white shadow-lg shadow-black/25 backdrop-blur transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-14 sm:text-2xl"
              >
                {"<"}
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={pageIndex === pageCount - 1}
                aria-label="Go to next page"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-xl font-black text-white shadow-lg shadow-black/25 backdrop-blur transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-14 sm:text-2xl"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-2 left-2 right-2 z-50">
          <div className="mx-auto flex w-full flex-col gap-2 rounded-2xl bg-slate-900 px-3 py-3 text-white shadow-xl shadow-black/20 ring-1 ring-white/10 lg:px-0">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={pageIndex === 0}
                className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              <div className="flex items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={decreaseTranslationSize}
                  aria-label="Decrease translation size"
                  className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white/85 transition hover:bg-white/10"
                >
                  -
                </button>

                <button
                  type="button"
                  onClick={handleToggleTranslation}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                    showTranslation ? "bg-white text-slate-900" : "text-white"
                  }`}
                >
                  {showTranslation ? "Hide translation" : "Show translation"}
                </button>

                <button
                  type="button"
                  onClick={increaseTranslationSize}
                  aria-label="Increase translation size"
                  className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white/85 transition hover:bg-white/10"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={pageIndex === pageCount - 1}
                className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">
                Speed
              </span>
              <div className="flex flex-1 items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/10">
                {speechRateOptions.map((rate) => {
                  const isActiveRate = speechRate === rate;
                  return (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSpeechRate(rate)}
                      className={`flex-1 rounded-full px-2 py-2 text-[10px] font-black uppercase tracking-wide transition ${
                        isActiveRate ? "bg-white text-slate-900 shadow-md" : "text-white/80"
                      }`}
                    >
                      {rate}x
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
