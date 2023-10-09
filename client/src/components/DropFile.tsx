import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PDF"];

const DropFile = () => {
    const [file, setFile] = useState<File>();
    const [isUploaded, setIsUploaded] = useState<boolean>();

    const handleChange = (file : File) => {
        setFile(file);
    };
    const handleFileUploaded = (file : File) => {
        setIsUploaded(true);
    };
    return(
        <div className="w-[25vw]">
            <FileUploader 
                multiple={false} 
                handleChange={handleChange} 
                name="file" 
                types={fileTypes} 
                label={"Drop a File"}
                className="max-w-max"
                onDrop={handleFileUploaded}
            />
        </div>
    )
}

export default DropFile;