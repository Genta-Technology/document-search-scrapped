"use client";

import React, { useCallback, useEffect, useState } from "react";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

function highlightPattern(text: string, pattern: string) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export default function FileViewer() {
  const [searchText, setSearchText] = useState<string>("");

  const [numPages, setNumPages] = useState(null);
  const [context, setContext] = useState<string>("");

  // Display the first page
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  // Highlighting given text
  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText],
  );

  const getTextPage = useCallback(
    (e: any) =>
      e.getTextContent().then((textContent: any) => {
        let pageText: string = textContent.items
          .map((s: any) => s.str)
          .join("");
        setContext((prev) => prev + " " + pageText);
      }),
    [],
  );
  console.log("Context: " + context);

  // Uodate search text
  function onChange(event: any) {
    setSearchText(event.target.value);
  }

  return (
    <div className="justify-center flex-col items-center flex gap-[0.25vw]">
      <Document file={"./sample3.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            onLoadSuccess={getTextPage}
            customTextRenderer={textRenderer}
          />
        ))}
      </Document>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
