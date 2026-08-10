import { useEffect, useMemo, useRef, useState } from "react";
import whisperResult from "../assets/isaac_beech/Track 72_isaac_beech.json";
import audioSrc from "../assets/isaac_beech/Track 72_isaac_beech.mp3";
import isaacBeechImage from "../assets/isaac_beech/isaac_beech.png";

const stripPunctuation = (value) =>
  String(value)
    .trim()
    .replace(/^["'“”‘’([{<]+|[)"'“”‘’.,!?;:]+$/g, "");

export default function ExtraordinaryTeenager() {
  const audioRef = useRef(null);
  const textContainerRef = useRef(null);
  const wordRefs = useRef([]);
  const paragraphRefs = useRef([]);
  const paragraphJumpTimerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playRate, setPlayRate] = useState(1);
  const introSegments = useMemo(() => {
    const segments = Array.isArray(whisperResult?.segments) ? whisperResult.segments : [];
    return segments.slice(0, 2);
  }, []);
  const introText = useMemo(() => {
    const introWords = introSegments.flatMap((segment) => segment.words ?? []);
    return introWords.map((word) => String(word.word).trimStart()).join(" ").trim();
  }, [introSegments]);

  const words = useMemo(() => {
    const segments = Array.isArray(whisperResult?.segments) ? whisperResult.segments : [];

    return segments.flatMap((segment) => {
      if (!Array.isArray(segment.words)) {
        return [];
      }

      return segment.words
        .map((word) => {
          const cleaned = typeof word?.word === "string" ? word.word.trimStart() : "";

          if (!cleaned) {
            return null;
          }

          return {
            start: Number(word.start),
            end: Number(word.end),
            word: cleaned,
            probability:
              typeof word.probability === "number" && Number.isFinite(word.probability)
                ? word.probability
                : null,
          };
        })
        .filter(Boolean);
    });
  }, []);
  const introWordCount = introSegments.reduce((count, segment) => count + (segment.words?.length ?? 0), 0);
  const visibleWords = useMemo(() => words.slice(introWordCount), [words, introWordCount]);
  const paragraphWordGroups = useMemo(() => {
    const contentWords = visibleWords;
    const tooIndex = contentWords.findIndex((word) => stripPunctuation(word?.word) === "too");
    const funIndex = contentWords.findIndex((word) => stripPunctuation(word?.word) === "fun");

    if (tooIndex === -1 || funIndex === -1) {
      return [contentWords];
    }

    return [
      contentWords.slice(0, tooIndex + 1),
      contentWords.slice(tooIndex + 1, funIndex + 1),
      contentWords.slice(funIndex + 1),
    ];
  }, [visibleWords]);

  const activeIndex = useMemo(() => {
    if (!visibleWords.length) return -1;
    let candidate = -1;
    for (let i = 0; i < visibleWords.length; i += 1) {
      if (currentTime >= visibleWords[i].start) {
        candidate = i;
      } else {
        break;
      }
    }
    return candidate;
  }, [currentTime, visibleWords]);

  const paragraphWordIndices = useMemo(() => {
    let cursor = 0;
    return paragraphWordGroups.map((group) =>
      group.map(() => {
        const index = cursor;
        cursor += 1;
        return index;
      })
    );
  }, [paragraphWordGroups]);

  const paragraphStartIndices = useMemo(() => {
    let cursor = 0;
    return paragraphWordGroups.map((group) => {
      const start = cursor;
      cursor += group.length;
      return start;
    });
  }, [paragraphWordGroups]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.preload = "auto";
    audio.volume = 1;
    audio.src = audioSrc;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("seeked", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("seeked", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (paragraphJumpTimerRef.current) {
        window.clearTimeout(paragraphJumpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playRate;
  }, [playRate]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleRewindAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);

    const container = textContainerRef.current;
    if (container) {
      const isSmallScreen = window.matchMedia("(max-width: 639px)").matches;
      container.scrollTo({
        top: 0,
        behavior: isSmallScreen ? "smooth" : "auto",
      });
    }
  };

  const handleRewind = () => {
    const paragraphIndex =
      paragraphWordIndices.findIndex((indices) => indices.includes(activeIndex)) >= 0
        ? paragraphWordIndices.findIndex((indices) => indices.includes(activeIndex))
        : 0;

    void pauseThenJumpToParagraph(paragraphIndex);
  };

  const duration = audioRef.current?.duration || 0;
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const titleText = "An extraordinary teenager";

  useEffect(() => {
    const container = textContainerRef.current;
    const activeNode = wordRefs.current[activeIndex];
    if (!container || !activeNode || activeIndex < 0) return;

    const containerRect = container.getBoundingClientRect();
    const wordRect = activeNode.getBoundingClientRect();
    const topThreshold = containerRect.top + 64;
    const bottomThreshold = containerRect.bottom - 88;
    const wordAbove = wordRect.top < topThreshold;
    const wordBelow = wordRect.bottom > bottomThreshold;

    if (wordAbove || wordBelow) {
      const targetTop =
        container.scrollTop +
        (wordRect.top - containerRect.top) -
        container.clientHeight / 2 +
        wordRect.height / 2;

      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const container = textContainerRef.current;
    const activeNode = wordRefs.current[activeIndex];
    if (!container || !activeNode || activeIndex < 0) return;

    const activeWord = visibleWords[activeIndex];
    const startsHeStudies = stripPunctuation(activeWord?.word) === "He" && stripPunctuation(visibleWords[activeIndex + 1]?.word) === "studies";

    if (startsHeStudies) {
      const paragraphIndex = paragraphWordIndices.findIndex((indices) => indices.includes(activeIndex));
      const paragraphNode = paragraphRefs.current[paragraphIndex];
      if (paragraphNode) {
        paragraphNode.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [activeIndex, paragraphWordIndices, visibleWords]);

  const pauseThenJumpToParagraph = async (paragraphIndex) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (paragraphJumpTimerRef.current) {
      window.clearTimeout(paragraphJumpTimerRef.current);
      paragraphJumpTimerRef.current = null;
    }

    audio.pause();
    setIsPlaying(false);

    const targetIndex = paragraphStartIndices[paragraphIndex] ?? 0;
    const targetTime = visibleWords[targetIndex]?.start ?? 0;

    paragraphJumpTimerRef.current = window.setTimeout(async () => {
      audio.currentTime = targetTime;
      setCurrentTime(targetTime);
      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
      } catch {
        setIsPlaying(false);
      }
    }, 1000);
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-5rem)] items-start justify-center bg-[#8bd06e] px-3 pt-4 pb-24 dark:bg-[#20301f]">
      <div className="flex w-full max-w-[980px] flex-col">
        <div className="relative mb-1 rounded-[1.5rem] border-8 border-[#ff8a00] bg-[#ff8a00] px-4 py-2 shadow-lg shadow-black/15">
          <h1 className="whitespace-nowrap text-left text-[clamp(1.0rem,4.3vw,4.2rem)] font-black leading-none tracking-tight text-white [text-shadow:0_3px_0_rgba(0,0,0,0.06)]">
            {titleText}
          </h1>
          <img
            src={isaacBeechImage}
            alt="Isaac Beech"
            className="absolute right-3 top-1/2 h-14 w-auto -translate-y-1/2 rounded-[0.45rem] object-cover shadow-md shadow-black/20 sm:right-4 sm:h-20 md:h-[6.2rem]"
          />
        </div>

        <div
          ref={textContainerRef}
          className="min-h-[48vh] flex-1 overflow-y-auto rounded-[1.4rem] border-2 border-white bg-[#3aa0d8] p-3 shadow-2xl shadow-black/20 sm:min-h-[58vh] sm:p-4"
        >
          <div className="text-[clamp(1rem,2.1vw,1.15rem)] font-semibold leading-[1.38] text-white sm:leading-[1.58]">
            {paragraphWordGroups.map((paragraphWords, paragraphIndex) => {
              return (
                <p
                  key={paragraphIndex}
                  ref={(node) => {
                    if (node) {
                      paragraphRefs.current[paragraphIndex] = node;
                    }
                  }}
                  className="m-0 mb-4 flex flex-wrap items-start gap-x-1 gap-y-0 break-normal whitespace-normal last:mb-0 sm:mb-8"
                >
                  {paragraphWords.map((word, wordPosition) => {
                    const displayWord = String(word.word).trimStart();
                    const wordIndex = paragraphWordIndices[paragraphIndex]?.[wordPosition] ?? -1;
                    const isActive = wordIndex === activeIndex;
                    const isParagraphStart = wordPosition === 0;

                    return (
                      <span
                        key={`${paragraphIndex}-${wordPosition}-${displayWord}`}
                        ref={(node) => {
                          if (node) {
                            wordRefs.current[wordIndex] = node;
                          }
                        }}
                        onClick={isParagraphStart ? () => pauseThenJumpToParagraph(paragraphIndex) : undefined}
                        role={isParagraphStart ? "button" : undefined}
                        tabIndex={isParagraphStart ? 0 : undefined}
                        onKeyDown={
                          isParagraphStart
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  pauseThenJumpToParagraph(paragraphIndex);
                                }
                              }
                            : undefined
                        }
                        className={`inline-block whitespace-nowrap rounded-[0.35rem] px-0.5 py-0.5 align-baseline transition-colors duration-150 ${
                          isActive ? "bg-white text-[#1f93d0] shadow-md shadow-white/30" : "bg-transparent"
                        }`}
                      >
                        {displayWord}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-3 left-2 right-2 z-[9999] pointer-events-auto sm:left-3 sm:right-3">
        <div className="mx-auto flex max-w-[980px] flex-col gap-2 overflow-hidden rounded-2xl bg-white/20 px-2 py-2 shadow-xl shadow-black/15 backdrop-blur-sm pointer-events-auto">
          <audio ref={audioRef} src={audioSrc} preload="auto" className="hidden" />

          <div className="h-1 overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-[#7CFC00] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-nowrap items-center justify-center gap-1 overflow-hidden sm:gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pausa" : "Iniciar"}
              className="flex h-10 w-[4.15rem] shrink-0 items-center justify-center rounded-[1.3rem] bg-transparent transition hover:scale-[1.02] active:scale-[0.98] pointer-events-auto touch-manipulation sm:h-11 sm:w-[4.6rem] sm:rounded-[1.35rem]"
            >
              <span className="flex h-9 w-12 items-center justify-center rounded-[0.95rem] bg-[#2b2b2b] shadow-[0_0_0_2px_#efefef] sm:h-10 sm:w-[3.35rem] sm:rounded-[1rem]">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#7CFC00]" aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" rx="0.8" />
                    <rect x="14" y="5" width="4" height="14" rx="0.8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-[#7CFC00]" aria-hidden="true">
                    <path d="M8 5l11 7-11 7z" />
                  </svg>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop"
              className="flex h-10 w-[4.15rem] shrink-0 items-center justify-center rounded-[1.3rem] bg-transparent transition hover:scale-[1.02] active:scale-[0.98] pointer-events-auto touch-manipulation sm:h-11 sm:w-[4.6rem] sm:rounded-[1.35rem]"
            >
              <span className="flex h-9 w-12 items-center justify-center rounded-[0.95rem] bg-[#2b2b2b] shadow-[0_0_0_2px_#efefef] sm:h-10 sm:w-[3.35rem] sm:rounded-[1rem]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#7CFC00]" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              onClick={handleRewind}
              aria-label="Rebobinar párrafo"
              className="flex h-10 w-[4.15rem] shrink-0 items-center justify-center rounded-[1.3rem] bg-transparent transition hover:scale-[1.02] active:scale-[0.98] pointer-events-auto touch-manipulation sm:h-11 sm:w-[4.6rem] sm:rounded-[1.35rem]"
            >
              <span className="flex h-9 w-12 items-center justify-center rounded-[0.95rem] bg-[#2b2b2b] shadow-[0_0_0_2px_#efefef] sm:h-10 sm:w-[3.35rem] sm:rounded-[1rem]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#7CFC00]" aria-hidden="true">
                  <path d="M11 12l8 7V5l-8 7z" />
                  <path d="M5 12l8 7V5l-8 7z" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              onClick={handleRewindAudio}
              aria-label="Rebobinar al inicio"
              className="flex h-10 w-[4.15rem] shrink-0 items-center justify-center rounded-[1.3rem] bg-transparent transition hover:scale-[1.02] active:scale-[0.98] pointer-events-auto touch-manipulation sm:h-11 sm:w-[4.6rem] sm:rounded-[1.35rem]"
            >
              <span className="flex h-9 w-12 items-center justify-center rounded-[0.95rem] bg-[#2b2b2b] shadow-[0_0_0_2px_#efefef] sm:h-10 sm:w-[3.35rem] sm:rounded-[1rem]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#7CFC00]" aria-hidden="true">
                  <path d="M6 4h2v16H6z" />
                  <path d="M18 5L8 12l10 7V5z" />
                </svg>
              </span>
            </button>

            <div className="shrink-0 rounded-full bg-[#2b2b2b]/85 px-2 py-1 text-[10px] font-black tracking-[0.12em] text-[#7CFC00] sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.16em]">
              {playRate.toFixed(1)}x
          </div>
            <div className="hidden shrink-0 items-center justify-center gap-2 rounded-full bg-[#2b2b2b]/85 px-3 py-1 text-[10px] font-black tracking-[0.12em] text-white sm:flex sm:gap-3 sm:px-4">
              {[1, 0.9, 0.7, 0.6].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlayRate(rate)}
                  className={`rounded-full px-2 py-1 transition ${playRate === rate ? "bg-[#7CFC00] text-[#2b2b2b]" : "bg-white/10 text-white"}`}
                >
                  {rate.toFixed(1)}x
                </button>
              ))}
            </div>
            <label className="flex shrink-0 items-center gap-2 rounded-full bg-[#2b2b2b]/85 px-2 py-1 text-[10px] font-black tracking-[0.12em] text-white sm:hidden">
              <span className="sr-only">Velocidad</span>
              <select
                value={playRate}
                onChange={(e) => setPlayRate(Number(e.target.value))}
                className="h-7 rounded-full border-0 bg-[#7CFC00] px-2 text-[10px] font-black text-[#2b2b2b] outline-none"
              >
                <option value="1">1.0x</option>
                <option value="0.9">0.9x</option>
                <option value="0.7">0.7x</option>
                <option value="0.6">0.6x</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}



