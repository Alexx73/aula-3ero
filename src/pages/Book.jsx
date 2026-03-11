// import React from "react";
// import BookViewer from "../components/BookViewer";

// export default function Book() {
//   return (
//     <BookViewer
//       pdf="engage_tarter_students_units5_8.pdf"
//       // title="Engage Starter Students Units 5–8"
//     />
//   );
// }

import React from "react";

const pdfUrl =
"https://alexx73.github.io/aula-3ero/engage_tarter_students_units5_8.pdf";

export default function Book() {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col">

      {/* <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
        <h1 className="text-lg font-bold">
          📘 Engage Starter Students Units 5–8
        </h1>

        <a
          href={pdfUrl}
          target="_blank"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Abrir en pestaña
        </a>
      </div> */}

      <iframe
      href={pdfUrl}
        src={pdfUrl}
        className="flex-1 w-full"
        title="Book"
      />

    </div>
  );
}