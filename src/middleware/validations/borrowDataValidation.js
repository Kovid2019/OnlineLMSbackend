import {
  _ID_REQ,
  EXPECTEDAVAILABLE,
  ISBN_REQ,
  LONG_STR,
  LONG_STR_REQ,
  SHORT_STR_REQ,
  STATUS_REQ,
  STR_ARRAY,
  YEAR_REQ,
} from "./joiConst.js";
import { validateData } from "./joiValidation.js";

export const newBorrowDataValidation = (req, res, next) => {
  const obj = {
    bookId: SHORT_STR_REQ,
    bookTitle: SHORT_STR_REQ,
    thumbnail: SHORT_STR_REQ,
  };
  validateData({ req, res, next, obj });
};
