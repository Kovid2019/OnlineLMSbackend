import express from "express";
import {
  deleteBookController,
  getAllBooksController,
  getAllPublicBooksController,
  getSinglePublicBookController,
  insertNewBook,
  updateBookController,
} from "../controllers/bookController.js";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middleware/authMiddleware.js";
import {
  newBookDataValidation,
  updateBookDataValidation,
} from "../middleware/validations/bookDataValidation.js";
import { get } from "mongoose";
import { upload } from "../utils/multer.js";
const router = express.Router();

//Public API to get all books
router.get("/", getAllPublicBooksController);

//Public API to get single book.
router.get("/public/:slug", getSinglePublicBookController);

//Admin Only access to get all books
router.get(
  "/admin",
  userAuthMiddleware,
  adminAuthMiddleware,
  getAllBooksController
);

//Inserting new book
router.post(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
  upload.single("image"), // Allow single image upload
  // upload.array("image", 2), // Allow multiple images, max 2
  newBookDataValidation, //Once you upload the file, only then you have data for Server side validation(Joi).
  insertNewBook
);
//Update Book
router.put(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
  upload.array("images", 2), // Allow multiple images, max 2
  updateBookDataValidation,
  updateBookController
);
//Delete Book
router.delete(
  "/:_id",
  userAuthMiddleware,
  adminAuthMiddleware,
  deleteBookController
);

export default router;
