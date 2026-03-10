import React, { useState, useEffect } from "react";

import lisaImg from "../assets/lisa1.png";

// Preguntas y personajes
const questions = [
  { text: "What is your first name?", character: 0 },
  { text: "How old are you?", character: 1 },
  //   { text: "What is your phone number?", character: 0 },
  //   { text: "What is your last name?", character: 1 },
  //   { text: "What is your address?", character: 0 },
  //   { text: "What is your Email address?", character: 1 },
  //   { text: "What is your favorite subject?", character: 0 },
  //   { text: "What is your favorite color?", character: 1 },
  //   { text: "What city are you from?", character: 0 },
  //   { text: "What country are you from?", character: 1 },
];

const characters = [
  { img: lisaImg, name: "Lisa" },
  { img: lisaImg, name: "Lisa" },
];

// Función para pronunciar la pregunta
function speak(text) {
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.voice =
    window.speechSynthesis
      .getVoices()
      .find((v) => v.lang === "en-US" && v.gender === "female") || null;
  utter.lang = "en-US";
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

function getFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name === "Samantha" ||
          v.name === "Google US English" ||
          v.name === "Microsoft Zira Desktop" ||
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("woman")),
    ) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0]
  );
}

// Nueva función para mostrar el mensaje final
function FinPreguntas({ onRestart, onHome }) {
  return (
    <div className="animate-fade-in flex h-96 flex-col items-center justify-center">
      <div className="mb-6">
        <img
          src={lisaImg}
          alt="Lisa"
          className="mx-auto h-32 w-32 animate-bounce rounded-full"
        />
      </div>
      <h2 className="mb-4 animate-pulse text-3xl font-extrabold text-blue-600 dark:text-blue-400">
        ¡Felicitaciones!
      </h2>
      <p className="mb-6 text-center text-lg text-gray-700 dark:text-gray-200">
        Has respondido todas las preguntas.
        <br />
        ¡Eres un campeón!
      </p>
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="transform animate-bounce rounded bg-green-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-green-600"
        >
          Volver a contestar
        </button>
        <button
          onClick={onHome}
          className="transform animate-bounce rounded bg-purple-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default function PersonalInformation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [speakingWordIdx, setSpeakingWordIdx] = useState(-1);
  const [voiceReady, setVoiceReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false); // Nuevo estado para controlar la pausa
  const [finished, setFinished] = useState(false);

  // Espera a que la voz femenina esté disponible
  useEffect(() => {
    function checkVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (getFemaleVoice()) {
        setVoiceReady(true);
      }
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = checkVoice;
    } else {
      checkVoice();
    }
  }, []);

  // Pronuncia la pregunta y resalta cada palabra
  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    function speakQuestion() {
      if (cancelled) return;
      window.speechSynthesis.cancel(); // Cancela cualquier pronunciación previa

      const utter = new window.SpeechSynthesisUtterance(questions[step].text);
      utter.voice = getFemaleVoice();
      utter.lang = "en-US";
      utter.pitch = 1.2;
      utter.rate = 0.5;

      utter.onboundary = (event) => {
        if (event.name === "word") {
          // Encuentra el índice de la palabra actual
          const before = utter.text.slice(0, event.charIndex);
          // Usa split(/\s+/) para mayor precisión
          const idx = before.trim().split(/\s+/).length - 1;
          setSpeakingWordIdx(idx);
        }
      };

      utter.onend = () => {
        setSpeakingWordIdx(-1);
      };

      window.speechSynthesis.speak(utter);
    }

    // Espera a que las voces estén listas antes de hablar
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakQuestion;
    } else {
      speakQuestion();
    }

    return () => {
      cancelled = true;
      window.speechSynthesis.cancel();
      setSpeakingWordIdx(-1);
    };
  }, [step, started]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswers([...answers, input]);
    setInput("");
    if (step < questions.length - 1) {
      setIsWaiting(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsWaiting(false);
      }, 1000); // 1500 ms de pausa, puedes ajustar el tiempo
    } else {
      // Ejecuta finPreguntas al terminar
      setFinished(true);
    }
  };

  // Funciones para los botones finales
  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setInput("");
    setFinished(false);
    setStarted(false);
  };

  const handleHome = () => {
    window.location.href = "/"; // O usa navigate si tienes react-router
  };

  const words = questions[step].text.split(" ");

  return (
  <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-white px-4">
    {/* CONTENEDOR GENERAL RESPONSIVO */}
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800">
        {!started ? (
          <div className="flex h-96 flex-col items-center justify-center">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Personal Information
            </h2>
            <button
              className={`rounded px-6 py-3 font-semibold text-white transition ${
                voiceReady
                  ? "cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-400 dark:bg-gray-700"
              }`}
              disabled={!voiceReady}
              onClick={() => setStarted(true)}
            >
              {voiceReady ? "Comenzar" : "Cargando voz..."}
            </button>
            {!voiceReady && (
              <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
                Esperando voz femenina americana...
              </p>
            )}
          </div>
        ) : finished ? (
          <FinPreguntas onRestart={handleRestart} onHome={handleHome} />
        ) : (
          <>
            <div className="mb-6 flex items-center">
              <img
                src={characters[questions[step].character].img}
                alt={characters[questions[step].character].name}
                className="mr-4 h-36 w-36 rounded-full bg-yellow-300"
              />
              <span className="text-lg font-bold">
                {characters[questions[step].character].name}
              </span>
            </div>

            {/* Texto que se pronuncia */}
            <div className="mb-4 flex flex-wrap gap-2 font-semibold transition-all duration-300">
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={
                    speakingWordIdx === idx
                      ? "rounded bg-blue-600 px-2 py-1 text-3xl text-white transition-all duration-300 dark:bg-blue-500"
                      : "text-xl text-black transition-all duration-300 dark:text-white"
                  }
                >
                  {word}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white dark:bg-blue-500"
                disabled={isWaiting}
              >
                {isWaiting ? "Espere..." : "Next"}
              </button>
            </form>

            <div className="mt-6 w-full">
              <h3 className="mb-2 font-bold">Your Answers:</h3>
              <ul className="list-disc pl-6">
                {answers.map((ans, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{questions[idx].text}</span>:{" "}
                    {ans}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Animación fade-in */}
    <style>
      {`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
      `}
    </style>
  </div>
);

}
