import { responseClient } from "../middleware/responseClient.js";
import { updateBorrow } from "../models/borrowHistory/BorrowHistoryModel.js";
import {
  createReview,
  getReviews,
  updateReview,
} from "../models/review/ReviewModel.js";

const BOOK_DUE_DAYS = 15;
export const insertNewReviewController = async (req, res, next) => {
  try {
    const { _id, fName, lName } = req.userInfo;
    const { borrowId } = req.body;
    const reviewObj = {
      userId: _id,
      userName: `${fName} ${lName}`,
      ...req.body,
    };

    const result = await createReview(reviewObj);

    if (result?._id) {
      //Update borrow table with review id
      const reviewId = result._id;
      const updateResult = await updateBorrow({ _id: borrowId }, { reviewId });
      if (updateResult?._id) {
        return responseClient({
          req,
          res,
          message: "The review has been received successfully",
        });
      }
    }

    responseClient({
      req,
      res,
      message: "Something went wrong, Please contact administration..",
      statusCode: 401,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviewsController = async (req, res, next) => {
  try {
    const filter = {};
    //Is admin requesting or public
    if (req?.userInfo?.role !== "admin") {
      filter.isApproved = true;
    }
    const payload = await getReviews(filter);
    responseClient({
      req,
      res,
      payload,
      message: " Here are the reviews!",
    });
  } catch (error) {
    next(error);
  }
};
export const updateReviewStatusController = async (req, res, next) => {
  try {
    const { _id, isApproved } = req.body;

    const result = await updateReview({ _id, isApproved });
    result?._id
      ? responseClient({
          req,
          res,
          message: " The review has been updated..!",
        })
      : responseClient({
          req,
          res,
          statusCode: 400,
          message: "Unable to update the reviews..! Contact Admin",
        });
  } catch (error) {
    next(error);
  }
};
