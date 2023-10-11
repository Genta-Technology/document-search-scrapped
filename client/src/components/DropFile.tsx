"use client";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useState } from "react";


export default const DropFile = () => {

  return (
    <div className="w-[25vw]">
      <FileUploader
        multiple={false}
        name="file"
        types={fileTypes}
        label={"Drop a File"}
        className="max-w-max"
      />
    </div>

  );
}
