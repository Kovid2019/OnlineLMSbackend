//Multer Setup
import path from "path"; //path module to handle file paths
import multer from "multer";
import fs from "fs"; //fs module to handle file system operations

const __dirname = path.resolve(); // Get the current directory path upto the root
const fpDestination = "public/img/"; // Define the destination path for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb is the callback function to indicate where to store the file
    //Check if directory exists, if not create it.
    !fs.existsSync(fpDestination) &&
      fs.mkdirSync(fpDestination, { recursive: true });

    cb(null, fpDestination); //
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filepath = uniqueSuffix + "-" + file.originalname;
    cb(null, filepath);
  },
});
// Filter to allow images only.
const fileFilter = (req, file, cb) => {
  // Callback function to filter files
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/; // Using regex to allow specific image formats
  const extName = path.extname(file.originalname).toLowerCase(); // Get the file extension
  const isAlowedExt = allowedFileTypes.test(extName); // Test if the file extension is allowed
  const mimetype = allowedFileTypes.test(file.mimetype); // Test if the file mimetype(original type) is allowed
  if (isAlowedExt && mimetype) {
    cb(null, true); // If both checks pass, allow the file
  } else {
    cb(new Error("Only jpeg|jpg|png|gif|webp images are allowed!"), false); // If not, throw an error
  }
};

export const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, //2MB
}); // Set up multer with storage, file filter and fileSize.
// const upload = multer({ dest: "uploads/" });

// End multer setup
