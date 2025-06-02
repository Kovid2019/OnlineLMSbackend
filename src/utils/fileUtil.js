import { unlink } from "fs";
import { resolve } from "path";

//Actually Deletes the file
export const deleteFile = (filePath) => {
  try {
    unlink(resolve(filePath), () => {
      console.log((filePath, "deleted successfully"));
    });
  } catch (error) {
    console.log(error);
  }
};

//Is it single file or array of files to be deleted
export const deleteUploadedFiles = (req) => {
  //Single file case
  if (req.file) {
    deleteFile(req.file.path);
    return;
  }
  //Multiple files case
  if (req.files) {
    req.files.map((f) => deleteFile(f.path));
  }
};
