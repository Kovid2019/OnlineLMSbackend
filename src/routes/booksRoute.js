import express from "express";
import {
  getAllBooksController,
  getAllPublicBooksController,
  insertNewBook,
} from "../controllers/bookController.js";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middleware/authMiddleware.js";
import { newBookDataValidation } from "../middleware/validations/bookDataValidation.js";
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

export default router;
