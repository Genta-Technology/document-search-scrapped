"use client";

import React, { useCallback, useState } from "react";

import { Button } from "@nextui-org/react";

import { pdfjs, Document, Page } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

function highlightPattern(text: string, pattern: string) {
  console.log("text: " + text);
  console.log("pattern: " + pattern);
  console.log("index: " + text.indexOf(pattern));
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export default function FileViewer() {
  const [searchText, setSearchText] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Display the first page
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // Navigation
  function changePage(offset: any) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }
  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // Highlighting given text
  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText],
  );

  // Uodate search text
  function onChange(event: any) {
    setSearchText(event.target.value);
  }

  return (
    <div className="justify-center flex-col items-center flex gap-[0.25vw]">
      <div className="flex justify-center max-w-full flex-col items-center gap-[0.25vw]">
        <p className="items-center justify-center flex-auto">
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <div className="flex justify-between items-center w-[30vw]">
          <Button
            color="primary"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            color="primary"
            disabled={numPages === null || pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </div>

      <Document file={"./sample2.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} customTextRenderer={textRenderer} />
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
