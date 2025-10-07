import { _ID_REQ, LONG_STR_REQ, RATING, SHORT_STR_REQ } from "./joiConst.js";
import { validateData } from "./joiValidation.js";

export const newReviewDataValidation = (req, res, next) => {
  const obj = {
    bookId: SHORT_STR_REQ,
    borrowId: SHORT_STR_REQ,
    title: SHORT_STR_REQ,
    reviewMessage: LONG_STR_REQ,
    rating: RATING,
  };
  validateData({ req, res, next, obj });
};
