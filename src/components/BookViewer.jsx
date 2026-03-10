import React from "react";

export default function BookViewer({ pdf, title }) {

  const base = import.meta.env.BASE_URL;

  const pdfUrl = `${base}${pdf}`;

  const isLocal = window.location.hostname === "localhost";

  const viewer = isLocal
    ? pdfUrl
    : `https://docs.google.com/gview?url=${window.location.origin}${pdfUrl}&embedded=true`;

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col">

      {/* <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
        <h1 className="text-lg font-bold">
          📘 {title}
        </h1>

        <a
          href={pdfUrl}
          download
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ⬇ Descargar
        </a>
      </div> */}

      <iframe
        src={viewer}
        className="flex-1 w-full"
        title={title}
      />

    </div>
  );
}