import React, { useState } from "react";
import useSpeech from "../hooks/useSpeech.js";

export default function Jobs() {
  const { playSound } = useSpeech();
  const [activeJob, setActiveJob] = useState(null);

  // Duración total (texto + animación)
  const duracion = 1500;

  const traducciones = {
    farmer: "granjero",
    secretary: "secretaria",
    baker: "panadero",
    engineer: "ingeniero",
    painter: "pintor",
    vet: "veterinario",
    dentist: "dentista",
    butcher: "carnicero",
    pilot: "piloto",
    nurse: "enfermero",
    tailor: "sastre",
    teacher: "maestro",
    cook: "cocinero",
    hairdresser: "peluquero",
    singer: "cantante",
    doctor: "doctor",
  };

  // Cargar imágenes automáticamente
  const images = import.meta.glob("../assets/jobs/*.png", { eager: true });
  const jobs = Object.keys(images).map((path) => {
    const fileName = path.split("/").pop().replace(".png", "");
    const name = fileName.replace(/^\d+\s*-\s*/, "").trim().toLowerCase();
    return { name, img: images[path].default };
  });

  const colors = [
    "bg-red-500",
    "bg-blue-600",
    "bg-yellow-400",
    "bg-cyan-400",
    "bg-green-400",
    "bg-purple-600",
  ];

  const handleClick = (jobName) => {
    playSound(jobName);
    setActiveJob(jobName);
    setTimeout(() => setActiveJob(null), duracion);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-5 px-4 flex flex-col items-center">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {jobs.map((job, index) => {
          const color = colors[index % colors.length];
          const isActive = activeJob === job.name;

          return (
            <div
              key={job.name}
              className={`relative flex flex-col items-center justify-center rounded-xl p-2 cursor-pointer transition-transform duration-300 ${color} ${
                isActive ? "animate-pop" : "hover:scale-105"
              }`}
              onClick={() => handleClick(job.name)}
              style={{ animationDuration: `${duracion}ms` }}
            >
              {/* Traducción arriba de la imagen */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 bg-black/70 text-white text-sm font-bold py-1 text-center rounded-t-lg animate-fadeInOut"
                  style={{ animationDuration: `${duracion}ms` }}
                >
                  {traducciones[job.name]}
                </div>
              )}

              {/* Imagen */}
              <img
                src={job.img}
                alt={job.name}
                className="w-[140px] h-[120px] object-contain mx-auto"
              />

              {/* Nombre */}
              <p className="mt-2 text-white font-semibold capitalize text-sm sm:text-base">
                {job.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Animaciones CSS */}
      <style>
        {`
          /* Texto traducido (fade arriba) */
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ease-in-out forwards;
          }

          /* Animación de rebote (pop) */
          @keyframes pop {
            0% { transform: scale(1); }
            20% { transform: scale(1.15); }
            50% { transform: scale(1.05); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pop {
            animation: pop ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}
