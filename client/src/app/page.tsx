"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import Image from "next/image";
import {
  Select,
  SelectItem,
  Textarea,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";

import FileUploader from "@components/DropFile";

import FileViewer from "@components/FileViewer";

const MockModels = [
  { label: "Xenova/distilbert-base-cased-distilled-squad" },
];

const Home = () => {
  // track the classification result and the model loading status.
  const [result, setResult] = useState<Worker | null>(null);
  const [ready, setReady] = useState<Boolean | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [pdfFile, setPdfFile]=useState(null);

  // Create a reference to the worker object.
  const worker: any = useRef(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: any) => {
      switch (e.data.status) {
        case "initiate":
          setReady(false);
          break;
        case "ready":
          setReady(true);
          break;
        case "complete":
          setResult(e.data.output.answer);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);
    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  const classify = useCallback((question: string, context: string) => {
    if (worker.current) {
      worker.current.postMessage({ question, context });
    }
  }, []);

  const fileType = ["application/pdf"];
  const handlePdfFileChange = (e: any) => {
    let selectedFile = e;
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e: any) => {
            setPdfFile(e.target.result);
        };
      }
    }
  };
  return (
    <div className="flex w-[100%]">
      <div className="bg-gray-800 h-screen p-5 pt-8 w-[33vw] fixed items-center justify-end space-y-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)]">
        <div className="flex gap-4 items-center justify-center mb-3">
          <Image
            src="/Genta_Logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="font-satoshi font-semibold text-lg tracking-wide blue_gradient text_gradient">
            Document Search
          </p>
        </div>
        <div className="flex justify-center">
          <FileUploader handlePdfFileChange={handlePdfFileChange} />
        </div>
        <div className="gap-6">
          <Select
            items={MockModels}
            label="Model to use"
            placeholder="Select a model"
            defaultSelectedKeys={[
              "Xenova/distilbert-base-cased-distilled-squad",
            ]}
            className="max-w-lg"
          >
            {(MockModels) => (
              <SelectItem key={MockModels.label}>{MockModels.label}</SelectItem>
            )}
          </Select>
        </div>

        <div className="w-full max-w-2xl flex flex-col">
          <Textarea
            label="Question"
            placeholder="Ask a question i.e 'what is TRIUMF?'"
            description="Enter a consice question about the document"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuestion(e.target.value);
            }}
          />

          <pre className="flex-end">
            {ready !== null && (!ready || !result) ? (
              <Button color="primary" isLoading>
                Loading..
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                onClick={() => classify(question, context)}
              >
                Ask
              </Button>
            )}
          </pre>
          {ready !== null && (
            <pre className="bg-gray-100 p-2 rounded">
              {!ready || !result ? (
                "Loading..."
              ) : (
                <Card className="max-w-2xl">
                  <CardBody>{JSON.stringify(result, null, 2)}</CardBody>
                </Card>
              )}
            </pre>
          )}
        </div>
      </div>
      <div className="h-screen p-5 pt-8 w-[33vw] p-5 pt-8"></div>
      <div className="flex justify-center  w-[100%]">
        <FileViewer
          context={context}
          setContext={setContext}
          resultFromModel={JSON.stringify(result, null, 2)}
          pdfFile={pdfFile}
        />
      </div>
    </div>
  );
};

export default Home;
