"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import Image from "next/image";
import {
  Select,
  SelectItem,
  Chip,
  Textarea,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";

import FileUploader from "@components/DropFile";

import FileViewer from "@components/FileViewer";

const MockModels = [
  { label: "Xenova/distilbert-base-cased-distilled-squad" },
  { label: "mock_model2" },
  { label: "mock_model3" },
];
const MockContext: string =
  "The University of British Columbia (UBC) is a public research university with campuses near Vancouver and in Kelowna. Established in 1908, it is the oldest university in British Columbia. With an annual research budget of $759 million, UBC funds over 8,000 projects a year.[The Vancouver campus is situated adjacent to the University Endowment Lands located about 10 km (6 mi) west of downtown Vancouver.[8] UBC is home to TRIUMF, Canada's national laboratory for particle and nuclear physics, which houses the world's largest cyclotron. In addition to the Peter Wall Institute for Advanced Studies and Stuart Blusson Quantum Matter Institute, UBC and the Max Planck Society collectively established the first Max Planck Institute in North America, specializing in quantum materials.[9] One of the largest research libraries in Canada, the UBC Library system has over 10 million volumes among its 21 branches.[10][11] The Okanagan campus, acquired in 2005, is located in Kelowna, British Columbia.Eight Nobel laureates, 74 Rhodes scholars, 65 Olympians garnering medals, ten fellows in both American Academy of Arts & Sciences and the Royal Society, and 273 fellows to the Royal Society of Canada have been affiliated with UBC.[4] Three Canadian prime ministers, including Canada's first female prime minister, Kim Campbell, and current prime minister, Justin Trudeau, have been educated at UBC.[12]";
const MockQuestion: string = "Who was Jim Henson?";

const Home = () => {
  // track the classification result and the model loading status.
  const [result, setResult] = useState<Worker | null>(null);
  const [ready, setReady] = useState<Boolean | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [context, setContext] = useState<string>("");

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
          setResult(e.data.output);
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

  console.log("Context: " + context);
  return (
    <div className="w-full flex-center flex-col gap-5 p-7">
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

      <FileUploader />

      <FileViewer context={context} setContext={setContext} />
      

      <Select
        items={MockModels}
        label="Model to use"
        placeholder="Select a model"
        defaultSelectedKeys={["Xenova/distilbert-base-cased-distilled-squad"]}
        className="max-w-lg"
      >
        {(MockModels) => (
          <SelectItem key={MockModels.label}>{MockModels.label}</SelectItem>
        )}
      </Select>

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
      </div>

      {ready !== null && (
        <pre className="bg-gray-100 p-2 rounded">
          {!ready || !result ? "Loading..." : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Home;
