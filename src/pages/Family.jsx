import React, { useState } from "react";
import useSpeech from "../hooks/useSpeech.js";

export default function Family() {
  const { playSound } = useSpeech();
  const [active, setActive] = useState(null);
  const duracion = 2600;

  // Carga automática de las imágenes desde /src/assets/family
  const images = import.meta.glob("../assets/family/*.png", { eager: true });
  const imgs = {};
  Object.keys(images).forEach((p) => {
    const filename = p.split("/").pop().replace(".png", "");
    imgs[filename] = images[p].default;
  });

  // Mapeo de archivos (asegurate que los nombres coincidan con los PNG)
  const keys = {
    grandfather: "1_grandfather",
    grandmother: "2_grandmother",
    mother: "3_mother",
    father: "4_father",
    aunt: "5_aunt",
    uncle: "6_uncle",
    sister: "7_sister",
    you: "8_you",
    brother: "9_brother",
    cousin1: "10_cousin",
    cousin2: "11_cousin2",
  };

  const labels = {
    grandfather: "grandfather",
    grandmother: "grandmother",
    mother: "mother",
    father: "father",
    aunt: "aunt",
    uncle: "uncle",
    sister: "sister",
    you: "you",
    brother: "brother",
    cousin1: "cousin",
    cousin2: "cousin",
  };

  const play = (keyName) => {
    const fileKey = keys[keyName];
    if (!fileKey) return;
    if (fileKey.includes("you")) return; // you no hace nada
    const word = labels[keyName];
    playSound(word);
    setActive(keyName);
    setTimeout(() => setActive(null), duracion);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-300 dark:bg-gray-800 p-3">
      <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        👪 My Family
      </h4>

      {/* contenedor principal: 2 columnas x 3 filas */}
      <div className="relative w-full max-w-[980px] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
           style={{ height: "88vh" }}>
        {/* línea divisoria vertical central (opcional) */}
        <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gray-400 pointer-events-none transform -translate-x-1/2" />

        <div className="grid grid-cols-2 grid-rows-3 h-full gap-y-2 sm:gap-y-4">

          {/* ROW 1 */}
          <div className="flex items-center justify-center"> 
            <FamilyMember
              img={imgs[keys.grandfather]}
              label={labels.grandfather}
              onClick={() => play("grandfather")}
              isActive={active === "grandfather"}
              duracion={duracion}
              size="large"
            />
          </div>

          <div className="flex items-center justify-center">
            <FamilyMember
              img={imgs[keys.grandmother]}
              label={labels.grandmother}
              onClick={() => play("grandmother")}
              isActive={active === "grandmother"}
              duracion={duracion}
              size="large"
            />
          </div>

          {/* ROW 2 - pareja de la izquierda (mother,father) | pareja derecha (aunt,uncle) */}
          <div className="flex items-center justify-center">
            <div className="flex gap-6 sm:gap-8 items-center">
              <FamilyMember
                img={imgs[keys.mother]}
                label={labels.mother}
                onClick={() => play("mother")}
                isActive={active === "mother"}
                duracion={duracion}
                size="medium"
              />
              <FamilyMember
                img={imgs[keys.father]}
                label={labels.father}
                onClick={() => play("father")}
                isActive={active === "father"}
                duracion={duracion}
                size="medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex gap-6 sm:gap-8 items-center">
              <FamilyMember
                img={imgs[keys.aunt]}
                label={labels.aunt}
                onClick={() => play("aunt")}
                isActive={active === "aunt"}
                duracion={duracion}
                size="medium"
              />
              <FamilyMember
                img={imgs[keys.uncle]}
                label={labels.uncle}
                onClick={() => play("uncle")}
                isActive={active === "uncle"}
                duracion={duracion}
                size="medium"
              />
            </div>
          </div>

          {/* ROW 3 - left: sister,you,brother  | right: cousins */}
          <div className="flex items-center justify-center">
            <div className="flex gap-6 sm:gap-8 items-center">
              <FamilyMember
                img={imgs[keys.sister]}
                label={labels.sister}
                onClick={() => play("sister")}
                isActive={active === "sister"}
                duracion={duracion}
                size="small"
              />
              <FamilyMember
                img={imgs[keys.you]}
                label={labels.you}
                onClick={() => play("you")}
                isActive={false} // you no activa
                duracion={duracion}
                size="small"
                disabled
              />
              <FamilyMember
                img={imgs[keys.brother]}
                label={labels.brother}
                onClick={() => play("brother")}
                isActive={active === "brother"}
                duracion={duracion}
                size="small"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex gap-6 sm:gap-8 items-center">
              <FamilyMember
                img={imgs[keys.cousin1]}
                label={labels.cousin1}
                onClick={() => play("cousin1")}
                isActive={active === "cousin1"}
                duracion={duracion}
                size="small"
              />
              <FamilyMember
                img={imgs[keys.cousin2]}
                label={labels.cousin2}
                onClick={() => play("cousin2")}
                isActive={active === "cousin2"}
                duracion={duracion}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      {/* estilos de animaciones */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-6px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-6px); }
          }
          .animate-fadeInOut { animation: fadeInOut ease-in-out forwards; }

          @keyframes pop {
            0% { transform: scale(1); }
            20% { transform: scale(1.18); }
            50% { transform: scale(1.08); }
            80% { transform: scale(1.12); }
            100% { transform: scale(1); }
          }
          .animate-pop { animation: pop ease-in-out forwards; }
        `}
      </style>
    </div>
  );
}

/* ----------------- FamilyMember ----------------- */
function FamilyMember({
  img,
  label,
  onClick,
  isActive,
  duracion,
  size = "medium",
  disabled = false,
}) {
  // tamaños por "tipo" (ajustalos si querés)
  const sizeClass =
    size === "large"
      ? "w-[140px] sm:w-[160px] md:w-[170px] lg:w-[180px]"
      : size === "medium"
      ? "w-[110px] sm:w-[125px] md:w-[135px] lg:w-[145px]"
      : "w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px]";

  // Comentario: para agrandar TODAS las fotos un 10% -> multiplicá cada valor por 1.1
  // (ej. w-[154px] sm:w-[176px] ...)

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`relative bg-transparent border-0 ${disabled ? "cursor-default" : "cursor-pointer"}`}
      >
        <img
          src={img}
          alt={label}
          className={`${sizeClass} rounded-full border-4 border-white shadow-lg transition-transform ${isActive ? "animate-pop" : "hover:scale-[1.03]"}`}
        />
        {isActive && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm sm:text-base font-semibold px-2 py-2 rounded-md animate-fadeInOut"
            style={{ animationDuration: `${duracion}ms` }}
          >
            {label}
          </div>
        )}
      </button>
    </div>
  );
}
