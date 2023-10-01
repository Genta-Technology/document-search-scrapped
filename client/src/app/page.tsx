"use client";

import Image from "next/image";
import { Select, SelectItem, Chip, Textarea } from "@nextui-org/react";

const MockModels = [
  { label: "mock_model1" },
  { label: "mock_model2" },
  { label: "mock_model3" },
];

const Home = () => {
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

      <Chip> Select_file_placeholder </Chip>

      <Select
        items={MockModels}
        label="Model to use"
        placeholder="Select a model"
        className="max-w-lg"
      >
        {(MockModels) => (
          <SelectItem key={MockModels.label}>{MockModels.label}</SelectItem>
        )}
      </Select>

      <Textarea
        label="Question"
        placeholder="Ask a question"
        description="Enter a consice question about the document"
      />

      <Chip> submit_button_placeholder </Chip>
      <Chip> view_pdf_placeholder </Chip>
    </div>
  );
};

export default Home;
