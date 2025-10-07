import express from "express";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middleware/authMiddleware.js";
import {
  getBorrowsController,
  insertNewBorrow,
  returnBookController,
} from "../controllers/borrowController.js";
import { newBorrowDataValidation } from "../middleware/validations/borrowDataValidation.js";
const router = express.Router();

//Insert new borrow
router.post("/", userAuthMiddleware, newBorrowDataValidation, insertNewBorrow);

// Return all borrows for admin request
router.get(
  "/admin",
  userAuthMiddleware,
  adminAuthMiddleware,
  getBorrowsController
);

//Return user specific borrow list only
router.get("/user", userAuthMiddleware, getBorrowsController);

//Return the book back to library
router.patch("/", userAuthMiddleware, returnBookController);

export default router;
