import { responseClient } from "../middleware/responseClient.js";
import { createBorrows } from "../models/borrowHistory/BorrowHistoryModel.js";

import { deleteFile, deleteUploadedFiles } from "../utils/fileUtil.js";
const BOOK_DUE_DAYS = 15;
export const insertNewBorrow = async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const today = new Date();
    const dueDate = today.setDate(today.getDate() + BOOK_DUE_DAYS);

    req.body = req.body.map((book) => {
      return {
        ...book,
        userId: _id,
        dueDate,
      };
    });

    const borrow = await createBorrows(req.body);
    borrow.length
      ? responseClient({ req, res, message: "Borrow added successfully!" })
      : responseClient({
          req,
          res,
          message: "Borrow not added. Try again later..",
          statusCode: 401,
        });
  } catch (error) {
    next(error);
  }
};
