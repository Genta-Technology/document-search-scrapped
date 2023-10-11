"use client";

import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@nextui-org/react";

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

  const [currentPageText, setCurrentPageText] = useState<string>("");
  const [context, setContext] = useState<string>("");

  // Get number of pages
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  // Highlighting given text
  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText],
  );

  // Get text from single page
  const getTextPage = useCallback(
    (e: any) =>
      e.getTextContent().then((textContent: any) => {
        let pageText: string = textContent.items
          .map((s: any) => s.str)
          .join("");
        setCurrentPageText(pageText);
        console.log("Current page: " + pageText);
      }),
    [],
  );

  // Update context (still missing the last page)
  useEffect(() => {
    setContext(context + " " + currentPageText);
    console.log("Context: " + context);
  }, [currentPageText]);

  // Uodate search text
  function onChange(event: any) {
    setSearchText(event.target.value);
  }

  return (
    <div className="justify-center flex-col items-center">
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>

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
    </div>
  );
}
