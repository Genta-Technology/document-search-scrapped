"use client";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useState } from "react";

export default function DropFile() {
  return (
    <FilePond
      server={{
        process: "/api/upload",
        fetch: null,
        revert: null,
      }}
    />
  );
}
