import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PDF"];

const DropFile = (props: any) => {

  return (
    <div className="w-[25vw]">
      <FileUploader
        multiple={false}
        name="file"
        types={fileTypes}
        label={"Drop a File"}
        className="max-w-max"
        handleChange={(e: any) => props.handlePdfFileChange(e)}
      />
    </div>
  );
};

export default DropFile;
