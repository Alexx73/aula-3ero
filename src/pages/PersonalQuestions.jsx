import React, { useState } from "react";
import useSpeech from "../hooks/useSpeech";
import questions from "../data/Questions";
import girl from "../assets/girl.png";
import boy from "../assets/boy.png";

export default function PersonalQuestions() {
  const { playSound } = useSpeech();
  const [activeItem, setActiveItem] = useState(null);
  const [seenMessages, setSeenMessages] = useState(new Set());

  const duracionBase = 4400; // ms
  const duracionExtra = 3400; // ms -> se puede ajustar más adelante
  const animacion = 800; // ms

  const markAsSeen = (text) => {
    setSeenMessages((prev) => new Set([...prev, text]));
  };

  // 🔹 Calcula duración según cantidad de palabras
  const getDuracionTotal = (text) => {
    const numPalabras = text.split(" ").length;
    return numPalabras > 4 ? duracionBase + duracionExtra : duracionBase;
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-3 bg-[#e5ddd5] font-sans relative dark:bg-gray-800">
      {/* Encabezado tipo WhatsApp */}
      <div className="bg-green-600 text-white py-3 px-4 rounded-t-xl shadow-md text-center sticky top-0 z-10">
        <h4 className="text-lg font-semibold">💬 Personal Questions</h4>
      </div>

      {/* Contenedor de mensajes */}
      <div className="flex flex-col gap-3 py-6 overflow-y-auto max-h-[calc(100vh-100px)]">
        {questions.map((item) => {
          const duracionPregunta = getDuracionTotal(item.question);
          const duracionRespuesta = getDuracionTotal(item.answer);

          return (
            <div key={item.number} className="flex flex-col gap-2 mb-6">
              {/* PREGUNTA (izquierda) */}
              <div className="flex items-start gap-2">
                <img src={boy} alt="Boy" className="w-12 h-12 rounded-full self-end" />
                <div
                  className={`relative bg-white text-gray-800 rounded-2xl p-3 max-w-[75%] shadow-sm border border-gray-200 transition-transform ${
                    activeItem?.type === "question" && activeItem.text === item.question
                      ? "animate-bubble"
                      : ""
                  }`}
                  style={{ animationDuration: `${animacion}ms` }}
                >
                  <p
                    className="text-sm font-medium cursor-pointer"
                    onClick={() => {
                      const duracionTotal = getDuracionTotal(item.question);
                      playSound(item.question, false);
                      setActiveItem({ type: "question", text: item.question });
                      markAsSeen(item.question);
                      setTimeout(() => setActiveItem(null), duracionTotal);
                    }}
                  >
                    {item.number}. {item.question}
                  </p>

                  {/* Traducción temporal */}
                  {activeItem?.type === "question" &&
                    activeItem.text === item.question && (
                      <div
                        className="absolute -top-6 left-0 right-0 bg-black/70 text-white text-xs font-semibold py-1 text-center rounded-t-lg animate-fadeInOut"
                        style={{ animationDuration: `${duracionPregunta}ms` }}
                      >
                        {item.translationQuestion}
                      </div>
                    )}

                  {/* ✅✅ Doble check azul */}
                  {seenMessages.has(item.question) && (
                    <div className="absolute bottom-1 right-2 text-[#34B7F1] text-xs font-bold flex items-center gap-[1px]">
                      <span>✓</span>
                      <span>✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RESPUESTA (derecha) */}
              <div className="flex items-start justify-end gap-2">
                <div
                  className={`relative bg-green-200 text-gray-900 rounded-2xl p-3 max-w-[75%] shadow-sm border border-green-300 transition-transform ${
                    activeItem?.type === "answer" && activeItem.text === item.answer
                      ? "animate-bubble"
                      : ""
                  }`}
                  style={{ animationDuration: `${animacion}ms` }}
                >
                  <p
                    className="text-sm font-medium cursor-pointer text-right"
                    onClick={() => {
                      const duracionTotal = getDuracionTotal(item.answer);
                      playSound(item.answer, false);
                      setActiveItem({ type: "answer", text: item.answer });
                      markAsSeen(item.answer);
                      setTimeout(() => setActiveItem(null), duracionTotal);
                    }}
                  >
                    {item.answer}
                  </p>

                  {/* Traducción temporal */}
                  {activeItem?.type === "answer" &&
                    activeItem.text === item.answer && (
                      <div
                        className="absolute -top-6 left-0 right-0 bg-black/70 text-white text-xs font-semibold py-1 text-center rounded-t-lg animate-fadeInOut"
                        style={{ animationDuration: `${duracionRespuesta}ms` }}
                      >
                        {item.translationAnswer}
                      </div>
                    )}

                  {/* ✅✅ Doble check azul */}
                  {seenMessages.has(item.answer) && (
                    <div className="absolute bottom-1 right-2 text-[#34B7F1] text-xs font-bold flex items-center gap-[1px]">
                      <span>✓</span>
                      <span>✓</span>
                    </div>
                  )}
                </div>
                <img src={girl} alt="Girl" className="w-12 h-12 rounded-full self-end" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Estilos de animación */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-8px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-8px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ease-in-out forwards;
          }

          @keyframes bubble {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1.05); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-bubble {
            animation: bubble ease-in-out forwards;
          }

          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
}
