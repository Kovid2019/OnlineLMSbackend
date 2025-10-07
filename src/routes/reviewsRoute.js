import express from "express";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middleware/authMiddleware.js";

import {
  getAllReviewsController,
  insertNewReviewController,
  updateReviewStatusController,
} from "../controllers/reviewController.js";
import { newReviewDataValidation } from "../middleware/validations/reviewDataValidation.js";
const router = express.Router();

//Insert new borrow
router.post(
  "/",
  userAuthMiddleware,
  newReviewDataValidation,
  insertNewReviewController
);

// Return all  approved Reviews for public
router.get("/", getAllReviewsController);

//All Reviews for admin only
router.get("/admin", userAuthMiddleware, getAllReviewsController);

//Update review status by admin
router.patch(
  "/admin",
  userAuthMiddleware,
  adminAuthMiddleware,
  updateReviewStatusController
);

//Return the book back to library
// router.patch("/", userAuthMiddleware, returnBookController);

export default router;
