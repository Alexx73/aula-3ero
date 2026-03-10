import React from 'react'

export default function Inicio() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-blue-100 to-blue-200 p-6 dark:from-gray-900 dark:to-gray-800">
      {/* Encabezado */}
      <h1 className="mb-4 text-center text-3xl font-extrabold text-blue-800 md:text-4xl dark:text-blue-300">
        👋 Welcome to English Class!
      </h1>
      <p className="mb-6 max-w-xl text-center text-lg text-gray-700 dark:text-gray-300">
        Queridos estudiantes, esta es nuestra plataforma interactiva para
        aprender y practicar inglés. ¡Espero que disfruten cada actividad! 🎉
      </p>

      {/* Imagen + GIF */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row">
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048945.png"
          alt="English Learning"
          className="h-32 w-32 drop-shadow-lg"
        /> */}
        <img
          src="https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif"
          alt="Funny Hello"
          className="h-120 w-120 rounded-xl shadow-lg"
        />
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Students"
          className="h-32 w-32 drop-shadow-lg"
        /> */}
      </div>

    
     <div className="mt-10 flex gap-4 w-full max-w-md">
  
 
</div>
    </div>
  );
}
