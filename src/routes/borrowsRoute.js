import express from "express";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";
import { insertNewBorrow } from "../controllers/borrowController.js";
import { newBorrowDataValidation } from "../middleware/validations/borrowDataValidation.js";
const router = express.Router();

//Insert new borrow
router.post("/", userAuthMiddleware, newBorrowDataValidation, insertNewBorrow);
export default router;
