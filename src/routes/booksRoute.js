import express from "express";
import {
  deleteBookController,
  getAllBooksController,
  getAllPublicBooksController,
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
const router = express.Router();

//Public API to get all books
router.get("/", getAllPublicBooksController);

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
  newBookDataValidation,
  insertNewBook
);
//Update Book
router.put(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
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
